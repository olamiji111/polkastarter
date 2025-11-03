/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useWalletStore } from "@/store";
import { generateGradientFromAddress, copyToClipboardMobileSafe } from "@/utils";
import { WalletConnect } from "@/components/icons/icons";
import { Check, Copy, ChevronRight, Power, PowerCircle, Settings, Shield, FolderClosed,PanelTop } from "lucide-react";
import { useState } from "react";
import { themes} from '@/constants';
import { useTheme } from "next-themes";
import {useRouter} from "next/navigation";
import { Ethereum } from "@/components/icons/icons";
import { useDisconnect } from "@reown/appkit/react";


interface ConnectedPopoverProps {
  open: boolean;
  setOpen: (b: boolean) => void;
}

function getRandomSuffix(address: unknown) {
     if (!address) return "0000000";
     const str = String(address);
     const clean = str.replace(/[^a-zA-Z0-9]/g, "");
     return clean.slice(-7).padStart(7, "0");
};

function getWalletString(walletObj: any): string {
     if (!walletObj) return "";
     if (typeof walletObj === "string") return walletObj; 
     if (walletObj.address) return walletObj.address;     
     return "";
}
   

const ConnectedPopover: React.FC<ConnectedPopoverProps> = ({ open, setOpen }) => {
  const { walletAddress, userName, userImage } = useWalletStore();
  const [copied, setCopied] = useState<boolean>(false);
  const {theme, setTheme} = useTheme();
  const router = useRouter();
  const { disconnect  } = useDisconnect();
  const { logout } = useWalletStore.getState(); 
 

  const disconnectWallet = async () => {
    try {

      if (disconnect) {
        await disconnect();
        console.log("Wallet disconnected from Reown AppKit");
      }
  
      if (logout) {
        logout();
        console.log("Wallet cleared from Zustand");
      }
    } catch (err) {
      console.error("Failed to disconnect wallet:", err);
    }
  };
  


  if (!walletAddress) return null;

  const walletStr = getWalletString(walletAddress);

const truncatedAddress = walletStr
  ? `${walletStr.slice(0, 6)}…${walletStr.slice(-4)}`
  : "0x0000…0000";


const displayName = userName || `BlockPioneer${getRandomSuffix(walletStr)}`;
const currentTheme = themes.find((t) => t.label === theme) ?? themes[0] ;


  


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {/* Empty trigger here — header handles click */}
        <div />
      </PopoverTrigger>

      <PopoverContent
          align="end"
          className="flex w-72 flex-col  rounded-md mt-4 border 
                   shadow-xl z-[99999] py-4"
        >
          {/* Headrer wallet Information */}
        <div className="px-4 flex flex-row items-center gap-3">
         
          <div className="relative">
               <div
               className="w-9 h-9 rounded-full"
               style={{
                    background: userImage
                    ? `url(${userImage}) center/cover`
                    : generateGradientFromAddress(walletAddress),
               }}
               />
               <WalletConnect className="absolute -bottom-0.5 -right-1.5 h-4 w-4"/>

               
          </div>
          <div className="flex flex-col ">
          <div
              className="flex flex-row gap-1 items-center hover:opacity-80 transition-opacity"
            >
              <span className="font-[400] text-[15px]">{truncatedAddress}</span>

              {copied ? (
                <div className="w-5 h-5 bg-[var(--type-6)] rounded-full flex items-center justify-center border border-[var(--border-1)]">
                  <Check className="text-primary w-3 h-3" strokeWidth={2.5} />
                </div>
              ) : (
                <Copy className="text-[var(--type-3)] h-3.5 w-3.5" />
              )}
            </div>
               <span className="font-[550] text-[var(--type-6)] text-[13px] ">{displayName}</span>
          </div>
            
          </div>
          <div className="border-t w-full mt-4 pt-2 flex " /> 
          <div className="flex flex-col gap-4 items-start place-items-start px-4 ">
            <div className="flex justify-between items-center  w-full ">
              
              <div className="flex gap-1 items-center w-full">
                <PanelTop className="text-[var(--type-2)] h-4 w-4" strokeWidth={2}/>
                <span className="text-[14px] text-primary font-[400]"> Theme </span>
              </div>
             
              <div className="border flex flex-row   w-28 h-8 p-0.5 rounded-[7px]   ">
              {themes.map(({ label, icon: Icon }) => {
                  const isActive = label === theme;
                  return (
                    <div
                  key={label}
                  onClick={() => setTheme(label)}
                  className={`flex items-center justify-center w-full rounded-[6px] p-2 transition-colors ${
                    isActive
                      ? "bg-[#00BBFF29] text-[#0095CC]"
                      : "bg-transparent text-[var(--type-3)] hover:none"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                  )
              })}
                
              </div>
            </div>
            <div id="inventory"  className="flex gap-1 items-center w-full" onClick={() => router.push("/missions")}>
              <FolderClosed className="text-[var(--type-2)] h-4 w-4" strokeWidth={2}/>
              <span className="text-[14px] text-primary font-[400]"> Inventory </span>
            </div>
            <div id="settings"  className="flex gap-1 items-center w-full" onClick={() => router.push("/")}>
                <Settings className="text-[var(--type-2)] h-4 w-4" strokeWidth={2}/>
                <span className="text-[14px] text-primary font-[400]"> Settings  </span>
            </div>
            <div  id="Chains" className="flex justify-between items-center w-full ">
              <div className="flex gap-1 items-center w-full">
                <Shield className="text-[var(--type-2)] h-4 w-4" strokeWidth={2}/>
                <span className="text-[14px] text-primary font-[400]"> Chain</span>
              </div>
             
              <div className="flex flex-row gap-1.5 items-center" onClick={() => router.push("/")}>
                <Ethereum  className="h-4 w-4"/>
                <span className="text-[14px] text-[var(--type-2)] font-[400]"> Ethereum </span>
                <ChevronRight  className="text-[var(--type-2)] h-5 w-5" strokeWidth={1}/>
              </div>
            </div>
            <div  id="Disconnect Wallet" className="flex gap-1 items-center w-full" onClick={disconnectWallet}>
              <Power className="text-[var(--type-2)] h-4 w-4" strokeWidth={2}/>
              <span className="text-[14px] text-[var(--type-2)] font-[400]">Disconnect</span>
            </div>
          </div>
        
      </PopoverContent>
    </Popover>
  );
};

export default ConnectedPopover;