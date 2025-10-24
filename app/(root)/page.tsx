'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, {useState,  useEffect} from "react";
import {Button} from "@/components/ui/button"
import { useTheme } from "next-themes";
import { coinIcons } from "@/constants";
import {Revolut} from "@/components/icons/icons";
import FAQAnswer from "@/components/shared/faq-answer";
import {Bitavo} from "@/components/icons/icons";
import { councilLogo, polstat, polsStatement, polsEvent, getMarketCap, getPolsSupply, fullCoinicon, polkaQuestions, faqQuestions } from "@/constants";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import PolkaTable from "@/sections/pols-table";
import TradingViewMiniChart from "@/sections/polschart"


const steps = [
  "Create an Account",
  "Purchase POLS",
  "Claim First Access too 100+ IDOs"
];


interface marketCapProps {
  title: string;
  value: string | number;
};

interface polsmarketProps {
  title: string;
  value: string | number;
}


const Home = () =>  {
  const [mounted, setMounted] = useState(false);
  const {theme} = useTheme()
  const router = useRouter();
  const [polsSupply, setPolsSupply] = useState<polsmarketProps[]>([])
  const [marketCap, setMarketCap] = useState<marketCapProps[] >([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(0)
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchSupply = async () => {
      const data = await getPolsSupply();
      setPolsSupply(data);
    };

    const fetchMarketCap = async () => {
      const data = await getMarketCap();
      setMarketCap(data);
    };
    

    fetchSupply();
    fetchMarketCap();
  }, []);

  const getResolvedTheme = () => {
    if (theme === "dark") return "dark";
    if (theme === "light") return "light";
  
    // For "system", check system preference dynamically:
    if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  };

  if (!mounted) {

    return null;
  }

  const resolvedTheme = getResolvedTheme();
  
  
  const videoSrc = resolvedTheme === "dark"
      ? "/assets/videos /hero-dark.mp4"
      : "/assets/videos /hero-light.mp4";
  
  const handleQuestionSelect = (idx: number) => {
    setActiveQuestionIndex(idx)
  }
  return (
    <div className="pt-8">
       <div className="px-4 pt-10 ">
        <div className="mx-auto mt-8 items-center grid  lg:grid-cols-2 lg:items-center min-h-[200px] ">
          <div className="items-center lg:mx-0 mx-auto gap-4  py-4  lg:items-start lg:px-2 ">
            <h2  className=" __className_a17902 antialiased text-5xl  lg:text-8xl text-center  lg:text-left font-[400] mx-auto lg:mx-0 max-w-full  "> 
               Crypto's First Launchpad 
            </h2>
            
            <p className="mt-9 __className_a17902 text-[18px] text-[#71717A] font-[600] text-center antialiased lg:text-left"> 
              Founded in 2020
              <br />
                 $500M+ Distributed to Users 
            </p> 
            <div className="w-full flex flex-col items-center [@media(min-width:600px)]:flex-row gap-2 mt-8 justify-center lg:justify-start">
              <Button onClick={()=> router.push("/projects")} className="rounded-full  __className_a17902 items-center font-[600] cursor-pointer  transition-all text-[#000] hover:bg-contrast bg-[#00BBFF] h-14  w-56 text-[18px] ">
                Get Started 
                <Image
                  src="/assets/icons/get-started.svg"
                  alt="get-started"
                  className="w-6 h-6 "
                  width={50}
                  height={50}
                
                />
              </Button>
              <Button  onClick={()=> router.push("/staking")} className="rounded-full items-center duration-300 font-[600] cursor-pointer  transition-all  hover:bg-contrast h-14 px-4 w-46 text-[19px] ">
                Stake POLS
              </Button>
              
            </div>
          </div>
          {/*  Video - marketting */}
          <div className="w-full  mt-4 lg:justify-start  justify-center relative aspect-[250/200]">
            <video
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              className=" w-full h-full  rounded-md"
            >
            </video>
          </div>
        </div>
        <div className="mx-auto mt-12  flex flex-col  items-center w-[92%]">
          <p className="px-4 text-center text-sm font-medium uppercase tracking-widest text-[#71717A] "> Available on the World's largest exchanges </p>
          <div className="flex mt-6 gap-y-3 flex-wrap  items-center justify-center  gap-x-6 lg:gap-x-8 [@media(max-width:540px)]:w-[90%] lg:w-[100%]  h-full  ">
              <Revolut 
                className=" w-18 "
              />
              {coinIcons.map((coin, index) => (
                <React.Fragment key={index}>
                  <Image
                    alt={coin.title}
                    width={coin.title === "HTX" ? 50 : 80}
                    height={coin.title === "HTX" ? 100 : 100}
                    src={resolvedTheme === "dark" ? coin.dark : coin.light}
                    className={`  self-center   ${coin.title == "Mexc Global" && theme !=="dark" ? "w-22 h-5" : ""}`} 
                  />
                    {coin.title === "kraken" && (
                        <Bitavo 
                          className="h-8 w-26"
                        />
                )}
                </React.Fragment>
              ))}
          </div>
        </div>
       </div>
       <div className="flex flex-col bg-[#00BBFF] py-8 mt-16 px-10 lg:px-24 lg:flex-row gap-4 lg:gap-20 justify-center">
          <div>
            <h1 className="text-white text-[22px] font-bold text-center lg:text-left"> Polkastarter Council </h1>
            <p className="text-white text-base font-semibold mt-1 text-center lg:text-left"> Our council includes individuals from </p>
          </div>
          <div className="flex flex-row items-center justify-center space-x-6">
              {councilLogo.map((coin, index) => (
                <Image 
                  key={index}
                  src={coin.imgPath}
                  alt={coin.title}
                  width={coin.title === "OKX" ||coin.title === "HTX" ? 40 : 80}
                  height={100}
                  className={` ${coin.title == "OKX" || coin.title === "HTX" ? "md:w-20 md:h-10 " : "md:w-40 md:h-18" }`}  
                />

              ))}
          </div>
       </div>
       <div className="mt-20 py-12 text-center justify-center">
                <h1 className="font-bold leading-[48px] sm:text-[26px] lg:text-[40px]"> Launching the Best Sales in Crypto Since 2020 </h1>
                <div  className="mt-8 flex  flex-row justify-center gap-10 sm:gap-20 md:gap-52">
                  {polstat.map((stat, index) => (
                    <div key={index}>
                      <p className="text-[32px] font-bold sm:text-[58px]"> {stat.value}</p>
                      <p  className="mt-2 text-[16px] text-[#A1A1AA] sm:text-[20px]"> {stat.title} </p>
                    </div>
                ))}
              </div>
       </div>
       <div className="px-6 pt-12">
          <div className="mx-auto flex flex-col items-center justify-between gap-12 lg:flex-row">
            <div className="flex h-full w-11/12 items-center lg:w-1/2">
                <Image 
                  src="/assets/images/IDO-Claim.png"
                  alt="IDO-Claim"
                  height={1000}
                  width={1000}
                  className="rounded-xl object-cover"
                />
            </div>
            <div className="w-11/12 lg:w-1/2 lg:pr-20 mt-1">
              <h3 className="text-[32px] font-normal text-[#00BBFF] -mt-4 sm:text-[62px] sm:leading-[65px]"> Join Your First Sale in Minutes </h3>
                  <div className="flex flex-col mt-6 gap-4">
                    {steps.map((step, index) => (
                      <div key={index} className="flex-row flex items-center ">
                        <span className="mr-4 flex h-[34px] w-[34px] items-center justify-center rounded-full border-2 border-[#00BBFF] text-[26px] font-semibold text-[#00BBFF] sm:h-[52px] sm:w-[52px]"> {index +1} </span>
                        <span className="text-sm sm:text-[20px] text-[(--type-1)] font-[600] sm:leading-[24px]"> {step} </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex-col flex gap-4 sm:flex-row">
                      <Link href="https://www.revolut.com/crypto/price/pols/" target="_blank" rel="noopener noreferer" className="text-md cursor-pointer hover:bg-contrast rounded-3xl bg-[#00BBFF] px-8 py-3 text-[#18181b] h-12 w-34"> Buy POLS</Link>
                      <Button className="text-md cursor-pointer hover:bg-contrast rounded-3xl bg-[#00BBFF29] px-8 py-3 h-12 text-[#0095CC] w-50">Create An Account </Button>
                  </div>
            </div>
          </div>
       </div>
       <div className="pt-16 px-6">
          <h2 className="text-[24px] sm:text-[40px] text-center font-bold">Why POLS?</h2>
          <div className="mx-auto mt-20 grid grid-cols-1 lg:grid-cols-3 gap-10">
              {polsStatement.map((pols, index) => (
                <div key={index} className={` ${resolvedTheme === "dark" ? "bg-[#18181b]" : "bg-[#fafafa]"} rounded-lg shadow-lg overflow-hidden`}>
                  <div className="w-full h-64 relative">
                    <Image
                      alt={pols.title}
                      src={pols.imgPath}
                      width= {100}
                      height={100}
                      className="h-full w-full object-cover"
                    
                    />
                    {pols.title === "Evergreen Asset" && (
                      <Image 
                        src="/assets/images/polkastarter-white.svg"
                        alt="polkastarter white image"
                        width={100}
                        height={100}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64"
                      />
                    )}
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-8" > {pols.title} </h3>
                    <p className="text-[#A1A1AA] font-[600] text-[16px]"> {pols.content}</p>
                    <p className="text-[#A1A1AA] font-[600] text-[16px] mt-4"> {pols.otherContent}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
        {/*  New section */}
        <div className="pt-16 ">
          <div className={`${resolvedTheme === "dark" ? "bg-[#18181b]" : "bg-[#fafafa]" } max-w-[#1344px] mx-auto py-10 px-6 `}>
            <h1 className="text-[24px] text-center sm:text-[40px] font-bold my-20">  Events Due in 2025 that Power Up POLS</h1>
            <div className="flex flex-wrap justify-center gap-8">
              {polsEvent.map((polsEvent, index) => (
                <div key={index} className=" relative border-[#00BBFF]  rounded-xl text-[#18181b] font-bold flex items-center justify-center min-h-[100px] w-[80%] lg:w-[40%] xl:w-[30%] border "   >
                  <div className={`absolute inset-0  bg-[length:6px_6px]  bg-center rounded-xl  bg-[url('/assets/images/events-due-in-2025-bg.png')]  ${resolvedTheme === "dark" ? "bg-black opacity-10 bg-blend-lighten" : "bg-[#D2F0FB] opacity-60  bg-blend-lighten"} `} />  
                    
                    <div className="relative z-10 flex items-center justify-center  px-6">
                      <span className={` font-bold text-center text-[17px]  ${ resolvedTheme ==="dark" ? "text-[#00BBFF]" : "text-black"}`}> {polsEvent}</span>
                    </div>
                  </div>
              ))}
            </div>
            <div className="py-10 mx-auto">
                <h1 className="text-[24px] sm:text-[40px] font-bold mt-20 text-center"> POLS Market Performance </h1>
                <p className="font-[600] text-center text-[#71717A] mt-8 text-[17px]"> Listed on over 20 primary  markets including, Coinbase, Kraken, and Revolut </p>
                <div className="mt-10 flex flex-col xl:flex-row items-center xl:items-start ">
                  <div className="bg-white rounded-lg p-4 w-full sm:w-11/12 md:w-10/12 lg:w-8/12 xl:w-1/2 flex-shrink-0 border border-[#E4E4E7] h-[420px]">
                        <div className="h-full">
                          <TradingViewMiniChart />
                        </div>
                  </div>
                  <div  className="mt-8 flex flex-col  gap-y-6 xl:mt-0">
                  {marketCap.map((stat, index) => (
                    <div key={index} className="xl:text-left px-2 text-center">
                      <div className="text-xl leading-relaxed font-[600]">{stat.title}</div>
                        <div className="text-[50px] __className_a17902  text-[#00BBFF] font-[400] ">
                          {stat.value}
                        </div>
                    </div>
                  ))}
                    <div className="mt-6 px-2 flex-col flex gap-4 sm:flex-row items-center">
                      <Button className="text-md cursor-pointer hover:bg-contrast rounded-3xl bg-[#00BBFF] px-8 py-3 text-[#18181b] h-12 w-34"> Buy POLS</Button>
                      <Link href="/staking" className="text-md cursor-pointer hover:bg-contrast text-center rounded-3xl bg-[#00BBFF29] px-8 py-3 h-12 text-[#0095CC] w-50">Stake POLS </Link>
                  </div>
                  </div>

                </div>
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 ">
                  {polsSupply.map((item, index) => (
                    <div key={index} className={` text-center py-4 rounded-xl  ${ resolvedTheme === "dark" ? "border-none bg-[#09090b]" : "border border-[#E4EE7] bg-[#fff]"} `} >
                      <div className="font-normal text-sm">{item.title}</div>
                      <div className="font-[700] text-[26px] __className_a17902  text-[#00BBFF]"> 
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="max-w-7xl mx-auto pt-12 mt-16">
                   <h1 className="font-bold py-8 text-[24px] sm:text-[40px]"> Polkastarter Sales at a Glance </h1>
                   <div className={` ${resolvedTheme === "dark" ? "bg-[#0a0a0a]" : "bg-white"} rounded-lg   overflow-x-scroll border border-[var(--table-border)] `}>
                      <PolkaTable />
                   </div> 
                   <Button onClick={() => router.push("/projects")} className="w-full bg-[#00BBFF] text-[17px] rounded-full text-center py-6  my-4 font-[600] text-[#18181B] hover:bg-contrast cursor-pointer"> Explore Projects</Button>
                </div>
            </div>
          </div>
          {/*  new section*/}
          <div className={`flex  flex-col items-center   py-10 lg:py-0 px-6 ${resolvedTheme === "dark" ? "bg-[#09090b]" : "bg-[#fff]"}`}>
            <h1 className="mb-8 text-[24px] font-bold sm:text-[40px] lg:mt-10">POLS Token  Available On</h1>
            <div className="mb-12 grid   grid-cols-2 gap-2 sm:gap-4 flex-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  xl:grid-cols-6">
              {fullCoinicon.map((coin, index) =>
                coin.link ? ( // only render if link exists
                  <Link
                    key={index}
                    href={coin.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative  flex items-center justify-center rounded-xl  border h-24 w-40 md:w-44 transition-all 
                    hover:border-[#00BBFF]   border-[var(--table-border)] 
                     cursor-pointer  ${resolvedTheme === "dark" ? "bg-[#16262D] hover:bg-[#16262D]" : "hover:bg-[#D2F0FB] "} `}
                  >
                    {typeof coin.light === "string" ? (
                      <Image
                        alt={coin.title}
                        width={ coin.title === "HTX"  ? 60 :90}
                        height={100}
                        src={resolvedTheme === "dark" ? (coin.dark as string) : (coin.light as string)}
                        className="shrink-0"
                      />
                      ) : (
                        <coin.light className="h-26 w-18  " />
                      )}
                  </Link>
                  ) : null
                )} 
            </div>
            <div className="flex space-x-2 sm:space-x-4">
              <Button className="text-[18px] cursor-pointer hover:bg-contrast rounded-3xl bg-[#00BBFF] font-[600] px-8 py-3 text-[#18181b] h-12 w-34"> Buy POLS</Button>
              <Button onClick={() => router.push("/stake")} className="rounded-full items-center duration-300 cursor-pointer  transition-all font-[600]  hover:bg-contrast h-12 px-4 w-34  py-3 text-[19px] ">
                Stake POLS
              </Button>
            </div>
          </div>
          {/* new section  */}
          <div className="max-w-[1280px] mx-auto px-6 lg:mt-12">
            <div className="flex flex-row  w-full items-center justify-between gap-x-4 space-x-2 ">
               <h2 className="font-bold text-[20px]"> Learn about Polkastarter</h2> 
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex "
              >
               
                  <p className="font-[600]  text-[#00BBFF] text-[14px] shrink-0 "> Explore our Blog</p>
                  <ChevronRight className=' w-5 h-6 text-[#00BBFF] group-hover:hidden shrink-0' color='#00BBFF' strokeWidth={2.5}/>
                  <ArrowRight className="w-6 h-4 text-[#00BBFF]  hidden group-hover:inline group-hover:translate-x-1 translate-y-1 transform  transition-all duration-300 animate" strokeWidth={2.5}/>
             
              </Link>
            </div>
            <div className="grid grid-cols-1 mt-4 gap-6 md:grid-cols-2 lg:grid-cols-3 ">
                        
            {polkaQuestions.map((question, index) => (
              
              
                 <div
                  key={index}
                  className={`relative ${resolvedTheme === "dark" ? "bg-[rgb(24,24,27)] border-none hover:bg-[#242429]" : "bg-[#fff] border hover:bg-[#fafafa]"} rounded-xl  w-full overflow-hidden  hover:shadow-lg cursor-pointer 
                           ${index === 0 ? "md:col-span-2 lg:col-span-2 lg:row-span-2 " : "w-full" }`}
                  onClick={() => {
                  setTimeout(() => {
                    router.push("/")
                  }, 2000)
                 
                  }}
                >
                  
                  {question.content ? (
                  <>
                  
                    <div className="h-[400px] rounded-xl">
                      <Image
                        src={question.imgPath}
                        alt={question.question}
                        fill
                        priority
                        className={`object-cover  object-[center_bottom]  ${resolvedTheme ==="dark" ? "opacity-20" : "opacity-50"} `}
                      />
                    </div>
                  
                    <div
                      className={`absolute inset-0 opacity-50 z-10 bg-gradient-to-b ${
                      resolvedTheme === "dark"
                      ? "from-[#18181b] via-transparent to-black/60"
                       : "from-white via-transparent to-white"
                      }`}
                    />

                  <div className=" flex fex-col items-end  p-4  absolute inset-0 z-10">
                    <h2 className="absolute text-[var(--primary)] md:bottom-40  bottom-26   w-[90%] sm:w-[70%] text-4xl sm:text-4xl font-extrabold">
                        {question.question}
                    </h2>
                    <p className=" line-clamp-3 lg:line-clamp-4 text-left  text-[#A1A1AA] leading-relaxed font-[600] sm:font-normal text-[16px] sm:text-[19px]">
                        {question.content}
                    </p>
                    
                  </div>
                </>
                ) : (
                <div className="flex p-6 relative items-center">
                  <h2 className="absolute __className_a17902  text-[var(--primary)] w-[70%] lg:w-[40%] md:w-[70%] z-10 text-[21px] sm:text-2xl font-[700]">
                     {question.question} 
                  </h2>
                  <div className="h-54 overflow-hidden rounded-xl">
                    <Image
                      src={question.imgPath}
                      alt={question.question}
                      fill
                      priority
                      className=" object-cover object-[right_center] rounded-xl"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}  
        </div>
       
       
      </div>
       {/* new section */}
      <div className="pt-16 py-10  sm:mb-8">
          <div className={`${resolvedTheme === "dark" ? "bg-[#18181b]" : "bg-[#fafafa]" } max-w-7xl  px-6 py-6`}>
            <h1 className="font-bold text-[24px] sm:text-[40px]"> FAQ </h1>
            <p className="text-lg text-[#71717A] mt-2 font-[600]"> Find answers to some of the most common questions. </p>
            <div className="mt-6 xl:grid xl:grid-cols-2 gap-x-6 gap-y-3">
              <div className="space-y-3">
                {faqQuestions.map((question, idx) => {
                  const isActive = activeQuestionIndex === idx;
                  
                  return (
                  <div className="w-full" key={idx}>
                  <div key={idx}  onClick={() => handleQuestionSelect(idx)}  className={`  flex items-center w-full cursor-pointer  justify-center ${resolvedTheme === "dark" ? "bg-[#18181b]" : "bg-[#fafafa]" } text-center border  py-5 ${idx === 3 ? "px-6" : "px-4"} rounded-xl  transition-all duration-300 ${isActive ? "border-[#00BBFF] text-[#00BBFF]" : "border-[var(--border)]"}`}>
                    <p className="text-[22px] font-[600] __className_a17902 text-center">
                        {question.question} 
                    </p>
                    <ChevronRight className=' w-6 h-6'  strokeWidth={2.5}/>
                  </div>
                  
                </div>
                )
              })}
            </div>
            {activeQuestionIndex !== null && (
              <div className=" px-4 py-4 pb-20 mt-4 xl:mt-0 xl:col-span-1">
                <FAQAnswer idx={activeQuestionIndex} />
              </div>
            )}
            </div>
          </div>
          </div>
     </div>
    </div>
    
  )

}


export default Home;



