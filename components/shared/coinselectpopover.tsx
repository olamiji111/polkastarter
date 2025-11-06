
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, {  useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Ethereum, BNB} from "@/components/icons/icons";
import {  ChevronDown, ChevronUp, Copy } from "lucide-react";
import { useTheme } from "next-themes";
import {useResolvedTheme} from "@/components/shared/theme-context"
import {useChainStore} from "@/store";

const coinSelect = [
  { title: "Binance", icon: BNB },
  { title: "Ethereum", icon: Ethereum },
];
const CoinSelect = () => {
  const [open, setOpen] = useState(false);
  const {resolvedTheme, mounted} = useResolvedTheme();
  const {theme} = useTheme();
  const [selectedCoin, setSelectedCoin] = useState(coinSelect[1]); 
  const {setChain} = useChainStore();

  
  const handleSelect = (coin: { title: string; icon: any }) => {
    setSelectedCoin(coin);  
    setChain(coin.title as "Binance" | "Ethereum");
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
        {coinSelect.map(({ title, icon: Icon }, idx) => {
          const isSelected = selectedCoin.title === title
          return (
                  <DropdownMenuItem
                    key={idx}
                    onSelect={() => handleSelect({ title, icon: Icon})}
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
          )
        })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CoinSelect;
