"use client";

import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import { Ethereum, BNB, AlertIcon } from "@/components/icons/icons";
import { Check, ChevronDown, ChevronUp, Copy } from "lucide-react";
import { useTheme } from "next-themes";
import {useResolvedTheme} from "@/components/shared/theme-context"
import { toast } from "sonner";

const coinSelect = [
  { title: "Binance", icon: BNB, address: "0x680ba3Dc38F76ba786BCF0947f993A517b4a3301" },
  { title: "Ethereum", icon: Ethereum, address: "0xC33d49A65B3279774EB5156Af9916271d3777506" },
];
const CoinSelect = () => {
  const [open, setOpen] = useState(false);
  const {resolvedTheme, mounted} = useResolvedTheme();
  const {theme} = useTheme();
  const [selectedCoin, setSelectedCoin] = useState(coinSelect[1]); // default Ethereum

  
  const handleSelect = (coin: { title: string; icon: any ; address:string}) => {
    setSelectedCoin(coin);  
  };
 
  const handleCopyAddress = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    try {
      // ✅ Try the standard Clipboard API first
      await navigator.clipboard.writeText(selectedCoin.address);
    } catch (err) {
      // 🧩 Fallback for iOS/Safari/Android WebViews
      const textArea = document.createElement("textarea");
      textArea.value = selectedCoin.address;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
      } catch (err2) {
        console.error("Fallback copy failed:", err2);
      }
      document.body.removeChild(textArea);
    }
  
    // ✅ Show toast feedback
    toast.custom(
      (t) => (
        <div
          className={`flex items-center gap-2 p-2 rounded-md shadow-lg border border-[var(--tooltip-border)]
            ${resolvedTheme === "dark" ? "bg-zinc-800 text-white" : "bg-white text-black"}`}
        >
          <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
            <Check className="text-primary w-3 h-3" strokeWidth={2} />
          </div>
          <span className="text-xs font-[600] whitespace-normal">
            {selectedCoin.title} address copied!
          </span>
        </div>
      ),
      {
        duration: 2000,
        position: "top-center",
      }
    );
  };
 
  

  return (
    <div className="relative">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Select coin"
            className={`  focus:outline-none  w-28   flex px-0 py-2 gap-2 focus-visible:ring-offset-0 ring-0 focus:ring-0 relative items-center cursor-pointer justify-center text-xs rounded-md border  ${resolvedTheme === 'dark' ? 'hover:bg-zinc-700 text-white bg-zinc-800 ' 
            : 'bg-white hover:bg-gray-50 text-black'} hover:bg-contrast  ` }
          >
            <selectedCoin.icon className="h-3 w-3  text-[var(--type-1)]" />
            <span className="capitalize text-[var(--type-1)] text-xs">
              {selectedCoin.title}
            </span>
            {open ? (
              <ChevronUp className="h-3 w-3 text-[var(--type-1)]" />
            ) : (
              <ChevronDown className="h-3 w-3 text-[var(--type-1)]" />
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="min-w-[110px] min-h[10px] p-0 m-0"
          align="start"
        >
        {coinSelect.map(({ title, icon: Icon, address }) => {
          const isSelected = selectedCoin.title === title
          return (
            <TooltipProvider key={title} delayDuration={0}>
              <Tooltip open={open && isSelected}> 
                <TooltipTrigger asChild>
                  <DropdownMenuItem
                    onSelect={() => handleSelect({ title, icon: Icon, address })}
                    className={`cursor-pointer border-none w-full rounded-none h-9 flex items-center
                      ${
                        resolvedTheme === "dark"
                          ? isSelected
                            ? "pointer-events-none bg-zinc-800"
                            : "bg-zinc-900"
                          : isSelected
                            ? "pointer-events-none bg-[#00bbff29]"
                          : "bg-white"
                        }
                      `}
                  >
                    <Icon
                      className={`h-3 w-3 ${
                                  isSelected
                                    ? "text-[var(--type-1)]"
                                      : "text-[var(--text-type-1)]"
                                }`}
                    />
                    <p className="text-[var(--type-1)] text-xs">{title}</p>
                  </DropdownMenuItem>
                </TooltipTrigger>
                {isSelected && (
                  <TooltipContent
                    side="top"
                    align="center"
                    className={`  w-full h-12 text-center ${selectedCoin.title === 'Binance' ? 'translate-y-1 ' : '-translate-y-8 '}relative ${
                                  resolvedTheme === "dark" ? "bg-zinc-800" : "bg-white"
                                  } border-[var(--tooltip-border)] border shadow-md shadow-[var(--surface-1)]`
                              }
                  >
                      <div
                        className="flex items-center justify-between w-full px-1 py-1.5 gap-1.5 rounded-md cursor-pointer"
                        onClick={handleCopyAddress}
                      >
                        <span className=" text-[13px] font-[500] text-primary">{selectedCoin.address}</span>
                        <Copy className="h-4 w-4 text-[var(--type-2)]" />
                      </div>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          )
        })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CoinSelect;