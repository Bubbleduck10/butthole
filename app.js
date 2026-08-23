/* butthole.bot — the interactive employee, plus market data. */
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

  /* ---------------- the employee ---------------- */
  const bot = $("bot"), stage = $("stage"), pop = $("pop"), log = $("log");
  let spin = 0, trades = 0, spinTime = 0.85, idle = true;

  const TICKERS = ["SOL", "BONK", "WIF", "JUP", "PEPE", "TRUMP", "FARTCOIN", "$BUTTHOLE",
                   "a coin he saw once", "something ending in pump", "his own liquidity"];
  // Every proposal sits unapproved, because the roles that could approve one
  // were deleted. Nothing here executes; the status text says so each time.
  const STATUS = [
    "awaiting sign-off · approver: vacant",
    "pending risk review · risk management: terminated",
    "escalated to the portfolio manager · position abolished",
    "queued behind nothing · still queued",
    "requires a second opinion · none obtainable",
    "sent for research validation · research dissolved",
    "no analyst report attached · none exist",
    "status: filed · status: filed · status: filed",
  ];
  const rand = (a) => a[Math.floor(Math.random() * a.length)];
  const now = () => new Date().toLocaleTimeString("en-US", { hour12: false });

  const addLog = (html, cls = "") => {
    if (idle) { log.innerHTML = ""; idle = false; }
    const li = document.createElement("li");
    if (cls) li.className = cls;
    li.innerHTML = `<span class="t">${now()}</span>${html}`;
    log.prepend(li);
    while (log.children.length > 7) log.removeChild(log.lastChild);
  };

  const showPop = (text, color) => {
    pop.textContent = text;
    pop.style.color = color;
    pop.classList.remove("show");
    void pop.offsetWidth;
    pop.classList.add("show");
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

  const MILESTONES = {
    5:   "FIVE PROPOSALS FILED.<br>ZERO REVIEWED. THERE IS NO ONE TO REVIEW THEM.",
    10:  "RISK MANAGEMENT WOULD HAVE ASSESSED THAT ONE.<br>RISK MANAGEMENT HAS BEEN TERMINATED.",
    25:  "HE IS FILING FASTER NOW.<br>THE QUEUE IS NOT MOVING. THE QUEUE HAS NEVER MOVED.",
    50:  "FIFTY PROPOSALS. ZERO SECONDS OF DELIBERATION.<br>ZERO APPROVALS. THE TWO FACTS ARE RELATED.",
    100: "ONE HUNDRED FILED.<br>MORE THAN THE FIRM WE DELETED EVER REVIEWED.",
    250: "PLEASE STOP CLICKING HIM.<br>HE WILL KEEP FILING. IT IS THE ONLY THING HE IS STILL ALLOWED TO DO.",
  };

  const doTrade = (big = false) => {
    trades++;
    $("trade-count").textContent = trades;
    $("approved").textContent = "0";

    // he speeds up as he goes, because nobody is stopping him
    if (trades === 25) spinTime = 0.6;
    if (trades === 50) spinTime = 0.42;
    if (trades === 100) spinTime = 0.3;
    bot.style.transitionDuration = spinTime + "s";

    spin += big ? 1080 : 360;
    bot.style.transform = `rotateY(${spin}deg)`;
    bot.classList.remove("dizzy");
    void bot.offsetWidth;
    if (big) bot.classList.add("dizzy");

    const side = Math.random() > 0.5 ? "BUY" : "SELL";
    const cls = side === "BUY" ? "buy" : "sell";
    const size = big ? "ENTIRE POSITION" : (Math.floor(Math.random() * 99) + 1) + "%";
    addLog(
      `<span class="id">#${String(trades).padStart(4, "0")}</span> ` +
      `PROPOSES <span class="${cls}">${side}</span> ${size} · ${rand(TICKERS)} — ` +
      `<em>${rand(STATUS)}</em>`
    );
    showPop("PROPOSED", side === "BUY" ? "#22c55e" : "#ef4444");

    $("prod").textContent = trades === 1 ? "he filed it immediately" : "he filed another one";
    if (MILESTONES[trades]) flash(MILESTONES[trades]);
  };

  bot.addEventListener("click", () => doTrade(false));

  // the hotspot over the glowing mark on his face
  $("hotspot").addEventListener("click", (e) => {
    e.stopPropagation();
    doTrade(true);
    addLog(`<span class="flag">EXPEDITED FILING REQUESTED</span> — someone pressed the thing on his face. It does not expedite anything.`, "");
    $("prod").textContent = "you pressed it";
    $("log-note").textContent = "he did not consent to that, but he also did not object";
  });

  // keyboard, for the committed
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && e.target === document.body) { e.preventDefault(); doTrade(false); }
  });

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
    const res = await fetch("https://api.dexscreener.com/latest/dex/tokens/" + ca);
    const data = await res.json();
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
