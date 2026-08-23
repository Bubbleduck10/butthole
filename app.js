/* butthole.bot — market data for a desk with no supervision. */
(() => {
  const $ = (id) => document.getElementById(id);
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

  /* static config into the page */
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

  /* market data — DexScreener first, GeckoTerminal as fallback, because
     DexScreener drops pairs once a token goes quiet. */
  const fromDexScreener = async (ca) => {
    const res = await fetch("https://api.dexscreener.com/latest/dex/tokens/" + ca);
    const data = await res.json();
    const pairs = (data.pairs || []).filter((p) => p.chainId === CONFIG.chain);
    if (!pairs.length) return null;
    const p = pairs.sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0];
    return {
      price: parseFloat(p.priceUsd),
      change: p.priceChange?.h24 ?? null,
      mcap: p.marketCap,
      vol: p.volume?.h24,
    };
  };

  const fromGeckoTerminal = async (ca) => {
    const res = await fetch(`${GT}/networks/${CONFIG.chain}/tokens/${ca}`);
    const a = (await res.json())?.data?.attributes;
    if (!a?.price_usd) return null;
    return {
      price: parseFloat(a.price_usd),
      change: null,
      mcap: parseFloat(a.market_cap_usd ?? a.fdv_usd),
      vol: parseFloat(a.volume_usd?.h24 ?? 0),
    };
  };

  const render = (r) => {
    $("m-price").textContent = fmtPrice(r.price);
    $("m-mcap").textContent = fmtUsd(r.mcap);
    $("m-vol").textContent = fmtUsd(r.vol);
    $("m-chg").textContent =
      r.change == null
        ? "live"
        : (r.change >= 0 ? "+" : "") + r.change.toFixed(2) + "% 24h";
    $("m-price").className = "v " + (r.change == null ? "" : r.change >= 0 ? "green" : "red");
    $("desk-state").textContent = "DESK: OPEN — ONE EMPLOYEE";
    $("desk-state").classList.add("live");
    $("buy").href = "https://pump.fun/coin/" + CONFIG.contractAddress;
    $("buy").textContent = "BUY $BUTTHOLE ›";
  };

  const poll = async () => {
    const ca = CONFIG.contractAddress;
    if (!ca) {
      $("desk-state").textContent = "DESK: NOT YET OPEN";
      return;
    }
    let r = null;
    try { r = await fromDexScreener(ca); } catch { /* try the other one */ }
    if (!r) { try { r = await fromGeckoTerminal(ca); } catch { /* nor that one */ } }
    if (r) render(r);
    else $("desk-state").textContent = "DESK: AWAITING FIRST TRADE";
  };

  const ca = new URLSearchParams(location.search).get("ca");
  if (ca) CONFIG.contractAddress = ca;
  poll();
  setInterval(poll, CONFIG.pollMs);
})();
