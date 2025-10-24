'use client';

import React, {useState, useRef} from 'react'
import {useResolvedTheme} from "@/components/shared/theme-context"
import { useProjectStore } from '@/store';
import { CheckCircle2,  Check, XCircle} from "lucide-react"

import Image from "next/image";
import { usePathname } from 'next/navigation';
import { CoinType, getIcon } from '@/utils';
import {getNames} from "country-list";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from '@/components/ui/button';
import {z} from "zod";
import {toast} from "sonner";


const countries = getNames();
const emailSchema = z.string().email("Enter a valid email address");

function ApplyForm() {
  const {resolvedTheme, mounted} = useResolvedTheme();
  const [isLoggedIn , setIsLoggedIn] = useState<boolean>(true);
  const [isWalletetConnected , setIsWalletConnected] = useState<boolean>(true);
  const [connectedAddress, setConnectedAddress] = useState<string | null>("0x789");
  const pathname = usePathname();
  const selectedProject = useProjectStore((state) => state.selectedProject);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name:"",
    email:"",
    country:""

  })
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [shake, setShake] = useState(false);
  

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

const CoinIcon = getIcon(cointypeIcon as CoinType);
const dateState = name === "Zesh AI Layer" ? "TBA": date;

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const {name, value} = e.target;
  setFormData((prev) => ({...prev, [name]:value} ));
};

