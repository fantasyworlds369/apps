(function () {
  const UI = {
    vi: { apps: "Ứng dụng", donate: "Ủng hộ", about: "Giới thiệu", search: "Tìm ứng dụng...", all: "Tất cả",
      none: "Không tìm thấy ứng dụng phù hợp.", free: "Miễn phí", download: "Tải về", zip: "Tải bản ZIP",
      version: "Phiên bản", updated: "Cập nhật", platform: "Hệ điều hành", size: "Dung lượng", price: "Giá",
      features: "Tính năng", howto: "Cách dùng", changelog: "Lịch sử phiên bản", verify: "Kiểm tra file (SHA256)",
      copy: "Sao chép", copied: "Đã chép", info: "Thông tin", back: "Ứng dụng", notfound: "Không tìm thấy ứng dụng này.",
      smart: "Windows có thể hiện cảnh báo SmartScreen với app mới: bấm “More info” → “Run anyway”. Chỉ tải từ trang này và đối chiếu mã SHA256.",
      support_h: "Ủng hộ tác giả ☕", support_s: "Mọi ứng dụng đều miễn phí. Nếu thấy hữu ích, bạn có thể mời mình một ly cà phê.",
      thanks: "Cảm ơn bạn rất nhiều! ❤", contact: "Liên hệ", email: "Email", issues: "Báo lỗi / góp ý",
      privacy: "Quyền riêng tư", free_for_all: "Miễn phí cho mọi người" },
    en: { apps: "Apps", donate: "Support", about: "About", search: "Search apps...", all: "All",
      none: "No matching apps found.", free: "Free", download: "Download", zip: "Download ZIP",
      version: "Version", updated: "Updated", platform: "Platform", size: "Size", price: "Price",
      features: "Features", howto: "How to use", changelog: "Changelog", verify: "Verify file (SHA256)",
      copy: "Copy", copied: "Copied", info: "Details", back: "Apps", notfound: "This app was not found.",
      smart: "Windows may show a SmartScreen warning for new apps: click “More info” → “Run anyway”. Download only from this site and compare the SHA256 hash.",
      support_h: "Support the author ☕", support_s: "Every app is free. If one helps you, consider buying me a coffee.",
      thanks: "Thank you so much! ❤", contact: "Contact", email: "Email", issues: "Report a bug / feedback",
      privacy: "Privacy", free_for_all: "Free for everyone" }
  };

  let lang = "en";
  try { lang = localStorage.getItem("lang") || ""; } catch (e) {}
  if (lang !== "vi" && lang !== "en") lang = (navigator.language || "").toLowerCase().startsWith("vi") ? "vi" : "en";

  const t = (k) => UI[lang][k] || k;
  const L = (o) => (o && typeof o === "object" ? (o[lang] || o.vi || o.en || "") : o || "");
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = (s) => document.querySelector(s);
  const page = document.body.dataset.page;
  let site, apps, filter = "all", query = "";

  function setLang(l) {
    lang = l;
    try { localStorage.setItem("lang", l); } catch (e) {}
    render();
  }

  function chrome() {
    const nav = (id, href, label) => `<a href="${href}" class="${page === id ? "on" : ""}">${esc(label)}</a>`;
    $("#top").innerHTML = `<div class="wrap">
      <a class="brand" href="index.html">${esc(site.brand)}</a>
      <nav>${nav("home", "index.html", t("apps"))}<a href="index.html#donate">${esc(t("donate"))}</a>${nav("about", "about.html", t("about"))}
        <div class="lang"><button data-l="vi" class="${lang === "vi" ? "on" : ""}">VI</button><button data-l="en" class="${lang === "en" ? "on" : ""}">EN</button></div>
      </nav></div>`;
    $("#top").querySelectorAll("[data-l]").forEach((b) => (b.onclick = () => setLang(b.dataset.l)));
    $("#foot").innerHTML = `<div class="wrap">© ${new Date().getFullYear()} ${esc(site.brand)} · ${esc(t("free_for_all"))}</div>`;
    document.documentElement.lang = lang;
  }

  function donateBlock() {
    const d = site.donate || {};
    return `<section id="donate"><h2>${esc(t("support_h"))}</h2><p class="sub">${esc(t("support_s"))}</p>
      <div class="card donate">${d.qr ? `<img src="${esc(d.qr)}" alt="QR">` : ""}
      <div><p>${esc(L(d.note))}</p>${d.intl_url ? `<p><a class="btn ghost" href="${esc(d.intl_url)}" target="_blank" rel="noopener">${esc(d.intl_label || "PayPal / Ko-fi")}</a></p>` : ""}
      <p class="small">${esc(t("thanks"))}</p></div></div></section>`;
  }

  function home() {
    const cats = Object.keys(site.categories || {}).filter((c) => apps.some((a) => a.category === c));
    const q = query.trim().toLowerCase();
    const list = apps.filter((a) => (filter === "all" || a.category === filter) &&
      (!q || (a.name + " " + L(a.summary)).toLowerCase().includes(q)));
    document.title = site.brand;
    $("#main").innerHTML = `<div class="wrap">
      <div class="hero"><h1>${esc(L(site.tagline))}</h1><p>${esc(L(site.hero_sub))}</p></div>
      <div class="tools"><input id="q" type="search" placeholder="${esc(t("search"))}" value="${esc(query)}">
        <button class="chip ${filter === "all" ? "on" : ""}" data-c="all">${esc(t("all"))}</button>
        ${cats.map((c) => `<button class="chip ${filter === c ? "on" : ""}" data-c="${esc(c)}">${esc(L(site.categories[c]))}</button>`).join("")}</div>
      <div class="grid">${list.map((a) => `<a class="card app" href="app.html?id=${encodeURIComponent(a.id)}">
        <div class="ic">${esc(a.icon || "📦")}</div><h3>${esc(a.name)}</h3><p>${esc(L(a.summary))}</p>
        <div class="meta"><span class="tag ${a.price === "free" ? "free" : ""}">${esc(a.price === "free" ? t("free") : a.price)}</span>
        <span class="tag">v${esc(a.version)}</span><span class="tag">${esc(a.platform)}</span></div></a>`).join("")}</div>
      ${list.length ? "" : `<div class="empty">${esc(t("none"))}</div>`}
      ${donateBlock()}</div>`;
    const qi = $("#q");
    qi.oninput = () => { query = qi.value; const pos = qi.selectionStart; home(); const n = $("#q"); n.focus(); n.setSelectionRange(pos, pos); };
    document.querySelectorAll("[data-c]").forEach((b) => (b.onclick = () => { filter = b.dataset.c; home(); }));
  }

  function detail() {
    const id = new URLSearchParams(location.search).get("id");
    const a = apps.find((x) => x.id === id);
    if (!a) { document.title = site.brand; $("#main").innerHTML = `<div class="wrap"><p class="empty">${esc(t("notfound"))}</p></div>`; return; }
    document.title = `${a.name} · ${site.brand}`;
    const kv = [[t("version"), "v" + a.version], [t("updated"), a.updated], [t("platform"), a.platform], [t("size"), a.size],
      [t("price"), a.price === "free" ? t("free") : a.price]];
    $("#main").innerHTML = `<div class="wrap">
      <div class="crumb"><a href="index.html">${esc(t("back"))}</a> / ${esc(a.name)}</div>
      <div class="head"><div class="ic">${esc(a.icon || "📦")}</div><div><h1>${esc(a.name)}</h1><div class="sub">${esc(L(a.summary))}</div></div></div>
      <div class="acts"><a class="btn" href="${esc(a.download)}" download>⬇ ${esc(t("download"))}</a>
        ${a.zip ? `<a class="btn ghost" href="${esc(a.zip)}" download>${esc(t("zip"))}</a>` : ""}</div>
      <div class="two"><div>
        <h2>${esc(t("features"))}</h2><ul class="feat">${(L(a.features) || []).map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
        <h2 style="margin-top:24px">${esc(t("howto"))}</h2><ol class="steps">${(L(a.howto) || []).map((f) => `<li>${esc(f)}</li>`).join("")}</ol>
        <p class="small">${esc(t("smart"))}</p>
        <h2 style="margin-top:24px">${esc(t("changelog"))}</h2>
        ${(a.changelog || []).map((c) => `<div class="log"><b>v${esc(c.version)}</b> <span class="small">${esc(c.date)}</span><div>${esc(L(c.notes))}</div></div>`).join("")}
      </div><div>
        <div class="card"><h3 style="margin-top:0">${esc(t("info"))}</h3><table class="kv">${kv.map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join("")}</table></div>
        ${a.sha256 ? `<div class="card" style="margin-top:14px"><h3 style="margin-top:0">${esc(t("verify"))}</h3><div class="hash" id="h">${esc(a.sha256)}</div>
          <button class="btn ghost" id="cp" style="padding:6px 14px">${esc(t("copy"))}</button></div>` : ""}
      </div></div>${donateBlock()}</div>`;
    const cp = $("#cp");
    if (cp) cp.onclick = () => { try { navigator.clipboard.writeText(a.sha256); cp.textContent = t("copied"); } catch (e) {} };
  }

  function about() {
    document.title = `${t("about")} · ${site.brand}`;
    const c = site.contact || {};
    $("#main").innerHTML = `<div class="wrap"><section><h2>${esc(t("about"))}</h2>
      ${(L(site.about) || []).map((p) => `<p>${esc(p)}</p>`).join("")}</section>
      <section><h2>${esc(t("contact"))}</h2><p>${c.email ? `${esc(t("email"))}: <a href="mailto:${esc(c.email)}">${esc(c.email)}</a><br>` : ""}
      ${c.issues_url ? `<a href="${esc(c.issues_url)}" target="_blank" rel="noopener">${esc(t("issues"))}</a>` : ""}</p></section>
      <section><h2>${esc(t("privacy"))}</h2><p>${esc(L(site.privacy))}</p></section>${donateBlock()}</div>`;
  }

  function render() {
    chrome();
    ({ home, app: detail, about }[page] || home)();
  }

  Promise.all([fetch("site.json").then((r) => r.json()), fetch("apps.json").then((r) => r.json())])
    .then(([s, a]) => { site = s; apps = a; render(); })
    .catch((e) => { $("#main").innerHTML = `<div class="wrap"><p class="empty">Failed to load data: ${esc(e.message)}. Open via a web server, not file://.</p></div>`; });
})();
