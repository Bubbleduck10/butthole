// ============================================================
// BUTTHOLE.BOT — edit this block only.
// ============================================================
const CONFIG = {
  name: "butthole.bot",
  ticker: "BUTTHOLE",

  // ---- chain: Robinhood Chain (Ethereum L2 rollup, chain id 4663) ----
  // Both indexers happen to use the same slug here; they are separate
  // fields because on most chains they differ.
  chain: "robinhood",       // DexScreener chainId
  gtNetwork: "robinhood",   // GeckoTerminal network
  chainName: "Robinhood Chain",

  contractAddress: "0x8545f354f95165309d6bbb4a9036fd881a3f4428",  // live; auto-discovery is the fallback

  // ---- the desk's only wallet ------------------------------
  // Read-only. The site queries this address; it never signs
  // anything and holds no key.
  wallet: "0x2be0e167909db604cd03e59b347c5e50ba11bbb1",

  rpc: "https://rpc.mainnet.chain.robinhood.com",     // sends CORS: *
  logsRpc: "https://rpc.mainnet.chain.robinhood.com", // same node serves getLogs

  // This chain makes ~10 blocks a second, so block counts look nothing
  // like Ethereum's: 1,000,000 blocks is about 29 hours, not four months.
  secondsPerBlock: 0.104,
  logsWindow: 1000000,
  logsFallbacks: [200000, 40000],   // ~5.8h, ~1.2h if the wide query is refused

  explorer: "https://robinhoodchain.blockscout.com",

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
