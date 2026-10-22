(function () {
  var STEPS = [
    { t: "Eintreten", d: "Gehen Sie in den Türrahmen und bleiben Sie mittig stehen, das Gesicht nach vorn." },
    { t: "Tür schließt", d: "Hinter Ihnen schließt sich die Tür langsam. Danach startet der Ablauf." },
    { t: "Düsen fahren aus", d: "Aus beiden Seiten des Rahmens fahren je vier Düsen mechanisch heraus." },
    { t: "Nebel", d: "Ein feiner, leicht sichtbarer Nebel legt sich auf Kleidung und Körper unterhalb des Kopfes. Halten Sie die Arme leicht vom Körper ab. Das Gesicht bleibt frei." },
    { t: "Drehen", d: "Nach einigen Sekunden drehen Sie sich einmal langsam um 180 Grad. Die Düsen sprühen weiter und erreichen die andere Körperseite." },
    { t: "Zurückfahren", d: "Der Nebel stoppt, die Düsen fahren bündig in den Rahmen zurück. Der Rahmen ist wieder glatt." }
  ];
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var seed = 11;
  function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  function between(a, b) { return a + rnd() * (b - a); }
  function puffs(x, y, dxMin, dxMax, dyMin, dyMax, n, r) {
    var s = "";
    for (var i = 0; i < n; i++) {
      s += '<circle class="p" cx="' + x + '" cy="' + y + '" r="' + between(r * 0.7, r * 1.3).toFixed(1) +
        '" style="--dx:' + between(dxMin, dxMax).toFixed(0) + 'px;--dy:' + between(dyMin, dyMax).toFixed(0) +
        'px;--t:' + between(0, 1.6).toFixed(2) + 's;--d:' + between(1.3, 2.1).toFixed(2) + 's"/>';
    }
    return s;
  }

  function stageSVG() {
    var sideY = [215, 265, 315, 365], topX = [], doorPts = [];
    var nz = "", mist = "";
    sideY.forEach(function (y) {
      nz += '<g class="nz nz-l"><rect x="92" y="' + (y - 6) + '" width="34" height="12" rx="6"/><circle cx="126" cy="' + y + '" r="4.5"/></g>';
      nz += '<g class="nz nz-r"><rect x="274" y="' + (y - 6) + '" width="34" height="12" rx="6"/><circle cx="274" cy="' + y + '" r="4.5"/></g>';
      mist += puffs(130, y, 22, 42, -8, 16, 4, 4) + puffs(270, y, -42, -22, -8, 16, 4, 4);
    });
    topX.forEach(function (x, i) {
      nz += '<g class="nz nz-t"><rect x="' + (x - 6) + '" y="72" width="12" height="32" rx="6"/><circle cx="' + x + '" cy="104" r="4.5"/></g>';
      mist += puffs(x, 108, i ? -22 : 10, i ? -10 : 22, 55, 92, 5, 4);
    });
    var dz = "";
    doorPts.forEach(function (p) {
      dz += '<g class="dz"><circle cx="' + p[0] + '" cy="' + p[1] + '" r="9"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.5"/></g>';
      mist += puffs(p[0], p[1], p[0] < 200 ? 6 : -26, p[0] < 200 ? 26 : -6, -22, 22, 3, 7);
    });
    return '<svg viewBox="0 0 400 480" role="img" aria-label="Frontansicht: Türrahmen mit Person">' +
      '<rect class="frame" x="56" y="36" width="288" height="408" rx="12"/>' +
      '<rect class="reveal" x="84" y="64" width="232" height="380" rx="4"/>' +
      '<rect class="cavity" x="92" y="72" width="216" height="372"/>' +
      '<rect class="led" x="150" y="48" width="100" height="5" rx="2.5"/>' +
      '<rect class="door" x="96" y="76" width="208" height="368" rx="2"/>' +
      '<g class="doorfit">' + dz + '</g>' +
      '<rect class="handle" x="282" y="250" width="6" height="40" rx="3"/>' +
      '<ellipse class="shadow" cx="200" cy="440" rx="60" ry="7"/>' +
      '<g class="person-wrap"><g class="person-in">' +
        '<rect class="person" x="176" y="426" width="20" height="14" rx="6"/>' +
        '<rect class="person" x="176" y="318" width="20" height="116" rx="9"/><rect class="person" x="204" y="318" width="20" height="116" rx="9"/>' +
        '<rect class="person" x="170" y="196" width="60" height="140" rx="22"/>' +
        '<rect class="person" x="152" y="204" width="15" height="116" rx="7.5" transform="rotate(15 160 208)"/>' +
        '<rect class="person" x="233" y="204" width="15" height="116" rx="7.5" transform="rotate(-15 240 208)"/>' +
        '<rect class="person" x="190" y="180" width="20" height="24" rx="8"/>' +
        '<circle class="person" cx="200" cy="162" r="23"/>' +
        '<path class="hair hair-front" d="M177 160 A23 23 0 0 1 223 160 Q200 148 177 160Z"/>' +
        '<circle class="hair hair-back" cx="200" cy="162" r="23"/>' +
      '</g></g>' +
      nz +
      '<ellipse class="haze" cx="200" cy="325" rx="128" ry="135"/>' +
      '<g class="mist">' + mist + '</g>' +
      '</svg>';
  }

  function Stage(root) {
    var host = root.querySelector(".svg-host");
    host.innerHTML = stageSVG();
    var cap = root.querySelector(".cap-title");
    var seg = root.querySelector(".seg");
    var btns = STEPS.map(function (s, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", s.t);
      b.addEventListener("click", function () { api.onPick && api.onPick(i); api.set(i); });
      seg.appendChild(b);
      return b;
    });
    var api = {
      set: function (n) {
        root.dataset.step = n;
        cap.textContent = STEPS[n].t;
        btns.forEach(function (b, i) { b.setAttribute("aria-current", i === n ? "true" : "false"); });
      },
      onPick: null
    };
    api.set(0);
    return api;
  }

  /* Anleitung: Schritt folgt dem Scroll */
  var anl = Stage(document.getElementById("stage-anl"));
  var list = document.getElementById("steps");
  var items = STEPS.map(function (s, i) {
    var li = document.createElement("li");
    li.className = "step";
    li.tabIndex = 0;
    li.innerHTML = "<h3></h3><p></p>";
    li.querySelector("h3").textContent = s.t;
    li.querySelector("p").textContent = s.d;
    li.addEventListener("click", function () { li.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }); });
    li.addEventListener("focus", function () { select(i); });
    list.appendChild(li);
    return li;
  });
  function select(i) {
    anl.set(i);
    items.forEach(function (li, j) { li.setAttribute("aria-current", i === j ? "true" : "false"); });
  }
  anl.onPick = function (i) { items[i].scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }); };
  select(0);
  var stepIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) select(items.indexOf(e.target)); });
  }, { rootMargin: "-42% 0px -42% 0px", threshold: 0 });
  items.forEach(function (li) { stepIO.observe(li); });

  /* Video erscheint nur, wenn die Datei neben der Seite liegt */
  var vid = document.getElementById("demo");
  vid.addEventListener("loadedmetadata", function () { document.getElementById("video-slot").hidden = false; });

  /* Anfrage: nur Vorschau, es wird nichts übertragen */
  var form = document.getElementById("form");
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var ok = true;
    var name = document.getElementById("f-name"), mail = document.getElementById("f-mail");
    document.getElementById("e-name").textContent = "";
    document.getElementById("e-mail").textContent = "";
    if (!name.value.trim()) { document.getElementById("e-name").textContent = "Bitte geben Sie Ihren Namen an."; ok = false; }
    if (!mail.value.trim() || !mail.checkValidity()) { document.getElementById("e-mail").textContent = "Bitte geben Sie eine gültige E-Mail-Adresse an."; ok = false; }
    if (!ok) return;
    var who = name.value.trim();
    form.innerHTML = '<div class="form-done" role="status"><h3></h3>' +
      '<p>Diese Vorschau überträgt keine Daten. Ihre Angaben wurden nicht gesendet.</p></div>';
    form.querySelector("h3").textContent = "Danke, " + who + ".";
  });

  /* Zahlen zählen hoch, sobald der Abschnitt sichtbar wird */
  var fmt = function (v, dec) { return v.toLocaleString("de-DE", { minimumFractionDigits: dec, maximumFractionDigits: dec }); };
  function countUp(el) {
    var to = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || "0", 10), dur = 1900, t0 = null;
    function frame(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / dur, 1), e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = fmt(to * e, dec);
      if (p < 1) requestAnimationFrame(frame);
    }
    el.textContent = fmt(0, dec);
    requestAnimationFrame(frame);
  }
  if (!reduce) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    document.querySelectorAll("[data-count]").forEach(function (el) { cio.observe(el); });

    /* Einblendung für Inhalte unterhalb des ersten Bildschirms */
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); rio.unobserve(e.target); } });
    }, { threshold: 0.15 });
    var groups = [".zahl", ".phase", ".flow li", ".cell", ".stand-row", "details", ".markt-grid > *", ".anfrage-grid > *"];
    groups.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el, i) {
        if (el.getBoundingClientRect().top < window.innerHeight) return;
        el.classList.add("rv");
        el.style.setProperty("--rv-d", (i % 4) * 0.09 + "s");
        rio.observe(el);
      });
    });
  }
})();
