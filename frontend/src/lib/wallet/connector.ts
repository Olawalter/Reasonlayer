import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { defineChain } from "viem";

export const studionetChain = defineChain({
  id: 61999,
  name: "Genlayer Studio Network",
  nativeCurrency: { name: "GEN Token", symbol: "GEN", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://studio.genlayer.com/api"] },
  },
  blockExplorers: {
    default: { name: "GenLayer Explorer", url: "https://explorer-studio.genlayer.com" },
  },
  testnet: true,
});

export const wagmiConfig = createConfig({
  chains: [studionetChain],
  connectors: [injected()],
  transports: {
    [studionetChain.id]: http("https://studio.genlayer.com/api"),
  },
  ssr: true,
});
