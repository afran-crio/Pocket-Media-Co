(function () {
  "use strict";

  // ---------- Mobile nav ----------
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function setNav(open) {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  }

  toggle.addEventListener("click", function () {
    setNav(toggle.getAttribute("aria-expanded") !== "true");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setNav(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setNav(false);
  });

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- About: "There's more to our story" ----------
  var story = document.getElementById("our-story");
  var storyToggle = document.querySelector(".story-toggle[aria-expanded]");
  var storyLabel = storyToggle && storyToggle.querySelector(".story-toggle-label");
  var storyIcon = storyToggle && storyToggle.querySelector(".story-toggle-icon");

  function setStory(open) {
    storyToggle.setAttribute("aria-expanded", String(open));
    storyLabel.textContent = open ? "Show less" : "There's more to our story";
    storyIcon.textContent = open ? "↑" : "↗";
    story.classList.toggle("is-open", open);
    if (open) story.removeAttribute("inert");
    else story.setAttribute("inert", "");
  }

  if (story && storyToggle) {
    storyToggle.addEventListener("click", function () {
      setStory(storyToggle.getAttribute("aria-expanded") !== "true");
    });
    story.querySelector(".story-toggle-close").addEventListener("click", function () {
      setStory(false);
      storyToggle.focus({ preventScroll: true });
      document.getElementById("about").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  // ---------- Portfolio videos: play only while on screen ----------
  var videos = document.querySelectorAll(".project-media video");

  if (reduceMotion) {
    videos.forEach(function (v) { v.controls = true; });
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          var p = v.play();
          if (p && p.catch) p.catch(function () { v.controls = true; });
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.4 });
    videos.forEach(function (v) {
      v.muted = true;
      io.observe(v);
    });
  }

  // ---------- Analytics ----------
  // Sends events to whichever tool is installed (Google Analytics / Tag Manager,
  // Plausible, Meta Pixel). Does nothing until one of them is added to the page.
  function track(name, params) {
    params = params || {};
    if (window.gtag) window.gtag("event", name, params);
    if (window.dataLayer && !window.gtag) window.dataLayer.push(Object.assign({ event: name }, params));
    if (window.plausible) window.plausible(name, { props: params });
    if (window.fbq) window.fbq("trackCustom", name, params);
  }

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-track]");
    if (el) track(el.dataset.track);
  });

  // ---------- Enquiry form ----------
  var form = document.getElementById("enquiry-form");
  var status = form.querySelector(".form-status");
  var labels = {
    brand: "Business / Brand Name",
    name: "Contact Name",
    contact: "Contact Details",
    link: "Instagram / Website",
    package: "Looking for",
    about: "About the business"
  };

  // "Choose" buttons pre-select the package in the form
  document.querySelectorAll("[data-plan]").forEach(function (link) {
    link.addEventListener("click", function () {
      var radio = form.querySelector('input[name=package][value="' + link.dataset.plan + '"]');
      if (radio) radio.checked = true;
    });
  });

  function setStatus(msg, type) {
    status.textContent = msg;
    status.className = "form-status" + (type ? " is-" + type : "");
  }

  function validate() {
    var firstInvalid = null;
    form.querySelectorAll("input[type=text][required]").forEach(function (input) {
      var bad = !input.value.trim();
      input.setAttribute("aria-invalid", bad ? "true" : "false");
      if (bad && !firstInvalid) firstInvalid = input;
    });
    var picked = form.querySelector("input[name=package]:checked");
    if (!picked && !firstInvalid) firstInvalid = form.querySelector("input[name=package]");
    return firstInvalid;
  }

  form.addEventListener("input", function (e) {
    if (e.target.getAttribute("aria-invalid") === "true" && e.target.value.trim()) {
      e.target.setAttribute("aria-invalid", "false");
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var invalid = validate();
    if (invalid) {
      setStatus("Please fill in your brand, name, contact details and what you're looking for.", "error");
      invalid.focus();
      return;
    }

    var data = new FormData(form);
    var endpoint = form.dataset.endpoint;
    var email = form.dataset.email;

    if (endpoint) {
      var btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      setStatus("Sending…");
      fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (res) {
          if (!res.ok) throw new Error(res.status);
          form.reset();
          track("generate_lead", { method: "form" });
          setStatus("Thanks! We've got your enquiry. We'll be in touch to learn about your business and recommend the right package.", "success");
        })
        .catch(function () {
          setStatus("Something went wrong sending that. Please try again in a moment.", "error");
        })
        .finally(function () { btn.disabled = false; });
      return;
    }

    if (email) {
      var lines = [];
      data.forEach(function (value, key) {
        if (String(value).trim()) lines.push(labels[key] + ": " + value);
      });
      var subject = "Website enquiry: " + data.get("brand");
      track("generate_lead", { method: "email" });
      window.location.href = "mailto:" + email +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n\n"));
      setStatus("Your email app should open with your enquiry ready to send.", "success");
      return;
    }

    setStatus("Our enquiry form isn't connected yet. Please reach out to Pocket directly for now.", "error");
  });

  // ---------- Sticky mobile CTA ----------
  // Shows once the hero is out of view; hides again while the contact form is on screen.
  var bar = document.querySelector(".mobile-cta");
  var hero = document.querySelector(".hero");
  var contact = document.getElementById("contact");
  if (bar && "IntersectionObserver" in window) {
    var heroVisible = true, contactVisible = false;
    var update = function () { bar.classList.toggle("is-visible", !heroVisible && !contactVisible); };
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.target === hero) heroVisible = entry.isIntersecting;
        if (entry.target === contact) contactVisible = entry.isIntersecting;
      });
      update();
    }).observe(hero);
    var io2 = new IntersectionObserver(function (entries) {
      contactVisible = entries[0].isIntersecting;
      update();
    });
    io2.observe(contact);
  }

  // ---------- Footer year ----------
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
