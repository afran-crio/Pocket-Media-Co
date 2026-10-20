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
    storyIcon.textContent = open ? "↑" : "↓";
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

    // Links elsewhere on the page that point into the story open it first
    document.querySelectorAll("[data-open-story]").forEach(function (link) {
      link.addEventListener("click", function (e) {
        var target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        setStory(true);
        setTimeout(function () {
          target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
        }, reduceMotion ? 0 : 560);
      });
    });
  }

  // ---------- Scroll reveals ----------
  // Tags elements with data-reveal; CSS hides them only when JS runs and motion is allowed.
  var revealGroups = [
    [".wide-heading, .who-intro, .work-sub, .who-outro, .work-soon, .party-close, .party-line-1, .contact-copy, .enquiry, .story-copy, .client-label", ""],
    [".svc", ""],
    [".who-card", "slap"],
    [".svc-caps li, .eco-logo, .client-logo", "pop"],
    [".step", "right"],
    [".faq-list details", ""],
    [".party-line-2, .story-pull", "punch"]
  ];

  if (!reduceMotion && "IntersectionObserver" in window) {
    revealGroups.forEach(function (g) {
      document.querySelectorAll(g[0]).forEach(function (el) {
        if (el.hasAttribute("data-reveal")) return;
        el.setAttribute("data-reveal", g[1]);
        var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
          return c.matches(g[0]);
        });
        var i = siblings.indexOf(el);
        var step = g[1] === "pop" ? 0.03 : 0.09;
        el.style.setProperty("--d", Math.min(i * step, 0.6) + "s");
        if (g[1] === "slap") el.style.setProperty("--tilt", (i % 2 ? 5 : -5) + "deg");
      });
    });
    document.querySelectorAll(".party-line-2").forEach(function (el) { el.style.setProperty("--d", "0.35s"); });

    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          revealIO.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    document.querySelectorAll("[data-reveal]").forEach(function (el) { revealIO.observe(el); });
  }

  // ---------- Scroll-progress bolt in the header ----------
  var boltFill = document.querySelector(".scroll-bolt-fill");
  if (boltFill) {
    var ticking = false;
    var paintProgress = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      boltFill.style.setProperty("--progress", pct.toFixed(1) + "%");
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(paintProgress); }
    }, { passive: true });
    window.addEventListener("resize", paintProgress);
    paintProgress();
  }

  // ---------- FAQ: smooth open and close ----------
  if (!reduceMotion && Element.prototype.animate) {
    document.querySelectorAll(".faq details").forEach(function (d) {
      var summary = d.querySelector("summary");
      var body = d.querySelector("p");
      summary.addEventListener("click", function (e) {
        e.preventDefault();
        if (d.dataset.animating) return;
        d.dataset.animating = "1";
        var done = function () { delete d.dataset.animating; body.style.overflow = ""; };
        body.style.overflow = "hidden";
        if (d.open) {
          var h = body.offsetHeight;
          body.animate([{ height: h + "px", opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 260, easing: "ease" })
            .onfinish = function () { d.open = false; done(); };
        } else {
          d.open = true;
          var h2 = body.offsetHeight;
          body.animate([{ height: "0px", opacity: 0 }, { height: h2 + "px", opacity: 1 }], { duration: 320, easing: "cubic-bezier(.2,.9,.3,1)" })
            .onfinish = done;
        }
      });
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
    email: "Email",
    phone: "Phone / WhatsApp",
    link: "Instagram / Website",
    service: "Help with",
    budget_type: "Budget type",
    budget_monthly: "Monthly budget",
    budget_project: "Project budget",
    start: "Looking to start",
    about: "About the business"
  };

  // Budget questions depend on the service picked. Hidden fieldsets are also
  // disabled, so their answers are never validated or sent.
  var budgetType = document.getElementById("f-budget-type");
  var budgetMonthly = document.getElementById("f-budget-monthly");
  var budgetProject = document.getElementById("f-budget-project");

  function showFieldset(fs, on) {
    if (fs.hidden === !on) return;
    fs.hidden = !on;
    fs.disabled = !on;
    if (!on) fs.querySelectorAll("input").forEach(function (i) { i.checked = false; });
  }

  function updateBudget() {
    var service = (form.querySelector("input[name=service]:checked") || {}).value;
    var both = service === "Both / Not Sure Yet";
    var type = both && (form.querySelector("input[name=budget_type]:checked") || {}).value;
    showFieldset(budgetType, both);
    showFieldset(budgetMonthly, service === "Social Media Management" || type === "Monthly");
    showFieldset(budgetProject, service === "Content Creation / Video Production" || type === "Project-based");
  }

  form.addEventListener("change", function (e) {
    if (e.target.name === "service" || e.target.name === "budget_type") updateBudget();
  });

  // Service CTAs pre-select the matching enquiry category
  document.querySelectorAll("[data-service]").forEach(function (link) {
    link.addEventListener("click", function () {
      var radio = form.querySelector('input[name=service][value="' + link.dataset.service + '"]');
      if (radio) { radio.checked = true; updateBudget(); }
    });
  });

  // A bolt strikes across the form when an enquiry really lands
  function strike() {
    if (reduceMotion) return;
    var bolt = document.createElement("img");
    bolt.src = "assets/img/bolt-6.webp";
    bolt.alt = "";
    bolt.className = "form-strike";
    bolt.style.setProperty("--strike-x", (form.offsetWidth - 40) + "px");
    bolt.addEventListener("animationend", function () { bolt.remove(); });
    form.appendChild(bolt);
  }

  function setStatus(msg, type) {
    status.textContent = msg;
    status.className = "form-status" + (type ? " is-" + type : "");
  }

  function markInvalid(el, bad) {
    el.setAttribute("aria-invalid", bad ? "true" : "false");
  }

  function validate() {
    var problems = [];
    var first = null;
    function fail(el, msg) {
      if (!first) first = el;
      if (msg && problems.indexOf(msg) === -1) problems.push(msg);
    }

    ["f-brand", "f-name"].forEach(function (id) {
      var input = document.getElementById(id);
      var bad = !input.value.trim();
      markInvalid(input, bad);
      if (bad) fail(input, "your brand and name");
    });

    var email = document.getElementById("f-email");
    var phone = document.getElementById("f-phone");
    var hasEmail = !!email.value.trim();
    var hasPhone = !!phone.value.trim();
    var emailBad = hasEmail && !email.checkValidity();
    markInvalid(email, emailBad || (!hasEmail && !hasPhone));
    markInvalid(phone, !hasEmail && !hasPhone);
    if (!hasEmail && !hasPhone) fail(email, "an email or phone number");
    else if (emailBad) fail(email, "a valid email address");

    // Every visible required radio group needs an answer
    form.querySelectorAll("fieldset:not([disabled])").forEach(function (fs) {
      var req = fs.querySelector("input[type=radio][required]");
      if (req && !fs.querySelector("input[type=radio]:checked")) {
        fail(req, fs.id === "f-service" ? "what we can help with" : "a budget (or \"Need guidance\")");
      }
    });

    return { first: first, problems: problems };
  }

  form.addEventListener("input", function (e) {
    if (e.target.getAttribute("aria-invalid") === "true" && e.target.value.trim()) {
      markInvalid(e.target, false);
      if (e.target.id === "f-email" || e.target.id === "f-phone") {
        markInvalid(document.getElementById("f-email"), false);
        markInvalid(document.getElementById("f-phone"), false);
      }
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var check = validate();
    if (check.first) {
      setStatus("Almost there! We just need " + check.problems.join(", ") + ".", "error");
      check.first.focus();
      return;
    }

    var data = new FormData(form);
    var endpoint = form.dataset.endpoint;
    var email = form.dataset.email;
    var service = data.get("service");

    if (endpoint) {
      var btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      setStatus("Sending…");
      fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (res) {
          if (!res.ok) throw new Error(res.status);
          form.reset();
          updateBudget();
          track("generate_lead", { method: "form", service: service });
          setStatus("And it's in! We'll take a look and get back to you soon.", "success");
          strike();
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
        if (String(value).trim()) lines.push((labels[key] || key) + ": " + value);
      });
      var subject = "Website enquiry: " + data.get("brand") + " (" + service + ")";
      track("generate_lead", { method: "email", service: service });
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
