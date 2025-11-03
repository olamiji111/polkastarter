import { create } from "zustand";
import { UpcomingProject } from "@/types/index";
import { persist } from 'zustand/middleware';

interface ProjectStore {
  selectedProject: UpcomingProject | null;
  setSelectedProject: (project: UpcomingProject) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  // Initialize from sessionStorage if available
  selectedProject: typeof window !== "undefined"
    ? JSON.parse(sessionStorage.getItem("selectedProject") || "null")
    : null,

  setSelectedProject: (project) => {
    set({ selectedProject: project });

    // Persist to sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.setItem("selectedProject", JSON.stringify(project));
    }
  },
}));



export type LoginType = "wallet" | "google" | "twitter" | null;

interface WalletState {
  loginType: LoginType;          // how user logged in
  walletAddress: string | null;  // blockchain wallet address
  userName: string | null;       // OAuth username
  userImage: string | null;      // OAuth avatar
  setWallet: (address: string) => void;
  setGoogleUser: (name: string, image: string) => void;
  setTwitterUser: (name: string, image: string) => void;
  logout: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      loginType: null,
      walletAddress: null,
      userName: null,
      userImage: null,

      // ✅ Sets wallet address AND login type
      setWallet: (address: string) =>
        set(() => ({
          loginType: "wallet",
          walletAddress: address,
          userName: null,
          userImage: null,
        })),

      // Google OAuth login
      setGoogleUser: (name: string, image: string) =>
        set(() => ({
          loginType: "google",
          walletAddress: null,
          userName: name,
          userImage: image,
        })),

      // Twitter OAuth login
      setTwitterUser: (name: string, image: string) =>
        set(() => ({
          loginType: "twitter",
          walletAddress: null,
          userName: name,
          userImage: image,
        })),

      // Clear all login state
      logout: () =>
        set(() => ({
          loginType: null,
          walletAddress: null,
          userName: null,
          userImage: null,
        })),
    }),
    {
      name: "wallet-storage", // localStorage key
    }
  )
);