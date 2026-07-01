/*
 * product.js, the demonstration product page (product.html)
 * ----------------------------------------------------------
 * Reads ?pack=<key> from the URL, looks the pack up in
 * window.SEEDS_FOR_COUNTRY, and renders a faux "add to cart" product page.
 * Nothing here takes a payment. It is a visual demonstration only, which the
 * page states plainly in the demo banner.
 *
 * Plain vanilla JS, no dependencies.
 */
(function () {
  "use strict";

  var DATA = window.SEEDS_FOR_COUNTRY;
  if (!DATA) return;

  // The real product photo, shown as the thumbnail under the main image. Add
  // more real product views here and the strip grows automatically.
  var THUMBS = ["assets/images/sfc-product-pack.jpg"];

  // Each pack has its own fixed decorative photo for the related-pack cards, so
  // no two cards in a row ever repeat the same image. `focus` sets object-position
  // where the default centre crop would cut badly (the tall portrait).
  var PACK_IMAGE = {
    single: { src: "assets/images/sfc-product-pack.jpg" },
    balcony: { src: "assets/images/sfc-about-seeds-soil.jpg" },
    pollinator: { src: "assets/images/sfc-hero-hands-seedlings.jpg" },
    workplace: { src: "assets/images/sfc-restoration-partner.jpg" },
    classroom: { src: "assets/images/sfc-nursery-partner.jpg", focus: "center 18%" }
  };

  var el = {};
  var pack = null;
  var cart = 0;

  document.addEventListener("DOMContentLoaded", function () {
    cache();
    pack = resolvePack();
    if (!pack) return;
    renderPack();
    buildThumbs();
    buildAreaSelect();
    buildRelated();
    wireQuantity();
    wireActions();
    updatePicks();
  });

  function cache() {
    el.bcName = document.getElementById("bc-name");
    el.name = document.getElementById("product-name");
    el.tagline = document.getElementById("product-tagline");
    el.price = document.getElementById("product-price");
    el.contents = document.getElementById("product-contents");
    el.blurb = document.getElementById("product-blurb");
    el.includes = document.getElementById("product-includes");
    el.picks = document.getElementById("product-picks");
    el.img = document.getElementById("product-img");
    el.thumbs = document.getElementById("thumbs");
    el.area = document.getElementById("area-select");
    el.priceFrom = document.getElementById("price-from");
    el.priceIndic = document.getElementById("price-indic");
    el.singleChoose = document.getElementById("single-choose");
    el.seedSelect = document.getElementById("seed-select");
    el.qtyInput = document.getElementById("qty-input");
    el.qtyMinus = document.getElementById("qty-minus");
    el.qtyPlus = document.getElementById("qty-plus");
    el.addCart = document.getElementById("add-cart");
    el.buyNow = document.getElementById("buy-now");
    el.cartBtn = document.getElementById("cart-btn");
    el.cartCount = document.getElementById("cart-count");
    el.related = document.getElementById("related");
    el.toast = document.getElementById("toast");
    el.toastText = document.getElementById("toast-text");
  }

  /* ----- Which pack? ---------------------------------------------------- */
  function resolvePack() {
    var key = getParam("pack");
    var found = (DATA.packs || []).filter(function (p) {
      return p.key === key;
    })[0];
    return found || (DATA.packs || [])[0] || null;
  }

  function getParam(name) {
    var m = new RegExp("[?&]" + name + "=([^&]+)").exec(
      window.location.search || ""
    );
    return m ? decodeURIComponent(m[1]) : null;
  }

  /* ----- Render the chosen pack ----------------------------------------- */
  function renderPack() {
    document.title = pack.name + ", Seeds for Country";
    el.bcName.textContent = pack.name;
    el.name.textContent = pack.name;
    el.tagline.textContent = pack.tagline;
    el.price.textContent = "$" + pack.fromPrice;
    el.blurb.textContent = pack.blurb;

    // Plain "what you get" line: species count and total seeds.
    if (el.contents) {
      el.contents.textContent = pack.single
        ? "1 species, 1 seed"
        : pack.speciesCount + " species, " + pack.seedsTotal + " seeds in total";
    }

    // Single seed is a set price; the packs are a "from" price.
    el.priceFrom.textContent = pack.single ? "Set price" : "From";
    el.priceIndic.textContent = "indicative only";

    // Show the "choose your seed" picker only for the single seed option.
    if (el.singleChoose) el.singleChoose.hidden = !pack.single;
    if (pack.single && el.seedSelect) {
      el.seedSelect.addEventListener("change", updatePicks);
    }

    el.includes.innerHTML = (pack.includes || [])
      .map(function (item) {
        return (
          '<li><svg class="tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg><span>' +
          esc(item) +
          "</span></li>"
        );
      })
      .join("");
  }

  /* ----- Thumbnails ----------------------------------------------------- */
  function buildThumbs() {
    el.thumbs.innerHTML = "";
    THUMBS.forEach(function (src, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "thumb";
      b.setAttribute("aria-label", "View product photo " + (i + 1));
      b.setAttribute("aria-current", i === 0 ? "true" : "false");
      b.innerHTML = '<img src="' + src + '" alt="" />';
      b.addEventListener("click", function () {
        el.img.src = src;
        Array.prototype.forEach.call(el.thumbs.children, function (c) {
          c.setAttribute("aria-current", "false");
        });
        b.setAttribute("aria-current", "true");
      });
      el.thumbs.appendChild(b);
    });
  }

  /* ----- Area select ---------------------------------------------------- */
  function buildAreaSelect() {
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
    el.area.appendChild(frag);
    el.area.value = DATA.regionOrder[0];
    el.area.addEventListener("change", updatePicks);
  }

  function updatePicks() {
    var region = DATA.regions[el.area.value];

    // Single seed: the buyer picks one species from the local list.
    if (pack.single) {
      populateSeedSelect(region);
      var chosen =
        el.seedSelect.value ||
        (region.species[0] && region.species[0].commonName) ||
        "your chosen species";
      el.picks.innerHTML =
        "Your seed: <strong>" +
        esc(chosen) +
        "</strong>, chosen from the " +
        esc(region.name) +
        " list. One seed, your pick.";
      return;
    }

    var localNames = {};
    (region.species || []).forEach(function (s) {
      localNames[s.commonName] = true;
    });
    var picks = (pack.speciesPicks || [])
      .map(function (n) {
        return localNames[n] ? "<strong>" + esc(n) + "</strong>" : esc(n);
      })
      .join(", ");

    el.picks.innerHTML =
      region.status === "draft"
        ? "Likely to include, where they suit your area: " + picks + "."
        : "Illustrative only until " +
          esc(region.name) +
          " is live: " +
          picks +
          ".";
  }

  // Fill the "choose your seed" select with the current region's species,
  // keeping the buyer's current choice if it is still available.
  function populateSeedSelect(region) {
    if (!el.seedSelect) return;
    var current = el.seedSelect.value;
    var species = region.species || [];
    el.seedSelect.innerHTML = "";
    species.forEach(function (s) {
      var opt = document.createElement("option");
      opt.value = s.commonName;
      opt.textContent = s.commonName + " (" + s.type + ")";
      el.seedSelect.appendChild(opt);
    });
    var stillThere = species.some(function (s) {
      return s.commonName === current;
    });
    if (stillThere) el.seedSelect.value = current;
  }

  /* ----- Related packs -------------------------------------------------- */
  function buildRelated() {
    var others = (DATA.packs || []).filter(function (p) {
      return p.key !== pack.key;
    });
    el.related.innerHTML = "";
    others.forEach(function (p) {
      var a = document.createElement("a");
      a.className = "related-card";
      a.href = "product.html?pack=" + encodeURIComponent(p.key);
      var conf = PACK_IMAGE[p.key] || { src: "assets/images/sfc-product-pack.jpg" };
      var pos = conf.focus ? ' style="object-position:' + conf.focus + '"' : "";
      a.innerHTML =
        '<span class="rc-media"><img src="' +
        conf.src +
        '"' + pos + ' alt="" /></span>' +
        '<span class="rc-body"><h3>' +
        esc(p.name) +
        '</h3><span class="rc-price">' +
        (p.single ? "Set price " : "From ") +
        "<strong>$" +
        esc(String(p.fromPrice)) +
        "</strong> indicative</span></span>";
      el.related.appendChild(a);
    });
  }

  /* ----- Quantity stepper ----------------------------------------------- */
  function wireQuantity() {
    var clamp = function (v) {
      v = parseInt(v, 10);
      if (isNaN(v) || v < 1) v = 1;
      if (v > 99) v = 99;
      return v;
    };
    el.qtyMinus.addEventListener("click", function () {
      el.qtyInput.value = clamp(clamp(el.qtyInput.value) - 1);
    });
    el.qtyPlus.addEventListener("click", function () {
      el.qtyInput.value = clamp(clamp(el.qtyInput.value) + 1);
    });
    el.qtyInput.addEventListener("change", function () {
      el.qtyInput.value = clamp(el.qtyInput.value);
    });
  }

  /* ----- Faux actions --------------------------------------------------- */
  function wireActions() {
    el.addCart.addEventListener("click", function () {
      var qty = parseInt(el.qtyInput.value, 10) || 1;
      cart += qty;
      el.cartCount.textContent = String(cart);
      var noun = pack.single
        ? qty === 1 ? "seed" : "seeds"
        : qty === 1 ? "pack" : "packs";
      showToast("Added " + qty + " " + noun + " to your cart");
      var original = el.addCart.textContent;
      el.addCart.textContent = "Added to cart";
      window.setTimeout(function () {
        el.addCart.textContent = original;
      }, 1400);
    });

    el.buyNow.addEventListener("click", function () {
      showToast("This is a demo, so there is no real checkout");
    });

    el.cartBtn.addEventListener("click", function () {
      showToast(
        cart === 0
          ? "Your cart is empty, this is only a demo"
          : "You have " + cart + " in your cart, this is only a demo"
      );
    });
  }

  var toastTimer = null;
  function showToast(msg) {
    el.toastText.textContent = msg;
    el.toast.classList.add("show");
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      el.toast.classList.remove("show");
    }, 2600);
  }

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
})();
