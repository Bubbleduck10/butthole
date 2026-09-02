// ============================================================
// BUTTHOLE.BOT — edit this block only.
// ============================================================
const CONFIG = {
  name: "butthole.bot",
  ticker: "BUTTHOLE",

  // ---- chain ----------------------------------------------
  // Two different slugs for the same chain: DexScreener says
  // "ethereum", GeckoTerminal says "eth". Both are needed.
  chain: "ethereum",
  gtNetwork: "eth",

  contractAddress: "",          // <-- paste token CA at launch (empty = pre-launch)

  // ---- the desk's only wallet ------------------------------
  // Read-only. The site queries this address; it never signs
  // anything and holds no key.
  wallet: "0x2be0e167909db604cd03e59b347c5e50ba11bbb1",

  // Keyless public endpoints, both send CORS: *
  rpc: "https://ethereum-rpc.publicnode.com", // balances
  logsRpc: "https://eth.drpc.org",            // transfer logs (10k block cap, free tier)
  logsWindow: 9000,                           // ~30h of blocks
  explorer: "https://etherscan.io",

  twitterUrl: "https://x.com/Buttholebot_",
  loreUrl: "https://x.com/Buttholebot_",

  // The numbers on this site are real. These come from the fork's diffstat.
  deletion: {
    filesChanged: 86,
    linesDeleted: 10783,
    upstreamStars: "99,293",
    survivors: 1,
  },

  pollMs: 30000,
  walletPollMs: 45000,
};
