"use client";

import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetOverlay } from "@/components/ui/sheet";
import { X , ArrowRight} from "lucide-react";
import {useResolvedTheme} from "@/components/shared/theme-context"
import Image from "next/image";
import { WalletConnect, PhantomWallet, RainbowWallet, Metamask, Google, Twitter } from "@/components/icons/icons";
import { modal } from "@/context"; 
import { useAppKitWallet } from "@reown/appkit-wallet-button/react";
import { createSiweMessage } from "@/utils";
import { useWalletStore } from "@/store";
import {ethers} from "ethers";

interface SignInProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function extractAddress(walletObj: any): string {
  if (!walletObj) return "";
  if (typeof walletObj === "string") return walletObj; // fallback if string
  if (walletObj.reference) return walletObj.reference; // CAIP object
  return "";
}

const SignIn = ({ open, onOpenChange }: SignInProps) => {
   const {resolvedTheme, mounted} = useResolvedTheme();
   const [isConnecting, setIsConnecting] = useState<boolean>(false);

   const { setWallet, loginType } = useWalletStore();

   
   

   async function handleWalletConnected(walletObj: any) {
    const address = extractAddress(walletObj);
    if (!address) {
      console.error("No wallet address found");
      return;
    }
  
    useWalletStore.getState().setWallet(address);
    console.log("✅ Wallet connected:", address);
  
    // Check if an EVM provider is injected (MetaMask, Rainbow, WalletConnect via appkit)
    const ethProvider = window?.ethereum;
  
    if (!ethProvider) {
      console.error("No Ethereum provider found. Probably a Solana wallet.");
      return;
    }
  
    try {
      // create SIWE message
      const message = createSiweMessage(address);
  
      // connect to provider and signer
      const provider = new ethers.BrowserProvider(ethProvider as any);
      const signer = await provider.getSigner();
  
      // request signature
      console.log("🪶 Asking user to sign SIWE message...");
      const signature = await signer.signMessage(message);
  
      console.log("✅ SIWE Message Signed:", { message, signature });
      // (you can now verify it client-side or later send to backend)
    } catch (err) {
      console.error("❌ Error signing SIWE message:", err);
    }
  }
  
   
    
   const { isReady: isMetaMaskReady, isPending: isMetaMaskPending, connect: connectMetaMask } = useAppKitWallet({
    namespace: "eip155",
    onSuccess: async (parsedCaipAddress) => {
      await handleWalletConnected(parsedCaipAddress);
      console.log("MetaMask connected:", parsedCaipAddress);

      onOpenChange(false);
    },
    onError(error) {
      console.error("MetaMask connection failed:", error);
      alert("Connection failed. Make sure your wallet is unlocked.");
    },
  });

 
  
  // Phantom
  const { isReady: isPhantomReady, isPending: isPhantomPending, connect: connectPhantom } = useAppKitWallet({
    namespace: "solana",
    onSuccess : async(parsedCaipAddress) => {
      await handleWalletConnected(parsedCaipAddress)
      console.log("Phantom connected:", parsedCaipAddress);
     
      onOpenChange(false);
    },
    onError(error) {
      console.error("Phantom connection failed:", error);
      alert("Connection failed. Make sure your wallet is unlocked.");
    },
  });
  
  // Rainbow
  const { isReady: isRainbowReady, isPending: isRainbowPending, connect: connectRainbow } = useAppKitWallet({
    namespace: "eip155",
    
   
    onSuccess: async(parsedCaipAddress) => {
      await handleWalletConnected(parsedCaipAddress)
      console.log("Rainbow connected:", parsedCaipAddress);
      onOpenChange(false);
    },
    onError(error) {
      console.error("Rainbow connection failed:", error);
      alert("Connection failed. Make sure your wallet is unlocked.");
    },
  });
  

  if (!mounted) { 
    return null;
  }

  const handleWalletConnect = async () => {
    try {
      setIsConnecting(true);
      console.log(`Opening WalletConnect modal...`);
  
      const address = await modal.open({
        
        view:"Connect"
      }); 
      await handleWalletConnected(address)
  
      setIsConnecting(false);
      onOpenChange(false);
    } catch (err) {
      console.error("WalletConnect modal error:", err);
      setIsConnecting(false);
    }
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange} >
      <SheetOverlay  className={` ${resolvedTheme === "dark" ? "bg-black/80" : "bg-gray-300/70"}`}
      />
  
      <SheetContent
        side="bottom"
        className={`h-[85vh] sm:h-[95vh]  rounded-2xl px-12 mx-2 sm:mx-auto  max-w-full  flex 
        flex-col items-center  mt-12  py-8   lg:py-26
        sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] 
        `}
      >
          <button 
               className={`cursor-pointer absolute right-4 top-4 group focus:outline-none `}
               onClick={() => onOpenChange(false)}
          >
            <div className={`cursor-pointer flex shrink-0 items-center justify-center rounded-full transition-transform
                              ease-in-out group-focus-within:ring-offset-2 h-6 w-6 group-hover:animate-heartbeat
                              duration-150 group-hover:-translate-x-0 group-hover:scale-120
                               group-focus-within:ring-offset-[var(--background-2)] 
                               ${resolvedTheme === 'dark' ? "bg-zinc-700" : "bg-gray-300"}`}

                              
                              >
              <X  className="h-5 w-5 text-primary " strokeWidth={1.5}/>
            </div>
              
          </button>
        <SheetHeader>
          <div className="flex flex-col items-center gap-3">
            <Image 
              alt="polkastarter Image"
              src="/assets/images/login-icon.webp"
              height={40}
              width={40}
              className="object-contain rounded-full mb-2"
            
            />
            <h2 className="text-3xl text-primary font-bold text-center"> Log in to Polkastarter </h2>
            <p className="text-[var(--type-2)] text-[17px] text-center opacity-70 font-[600]">Select your preferred method </p>
            <SheetTitle />

          </div> 
        </SheetHeader>

        <div className="w-full flex flex-col gap-8">
          <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2">
          
              <button
                   onClick={() => connectMetaMask("metamask")}
                    disabled={!isMetaMaskReady || isMetaMaskPending}
                className={`inline-flex justify-evenly items-center whitespace-nowrap 
                            rounded-full outline-none transition-all duration-200 ease-in-out relative 
                            focus-visible:outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-contrast 
                            focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background-1)]
                            text-center text-md h-13 gap-2 px-7 leading-none w-full text-primary pl-12 pr-8
                            ${resolvedTheme === "dark" ? "bg-zinc-800 hover:bg-zinc-700 border border-transparent" : "border bg-white hover:bg-gray-50"}`}
              >
                <div className="absolute flex items-center justify-center gap-2 h-7 w-7 left-2">
                  <Metamask />
                </div>
                <span className="inline-flex justify-center items-center text-[17px]">
                  MetaMask
                </span>
              </button>
    
            <button 
              onClick={handleWalletConnect}
              className={ ` inline-flex justify-evenly items-center whitespace-nowrap 
                                rounded-full  outline-none transition-all duration-200 
                                ease-in-out relative focus-visible:outline-none cursor-pointer
                                focus-visible:ring-2 focus-visible:ring-contrast 
                                focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background-1)]
                                text-center text-md h-13 gap-2 px-7 leading-none
                                w-full text-primary pl-12 pr-8
                                ${resolvedTheme === "dark" ? "bg-zinc-800 hover:bg-zinc-700 border-transparent" : " border bg-white hover:bg-gray-50"}
            `}>
              <div className="absolute flex items-center justify-center gap-2 h-7 w-7 left-2 ">
                <WalletConnect  />
              </div>
            <span className="inline-flex justify-center items-center gap-1.5  text-[17px]"> 
              WalletConnect
              </span>
            </button>
            <button 
              onClick={() => connectRainbow("rainbow")}
              disabled={!isRainbowReady || isRainbowPending}
              className={ ` inline-flex justify-evenly items-center whitespace-nowrap 
                                rounded-full  outline-none transition-all duration-200 
                                ease-in-out relative focus-visible:outline-none cursor-pointer
                                focus-visible:ring-2 focus-visible:ring-contrast 
                                focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background-1)]
                                text-center text-md h-13 gap-2 px-7 leading-none
                                w-full text-primary pl-12 pr-8
                                ${resolvedTheme === "dark" ? "bg-zinc-800 hover:bg-zinc-700 border border-transparent" : "border bg-white hover:bg-gray-50"}
            `}>
              <div className="absolute flex items-center justify-center gap-2 h-7 w-7 left-2">
                <RainbowWallet  />
              </div>
            <span className="inline-flex justify-center items-center gap-1.5  text-[17px]"> 
              Rainbow
              </span>
            </button>
            <button 
              onClick={() => connectPhantom("phantom")}
              disabled={!isPhantomReady || isPhantomPending}
              className={ ` inline-flex justify-evenly items-center whitespace-nowrap 
                                rounded-full  outline-none transition-all duration-200 
                                ease-in-out relative focus-visible:outline-none cursor-pointer
                                focus-visible:ring-2 focus-visible:ring-contrast 
                                focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background-1)]
                                text-center text-md h-13 gap-2 px-7 leading-none
                                w-full text-primary pl-12 pr-8
                                ${resolvedTheme === "dark" ? "bg-zinc-800 hover:bg-zinc-700 " : " border bg-white hover:bg-gray-50"}
            `}>
              <div className="absolute flex items-center justify-center gap-2 h-7 w-7 left-2">
                <PhantomWallet  />
              </div>
            <span className="inline-flex justify-center items-center gap-1.5  text-[17px]"> 
              Phantom
              </span>
            </button>
          
          </div>
          <div className="flex w-full items-center gap-4 text-center ">
            <div className="border h-[0.8px] w-full border-t-[0.8px]" />
            <p className="text-[var(--type-2)] text-nowrap text-sm font-[600] "> Or choose alternative methods </p>
            <div className="border h-[0.8px] w-full border-t-[0.8px]" />
          </div>
          <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2">
          <button className={ ` inline-flex justify-evenly items-center whitespace-nowrap 
                                rounded-full  outline-none transition-all duration-200 
                                ease-in-out relative focus-visible:outline-none cursor-pointer
                                focus-visible:ring-2 focus-visible:ring-contrast 
                                focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background-1)]
                                text-center text-md h-13 gap-2 px-7 leading-none
                                w-full text-primary pl-12 pr-8
                                ${resolvedTheme === "dark" ? "bg-zinc-800 hover:bg-zinc-700 " : " border bg-white hover:bg-gray-50"}
            `}>
              <div className="absolute flex items-center justify-center gap-2 h-7 w-7 left-2">
                <Google  />
              </div>
            <span className="inline-flex justify-center items-center gap-1.5  text-[17px]"> 
              Google
              </span>
            </button>
            <button className={ ` inline-flex justify-evenly items-center whitespace-nowrap 
                                rounded-full  outline-none transition-all duration-200 
                                ease-in-out relative focus-visible:outline-none cursor-pointer
                                focus-visible:ring-2 focus-visible:ring-contrast 
                                focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background-1)]
                                text-center text-md h-13 gap-2 px-7 leading-none
                                w-full text-primary pl-12 pr-8
                                ${resolvedTheme === "dark" ? "bg-zinc-800 hover:bg-zinc-700 " : " border bg-white hover:bg-gray-50"}
            `}>
              <div className="absolute flex items-center justify-center gap-2 h-7 w-7 left-2">
                <Twitter />
              </div>
            <span className="inline-flex justify-center items-center gap-1.5  text-[17px]"> 
              X
              </span>
            </button>
    
          </div>
          <div className="flex cursor-pointer items-center justify-center ease-in-out  gap-2 leading-none group"> 
            <span className="text-primary text-[17px] font-[400]">
              Continue with email
            </span>
            <div className="h-6 w-6 transition-transfrom shrink-0 bg-[#0bf] duration-300  rounded-full flex items-center justify-center group-hover:translate-x-[0.25rem]">
                <ArrowRight  className="text-black  size-4" strokeWidth={1.5}/>
            </div>
        </div>
        </div>
       
     
      </SheetContent>
  
    </Sheet>
  );
};

export default SignIn;