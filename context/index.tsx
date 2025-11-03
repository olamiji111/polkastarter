"use client"; 

import React, { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { mainnet, arbitrum, sei, polygon, optimismSepolia } from "@reown/appkit/networks";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";

import { wagmiAdapter, projectId } from "@/config"; 

// 🔹 Create Query Client
const queryClient = new QueryClient();

if (!projectId) throw new Error("Project ID not defined");

// 🔹 App metadata
const metadata = {
  name: "Polkastarter",
  description: "Polkastarter, Leading Web3 Fundraising Platform",
  url: "https://polkastarter-app.vercel.app",  
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
}

// 🔹 Create AppKit modal instance
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, arbitrum, sei, polygon, optimismSepolia, ],
  defaultNetwork: mainnet,
  metadata:metadata,
  features: {
    email:false,
    socials:[],
    
  },
});


export default function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies?: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}