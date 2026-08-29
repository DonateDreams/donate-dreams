import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { CoinbaseWallet } from "@web3-react/coinbase-wallet";

// 🔐 Replace this with your real Infura project ID
const INFURA_ID = "7595e618d109450c8a22dc5db34145df";

// MetaMask and Enkrypt (Injected)
export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42], // Ethereum networks
});

// WalletConnect
export const walletConnect = new WalletConnectConnector({
  rpc: {
    1: `https://mainnet.infura.io/v3/7595e618d109450c8a22dc5db34145df`,
  },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});

// Coinbase Wallet
export const coinbaseWallet = new CoinbaseWallet({
  url: `https://mainnet.infura.io/v3/7595e618d109450c8a22dc5db34145df`,
  appName: "Donate Dreams",
});