const handleSelect =(value: string) => {
  setFormData((prev) => ({...prev, country: value}));
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const { name, email, country } = formData;

  // Disable submit while processing
  const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement;
  if (submitBtn) submitBtn.disabled = true;

  try {
    // Simulate API call with 1s delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Fake success/fail logic (80% chance success)
    const success = Math.random() > 0.2;

    if (success) {
      toast.success(`Your request form has been successfully submitted`, {
        description: "",
        duration:5000,
        icon: (
          <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center border  border-[var(--border-1)]">
            <Check className="text-primary w-3 h-3"  strokeWidth={2.5}/>
          </div>
        ), 
        style:{
          background: resolvedTheme === "dark" ? "#18181b" : "#fff",
          color: "var(--primary)",
          border:"var(--border-1)",
        
        }

      });

      // Reset form
      setFormData({ name: "", email: "", country: "" });
      setEmailValid(null);
    } else {
      throw new Error("Server error");
    }
  } catch (err) {
    toast.error("Your form has not been submitted", {
      description:"",
      duration: 5000,
      icon: (
        <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center border border-[var(--border-1)]">
          <XCircle className="text-primary w-4 h-4" strokeWidth={2.5}/>
        </div>
      ),
  
      style:{
        background: resolvedTheme === "dark" ? "#18181b" : "#fff",
        color: "var(--primary)",
        border:"var(--border-1)"
      }

    })
   

  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
};

const submitDisabled = (formData.name && formData.email && formData.country);


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
              <div className={` border border-transparent px-6  py-2 gap-3 rounded-full flex items-center justify-center ${resolvedTheme === "dark" ? "bg-green-50" : "bg-green-100"} `}>
                <span className="inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                <span className='uppercase font-[400] text-green-500 text-sm'> Allowlist open</span>
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
                <div className='flex items-center flex-row justify-between gap-2 '>
                  <p className='capitalize text-primary text-[18px] font-[400] whitespace-nowrap'> Personal Allocation </p>
                  <hr
                    className={`flex-grow border-0 h-[1px] bg-[length:5px_1px] bg-repeat-x bg-center 
                      ${resolvedTheme === "dark"
                        ? "bg-[linear-gradient(90deg,#ffffff_30%,rgba(255,255,255,0)_0px)]"
                        : "bg-[linear-gradient(90deg,#000000_30%,rgba(0,0,0,0)_0px)]"
                      }`}
                  />
                  <p className='text-[18px] font-400]'> {maxAllocation} </p>
                </div>
                <div className='flex items-center flex-row justify-between gap-4 '>
                  <p className='capitalize text-primary text-[18px] font-[400] whitespace-nowrap'> Token Sale Date </p>
                  <hr
                    className={`flex-grow border-0 h-[1px] bg-[length:5px_1px] bg-repeat-x bg-center 
                      ${resolvedTheme === "dark"
                        ? "bg-[linear-gradient(90deg,#ffffff_30%,rgba(255,255,255,0)_0px)]"
                        : "bg-[linear-gradient(90deg,#000000_30%,rgba(0,0,0,0)_0px)]"
                      }`}
                  />
                  <p className='text-[17px] font-[400] whitespace-nowrap'> {dateState} </p>
                </div>
              </div>
            </div>
            <div className={` ${resolvedTheme === "dark" ? "bg-[#18181b]" : "bg-[#fff]" } rounded-xl  h-auto overflow-hidden max-w-full px-8 py-8  mt-10 sm:mt-12 border border-transparent  `}>
              <h2 className='text-primary  text-[29px] font-[600] sm:text-[36px]'> Join the Allowlist </h2>
              <p className='mt-4 text-[16px] sm:text-[17px] text-[var(--type-3)] font-[400] leading-7'>We are excited to launch our IDO on Polkastarter. For a chance to win a allowlist spot, please fill out the form below and perform all tasks accordingly. If you have any questions, please contact us!</p>
              <form 
                onSubmit={() => {}}
                className='h-full w-full py-4 mt-4' 
                ref={formRef} 
              >
                <span className='text-primary text-[14px] sm:text-[15px] font-[600] '> Good luck 🚀 </span>
                <div data-slot=" form Name field" className='mt-6 flex flex-col space-y-2'>
                  <label htmlFor='mame' className='text-[14px] text-primary font-[600]'>
                      Full Name <span className='text-red-600'>*</span>
                  </label>
                  <input 
                    id="name"
                    name="name"
                    type="text"
                    className='  ease-in-out
                    focus:shadow-[0_0_0_1px_#00BBFF33]
                    focus:outline-none
                    focus:ring-4 focus:ring-[#00BBFF]/12
                    focus:border-[#00BBFF]/50 border  p-3 rounded-lg bg-transparent'
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div data-slot=" Email field" className='mt-6 flex flex-col space-y-2'>
                  <label htmlFor='mame' className='text-[14px] text-primary font-[600]'>
                      Email Address <span className='text-red-600'>*</span>
                  </label>
                  <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          handleChange(e);
                      
                    
                          const parsed = emailSchema.safeParse(e.target.value);
                      
                          if (parsed.success) {
                            
                            if (emailValid !== true) setEmailValid(true);
                          } else {
                            
                            if (emailValid !== false) {
                              setEmailValid(false);
                              setShake(true);
                              setTimeout(() => setShake(false), 500);
                            }
                          }
                        }}
                        className={`
                        w-full p-3 pr-10 rounded-lg border
                        focus:outline-none focus:ring-4 focus:ring-[#00BBFF]/12 focus:shadow-[0_0_0_1px_#00BBFF33]
                        ${shake ? 'animate-shake' : ''}
                        ${emailValid === false ? 'border-red-400 focus:ring-red-400/12 focus:shadow-[0_0_0_1px_#fca5a533]' : ''}
                        ${emailValid === true ? 'border-green-600 focus:ring-green-500/12 focus:shadow-[0_0_0_1px_#4ade8099]' : ''}
                        bg-inherit
                      `}
                      />

                      {emailValid !== null && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2">
                          {emailValid ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )}
                        </span>
                      )}
                    </div>

                    {emailValid === false && (
                      <p className="text-red-400 mt-1 text-sm">Invalid email address</p>
                    )}
                    {emailValid === true && (
                      <p className="text-green-500 mt-1 text-sm">Valid email address</p>
                    )}
                </div>
                <div data-slot=" Email field" className='mt-6 flex flex-col space-y-2 w-full' >
                  <label htmlFor='country' className='capitalize text-[14px] text-[var(--type-2)] font-[600]'>
                      Whats your country?*
                  </label>
                  <Select onValueChange={handleSelect} value={formData.country}>
                  {/* ✅ Trigger (customized appearance) */}
                    <SelectTrigger
                      className={`
                        flex items-center justify-between w-full  rounded-md border 
                        focus:ring-0 focus:outline-none border-primary
                        
                      `}
                    >
                      <SelectValue
                        placeholder="Select a country"
                        className="text-[var(--type-2)]"
                      />
                    
                    </SelectTrigger>

                    {/* ✅ Dropdown */}
                    <SelectContent
                      className={` border border-[var(--border-1)]  scroll p-0 m-0 w-80 sm:w-full overflow-auto  ${resolvedTheme === "dark" ? "bg-[#18181b]" : "bg-[#fff]"}`}
                    >
                      {countries.map((c) => (
                        <SelectItem
                          key={c}
                          value={c}
                          className={` p-4 m-0
                            text-[var(--type-2)] cursor-pointer
                            focus:text-[var(--type-2)]
                            data-[state=checked]:bg-[var(--dropdown-bg-active)] data-[state=checked]:text-[var(--type-2)]
                          `}
                        >
                          {c}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                </div>
                <div data-slot=" Email field" className='mt-2 flex flex-col space-y-2 w-full' >
                  <h2 className='text-primary text-[26px] sm:text-[29px] font-bold'> Wallet where you hold POLS. </h2>
                  <label htmlFor='country' className='capitalize text-[14px] sm:text-[17px] text-primary font-bold'>
                      ERC20 Wallet Address*
                  </label>
                  <input 
                    id="ERC 20"
                    name="wallet"
                    type="text"
                    value="0x104FF5a76241968b576bA01Dd"
                    readOnly
                    className='ease-in-out text-[var(--type-3)]
                    border p-3 rounded-lg bg-inherit text-[15px] sm:text-[16px]'
                  />
                </div>
              </form>
            </div>
            <div className='mt-8 py-8 flex flex-col space-y-1'>
              <p className='text-primary font-[600] text-[14px] sm:text-[17px] '> {` Do you want to receive updates from ${name}?`}</p>
              <div className='flex flex-row items-center gap-3'>
                <Checkbox id="terms" className={` border ${resolvedTheme === 'dark' ? 'bg-zinc-600' : 'bg-zinc-200'}`} />
                <span className='text-[var(--type-2)] text-[14px] sm:text-[17px] font-normal'> {` Yes, I agree to receive updates from ${name} in the future`}</span>
              </div>
            </div>
            <div aria-label='submit button' className='flex items-center justify-center'>
                  <Button 
                    className={` relative  px-3 sm:px-7 sm:rounded-xl  rounded-lg py-6 mt-8 font-[400] text-[16px] duration-200 transition-all border border-transparent text-center ${!submitDisabled ? resolvedTheme === "dark" ?  "bg-zinc-600 text-zinc-300" :  "bg-zinc-200 text-[var(--type-2)]" : "bg-primary text-background cursor-pointer"}`} 
                    disabled={!submitDisabled}
                    onClick={handleSubmit}
                  >
                    Submit Application
                  </Button>
            </div>
           </div>
    </div>
  )
}

export default ApplyForm;
