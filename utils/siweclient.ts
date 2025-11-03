// utils/siweClient.ts
import { useWalletStore } from "@/store";

export interface SIWESession {
  address: string;
  chainId: number;
}

export const siweClient = {
  
  getNonce: async (): Promise<string> => {
    return Math.random().toString(36).substring(2, 10);
  },

 
  createMessage: (address: string, domain?: string, uri?: string): string => {
    const d = domain ?? "polkastarter.com";
    const u = uri ?? "https://polkastarter.com";
    const nonce = Math.random().toString(36).substring(2, 10);
    const issuedAt = new Date().toISOString();

    return `${d} wants you to sign in with your Ethereum account:
${address}

Click to sign this message and sign in. This request will not trigger a blockchain transaction or cost any gas fees.

URI: ${u}
Version: 1
Chain ID: 1
Nonce: ${nonce}
Issued At: ${issuedAt}`;
  },


  verifyMessage: async ({
    message,
    signature,
    address,
  }: {
    message: string;
    signature: string;
    address: string;
  }): Promise<boolean> => {
    // Only checks if the message contains the address
    return message.includes(address);
  },

  /** Get current session from Zustand */
  getSession: async (): Promise<SIWESession | null> => {
    const walletAddress = useWalletStore.getState().walletAddress;
    if (!walletAddress) return null;
    return { address: walletAddress, chainId: 1 }; // default Ethereum mainnet
  },

  /** Sign out / clear wallet */
  signOut: async (): Promise<boolean> => {
    useWalletStore.getState().setWallet("");
    return true;
  },

  /** Optional callbacks */
  onSignIn: (session?: SIWESession) => {
    console.log("Signed in:", session);
  },

  onSignOut: () => {
    console.log("Signed out");
  },
};