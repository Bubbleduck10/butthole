/* butthole.bot — he spins for free; filing a proposal costs you a form. */
(() => {
  const $ = (id) => document.getElementById(id);

  /* ---------------- static config ---------------- */
  const d = CONFIG.deletion;
  $("s-files").textContent = d.filesChanged;
  $("s-lines").textContent = d.linesDeleted.toLocaleString();
  $("stars").textContent = d.upstreamStars;
  $("x").href = CONFIG.twitterUrl;
  $("mint-line").textContent = CONFIG.contractAddress
    ? "mint " + CONFIG.contractAddress
    : "mint not yet announced";
  $("buy").href = CONFIG.contractAddress
    ? "https://pump.fun/coin/" + CONFIG.contractAddress
    : CONFIG.twitterUrl;
  if (!CONFIG.contractAddress) $("buy").textContent = "FOLLOW THE LAUNCH ›";

  /* ---------------- the employee (decorative; files nothing) ---------------- */
  const bot = $("bot"), pop = $("pop"), log = $("log");
  let spin = 0;

  const QUIPS = [
    "he cannot file it for you",
    "he is not authorised to complete forms",
    "he spun. that is the entire skillset.",
    "spinning is not a market action",
    "he has no opinion he is allowed to act on",
    "that did nothing, which is consistent",
  ];
  const rand = (a) => a[Math.floor(Math.random() * a.length)];

  const showPop = (text, color) => {
    pop.textContent = text;
    pop.style.color = color;
    pop.classList.remove("show");
    void pop.offsetWidth;
    pop.classList.add("show");
  };

  const spinHim = (big = false) => {
    spin += big ? 1080 : 360;
    bot.style.transform = `rotateY(${spin}deg)`;
    bot.classList.remove("dizzy");
    void bot.offsetWidth;
    if (big) bot.classList.add("dizzy");
    showPop(big ? "AAAA" : "SPIN", "#e8683c");
    $("prod").textContent = rand(QUIPS);
  };

  bot.addEventListener("click", () => spinHim(false));
  $("hotspot").addEventListener("click", (e) => {
    e.stopPropagation();
    spinHim(true);
    $("prod").textContent = "you pressed it. it still does not file anything.";
  });

  /* ---------------- the queue ---------------- */
  const KEY = "bh.proposals.v1";
  const loadFiled = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  };
  const saveFiled = (arr) => {
    try { localStorage.setItem(KEY, JSON.stringify(arr.slice(-40))); } catch {}
  };
  let filed = loadFiled();

  const STATUS = [
    "awaiting sign-off · approver: vacant",
    "pending risk review · risk management: terminated",
    "escalated to the portfolio manager · position abolished",
    "requires a second opinion · none obtainable",
    "sent for research validation · research dissolved",
  ];

  const ago = (ts) => {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return s + "s";
    if (s < 3600) return Math.floor(s / 60) + "m";
    if (s < 86400) return Math.floor(s / 3600) + "h";
    return Math.floor(s / 86400) + "d";
  };

  const renderQueue = () => {
    $("trade-count").textContent = filed.length;
    $("approved").textContent = "0";
    if (!filed.length) {
      log.innerHTML = '<li class="idle">queue empty · approver: vacant · estimated wait: indefinite</li>';
      return;
    }
    log.innerHTML = "";
    [...filed].reverse().slice(0, 8).forEach((p) => {
      const li = document.createElement("li");
      const cls = p.side === "BUY" ? "buy" : p.side === "SELL" ? "sell" : "flag";
      li.innerHTML =
        `<span class="id">#${String(p.n).padStart(4, "0")}</span>` +
        `PROPOSES <span class="${cls}">${p.side}</span> ${p.size}% · ${p.asset} — ` +
        `<em>${p.status}</em> <span class="t">pending ${ago(p.at)}</span>`;
      log.appendChild(li);
    });
  };

  const MILESTONES = {
    1: "PROPOSAL FILED.<br>IT WILL NOW WAIT FOREVER. THANK YOU FOR YOUR DILIGENCE.",
    3: "THREE PROPOSALS. ZERO APPROVALS.<br>THE APPROVAL RATE IS NOT A BUG, IT IS A VACANCY.",
    5: "YOU HAVE NOW DONE MORE PAPERWORK THAN THE FIRM WE DELETED EVER REQUIRED.",
    10: "TEN FILINGS.<br>YOU ARE, FUNCTIONALLY, THE COMPLIANCE DEPARTMENT NOW. UNPAID.",
  };
  const flash = (text) => {
    const el = document.createElement("div");
    el.className = "flash";
    el.innerHTML = `<span>${text}</span>`;
    document.body.appendChild(el);
    void el.offsetWidth;
    el.classList.add("go");
    setTimeout(() => el.remove(), 2000);
  };

  /* ---------------- the form ---------------- */
  const why = $("f-why"), err = $("form-err");
  why.addEventListener("input", () => {
    $("f-count").textContent = why.value.trim().length;
  });

  const fail = (msg, el) => {
    err.textContent = msg;
    err.classList.add("show");
    if (el) { el.classList.add("bad"); el.focus(); setTimeout(() => el.classList.remove("bad"), 1200); }
    return false;
  };

  $("form").addEventListener("submit", (e) => {
    e.preventDefault();
    err.classList.remove("show");

    const asset = $("f-asset").value.trim();
    const side = $("f-side").value;
    const size = parseInt($("f-size").value, 10);
    const rationale = why.value.trim();

    if (asset.length < 2) return fail("An asset is required. Even here.", $("f-asset"));
    if (!(size >= 1 && size <= 100)) return fail("Size must be between 1 and 100 percent.", $("f-size"));
    if (rationale.length < 40)
      return fail(
        `Rationale must be at least 40 characters. You have ${rationale.length}. ` +
        `The firm had no standards. The form does.`, why);
    if (!$("f-ack").checked)
      return fail("You must acknowledge the absence of analysts.", $("f-ack"));

    // Filed. Not executed. Never approved.
    const n = (filed.length ? filed[filed.length - 1].n : 0) + 1;
    filed.push({ n, asset, side, size, status: rand(STATUS), at: Date.now() });
    saveFiled(filed);
    renderQueue();

    $("f-asset").value = "";
    why.value = "";
    $("f-count").textContent = "0";
    $("f-ack").checked = false;
    err.textContent = `Proposal #${String(n).padStart(4, "0")} filed. Routed to risk management, which no longer exists.`;
    err.classList.add("show", "ok");
    setTimeout(() => err.classList.remove("ok"), 6000);

    if (MILESTONES[filed.length]) flash(MILESTONES[filed.length]);
    spinHim(false);
    $("prod").textContent = "he acknowledges receipt. he can do nothing else.";
  });

  renderQueue();
  setInterval(renderQueue, 30000); // keeps the "pending 4m" ages honest

  /* ---------------- market data ---------------- */
  const GT = "https://api.geckoterminal.com/api/v2";
  const fmtUsd = (n) => {
    if (n == null || isNaN(n)) return "—";
    if (n >= 1e9) return "$" + (n / 1e9).toFixed(2) + "B";
    if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
    if (n >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
    return "$" + n.toFixed(2);
  };
  const fmtPrice = (n) =>
    n == null || isNaN(n) ? "—" : n >= 1 ? "$" + n.toFixed(4) : "$" + n.toPrecision(4);

  const fromDexScreener = async (ca) => {
    const data = await (await fetch("https://api.dexscreener.com/latest/dex/tokens/" + ca)).json();
    const pairs = (data.pairs || []).filter((p) => p.chainId === CONFIG.chain);
    if (!pairs.length) return null;
    const p = pairs.sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0];
    return { price: +p.priceUsd, change: p.priceChange?.h24 ?? null, mcap: p.marketCap, vol: p.volume?.h24 };
  };
  const fromGeckoTerminal = async (ca) => {
    const a = (await (await fetch(`${GT}/networks/${CONFIG.chain}/tokens/${ca}`)).json())?.data?.attributes;
    if (!a?.price_usd) return null;
    return { price: +a.price_usd, change: null,
             mcap: parseFloat(a.market_cap_usd ?? a.fdv_usd), vol: parseFloat(a.volume_usd?.h24 ?? 0) };
  };

  const poll = async () => {
    const ca = CONFIG.contractAddress;
    if (!ca) { $("desk-state").textContent = "DESK: NOT YET OPEN"; return; }
    let r = null;
    try { r = await fromDexScreener(ca); } catch {}
    if (!r) { try { r = await fromGeckoTerminal(ca); } catch {} }
    if (!r) { $("desk-state").textContent = "DESK: AWAITING FIRST TRADE"; return; }
    $("m-price").textContent = fmtPrice(r.price);
    $("m-mcap").textContent = fmtUsd(r.mcap);
    $("m-vol").textContent = fmtUsd(r.vol);
    $("m-chg").textContent = r.change == null ? "live" : (r.change >= 0 ? "+" : "") + r.change.toFixed(2) + "% 24h";
    $("m-price").className = "v " + (r.change == null ? "" : r.change >= 0 ? "green" : "red");
    $("desk-state").textContent = "DESK: OPEN — ONE EMPLOYEE";
    $("desk-state").classList.add("live");
    $("buy").href = "https://pump.fun/coin/" + ca;
    $("buy").textContent = "BUY $BUTTHOLE ›";
  };

  const ca = new URLSearchParams(location.search).get("ca");
  if (ca) CONFIG.contractAddress = ca;
  poll();
  setInterval(poll, CONFIG.pollMs);
})();
