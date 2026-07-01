/*
 * main.js, site behaviour for Seeds for Country
 * - sticky header state on scroll
 * - mobile menu toggle
 * - active nav link highlighting
 * - smooth-scroll with focus handling for accessibility
 * - gentle scroll reveals (IntersectionObserver), disabled for reduced motion
 * - no-op submit handlers for the contact and newsletter forms
 *
 * Plain vanilla JS, no dependencies. Runs straight from index.html.
 */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  document.addEventListener("DOMContentLoaded", function () {
    setupStickyHeader();
    setupMobileNav();
    setupScrollReveal();
    setupActiveNav();
    setupSmoothScrollFocus();
    setupForms();
    setupImagePlaceholderTags();
  });

  /* ----- Hide the "Placeholder image" chip once a real photo loads -------- */
  // Each image tries a real photo (e.g. sfc-hero-hands-seedlings.jpg) and falls
  // back to the SVG placeholder on error. The chip should only show while the
  // placeholder is the thing actually on screen, so we toggle it on the live src.
  function setupImagePlaceholderTags() {
    var tags = Array.prototype.slice.call(document.querySelectorAll(".img-tag"));
    tags.forEach(function (tag) {
      var parent = tag.parentNode;
      var img = parent && parent.querySelector("img");
      if (!img) return;
      var update = function () {
        var src = img.currentSrc || img.src || "";
        // Placeholders are the SVG files with "placeholder" in the name
        // (e.g. sfc-placeholder-hero.svg). Match loosely so the chip logic does
        // not depend on the exact prefix if these get renamed again.
        tag.style.display = /placeholder/i.test(src) ? "" : "none";
      };
      img.addEventListener("load", update);
      img.addEventListener("error", update);
      update();
    });
  }

  /* ----- Sticky header gets a solid background once you scroll ----------- */
  function setupStickyHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var onScroll = function () {
      if (window.scrollY > 12) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ----- Mobile menu open/close ----------------------------------------- */
  function setupMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var panel = document.getElementById("mobile-nav");
    if (!toggle || !panel) return;

    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      panel.classList.toggle("is-open", open);
    };

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Close after choosing a link
    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ----- Scroll reveal --------------------------------------------------- */
  function setupScrollReveal() {
    var revealables = Array.prototype.slice.call(
      document.querySelectorAll(".reveal")
    );
    if (!revealables.length) return;

    // If reduced motion is requested, or no observer support, just show all.
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealables.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealables.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ----- Active nav link highlight while scrolling ---------------------- */
  function setupActiveNav() {
    var sections = Array.prototype.slice.call(
      document.querySelectorAll("main section[id]")
    );
    var links = Array.prototype.slice.call(
      document.querySelectorAll(".nav-links a")
    );
    if (!sections.length || !links.length || !("IntersectionObserver" in window))
      return;

    var byId = {};
    links.forEach(function (link) {
      var id = link.getAttribute("href").replace("#", "");
      byId[id] = link;
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            links.forEach(function (l) {
              l.classList.remove("is-active");
            });
            var active = byId[entry.target.id];
            if (active) active.classList.add("is-active");
          }
        });
      },
      { threshold: 0.3, rootMargin: "-30% 0px -55% 0px" }
    );

    sections.forEach(function (s) {
      observer.observe(s);
    });
  }

  /* ----- Smooth scroll, then move focus to the target for a11y ---------- */
  function setupSmoothScrollFocus() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href");
        if (id.length < 2) return; // just "#"
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();

        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start"
        });

        // Move focus without yanking the page back to the top.
        var hadTabindex = target.hasAttribute("tabindex");
        if (!hadTabindex) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        if (!hadTabindex) {
          target.addEventListener(
            "blur",
            function () {
              target.removeAttribute("tabindex");
            },
            { once: true }
          );
        }

        // Keep the URL tidy and shareable.
        if (history.replaceState) history.replaceState(null, "", id);
      });
    });
  }

  /* ----- Forms: inline, accessible validation + friendly confirmation ----
   * Validates on blur, then re-validates live once a field has been flagged
   * (or after a submit attempt). Errors are shown as icon + text + colour and
   * tied to each field via aria-describedby, so screen readers announce them.
   * No real network call, this is a demo, but the UX mirrors the real thing. */
  var WARN_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
    '<path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" stroke-linejoin="round"/></svg>';

  function setupForms() {
    var contactForm = document.getElementById("contact-form");
    if (contactForm) enhanceForm(contactForm, document.getElementById("contact-confirm"));
    var newsletterForm = document.getElementById("newsletter-form");
    if (newsletterForm) enhanceForm(newsletterForm, document.getElementById("newsletter-confirm"));
  }

  function enhanceForm(form, confirmEl) {
    var fields = Array.prototype.slice
      .call(form.querySelectorAll("input, textarea, select"))
      .filter(function (f) {
        return f.willValidate && f.type !== "hidden";
      });
    var submitted = false;

    fields.forEach(function (field) {
      var errEl = makeErrorNode(field);
      field.addEventListener("blur", function () {
        validateField(field, errEl);
      });
      // Only nag live once the field has already been flagged, so we never
      // shout at someone who is still part-way through typing.
      field.addEventListener("input", function () {
        if (submitted || field.getAttribute("aria-invalid") === "true") {
          validateField(field, errEl);
        }
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      submitted = true;
      var firstInvalid = null;
      fields.forEach(function (field) {
        if (!validateField(field, field._errEl) && !firstInvalid) {
          firstInvalid = field;
        }
      });
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }
      if (confirmEl) {
        confirmEl.classList.add("show");
        confirmEl.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "nearest"
        });
      }
      form.reset();
      fields.forEach(function (field) {
        clearField(field, field._errEl);
      });
      submitted = false;
    });
  }

  function makeErrorNode(field) {
    var err = document.createElement("span");
    err.className = "field-error";
    err.id = (field.id || field.name || "field") + "-error";
    err.setAttribute("role", "alert");
    field._errEl = err;
    var container = field.closest(".form-row") || field.closest(".field");
    if (container) {
      container.appendChild(err);
    } else if (field.form) {
      // Newsletter: the input sits in a flex row, so place the error after it.
      field.form.insertAdjacentElement("afterend", err);
    } else {
      field.insertAdjacentElement("afterend", err);
    }
    return err;
  }

  function messageFor(field) {
    var key = (field.id || field.name || "").toLowerCase();
    if (field.validity.typeMismatch && field.type === "email") {
      return "Please enter a valid email address, like name@example.com.";
    }
    if (field.validity.valueMissing) {
      if (key.indexOf("name") > -1) return "Please enter your name.";
      if (key.indexOf("email") > -1) return "Please enter your email address.";
      if (key.indexOf("message") > -1) return "Please add a short message.";
      return "Please fill in this field.";
    }
    return field.validationMessage || "Please check this field.";
  }

  function validateField(field, errEl) {
    if (!errEl) return true;
    if (field.checkValidity()) {
      clearField(field, errEl);
      return true;
    }
    field.setAttribute("aria-invalid", "true");
    describe(field, errEl.id, true);
    errEl.innerHTML = WARN_ICON + "<span>" + messageFor(field) + "</span>";
    errEl.classList.add("show");
    return false;
  }

  function clearField(field, errEl) {
    field.removeAttribute("aria-invalid");
    if (!errEl) return;
    errEl.classList.remove("show");
    errEl.textContent = "";
    describe(field, errEl.id, false);
  }

  // Toggle the error id inside aria-describedby without clobbering other ids.
  function describe(field, errId, on) {
    var ids = (field.getAttribute("aria-describedby") || "")
      .split(/\s+/)
      .filter(Boolean)
      .filter(function (x) {
        return x !== errId;
      });
    if (on) ids.push(errId);
    if (ids.length) field.setAttribute("aria-describedby", ids.join(" "));
    else field.removeAttribute("aria-describedby");
  }
})();
