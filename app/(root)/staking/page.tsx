/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import { Button } from '@/components/ui/button';
import React, { useEffect, useRef, useState } from 'react';
import CountUp from "react-countup";
import PolkastarterIcon from "@/components/icons/polkastarter-icon"
import {stakingSummary, polsAssets} from "@/constants/index";
import {AlertIcon,  LotteryProbabilityInfo, PolsPower, PolsDiamonFlag} from "@/components/icons/icons"
import CoinSelect from '@/components/shared/coinselectpopover';
import {useResolvedTheme} from "@/components/shared/theme-context"
import { AlertDialog, AlertDialogCancel, AlertDialogContent,  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import SignIn from '@/sections/sign-in';
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import type { Provider } from "@reown/appkit/react";

const tabs = ["stake", "withdraw"] as const;
type TabValue = (typeof  tabs)[number];


const Staking = () => {
  const {resolvedTheme, mounted} = useResolvedTheme();
  const [isTyping, setIsTyping] = useState(false);
  const [amount, setAmount] = useState("0")
  const [activeTab, setActiveTab] = useState<TabValue>("stake")
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [hasClickedContribute, setHasClickedContribute] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSigInOpen, setIsSignInOpen] = useState(false);
  const {address, isConnected} = useAppKitAccount()
  const [ isWalletConnected, setWalletConnected] = useState<boolean>(false);
  const { walletProvider } = useAppKitProvider<Provider>("eip155");
  const [polsBalance, setPolsBalance] = useState("0.00");

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
      console.error("❌ Failed to fetch POLS balance:", err);
      setPolsBalance("0.00");
    }
  }

  useEffect(() => {
    if (isConnected) fetchPolsBalance();
  }, [isConnected, walletProvider, address]);


  useEffect(() => {
    if (isConnected && address) {
      setWalletConnected(isConnected)
    }
  }, [])
  useEffect(() => {
    const index = tabs.findIndex((t) => t === activeTab);
    const target = buttonRefs.current[index];
    if (!target || !indicatorRef.current) return;

    const rect = target.getBoundingClientRect();
    const parentRect = target.parentElement!.getBoundingClientRect();

    indicatorRef.current.style.width = `${rect.width}px`;
    indicatorRef.current.style.left = `${rect.left - parentRect.left}px`;
  }, [activeTab]);

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

  const handleDepositClick = () => {
    setHasClickedContribute(true);
    
  };

  const handleStakeClick = () => {
    setIsDialogOpen(true);
  };

  const handleWithdrawalClick = () => {
    console.log("withdrawal case clicked");
  }
  
  const handleBlur = () => {
    setIsTyping(false);
    if (amount === "") {
      setAmount("0");
    }
  };

  

  if (!mounted) {

    return null;
  }

  const shouldShowNoPolsError = Number(amount.replace(/,/g, "")) > Number(polsBalance);
  const isAmountPositive = Number(amount.replace(/,/g, "")) > 0;
  return (
    <div className='py-8'>
      <div className='py-16 px-8'>
      <div className="flex-1  grid gap-12 sm:gap-16
                [@media(max-width:500px)]:grid-cols-[calc(90vw-1rem)_250px]   
                grid-cols-[1fr_23%]
                md:grid-cols-[minmax(0,1fr)_minmax(220px,40%)]   
                lg:grid-cols-[minmax(0,1fr)_minmax(400px,33%)]   
                xl:grid-cols-[minmax(0,1fr)_minmax(300px,30%)]   
                2xl:grid-cols-[minmax(0,1fr)_minmax(300px,30%)]  
      ">
          <div
            className={`
               relative w-full  overflow-hidden rounded-xl transform transition-all
               border  shadow-xl  bg-cover 
              ${resolvedTheme === 'dark' ? 'before:mix-blend-soft-light before:opacity-50 border-[#27272a] bg-[var(--background-1)]' 
              : 'before:mix-blend-darken before:opacity-5 border-gray-200 bg-white'}
              before:content-[''] before:absolute before:inset-0 
              before:bg-[url('/assets/images/surface-bitmap.png')] 
            `}
          >
            <div className={`relative flex w-full border-b-[1.6px]    items-center justify-between px-5 py-4  ${resolvedTheme === 'dark' ? 'bg-zinc-950/70' : 'bg-white/60'}`}>
              <h2 className='text-[var(--type-1)] text-[14px] sm:text-[17px] pr-4  whitespace-nowrap font-[600]'> Stake POLS </h2>
              <div className={`relative flex  rounded-full  border border-border-1 ${resolvedTheme === "dark" ? "bg-[#18181b]" : "bg-[#fafafa]"} p-0.5  w-fit`}>
                <div className="flex relative ">
                  {tabs.map((tab, index) => (
                    <button
                      key={tab}
                      role="tab"
                      aria-selected={activeTab === tab}
                      onClick={() => setActiveTab(tab)}
                      className={`text-[14px] font-[600] focus-visible:ring-contrast focus-visible:ring-offset-[var(--background-1)] text-center border-transparent focus-visible:ring-offset-2 flex px-4 py-1 gap-1 h-7 rounded-full items-center capitalize transition-colors duration-200 ease-in-out
                                  ${
                                  activeTab === tab
                                  ? tab === "stake"
                                  ? "bg-[#00BBFF29] text-[#0095CC]"
                                  : "bg-[var(--color-warning)] text-[var(--color-warning-foreground)]"
                                  : "bg-transparent  cursor-pointer hover:bg-transparent text-[color:var(--type-2)] hover:text-[color:var(--link-hover)]"
                                }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

               
                <div
                  ref={indicatorRef}
                  className="absolute top-[0.125rem] h-[30px] rounded-full bg-primary-bg transition-all duration-300"
                  style={{ left: 0, width: 0 }}
                />
              </div>
            </div>
            <div className=' relative flex flex-col items-center gap-x-6 gap-y-4 px-8 py-10'> 
              {!isWalletConnected ? (
                <Button  onClick={() => setIsSignInOpen(true)}  className="text-[12px]  font-[600] cursor-pointer bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-3xl py-3 text-[#18181b] h-7 "> 
                  Connect Wallet 
               </Button>
              ):(
                <div className='relative'>
                  <CoinSelect />
                </div>
              )}
                <div className='relative'> 
                  <input
                    type="text"
                    value={amount}
                    maxLength={10}
                    inputMode="numeric"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={` __className_a17902 ${activeTab === 'stake' ? 'text-[color:var(--color-primary-type)]' : ' text-[var(--color-warning-foreground)]'}  font-[500] w-full bg-transparent text-center text-6xl focus:outline-none`}
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
                  <p className='text-[var(--text-muted)]  font-[600] text-[14px]'> in wallet </p>
                    {shouldShowNoPolsError ? (
                      <Button className=" relative  text-[13px] mt-4 font-[500] cursor-pointer bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-3xl py-3 text-[#18181b] h-7">
                          Buy POLS
                      </Button>
                      ) : (
                        <Button className={` relative border  duration-300 transition-all text-[13px] mt-4 font-[600] cursor-pointer rounded-3xl py-3 h-7 
                                            ${resolvedTheme === 'dark' ? 'hover:bg-zinc-700 text-white bg-zinc-800 ' 
                                            : 'bg-white hover:bg-gray-50 text-black'}
                                          `}
                        >
                          {activeTab === 'stake' ? 'stake all' : 'Withdraw All'}
                        </Button>
                      )}
                    { activeTab === 'withdraw' ? (
                      <div className={` flex mt-6 items-center gap-3.5 rounded-lg border py-3 pl-4 pr-4  bg-[var(--color-warning)] ${resolvedTheme === 'dark' ? 'dtext-gray-400' : 'text-[var(--type-1)]'}  border-[var(--border-warning-border)] `} role='alert'>
                        <div className='flex gap-2 items-center '>
                          <AlertIcon  className='shrink-0  text-[color:var(--color-warning-foreground)] size-6'/>
                        <p className='text-[13px] font-[600] ml-2  text-[var(--type-1)]'> Withdrawing your staked POLS will reduce your POLS Power and associated benefits. Please consider the impact on your tier status and IDO participation.</p>
                      </div>
                    </div>
                    ) : (
                      <div className={` flex mt-6 items-center gap-3.5 rounded-lg border py-3 pl-4 pr-4 text-[var(--type-1)] ${resolvedTheme == 'dark' ? 'text-gray-400 bg-zinc-800' : 'bg-gray-200/40'} `} role='alert'>
                        <div className='flex gap-2 items-center '>
                          <AlertIcon  className='shrink-0  text-[color:var(--color-primary-type)] size-6'/>
                          <p className='text-[13px] font-[600] ml-2  text-[var(--type-1)]'> Your staked POLS will be locked for the entire staking period. Early withdrawals are not permitted, ensuring commitment and stability in the ecosystem.</p>
                        </div>
                      </div>
                    )} 
                  </div>
                </div>
                <div className='my-2 px-8 pb-8 flex flex-col gap-3 items-start '>
                  <h2 className='text-left __className_a17902 text-[var(--text-muted)] text-[15px] font-mono font-[500] uppercase transition-colors duration-300 '> Staking Summary  
                      {shouldShowNoPolsError && (
                        <span className='text-[color:var(--color-primary-type)] text-sm'> (PROJECTED) </span>
                      )}
                  </h2>
                  <div className='w-full flex flex-col gap-x-1 gap-y-2 flex-1'>
                    {stakingSummary.map(({title, icon:Icon, value, value2:otherValue}, idx) => (
                      <React.Fragment key={idx}>  
                        <div  className='flex h-6 w-full flex-row justify-between items-center gap-3'>
                          <div className='flex items-center gap-1.5 text-nowrap shrink-0'>
                            <Icon  className='shrink-0 text-[var(--type-2)] size-4' />
                            <p className='font-[600] text-[var(--type-1)] text-[14px] '> {title} </p>
                          </div>
                          <div className='border-[0.8px] mt-3 w-full border-dashed' />
                          <div className='flex items-center gap-1.5 text-nowrap shrink-0'>
                            <p className='__className_a17902 text-[var(--type-1)] tracking-tight font-[500] text-[14px] text-right'> 
                                {value} 
                                <span className='text-[var(--type-2)] shrink-0'> {otherValue} </span>
                            </p>
                            {title === "Lottery Probability" && (
                              <LotteryProbabilityInfo className='text-[var(--type-2)]' />
                            )}
                          </div>                                     
                        </div>
                        {idx === 2 && (
                           <div  className='border mt-2 mb-4  h-px w-full border-t  border-none via-border bg-gradient-to-r from-transparent to-transparent' /> 
                         )}
                      </React.Fragment> 
                    ))}
                  </div>
                    <button className={` relative inline-flex items-center font-[500] mt-4  disabled:cursor-not-allowed 
                                          rounded-3xl py-3 text-[#18181b]
                                          h-12 duration-200 outline-none transition-all ease-in-out border justify-evenly whitespace-nowrap
                                          focus-visible:ring-contrast focus-visible:ring-offset-[var(--background-1)] text-center border-transparent focus-visible:ring-offset-2
                                          leading-none disabled:border-transparent text-[17px]  px-7 w-full sans cursor-pointer 
                                          ${activeTab === "stake" ? "bg-[var(--color-primary)]   hover:bg-[var(--color-primary-hover)]" : "bg-[var(--color-warning)] hover:bg-[var(--color-warning)]/90" }
                                          ${resolvedTheme === 'dark' ? 'disabled:text-zinc-400/80 disabled:bg-zinc-600/30 ' : 'disabled:text-zinc-400 disabled:bg-zinc-200'}`}
                                         
                              disabled={!isConnected || !isAmountPositive}
                              onClick={
                                activeTab === "stake"
                                  ? handleStakeClick 
                                  : handleWithdrawalClick 
                              }  
                      >
                          {activeTab === "stake"
                              ? isAmountPositive && isConnected
                              ? "Deposit & Lock"
                              : "Deposit & Lock"
                              : "Withdraw POLS"
                            }
                      </button> 
                        
                </div>
                {/* Dialogue cases */}
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogContent
                      className={`max-w-lg border ${
                        resolvedTheme === "dark"
                          ? "bg-zinc-900 border-zinc-700"
                          : "bg-white border-zinc-200"
                      }`}
                    >
                      <AlertDialogHeader>
                        <div className="flex gap-2 items-center">
                          <AlertIcon className="shrink-0 text-[color:var(--color-primary-type)] size-6" />
                          <AlertDialogTitle className="text-[16px] font-semibold text-primary">
                            Authorize Staking
                          </AlertDialogTitle>
                        </div>
                      </AlertDialogHeader>

                      <AlertDialogDescription asChild>
                        <p className="text-[13px] font-[600] mt-3 text-[var(--type-1)] leading-6">
                          You may either manually deposit your stake to your funding wallet address listed in your profile,  
                          <br />
                          To ensure you use the correct wallet, select your coin type (<strong>Ethereum</strong> or <strong>Binance</strong>) to view the corresponding address.
                          <br />
                          or click <strong>“Authorize from Wallet”</strong> to authorize the transaction directly from your LoggedIn wallet.
                        </p>
                      </AlertDialogDescription>

                      <AlertDialogFooter className="mt-6">
                        <AlertDialogCancel
                          onClick={() => setIsDialogOpen(false)}
                          className={`px-4 py-2 rounded-md font-[600] ${
                            resolvedTheme === "dark"
                              ? "bg-zinc-800 text-zinc-300"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                Close
                              </AlertDialogCancel>

                              <button
                                onClick={() => setIsDialogOpen(false)}
                                className={`px-4 py-2 rounded-md font-[600]  bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-[#18181b] `}
                              >
                                Authorize from Wallet
                              </button>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
              
              <div className='flex flex-col gap-10 w-full  '>
               <div className='flex flex-col gap-5'>
                <div className='flex flex-col gap-0.5 '>
                  <h2 className='__className_a17902  uppercase text-[var(--type-1)] whitespace-nowrap text-sm font-[600] w-full'> 
                      Total POLS Power
                      {shouldShowNoPolsError && (
                        <span className='text-[color:var(--color-primary-type)] text-sm'> (PROJECTED) </span>
                      )}
                  </h2>
                  <div className='text-[var(--color-primary-type)] whitespace-nowrap   __className_a17902 font-[500]'>
                    {activeTab === "stake" ? (
                      <CountUp 
                        key={amount}
                        start={0}
                        end={Number(amount.replace(/,/g, "")) || 0}
                        duration={0.6}
                        separator=','
                        className='text-7xl'
                      />
                    ) : (
                      <span className='text-7xl '>0</span>
                    )}
                    <span className='text-4xl  opacity-75 '>.</span>
                    <span className='opacity-60 text-4xl'>0</span>
                  </div>
                </div>
                <div className='flex h-6 w-auto flex-row items-center justify-between gap-3 min-w-[350px]'>
                    <p className='text-sm font-[500]  text-[(var(--type-1)] text-[15px] '> POLS Staked</p>
                    <div className='border-[1px] mt-3 w-full border-dashed ' ></div>
                    <span className='__className_a17902 font-[500]'>0.00</span>
                </div>   
               </div>
             
                <div className='flex items-center justify-between min-w-[350px]'>
                  <div className='flex  gap-1 '>
                    <PolsPower  className='text-[color:var(--color-primary-type)] shrink-0 ' />
                    <h2 className='__className_a17902 uppercase text-[var(--type-1)] font-[500] text-xs shrink-0'> POLS Power</h2>
                  </div>
                  <h2 className='__className_a17902 uppercase whitespace-nowrap text-[var(--type-2)] shrink-0  text-[13px] font-[500]'> Allowlist Pobability</h2>
              </div>
              <div className='flex  flex-col gap-1.5  -mt-8  mb-8' >
                {polsAssets.map(({title, value, percentage}, idx) => (
                  <div className='border min-w-[350px] flex  items-center rounded  px-2.5 py-2  justify-between gap-2' key={idx}>
                    <div className='flex flex-col gap-0.5'>
                      <h2 className='uppercase text-xs __className_a17902 font-[600] text-[var(--type-2)]'>{title} </h2>
                      <div className='flex items-center gap-1'>
                        <p className='  leading-none text-[14px] font-[500]'> {value}</p>
                          {(idx === 3 || idx === 4) && (
                          <span className='inline-flex items-center gap-1 
                                          whitespace-nowrap border __className_a17902 
                                          tracking-tight border-transparent backdrop-blur-sm 
                                          uppercase h-[1.1rem] rounded-[0.25rem] px-[0.2rem]
                                          text-[var(--type-1)] bg-zinc-200/40 dark:bg-zinc-600/40 text-[0.6rem]
                          '>
                              No Cooldown
                          </span>
                        )}
                      </div>
                    </div>
                      <p className='shrink-0 text-[var(--type-2)] __className_a17902 font-[500] text-[15px]'> {percentage}</p>
                      {idx == 4 && (
                        <div className='flex gap-1 items-center text-[var(--color-secondary-type)]'>
                          <PolsDiamonFlag />
                          <p className='text-xs uppercase font-[500]'> Guaranteed </p>
                        </div>
                      )}
                  </div>
                ))}
              </div>
                <p className='text-[0.8rem] -mt-12 font-[600]   text-[var(--type-2)] min-w-[350px] opacity-70'> Probabilities are averages calculated over the most recent IDOs. Chances are not guaranteed. </p>
              </div>
            </div> 
          </div>
          <SignIn open={isSigInOpen} onOpenChange={setIsSignInOpen} />
      </div>
  )
}

export default Staking;
