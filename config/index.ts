import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, arbitrum } from "@reown/appkit/networks";
import type { Config } from "wagmi";

// WalletConnect / AppKit project ID
export const projectId = "00ba4ea044cad92fe9c0464da1ab4503";

if (!projectId) {
  throw new Error("Project ID is not defined.");
}

// Supported networks
export const networks = [mainnet, arbitrum];

// Create Wagmi adapter
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage:   cookieStorage
  }),
  ssr: true,
  projectId,
  networks,
});

// Export wagmi config
export const config: Config = wagmiAdapter.wagmiConfig;