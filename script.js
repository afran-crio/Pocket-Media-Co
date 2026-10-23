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
    [".head, .statement, .also, .soon, .show-text, .contact-copy, .enquiry, .story-copy, .client-label, .client-note, .explorer, .fine", ""],
    [".stickers li, .eco-logo, .client-logo, .numlist li, .nope-list li", "pop"],
    [".nope-stamp", "stamp"],
    [".journey li, .price-card, .card, .show-media, .slide-visual > *", "slap"],
    [".faq-list details, .slide-copy, .belief, .checklist li", ""]
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
    document.querySelectorAll(".faq-list details").forEach(function (d) {
      var summary = d.querySelector("summary");
      var body = d.querySelector(".faq-answer");
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

  // ---------- Cards tilt toward the mouse (desktop only) ----------
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".show-media, .journey li, .price-card, .card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transition = "transform 0.08s linear";
        card.style.transform = "perspective(900px) rotateX(" + (-y * 6).toFixed(2) + "deg) rotateY(" + (x * 8).toFixed(2) + "deg)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transition = "transform 0.4s ease";
        card.style.transform = "";
      });
    });
  }

  // ---------- Foundation: "Where are we starting from?" explorer ----------
  // Purely informational: switching tabs shows a different panel, nothing is submitted.
  var fndTabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  function selectTab(tab, focus) {
    fndTabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) tab.focus();
  }
  fndTabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { selectTab(tab); });
    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight") next = fndTabs[(i + 1) % fndTabs.length];
      if (e.key === "ArrowLeft") next = fndTabs[(i - 1 + fndTabs.length) % fndTabs.length];
      if (e.key === "Home") next = fndTabs[0];
      if (e.key === "End") next = fndTabs[fndTabs.length - 1];
      if (next) { e.preventDefault(); selectTab(next, true); }
    });
  });

  // ---------- Hero stickers drift as you scroll ----------
  var heroVisual = document.querySelector(".hero-visual");
  if (heroVisual && !reduceMotion) {
    var drift = function () { heroVisual.style.setProperty("--sy", Math.min(window.scrollY, 900).toFixed(0)); };
    window.addEventListener("scroll", function () { window.requestAnimationFrame(drift); }, { passive: true });
  }

  // ---------- Portfolio videos: play only while on screen ----------
  var videos = document.querySelectorAll(".show-media video");

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
  // (Only on pages that have the enquiry form.)
  var form = document.getElementById("enquiry-form");
  if (form) {
    var status = form.querySelector(".form-status");
    var loadedAt = Date.now();
  var labels = {
      name: "Name",
      business: "Business / Instagram",
      contact: "Email / WhatsApp",
      looking_for: "Looking for",
      about: "Anything else"
    };

    // "Psst" link and the main CTA pre-select what the visitor is after
    document.querySelectorAll("[data-service]").forEach(function (link) {
      link.addEventListener("click", function () {
        var radio = form.querySelector('input[name=looking_for][value="' + link.dataset.service + '"]');
        if (radio) radio.checked = true;
      });
    });

    // Links from other pages can pre-select the enquiry type: index.html?want=socials|content|unsure#contact
  var want = { socials: "Someone to handle our socials", content: "Just some really good content", unsure: "Not sure yet. Let's talk." }[new URLSearchParams(location.search).get("want")];
  if (want) {
    var wantRadio = form.querySelector('input[name=looking_for][value="' + want + '"]');
    if (wantRadio) wantRadio.checked = true;
  }

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
      var first = null;
      ["f-name", "f-brand", "f-contact"].forEach(function (id) {
        var input = document.getElementById(id);
        var bad = !input.value.trim();
        markInvalid(input, bad);
        if (bad && !first) first = input;
      });
      if (!first && !form.querySelector("input[name=looking_for]:checked")) {
        first = form.querySelector("input[name=looking_for]");
      }
      return first;
    }

    form.addEventListener("input", function (e) {
      if (e.target.getAttribute("aria-invalid") === "true" && e.target.value.trim()) {
        markInvalid(e.target, false);
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Spam trap: bots fill the hidden field or submit instantly. Show the normal message, send nothing.
    var trap = form.querySelector("[name=_gotcha]");
    if ((trap && trap.value) || Date.now() - loadedAt < 3000) {
      setStatus("And it's in! We'll take a look and get back to you soon.", "success");
      return;
    }

    var invalid = validate();
      if (invalid) {
        setStatus("Almost there! We just need your name, where to find you, how to reach you and what you're looking for.", "error");
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
          if (key !== "_gotcha" && String(value).trim()) lines.push((labels[key] || key) + ": " + value);
        });
        var subject = "Website enquiry: " + data.get("business");
        track("generate_lead", { method: "email" });
        window.location.href = "mailto:" + email +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(lines.join("\n\n"));
        setStatus("Your email app should open with your enquiry ready to send.", "success");
        return;
      }

      setStatus("Our enquiry form isn't connected yet. Please reach out to Pocket directly for now.", "error");
    });
  }

  // ---------- "Veryyyyy": a rubber band. Stretches as the heading reaches the middle of the screen, springs back as it leaves ----------
  var very = document.querySelector(".very");
  if (very) {
    var veryLine = very.parentNode;
    var veryY = very.querySelector(".very-y");
    var veryHead = veryLine.parentNode;
    var MAX_Y = 8, veryMax = 6;
    var taper = function (i) { return 0.92 - i * 0.07; };
    for (var vi = 0; vi < MAX_Y; vi++) {
      var ys = document.createElement("span");
      ys.textContent = "y";
      veryY.appendChild(ys);
    }
    // x is how far the band is stretched, in y's. Each y grows in as x passes it.
    var paintVery = function (x) {
      for (var i = 0; i < MAX_Y; i++) {
        var f = Math.max(0, Math.min(1, x - i));
        var s = veryY.children[i];
        s.hidden = f === 0;
        s.style.fontSize = (taper(i) * f).toFixed(3) + "em";
      }
      // Squash a little when it snaps back past rest
      very.style.transform = x < 0 ? "scaleX(" + (1 + x * 0.25).toFixed(3) + ")" : "";
      very.classList.toggle("is-stretched", x > 0.3);
    };
    // Size the line so the full stretch still fits on one line
    var measureVery = function () {
      veryMax = window.innerWidth < 700 ? 3 : 6;
      veryHead.style.fontSize = "";
      veryLine.style.minWidth = "";
      paintVery(veryMax);
      var room = veryHead.clientWidth;
      var w = veryLine.getBoundingClientRect().width;
      if (w > room) veryHead.style.fontSize = (parseFloat(getComputedStyle(veryHead).fontSize) * room / w * 0.98).toFixed(1) + "px";
      // Hold the stretched width so "We're" stays put and only the y's grow
      veryLine.style.minWidth = Math.ceil(veryLine.getBoundingClientRect().width) + "px";
      paintVery(veryX);
    };
    var veryTarget = function () {
      var r = veryHead.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = 1 - Math.abs(r.top - vh * 0.3) / (vh * 0.6);
      return Math.max(0, Math.min(1, p * 1.5)) * veryMax;
    };
    var veryX = 0, veryV = 0, veryRunning = false;
    var springVery = function () {
      var t = veryTarget();
      veryV = veryV * 0.8 + (t - veryX) * 0.09;
      veryX += veryV;
      paintVery(veryX);
      if (Math.abs(veryV) > 0.002 || Math.abs(t - veryX) > 0.002) requestAnimationFrame(springVery);
      else { veryX = t; paintVery(veryX); veryRunning = false; }
    };
    var kickVery = function () {
      if (reduceMotion) { paintVery(Math.min(3, veryMax)); return; }
      if (!veryRunning) { veryRunning = true; requestAnimationFrame(springVery); }
    };
    measureVery();
    kickVery();
    window.addEventListener("scroll", kickVery, { passive: true });
    window.addEventListener("resize", function () { measureVery(); kickVery(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measureVery(); kickVery(); });
  }

  // ---------- Footer year ----------
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
