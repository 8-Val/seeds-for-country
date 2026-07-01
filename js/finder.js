/*
 * finder.js, the location-based native species finder
 * -----------------------------------------------------
 * Reads the data on window.SEEDS_FOR_COUNTRY (see data/regions.js) and drives
 * the finder UI in index.html: region selection, animated filtering, the
 * honest draft banner, verified badges (only ever on truly verified entries),
 * and the curated pack suggestions.
 *
 * IMPORTANT: a "verified" badge is painted only when a species'
 * verificationStatus is exactly "verified". Everything else is shown as a
 * draft. A build process is not a botanical authority, so nothing here is
 * verified until a person checks it (see the rule in data/regions.js).
 *
 * Plain vanilla JS, no dependencies, full keyboard support (native select,
 * real <button> filter chips, focusable links).
 */
(function () {
  "use strict";

  var DATA = window.SEEDS_FOR_COUNTRY;
  if (!DATA) return; // nothing to do without data

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Benefit filter definitions. Each tests a species' `attracts` text so the
  // data file only needs the one human-readable field.
  var BENEFITS = [
    { key: "pollinators", label: "Bees and pollinators", test: /bee|pollinat/i },
    { key: "nectarbirds", label: "Nectar birds", test: /nectar/i },
    { key: "fruitseedbirds", label: "Fruit and seed birds", test: /fruit-eating|seed-eating/i },
    { key: "butterflies", label: "Butterflies", test: /butterfl/i },
    { key: "shelter", label: "Shelter for small birds", test: /shelter/i }
  ];

  // Friendly labels for the species types.
  var TYPE_LABELS = {
    tree: "Trees",
    shrub: "Shrubs",
    grass: "Grasses",
    groundcover: "Groundcovers",
    wildflower: "Wildflowers"
  };

  // Where the transparent species cutouts live. The filename is the botanical
  // name slugified, matching tools/fetch_plants.py. A card whose image is
  // missing (e.g. an illustrative coming-soon species) simply hides its photo.
  var PLANT_IMG_BASE = "assets/images/plants/";

  // --- DOM refs -------------------------------------------------------------
  var el = {};
  var cardEntries = []; // [{ el, species }]
  var packsRendered = false;
  var state = { regionKey: null, types: new Set(), benefits: new Set() };

  document.addEventListener("DOMContentLoaded", function () {
    el.select = document.getElementById("region-select");
    el.postcode = document.getElementById("postcode-input");
    el.postcodeGo = document.getElementById("postcode-go");
    el.postcodeFeedback = document.getElementById("postcode-feedback");
    el.regionStatus = document.getElementById("region-status");
    el.filters = document.getElementById("finder-filters");
    el.typeChips = document.getElementById("type-chips");
    el.benefitChips = document.getElementById("benefit-chips");
    el.draftBanner = document.getElementById("draft-banner");
    el.matchNote = document.getElementById("match-note");
    el.resultsMeta = document.getElementById("results-meta");
    el.resultsCount = document.getElementById("results-count");
    el.clearFilters = document.getElementById("clear-filters");
    el.grid = document.getElementById("species-grid");
    el.empty = document.getElementById("results-empty");
    el.packsReveal = document.getElementById("packs-reveal");
    el.showPacks = document.getElementById("show-packs");
    el.packs = document.getElementById("packs");
    el.packsGrid = document.getElementById("packs-grid");

    if (!el.select || !el.grid) return;

    populateSelect();
    bindEvents();

    // Start on the first region in the order (Sydney) so the finder looks
    // alive immediately. Visitors can switch to any other area.
    selectRegion(DATA.regionOrder[0]);
  });

  /* ----- Build the region <select> from the data ------------------------ */
  function populateSelect() {
    var frag = document.createDocumentFragment();
    DATA.regionOrder.forEach(function (key) {
      var region = DATA.regions[key];
      if (!region) return;
      var opt = document.createElement("option");
      opt.value = key;
      var label = region.name + ", " + region.state;
      if (region.status === "coming-soon") label += " (coming soon)";
      opt.textContent = label;
      frag.appendChild(opt);
    });
    el.select.appendChild(frag);
  }

  /* ----- Events --------------------------------------------------------- */
  function bindEvents() {
    el.select.addEventListener("change", function () {
      selectRegion(el.select.value);
      if (el.postcodeFeedback) el.postcodeFeedback.textContent = "";
    });

    if (el.postcodeGo) el.postcodeGo.addEventListener("click", resolvePostcode);
    if (el.postcode) {
      el.postcode.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          resolvePostcode();
        }
      });
    }

    if (el.clearFilters)
      el.clearFilters.addEventListener("click", function () {
        state.types.clear();
        state.benefits.clear();
        syncChipStates();
        applyFilters();
      });

    if (el.showPacks)
      el.showPacks.addEventListener("click", function () {
        var open = el.packs.classList.toggle("show");
        el.showPacks.setAttribute("aria-expanded", String(open));
        el.showPacks.textContent = open
          ? "Hide suggested packs"
          : "View suggested packs for this area";
        if (open) {
          el.packs.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start"
          });
        }
      });
  }

  /* ----- Postcode -> region (simplified demo mapping) ------------------- */
  function resolvePostcode() {
    var raw = (el.postcode.value || "").trim();
    if (!/^\d{4}$/.test(raw)) {
      setPostcodeFeedback("Please enter a 4 digit Australian postcode.");
      return;
    }
    var pc = parseInt(raw, 10);
    var match = null;
    DATA.regionOrder.some(function (key) {
      var region = DATA.regions[key];
      var ranges = region.postcodeRanges || [];
      var hit = ranges.some(function (r) {
        return pc >= r[0] && pc <= r[1];
      });
      if (hit) {
        match = key;
        return true;
      }
      return false;
    });

    if (match) {
      el.select.value = match;
      selectRegion(match);
      var region = DATA.regions[match];
      setPostcodeFeedback(
        "Closest covered area: " + region.name + ", " + region.state + "."
      );
    } else {
      setPostcodeFeedback(
        "We do not cover that postcode yet. Pick a city from the list to explore a draft."
      );
    }
  }

  function setPostcodeFeedback(msg) {
    if (el.postcodeFeedback) el.postcodeFeedback.textContent = msg;
  }

  /* ----- Select a region and render everything for it ------------------- */
  function selectRegion(key) {
    var region = DATA.regions[key];
    if (!region) return;
    state.regionKey = key;
    state.types.clear();
    state.benefits.clear();

    el.select.value = key;
    renderRegionStatus(region);
    renderFilters(region);
    renderSpecies(region);
    renderPacks(region);
  }

  /* ----- Region status note (draft vs coming soon) ---------------------- */
  function renderRegionStatus(region) {
    el.regionStatus.classList.remove("is-draft", "is-coming");
    if (region.status === "coming-soon") {
      el.regionStatus.classList.add("show", "is-coming");
      el.regionStatus.innerHTML =
        "<strong>" +
        region.name +
        " is coming soon.</strong>&nbsp;The species shown are illustrative placeholders only, clearly not a verified local list.";
    } else {
      el.regionStatus.classList.add("show", "is-draft");
      el.regionStatus.innerHTML =
        "<strong>" +
        region.name +
        " is a working draft.</strong>&nbsp;" +
        escapeHtml(region.blurb);
    }
  }

  /* ----- Filters -------------------------------------------------------- */
  function renderFilters(region) {
    var species = region.species || [];

    // Hide filters when there are too few species to bother filtering, or for
    // illustrative coming-soon regions.
    var showFilters = region.status === "draft" && species.length >= 6;
    el.filters.classList.toggle("show", showFilters);
    if (!showFilters) {
      el.typeChips.innerHTML = "";
      el.benefitChips.innerHTML = "";
      return;
    }

    // Type chips, built from the types actually present, with counts.
    var typeCounts = {};
    species.forEach(function (s) {
      typeCounts[s.type] = (typeCounts[s.type] || 0) + 1;
    });
    el.typeChips.innerHTML = "";
    Object.keys(TYPE_LABELS).forEach(function (type) {
      if (!typeCounts[type]) return;
      el.typeChips.appendChild(
        makeChip(TYPE_LABELS[type], type, typeCounts[type], "type")
      );
    });

    // Benefit chips, only those with at least one match.
    el.benefitChips.innerHTML = "";
    BENEFITS.forEach(function (b) {
      var count = species.filter(function (s) {
        return b.test.test(s.attracts || "");
      }).length;
      if (!count) return;
      el.benefitChips.appendChild(makeChip(b.label, b.key, count, "benefit"));
    });
  }

  function makeChip(label, value, count, group) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    btn.setAttribute("aria-pressed", "false");
    btn.dataset.group = group;
    btn.dataset.value = value;
    btn.innerHTML =
      escapeHtml(label) + ' <span class="count">' + count + "</span>";
    btn.addEventListener("click", function () {
      var set = group === "type" ? state.types : state.benefits;
      var pressed = btn.getAttribute("aria-pressed") === "true";
      if (pressed) {
        set.delete(value);
        btn.setAttribute("aria-pressed", "false");
      } else {
        set.add(value);
        btn.setAttribute("aria-pressed", "true");
      }
      applyFilters();
    });
    return btn;
  }

  function syncChipStates() {
    var chips = el.filters.querySelectorAll(".chip");
    Array.prototype.forEach.call(chips, function (c) {
      c.setAttribute("aria-pressed", "false");
    });
  }

  /* ----- Species cards -------------------------------------------------- */
  function renderSpecies(region) {
    var species = region.species || [];
    el.grid.innerHTML = "";
    cardEntries = [];

    // Banners
    el.draftBanner.hidden = false;
    el.matchNote.hidden = false;
    el.resultsMeta.hidden = species.length === 0;

    species.forEach(function (s) {
      var card = buildCard(s);
      el.grid.appendChild(card);
      cardEntries.push({ el: card, species: s });

      // Clean up the entrance animation class after it runs.
      card.addEventListener("animationend", function () {
        card.classList.remove("is-entering");
        card.style.animationDelay = "";
      });
    });

    applyFilters();
  }

  function buildCard(s) {
    var card = document.createElement("article");
    card.className = "species-card";
    card.setAttribute("tabindex", "-1");

    var isVerified = s.verificationStatus === "verified";

    // Badge: verified ONLY when a person has confirmed it; otherwise draft.
    var badge = isVerified
      ? '<span class="badge verified"><span class="bdot"></span>Verified</span>'
      : '<span class="badge draft" title="' +
        escapeAttr(s.verificationStatus || "unverified, to be checked") +
        '"><span class="bdot"></span>Draft, to be checked</span>';

    var plantNet = s.plantNetUrl
      ? '<a class="plantnet-link" href="' +
        escapeAttr(s.plantNetUrl) +
        '" target="_blank" rel="noopener noreferrer">Check on PlantNET</a>'
      : "";

    var typeLabel = (TYPE_LABELS[s.type] || s.type || "").replace(/s$/, "");

    // Show the accepted botanical name, plus a synonym where one is recorded
    // (e.g. Melaleuca citrina, syn. Callistemon citrinus).
    var botanical = escapeHtml(s.botanicalName);
    if (s.synonym) {
      botanical +=
        ' <span class="syn">syn. ' + escapeHtml(s.synonym) + "</span>";
    }

    // Transparent species photo. Sits on a soft sand panel so even pale
    // subjects (grasses) read. Hidden by the error handler below if absent.
    var media =
      '<div class="species-media">' +
      '<img class="species-photo" loading="lazy" alt="' +
      escapeAttr(s.commonName + ", " + s.botanicalName) +
      '" src="' +
      PLANT_IMG_BASE +
      slugify(s.botanicalName) +
      '.png">' +
      "</div>";

    card.innerHTML =
      media +
      '<div class="species-top">' +
      '<span class="type-tag">' +
      escapeHtml(typeLabel) +
      "</span>" +
      "</div>" +
      "<div>" +
      "<h3>" +
      escapeHtml(s.commonName) +
      "</h3>" +
      '<p class="botanical">' +
      botanical +
      "</p>" +
      "</div>" +
      '<p class="desc">' +
      escapeHtml(s.description) +
      "</p>" +
      '<div class="species-meta">' +
      '<div class="row"><span class="k">Good for</span><span class="v">' +
      escapeHtml(s.attracts) +
      "</span></div>" +
      '<div class="row"><span class="k">Suits</span><span class="v">' +
      escapeHtml(s.suitability) +
      "</span></div>" +
      "</div>" +
      '<div class="species-foot">' +
      badge +
      plantNet +
      "</div>";

    // Hide the photo panel cleanly if the cutout is not present for this
    // species (illustrative coming-soon entries have no image).
    var img = card.querySelector(".species-photo");
    if (img) {
      img.addEventListener("error", function () {
        var m = card.querySelector(".species-media");
        if (m) m.style.display = "none";
      });
    }

    return card;
  }

  /* ----- Apply the active filters, animating the result ---------------- */
  function applyFilters() {
    var visible = 0;
    var total = cardEntries.length;

    cardEntries.forEach(function (entry) {
      var s = entry.species;
      var typeOk = state.types.size === 0 || state.types.has(s.type);
      var benefitOk =
        state.benefits.size === 0 || matchesAnyBenefit(s, state.benefits);
      var match = typeOk && benefitOk;

      if (match) {
        entry.el.classList.remove("is-hidden");
        if (!prefersReducedMotion) {
          entry.el.classList.remove("is-entering");
          // force reflow so the animation restarts cleanly
          void entry.el.offsetWidth;
          entry.el.style.animationDelay = visible * 40 + "ms";
          entry.el.classList.add("is-entering");
        }
        visible++;
      } else {
        entry.el.classList.add("is-hidden");
      }
    });

    // Count + empty state
    var noun = DATA.regions[state.regionKey].status === "coming-soon"
      ? "illustrative species"
      : "draft species";
    var filtersActive = state.types.size > 0 || state.benefits.size > 0;

    if (total === 0) {
      el.resultsMeta.hidden = true;
    } else {
      el.resultsMeta.hidden = false;
      el.resultsCount.textContent = filtersActive
        ? "Showing " + visible + " of " + total + " " + noun
        : "Showing all " + total + " " + noun;
    }

    if (visible === 0 && total > 0) {
      el.empty.hidden = false;
      el.empty.innerHTML =
        "<p>No species match those filters. Try removing one, or clear them all.</p>";
    } else {
      el.empty.hidden = true;
    }

    // Packs become available once a region is chosen.
    el.packsReveal.hidden = total === 0;
  }

  function matchesAnyBenefit(species, benefitSet) {
    var attracts = species.attracts || "";
    var ok = false;
    benefitSet.forEach(function (key) {
      var b = findBenefit(key);
      if (b && b.test.test(attracts)) ok = true;
    });
    return ok;
  }

  function findBenefit(key) {
    for (var i = 0; i < BENEFITS.length; i++) {
      if (BENEFITS[i].key === key) return BENEFITS[i];
    }
    return null;
  }

  /* ----- Curated packs -------------------------------------------------- */
  function renderPacks(region) {
    var packs = DATA.packs || [];
    el.packsGrid.innerHTML = "";

    // Which of a pack's picks actually exist in this region's list, so we can
    // show a real local match where we have one.
    var localNames = {};
    (region.species || []).forEach(function (s) {
      localNames[s.commonName] = true;
    });

    packs.forEach(function (pack) {
      var card = document.createElement("article");
      card.className = "pack-card";

      var includes = (pack.includes || [])
        .map(function (item) {
          return (
            '<li><svg class="tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg><span>' +
            escapeHtml(item) +
            "</span></li>"
          );
        })
        .join("");

      // Show picks, flagging which are a confirmed local match in this region.
      var picks = (pack.speciesPicks || [])
        .map(function (name) {
          return localNames[name]
            ? "<strong>" + escapeHtml(name) + "</strong>"
            : escapeHtml(name);
        })
        .join(", ");

      var picksLine;
      if (pack.single) {
        picksLine = "Your choice of any one species from the local list.";
      } else if (region.status === "draft") {
        picksLine = "Likely to include, where they suit your area: " + picks + ".";
      } else {
        picksLine =
          "Illustrative species only, matched once " +
          escapeHtml(region.name) +
          " is live: " +
          picks +
          ".";
      }

      // Single seed is a set price, the rest are a "from" price.
      var priceLead = pack.single ? "Set price" : "From";
      var priceIndic = "indicative only";
      var ctaLabel = pack.single ? "Choose your seed" : "View pack";

      card.innerHTML =
        '<div class="pack-head">' +
        '<div class="pack-name">' +
        escapeHtml(pack.name) +
        "</div>" +
        '<div class="pack-tag">' +
        escapeHtml(pack.tagline) +
        "</div>" +
        "</div>" +
        '<div class="pack-body">' +
        '<p class="pack-blurb">' +
        escapeHtml(pack.blurb) +
        "</p>" +
        '<ul class="pack-includes">' +
        includes +
        "</ul>" +
        '<p class="pack-picks">' +
        picksLine +
        "</p>" +
        '<div class="pack-foot">' +
        '<div class="pack-price"><span class="from">' +
        priceLead +
        '</span><span class="amt">$' +
        pack.fromPrice +
        '</span> <span class="indic">' +
        priceIndic +
        "</span></div>" +
        '<a class="btn btn--primary btn--small" href="product.html?pack=' +
        encodeURIComponent(pack.key) +
        '">' +
        ctaLabel +
        "</a>" +
        "</div>" +
        "</div>";

      el.packsGrid.appendChild(card);
    });

    packsRendered = true;
  }

  /* ----- Tiny escaping helpers ----------------------------------------- */
  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function escapeAttr(str) {
    return escapeHtml(str).replace(/"/g, "&quot;");
  }
  // Botanical name -> image filename. Must match tools/fetch_plants.py.
  function slugify(str) {
    return String(str == null ? "" : str)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
})();
