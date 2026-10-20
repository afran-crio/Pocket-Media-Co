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

  // ---------- Portfolio videos: play only while on screen ----------
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
          setStatus("Thanks! We've got your enquiry and will be in touch soon.", "success");
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
      window.location.href = "mailto:" + email +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n\n"));
      setStatus("Your email app should open with your enquiry ready to send.", "success");
      return;
    }

    setStatus("Our enquiry form isn't connected yet. Please reach out to Pocket directly for now.", "error");
  });

  // ---------- Footer year ----------
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
