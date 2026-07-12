// No-op stub — replaces @coinbase/wallet-sdk so its analytics SDK never loads.
// We only use the MetaMask injected connector; Coinbase Wallet is not supported on StudioNet.

export class CoinbaseWalletSDK {
  constructor(_opts?: unknown) {}
  makeWeb3Provider() { return null; }
  disconnect() {}
}

export default CoinbaseWalletSDK;
