'use client';

import React, { useEffect, useRef, useState } from 'react'
import {ChevronRight, ChevronLeft} from "lucide-react"
import { UpcomingProjectInfo, upcomingProjectSocials } from '@/constants/projects';
import {useResolvedTheme} from "@/components/shared/theme-context"
import { useTheme } from 'next-themes';
import { useProjectStore } from '@/store';
import Link from 'next/link';
import {useRouter} from "next/navigation";
import Image from "next/image";
import { getIcon , CoinType , getTodayFormatted, getCountdown, CountdownUnit } from "@/utils";

// Swiper needed Imports
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Navigation, Thumbs, Pagination} from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';
import { usePathname } from 'next/navigation';
import { UpcomingProjects } from '@/constants';

const SaleConfig: Record<string, boolean> = {
     "Zesh AI Layer": false,
     "KeetaAI": true,
     "Friendly Giant AI": false,
};

const FCFS = [
     "00",
     "06",
     "14"
] as const;


type Highlight = { title: string; content: string };

const InfoTab = [
     "Description",
     "Token Sale"
] as const;

type InfoTabValue = (typeof InfoTab)[number];



type SingleProject = {
     SwiperImagesFiles?: string[];
     Description?: Record<string, any>;
     TokenSale?: Record<string, any>;
     saleSummary?:Record<string, any>
};

type Product = {
     title?: string;
     contents: string[];
     lists: { content: string }[];
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


   

const  ProjectInfo = ({params} : {params: Promise<{projectName: string}> }) => {
     const {projectName} = React.use(params);
     const decodeName = decodeURIComponent(projectName);
     const {resolvedTheme, mounted} = useResolvedTheme();
     const [isLoggedIn , setIsLoggedIn] = useState<boolean>(true);
     const [isWalletetConnected , setIsWalletConnected] = useState<boolean>(true);
     const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
     const {theme} = useTheme();
     const router= useRouter();
     const selectedProject = useProjectStore((state) => state.selectedProject);
     const prevRef = useRef<HTMLButtonElement | null>(null);
     const nextRef = useRef<HTMLButtonElement | null>(null);
     const [ready, setReady] = useState(false);
     const [isBeginning, setIsBeginning] = useState(true);
     const pathname = usePathname();
     const [isEnd, setIsEnd] = useState(false);
     const [activeIndex, setActiveIndex] = useState(0);
     const swiperRef = useRef<any>(null);
     const [saleActive , setSaleActive] = useState<boolean>(false);
     const [connectedAddress, setConnectedAddress] = useState<string | null>("0xFEDCBA6543210987");
     const [ActiveInfoTab, setActiveInfoTab] = useState<InfoTabValue>("Description");
     const [timeCountdown, setTimeCountdown] = useState<CountdownUnit[]>([
          { title: "days", number: 0 },
          { title: "hours", number: 0 },
          { title: "minutes", number: 0 },
          { title: "seconds", number: 0 },
     ]);
     
     const projectCountdownDate = () => {
          switch (decodeName) {
            case "Friendly Giant AI":
              return { date: "2025-11-9", time: "16:00:00" };
            case "MemeMarket":
              return { date: "2025-11-02", time: "20:45:00" }; // <-- MemeMarket's date/time
            default:
              return null;
          }
        };

     const isSaleActiveForProject = (projectName: string) => {
          return SaleConfig[projectName] ?? false; 
     };

     useEffect(() => {
          const decodedName = decodeURIComponent(projectName);
        
   
          const found = UpcomingProjects.find(
            (proj) => proj.name.toLowerCase() === decodedName.toLowerCase()
          );
        
          
          if (found && (!selectedProject || selectedProject.name !== found.name)) {
            useProjectStore.setState({ selectedProject: found });
          }
        }, [projectName]);


     useEffect(() => {
          setSaleActive(isSaleActiveForProject(decodeName));
     }, [decodeName]);

     useEffect(() => {
          setReady(true);
     }, []);
     useEffect(() => {
          const updateCountdown = () => {
            const countdownData = projectCountdownDate();
            if (!countdownData) return;
            const countdown = getCountdown(countdownData.date, countdownData.time);
            setTimeCountdown(countdown);
          };
        
          updateCountdown(); // initial
          const timer = setInterval(updateCountdown, 1000);
        
          return () => clearInterval(timer);
        }, [decodeName]);

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
     } = selectedProject || null;

     const allowedWallets = [
          "0x1234567890abcdef",
          "0xABCDEF9876543210",
          "0xFEDCBA6543210987",
          "0xa1b2c3d4e5f678901234567890abcdef12345678", // you can add more
        ];


     const isAllowedtoJoin =
               isWalletetConnected &&
               allowedWallets.some(
               (addr) => addr.toLowerCase() === connectedAddress?.toLowerCase()
     );
     const salesbuttonText = isWalletetConnected ? "Join Sale" : "Connect wallet to Join"
     const CoinIcon = getIcon(cointypeIcon as CoinType);

     const projectData = getProjectData(decodeName);
     const SwiperImages  : string[] = projectData?.SwiperImagesFiles ?? [];

     const getProductInfo = (): { 
          title: string; 
          contents: string[]; 
          lists: { title: string; content: string }[] 
        } => {
          const product = projectData?.Description?.product;
        
          return {
            title: product?.title ?? "",
            // Guarantee it's always an array of strings
            contents: Array.isArray(product?.contents) ? (product.contents as string[]) : [],
            // Guarantee it's always an array of list objects
            lists: Array.isArray(product?.lists)
              ? (product.lists as { title: string; content: string }[])
              : [],
          };
        };


     const getHighlights = (): Highlight[] => {
          const highlights = projectData?.Description?.Highlights;

          return Array.isArray(highlights)
               ? highlights.map((item) => {
                    if (typeof item === "string") {
                    return { title: "", content: item };
               }
               if (typeof item === "object" && item !== null) {
                    return {
                         title: typeof item.title === "string" ? item.title : "",
                         content: typeof item.content === "string" ? item.content : "",
                    };
               }
               return { title: "", content: "" };
          })
          : [];
     };

     type NormalizedProblem = {
          title: string;
          contents: { title: string; content: string }[]; 
          list: { title: string; content: string }[];
          morecontent: string;
          bottomTitle: string;
        };
        
        const getProblem = (): NormalizedProblem => {
          const problem = projectData?.Description?.problem ?? {};
        
          // Helper to normalize either a string or an object into {title, content}
          const normalizeItem = (item: any): { title: string; content: string } => {
            if (typeof item === "string") {
              return { title: "", content: item };
            }
            if (item && typeof item === "object") {
              return {
                title: typeof item.title === "string" ? item.title : "",
                content: typeof item.content === "string" ? item.content : "",
              };
            }
            return { title: "", content: "" };
          };
        
          const contents = Array.isArray(problem.contents)
            ? problem.contents.map(normalizeItem)
            : [];
        
          const list = Array.isArray(problem.list)
            ? problem.list.map(normalizeItem)
            : [];
        
          return {
            title: typeof problem.title === "string" ? problem.title : "",
            contents,
            list,
            morecontent:
              typeof problem.morecontent === "string" ? problem.morecontent : "",
            bottomTitle:
              typeof problem.bottomTitle === "string" ? problem.bottomTitle : "",
          };
        };

        const getSolution= (): NormalizedProblem => {
          const solution = projectData?.Description?.solution ?? {};
        
          // Helper to normalize either a string or an object into {title, content}
          const normalizeItem = (item: any): { title: string; content: string } => {
            if (typeof item === "string") {
              return { title: "", content: item };
            }
            if (item && typeof item === "object") {
              return {
                title: typeof item.title === "string" ? item.title : "",
                content: typeof item.content === "string" ? item.content : "",
              };
            }
            return { title: "", content: "" };
          };
        
          const contents = Array.isArray(solution.contents)
            ? solution.contents.map(normalizeItem)
            : [];
        
          const list = Array.isArray(solution.list)
            ? solution.list.map(normalizeItem)
            : [];
        
          return {
            title: typeof solution.title === "string" ? solution.title : "",
            contents,
            list,
            morecontent:
              typeof solution.morecontent === "string" ? solution.morecontent : "",
            bottomTitle:
              typeof solution.bottomTitle === "string" ? solution.bottomTitle : "",
          };
        };

        const getMarket = (): NormalizedProblem => {
          const market = projectData?.Description?.market ?? {};
        
          // Helper to normalize either a string or an object into {title, content}
          const normalizeItem = (item: any): { title: string; content: string } => {
            if (typeof item === "string") {
              return { title: "", content: item };
            }
            if (item && typeof item === "object") {
              return {
                title: typeof item.title === "string" ? item.title : "",
                content: typeof item.content === "string" ? item.content : "",
              };
            }
            return { title: "", content: "" };
          };
        
          const contents = Array.isArray(market.contents)
            ? market.contents.map(normalizeItem)
            : [];
        
          const list = Array.isArray(market.list)
            ? market.list.map(normalizeItem)
            : [];
        
          return {
            title: typeof market.title === "string" ? market.title : "",
            contents,
            list,
            morecontent:
              typeof market.morecontent === "string" ? market.morecontent : "",
            bottomTitle:
              typeof market.bottomTitle === "string" ? market.bottomTitle : "",
          };
        };
        type investorprops = {
          title: string;
          contents: string;
          bottomTitle:string;
        }
        const getInvestors= (): investorprops => {
          const investor = projectData?.Description?.investors ?? {};
        
          return {
            title: typeof investor.title === "string" ? investor.title : "",
            contents: typeof investor.contents === "string" ? investor.contents : "",           
            
            bottomTitle: typeof investor.bottomTitle === "string" ? investor.bottomTitle : "",
          };
        };

        const getLink = (): { link: string | string[] } => {
          const link = projectData?.Description?.link;
          return {
            link: typeof link === "string" || Array.isArray(link) ? link : "",
          };
        };

        const getBusiness= (): NormalizedProblem => {
          const business = projectData?.Description?.Business ?? {};
        
          // Helper to normalize either a string or an object into {title, content}
          const normalizeItem = (item: any): { title: string; content: string } => {
            if (typeof item === "string") {
              return { title: "", content: item };
            }
            if (item && typeof item === "object") {
              return {
                title: typeof item.title === "string" ? item.title : "",
                content: typeof item.content === "string" ? item.content : "",
              };
            }
            return { title: "", content: "" };
          };
        
          const contents = Array.isArray(business.contents)
            ? business.contents.map(normalizeItem)
            : [];
        
          const list = Array.isArray(business.list)
            ? business.list.map(normalizeItem)
            : [];
        
          return {
            title: typeof business.title === "string" ? business.title : "",
            contents,
            list,
            morecontent:
              typeof business.morecontent === "string" ? business.morecontent : "",
            bottomTitle:
              typeof business.bottomTitle === "string" ? business.bottomTitle : "",
          };
        };
        const getTeam = (): NormalizedProblem => {
          const team = projectData?.Description?.team ?? {};
        
          // Helper to normalize either a string or an object into {title, content}
          const normalizeItem = (item: any): { title: string; content: string } => {
            if (typeof item === "string") {
              return { title: "", content: item };
            }
            if (item && typeof item === "object") {
              return {
                title: typeof item.title === "string" ? item.title : "",
                content: typeof item.content === "string" ? item.content : "",
              };
            }
            return { title: "", content: "" };
          };
        
          const contents = Array.isArray(team.contents)
            ? team.contents.map(normalizeItem)
            : [];
        
          const list = Array.isArray(team.list)
            ? team.list.map(normalizeItem)
            : [];
        
          return {
            title: typeof team.title === "string" ? team.title : "",
            contents,
            list,
            morecontent:
              typeof team.morecontent === "string" ? team.morecontent : "",
            bottomTitle:
              typeof team.bottomTitle === "string" ? team.bottomTitle : "",
          };
        };
        const getUtility = (): NormalizedProblem => {
          const utility = projectData?.Description?.tokenUtility ?? {};
        
          // Helper to normalize either a string or an object into {title, content}
          const normalizeItem = (item: any): { title: string; content: string } => {
            if (typeof item === "string") {
              return { title: "", content: item };
            }
            if (item && typeof item === "object") {
              return {
                title: typeof item.title === "string" ? item.title : "",
                content: typeof item.content === "string" ? item.content : "",
              };
            }
            return { title: "", content: "" };
          };
        
          const contents = Array.isArray(utility.contents)
            ? utility.contents.map(normalizeItem)
            : [];
        
          const list = Array.isArray(utility.list)
            ? utility.list.map(normalizeItem)
            : [];
        
          return {
            title: typeof utility.title === "string" ? utility.title : "",
            contents,
            list,
            morecontent:
              typeof utility.morecontent === "string" ? utility.morecontent : "",
            bottomTitle:
              typeof utility.bottomTitle === "string" ? utility.bottomTitle : "",
          };
        };

        type NormalizedTokenSaleItem = {
          key: string;
          value: string | { date?: string; time?: string };
        };
        
        const getTokenSale = (): NormalizedTokenSaleItem[] => {
          // Ensure projectData.TokenSale is always an object
          const tokenSale = projectData?.TokenSale ?? "";
        
          // Convert each key/value pair to a normalized format
          return Object.entries(tokenSale).map(([key, value]) => {
            if (typeof value === "string") {
              return { key, value };
            }
        
            if (value && typeof value === "object") {
              return { key, value: { date: value.date, time: value.time } };
            }
        
            return { key, value: "" };
          });
        };





     const fulldate =
          date && time ? `${date}, ${time} `:
          date ? date :
          time ? time :
          ""
     ;

     

     const DispalyProjectInfo = () => {
          switch (ActiveInfoTab) {
             case "Description":
               const highlights = getHighlights();
               const product = getProductInfo();
               const isDashList = decodeName === "Friendly Giant AI";
               const bullet = isDashList ? "–" : "•";
               const problem = getProblem();
               const solution = getSolution();
               const business = getBusiness();
               const market = getMarket();
               const investor = getInvestors();
               const team = getTeam();
               const utility = getUtility();
               const link = getLink();
            

               const socials = upcomingProjectSocials.map((social) => {
                    if (social.label === "link") {
                      return { ...social, href: link.link ? `https://${link.link}` : "" };
                    }
                    return social;
               });
               

               return (
                    <div className=' w-full py-8 h-full'>
                         {/* HIGHLIGHTS... */}
                         <div className='flex flex-col gap-4' data-slot="Higlights of different upcoming">
                              <div className='flex flex-row gap-2 w-full  items-center'>
                                   <h3 className='sm:text-[20px] text-[18px] leading-[0.4rem] text-[var(--type-6)] tracking-[0.6rem] uppercase font-[600]'>
                                        Highlights
                                    </h3>
                                    <hr className="flex-grow border-0 h-[1px] bg-[length:5px_1px] bg-repeat-x bg-[center] bg-[linear-gradient(90deg,rgba(0,187,255,0.6)_30%,rgba(255,255,255,0)_0px)]" />
                              </div>
                              <div className='flex flex-col gap-6 mt-4 '>
                              {(decodeName === "MemeMarket" || decodeName === "KeetaAI") && SwiperImages.length > 0 && (
                                   <div onClick={() => window.open(SwiperImages[0], "_blank", "noopener,noreferrer")} className='mt-8 px-2 cursor-zoom-in'>
                                        <Image
                                             src={SwiperImages[0]}
                                             alt={`${name} highlight start`}
                                             width={1000}
                                             height={1000}
                                             priority
                                             className='object-cover transition-transform duration-300'
                                        />
                                   </div>
                              )}
                                  {highlights.length > 0 ? (
                                        highlights.map((item, idx) => {
                                             const showBullet = decodeName === "Friendly Giant AI";
                                             const bulletChar = showBullet ? "–" : "";

                                                  return (
                                                       <div key={idx} className='flex flex-col gap-4'>
                                                            {item.title && (
                                                                 <p className={` font-bold text-[18px] sm:text-[21px] text-[var(--type-9)] leading-6 `}>
                                                                      {item.title}
                                                                 </p>
                                                            )}
                                                            {item.content && (
                                                                 <div className='flex items-start gap-2'>
                                                                      {showBullet && (
                                                                           <span className={ ` mt-1.5 text-[var(--type-8)] font-bold text-[15px] `}>
                                                                                {bulletChar}
                                                                           </span>
                                                                      )}
                                                                      <p className={` font-[600] text-[17px] sm:text-[19px] leading-8 text-[var(--type-8)] `}>
                                                                           {item.content}
                                                                      </p>
                                                                 </div>
                                                            )}
                                                       </div>
                                                  );
                                             })
                                             ) : (
                                                  <p className='text-[var(--type-3)]'>No highlights available.</p>
                                             )}
                                             {decodeName === "MemeMarket" && SwiperImages.length > 1 && (
                                                  <div onClick={() => window.open(SwiperImages[1], "_blank", "noopener,noreferrer")} className='w-full  relative mb-4 cursor-zoom-in group'>
                                                       <Image
                                                            src={SwiperImages[1]}
                                                            alt={`${name} highlight after start`}
                                                            width={1000}
                                                            height={1000}
                                                            priority
                                                            className='object-cover transition-transform duration-300'
                                                       />
                                                  </div>
                                             )}
                                        </div>

                              </div>
                         
                         {/* PRODUCTS... */}
                         <div className='mt-12 flex flex-col gap-6 ' data-slot="Product cases for the upcoming Projects">
                              <div className='flex flex-row gap-2 w-full  items-center'>
                                   <h3 className='sm:text-[20px] text-[18px] leading-[0.4rem] text-[var(--type-6)] tracking-[0.6rem] uppercase font-[600]'>
                                        PRODUCT
                                   </h3>
                                   <hr className="flex-grow border-0 h-[1px] bg-[length:5px_1px] bg-repeat-x bg-[center] bg-[linear-gradient(90deg,rgba(0,187,255,0.6)_30%,rgba(255,255,255,0)_0px)]" />
                              </div>
                              {decodeName === "Zesh AI Layer" && SwiperImages[1] && (
                                   <div  onClick={()=> window.open(SwiperImages[1], "_blank", "noopener,noreferrer")} className='w-full cursor-zoom-in  relative '>
                                        <Image
                                             src={SwiperImages[1]}
                                             alt={`${name} product image`}
                                             width={1000}
                                             height={1000}
                                             priority
                                             className='object-cover transition-transform duration-300'
                                        />
                                   </div>
                              )}

                              {product?.title  && (
                                   <h3 className='text-[36px] text-primary font-bold tracking-[-0.02rem] leading-tight'> {product.title}</h3>
                              )}
                               {decodeName === "KeetaAI" && SwiperImages[2] && (
                                   <div  onClick={()=> window.open(SwiperImages[2], "_blank", "noopener,noreferrer")} className='w-full  relative mb-4 cursor-zoom-in group'>
                                        <Image
                                             src={SwiperImages[2]}
                                             alt={`${name} product image`}
                                             width={1000}
                                             height={1000}
                                             priority
                                             className="object-center transition-transform duration-300"
                                          
                                        />
                                   </div>
                              )}
                              {product?.contents.map((content,idx) => (
                                   <p key={idx} className={` text-[var(--type-8)] font-[600] text-[17px] sm:text-[19px] leading-8`}>{content}</p>
                                   
                              ))}
                              {product?.lists.length > 0 && (
                                   <div className="flex flex-col gap-4">
                                        {product?.lists.map((item , idx) => {
                                               const showBullet = decodeName === "MemeMarket";
                                               const bulletChar = showBullet ? "•" :
                                                 decodeName === "KeetaAI" ? "–" :
                                                 decodeName === "Zesh AI Layer" ? "•" : "";

                                             return (
                                                  <div key={idx} className="flex items-start gap-2">
          
                                                  {bulletChar && (
                                                       <span
                                                       className={`mt-0.5 text-[var(--type-8)] font-bold text-[15px] `}
                                                       >
                                                       {bulletChar}
                                                       </span>
                                                  )}

                                                  <div className="flex flex-col gap-0.5">
           
                                                       {item.title && (
                                                            <p className={` font-bold text-[17px] sm:text-[19px] text-[var(--type-9)] `}>
                                                                 {item.title}
                                                            </p>
                                                       )}
            
                                                       {item.content && (
                                                            <p className="font-[600] text-[17px] sm:text-[19px] leading-8 text-[var(--type-8)]">
                                                                 {item.content}
                                                            </p>
                                                       )}
                                                  </div>
                                             </div>
                                        );
                                   })}
                                  
                                   
                              </div>


                         )}
                         <div></div> 
                          {((decodeName === "Zesh AI Layer" && SwiperImages[2]) ||
                              (decodeName === "Friendly Giant AI" && SwiperImages[1])) && (
                              <div
                              onClick={() =>
                                   window.open(
                                   decodeName === "Friendly Giant AI"
                                        ? SwiperImages[1]
                                        : SwiperImages[2],
                                   "_blank",
                                   "noopener,noreferrer"
                                   )
                              }
                              className="w-full cursor-zoom-in "
                              >
                              <Image
                                   src={
                                   decodeName === "Friendly Giant AI"
                                        ? SwiperImages[1]
                                        : SwiperImages[2]
                                   }
                                   alt={`${name} product image`}
                                   width={1000}
                                   height={1000}
                                   priority
                                   className="object-center transition-transform duration-300"
                              />
                              </div>
                              )}
       
                         </div>
                         {/* Problem section */}
                         <div className='mt-12 flex flex-col gap-8 ' data-slot="Problem  section for the upcoming Projects">
                              <div className='flex flex-row gap-2 w-full  items-center'>
                                   <h3 className='sm:text-[20px] text-[18px] leading-[0.4rem] text-[var(--type-6)] tracking-[0.6rem] uppercase font-[600]'>
                                        PROBLEM
                                    </h3>
                                    <hr className="flex-grow border-0 h-[1px] bg-[length:5px_1px] bg-repeat-x bg-[center] bg-[linear-gradient(90deg,rgba(0,187,255,0.6)_30%,rgba(255,255,255,0)_0px)]" />
                              </div>
                              {decodeName === "MemeMarket" && SwiperImages[2] && (
                                   <div  onClick={()=> window.open(SwiperImages[1], "_blank", "noopener,noreferrer")} className='w-full cursor-zoom-in md:w-full h-110 relative '>
                                        <Image
                                             src={SwiperImages[3]}
                                             alt={`${name} product image`}
                                             fill
                                             priority
                                             className='object-left transition-transform duration-300'
                                        />
                                   </div>
                              )}
                              {problem.title  && (
                                   <h3 className='text-[30px] text-primary font-bold tracking-[-0.02rem] leading-tight'> {problem.title}</h3>
                              )}
                              {/* problem Blcok */}
                              {problem?.contents.map((item, idx) => {
   
                                   const contentItem =
                                        typeof item === "string"
                                        ? { title: "", content: item }
                                        : { title: item?.title ?? "", content: item?.content ?? "" };

                                   return (
                                        <div key={idx} className="flex flex-col gap-1">
                                        {contentItem.title && (
                                             <p className="font-bold text-[17px] sm:text-[19px]  text-[var(--type-9)]">
                                             {contentItem.title}
                                             </p>
                                        )}
                                        {contentItem.content && (
                                             <p className="font-[600] text-[17px] sm:text-[19px] leading-8  text-[var(--type-8)]">
                                                  {contentItem.content}
                                             </p>
                                        )}
                                        </div>
                                   );
                              })}
                              {/*  Problem Lists Block*/}
                              {problem?.list?.length > 0 && (
                                   <div className=" mt- flex flex-col gap-4">
                                        {problem.list.map((item, idx) => (
                                             <div key={idx} className="flex items-start gap-2">
                                                  <span className="mt-0.5 font-bold text-[19px] text-[var(--type-9)]">•</span>
                                                  <div className="flex flex-col gap-0.5">
                                                  {item.title ? (
                                                       <p className="font-bold text-[17px] sm:text-[19px]  text-[var(--type-9)]">
                                                            {item.title}
                                                       </p>
                                                  ) :(
                                                       null
                                                  )}
                                                  {item.content && (
                                                       <p className="font-[600] text-[17px] sm:text-[19px] leading-8 text-[var(--type-8)]">
                                                            {item.content}
                                                       </p>
                                                  )}
                                             
                                              

                                             </div>
                                        </div>
                                        ))}
                                   </div>
                              )}
                              {problem.morecontent && (
                                   <p className="font-[600] text-[17px] sm:text-[19px] leading-8  text-[var(--type-8)]">
                                        {problem.morecontent}
                                   </p>
                              )}
                              {problem.bottomTitle && (
                                   <h3 className="font-bold text-[36px] sm:text-[36px] leading-12 ">
                                        {problem.bottomTitle}
                                   </h3>
                              )}
                         </div>
                          {/* Solution section */}
                          <div className='mt-12 flex flex-col gap-8 ' data-slot="Product cases for the upcoming Projects">
                              <div className='flex flex-row gap-2 w-full  items-center'>
                                   <h3 className=' sm:text-[20px] text-[18px] leading-[0.4rem] text-[var(--type-6)] tracking-[0.6rem] uppercase font-[600]'>
                                       Solution
                                    </h3>
                                    <hr className="flex-grow border-0 h-[1px] bg-[length:5px_1px] bg-repeat-x bg-[center] bg-[linear-gradient(90deg,rgba(0,187,255,0.6)_30%,rgba(255,255,255,0)_0px)]" />
                              </div>
                              {decodeName === "MemeMarket" && SwiperImages[4] && (
                                   <div  onClick={()=> window.open(SwiperImages[4], "_blank", "noopener,noreferrer")} className='w-full cursor-zoom-in  relative '>
                                        <Image
                                             src={SwiperImages[4]}
                                             alt={`${name} product image`}
                                             width={1000}
                                             height={1000}
                                             priority
                                             className='object-cover transition-transform duration-300'
                                        />
                                   </div>
                              )}
                              {solution.title  && (
                                   <h3 className='text-[32px] text-primary font-bold tracking-[-0.02rem] leading-tight'> {solution.title}</h3>
                              )}
                               {solution?.contents.map((item, idx) => {
   
                                   const contentItem =
                                        typeof item === "string"
                                        ? { title: "", content: item }
                                        : { title: item?.title ?? "", content: item?.content ?? "" };

                                   return (
                                        <div key={idx} className="flex flex-col gap-1 -mt-3">
                                        {contentItem.title && (
                                             <p className="font-bold text-[17px] sm:text-[19px] text-[var(--type-9)]">
                                             {contentItem.title}
                                             </p>
                                        )}
                                        {contentItem.content && (
                                             <p className="font-[600] text-[17px] sm:text-[19px] leading-9 text-[var(--type-8)]">
                                                  {contentItem.content}
                                             </p>
                                        )}
                                        </div>
                                   );
                              })}
                              {solution?.list?.length > 0 && (
                                   <div className=" mt- flex flex-col gap-4">
                                        {solution.list.map((item, idx) => (
                                             <div key={idx} className="flex items-start gap-2">
                                                  <span className="mt-0.5 font-bold text-[19px] text-[var(--type-9)]">•</span>
                                                  <div className="flex flex-col gap-0.5">
                                                  {item.title ? (
                                                       <p className="font-bold text-[17px] sm:text-[19px] text-[var(--type-9)]">
                                                            {item.title}
                                                       </p>
                                                  ) :(
                                                       null
                                                  )}
                                                  {item.content && (
                                                       <p className="font-[600] text-[17px] sm:text-[19px] leading-8  text-[var(--type-8)]">
                                                            {item.content}
                                                       </p>
                                                  )}
                                             
                                              

                                             </div>
                                        </div>
                              ))}
                                   </div>
                              )}
                              {solution.morecontent && (
                                   <p className="font-[600] text-[17px] sm:text-[19px] leading-8 text-[var(--type-8)]">
                                        {solution.morecontent}
                                   </p>
                              )}
                              {(
                              (decodeName === "MemeMarket" && SwiperImages[5]) ||
                              (decodeName === "Zesh AI Layer" && SwiperImages[3]) ||
                              (decodeName === "Friendly Giant AI" && SwiperImages[2])
                              ) && (
                              <div
                              onClick={() =>
                                   window.open(
                                   decodeName === "MemeMarket"
                                        ? SwiperImages[5]
                                        : decodeName === "Zesh AI Layer"
                                        ? SwiperImages[3]
                                        : SwiperImages[2],
                                   "_blank",
                                   "noopener,noreferrer"
                                   )
                              }
                              className="w-full cursor-zoom-in  "
                              >
                              <Image
                                   src={
                                   decodeName === "MemeMarket"
                                        ? SwiperImages[5]
                                        : decodeName === "Zesh AI Layer"
                                        ? SwiperImages[3]
                                        : SwiperImages[2]
                                   }
                                   alt={`${name} problem image`}
                                   width={800}
                                   height={500}
                                   priority
                                   className="object-center"
                              />
                              </div>
                              )}
                              {solution.bottomTitle && (
                                   <h3 className=" font-bold text-[36px] sm:text-[36px] leading-12">
                                        {solution.bottomTitle}
                                   </h3>
                              )}
                              
                         </div>

                         {/* Business Model */}
                         <div className='mt-14 flex flex-col gap-8 ' data-slot="Business Model for the upcoming Projects">
                              <div className='flex flex-row gap-2 w-full  items-center'>
                                   <h3 className=' sm:text-[20px] text-[18px] leading-[0.4rem] text-[var(--type-6)] tracking-[0.6rem] uppercase font-[600]'>
                                       Business Model
                                    </h3>
                                    <hr className="flex-grow border-0 h-[1px] bg-[length:5px_1px] bg-repeat-x bg-[center] bg-[linear-gradient(90deg,rgba(0,187,255,0.6)_30%,rgba(255,255,255,0)_0px)]" />
                              </div>
                              {decodeName === "MemeMarket" && SwiperImages[6] && (
                                   <div   onClick={()=> window.open(SwiperImages[5], "_blank", "noopener,noreferrer")} className='w-full cursor-zoom-in relative overflow-hidden '>
                                        <Image
                                             src={SwiperImages[6]}
                                             alt={`${name} product image`}
                                             width={1000}
                                             height={1000}
                                             priority
                                             className='object-center transition-transform duration-300'
                                        />
                                   </div>
                              )}
                              {decodeName === "MemeMarket" && SwiperImages[7] && (
                                   <div  onClick={()=> window.open(SwiperImages[6], "_blank", "noopener,noreferrer")} className='w-full cursor-zoom-in  relative overflow-hidden'>
                                        <Image
                                             src={SwiperImages[7]}
                                             alt={`${name} product image`}
                                             width={1000}
                                             height={1000}
                                             priority
                                             className='object-center transition-transform duration-300'
                                        />
                                   </div>
                              )}
                              {business.title  && (
                                   <h3 className='text-[30px] text-primary font-bold tracking-[-0.02rem] leading-tight'> {business.title}</h3>
                              )}
                               {business?.contents.map((item, idx) => {
   
                                   const contentItem =
                                        typeof item === "string"
                                        ? { title: "", content: item }
                                        : { title: item?.title ?? "", content: item?.content ?? "" };

                                   return (
                                        <div key={idx} className="flex flex-col gap-1 ">
                                        {contentItem.title && (
                                             <p className="font-bold text-[17px] sm:text-[19px] text-[var(--type-9)]">
                                             {contentItem.title}
                                             </p>
                                        )}
                                        {contentItem.content && (
                                             <p className="font-[600] text-[17px] sm:text-[19px] leading-9 text-[var(--type-8)]">
                                                  {contentItem.content}
                                             </p>
                                        )}
                                        </div>
                                   );
                              })}
                              {business?.list?.length > 0 && (
                                   <div className=" mt- flex flex-col gap-4">
                                        {business.list.map((item, idx) => (
                                             <div key={idx} className="flex items-start gap-2">
                                                  <span className="mt-0.5 font-bold text-[19px] text-[var(--type-9)]">•</span>
                                                  <div className="flex flex-col gap-0.5">
                                                  {item.title ? (
                                                       <p className="font-bold text-[17px] sm:text-[19px] text-[var(--type-9)]">
                                                            {item.title}
                                                       </p>
                                                  ) :(
                                                       null
                                                  )}
                                                  {item.content && (
                                                       <p className="font-[600] text-[17px] sm:text-[19px] leading-8 text-[var(--type-8)]">
                                                            {item.content}
                                                       </p>
                                                  )}
                                             
                                              

                                             </div>
                                        </div>
                              ))}
                                   </div>
                              )}
                              {business.morecontent && (
                                   <p className="font-[600] text-[17px] sm:text-[19px] leading-8 text-[var(--type-8)]">
                                        {business.morecontent}
                                   </p>
                              )}
                              {business.bottomTitle && (
                                   <h3 className="font-bold text-[38px] sm:text-[36px] leading-12 ">
                                        {business.bottomTitle}
                                   </h3>
                              )}
                         </div>
                         {/* Market Section */}
                         <div className='mt-14 flex flex-col gap-8 ' data-slot="Business Model for the upcoming Projects">
                              <div className='flex flex-row gap-2 w-full  items-center'>
                                   <h3 className=' sm:text-[20px] text-[18px] leading-[0.4rem] text-[var(--type-6)] tracking-[0.6rem] uppercase font-[600]'>
                                       Market 
                                    </h3>
                                    <hr className="flex-grow border-0 h-[1px] bg-[length:5px_1px] bg-repeat-x bg-[center] bg-[linear-gradient(90deg,rgba(0,187,255,0.6)_30%,rgba(255,255,255,0)_0px)]" />
                              </div>
                              {decodeName === "MemeMarket" && SwiperImages[3] && (
                                   <div   onClick={()=> window.open(SwiperImages[3], "_blank", "noopener,noreferrer")} className='w-full cursor-zoom-in  relative overflow-hidden '>
                                        <Image
                                             src={SwiperImages[3]}
                                             alt={`${name} product image`}
                                             width={1000}
                                             height={1000}
                                             className='object-center '
                                        />
                                   </div>
                              )}
                              {decodeName === "MemeMarket" && SwiperImages[8] && (
                                   <div  onClick={()=> window.open(SwiperImages[6], "_blank", "noopener,noreferrer")} className=' cursor-zoom-in relative overflow-hidden'>
                                        <Image
                                             src={SwiperImages[8]}
                                             alt={`${name} product image`}
                                             width={1000}
                                             height={1000}
                                             className='object-center'
                                        />
                                   </div>
                              )}
                              {market.title  && (
                                   <h3 className='text-[30px] text-primary font-bold tracking-[-0.02rem] leading-tight'> {market.title}</h3>
                              )}
                              {market?.contents.map((item, idx) => {
   
                                   const contentItem =
                                        typeof item === "string"
                                        ? { title: "", content: item }
                                        : { title: item?.title ?? "", content: item?.content ?? "" };

                                   return (
                                        <div key={idx} className="flex flex-col gap-1 ">
                                        {contentItem.title && (
                                             <p className="font-bold text-[17px] sm:text-[19px] text-[var(--type-9)]">
                                             {contentItem.title}
                                             </p>
                                        )}
                                        {contentItem.content && (
                                             <p className="font-[600] text-[17px] sm:text-[19px] leading-9 text-[var(--type-8)]">
                                                  {contentItem.content}
                                             </p>
                                        )}
                                        </div>
                                   );
                              })}
                               {market?.list?.length > 0 && (
                                   <div className=" mt- flex flex-col gap-4">
                                        {market.list.map((item, idx) => (
                                             <div key={idx} className="flex items-start gap-2">
                                                  <span className="mt-0.5 font-bold text-[18px] text-[var(--type-9)] ">•</span>
                                                  <div className="flex flex-col gap-0.5">
                                                  {item.title ? (
                                                       <p className="font-bold text-[17px] sm:text-[19px] text-[var(--type-9)]">
                                                            {item.title}
                                                       </p>
                                                  ) :(
                                                       null
                                                  )}
                                                  {item.content && (
                                                       <p className="font-[600] text-[17px] sm:text-[19px] leading-8 text-[var(--type-8)]">
                                                            {item.content}
                                                       </p>
                                                  )}
                                             
                                              

                                             </div>
                                        </div>
                              ))}
                                   </div>
                              )}
                               {market.morecontent && (
                                   <p className="font-[600] text-[17px] sm:text-[19px] leading-8 text-[var(--type-8)]">
                                        {business.morecontent}
                                   </p>
                              )}
                              {market.bottomTitle && (
                                   <h3 className="font-bold text-[24px] sm:text-[24px] leading-8 tracking-[-0.02rem]">
                                        {market.bottomTitle}
                                   </h3>
                              )}

                              {decodeName === "Friendly Giant AI" && SwiperImages[3] && (
                                   <div  onClick={()=> window.open(SwiperImages[3], "_blank", "noopener,noreferrer")} className=' cursor-zoom-in  relative overflow-hidden'>
                                        <Image
                                             src={SwiperImages[3]}
                                             alt={`${name} product image`}
                                             width={1000}
                                             height={1000}
                                             className='object-center'
                                        />
                                   </div>
                              )}   
                              
                         </div>
                         {/* Investor Section */}
                         <div className='mt-14 flex flex-col gap-8 ' data-slot="Business Model for the upcoming Projects">
                              <div className='flex flex-row gap-2 w-full  items-center'>
                                   <h3 className=' sm:text-[20px] text-[18px] leading-[0.4rem] text-[var(--type-6)] tracking-[0.6rem] uppercase font-[600]'>
                                       Investors
                                    </h3>
                                    <hr className="flex-grow border-0 h-[1px] bg-[length:5px_1px] bg-repeat-x bg-[center] bg-[linear-gradient(90deg,rgba(0,187,255,0.6)_30%,rgba(255,255,255,0)_0px)]" />
                              </div>
                              {decodeName === "MemeMarket" && SwiperImages[9] && (
                                   <div  onClick={()=> window.open(SwiperImages[9], "_blank", "noopener,noreferrer")} className=' cursor-zoom-in  relative overflow-hidden'>
                                        <Image
                                             src={SwiperImages[9]}
                                             alt={`${name} product image`}
                                             width={1000}
                                             height={1000}
                                             className='object-center'
                                        />
                                   </div>
                              )}
                              {investor.title  && (
                                   <h3 className='text-[26px] text-primary font-bold tracking-[-0.02rem] leading-tight'> {investor.title}</h3>
                              )}
                              {investor.contents && (
                                   <p className="font-[600] text-[17px] sm:text-[19px] leading-8  text-[var(--type-8)]">
                                        {investor.contents}
                                   </p>
                              )}
                               {investor.bottomTitle && (
                                   <h3 className="font-bold text-[32px] sm:text-[36px] leading-12 tracking-[-0.02rem] ">
                                        {investor.bottomTitle}
                                   </h3>
                              )}
                              {decodeName === "Friendly Giant AI" && SwiperImages[4] && (
                                   <div  onClick={()=> window.open(SwiperImages[3], "_blank", "noopener,noreferrer")} className=' cursor-zoom-in relative overflow-hidden'>
                                        <Image
                                             src={SwiperImages[4]}
                                             alt={`${name} product image`}
                                             width={1000}
                                             height={1000}
                                             className='object-center'
                                        />
                                   </div>
                              )}   
                               
                         </div>
                          {/* Team  Section */}
                          <div className='mt-14 flex flex-col gap-8 ' data-slot="Business Model for the upcoming Projects">
                              <div className='flex flex-row gap-2 w-full  items-center'>
                                   <h3 className=' sm:text-[20px] text-[18px] leading-[0.4rem] text-[var(--type-6)] tracking-[0.6rem] uppercase font-[600]'>
                                       Team
                                    </h3>
                                    <hr className="flex-grow border-0 h-[1px] bg-[length:5px_1px] bg-repeat-x bg-[center] bg-[linear-gradient(90deg,rgba(0,187,255,0.6)_30%,rgba(255,255,255,0)_0px)]" />
                              </div>
                              {decodeName === "MemeMarket" && SwiperImages[10] && (
                                   <div  onClick={()=> window.open(SwiperImages[10], "_blank", "noopener,noreferrer")} className=' cursor-zoom-in  overflow-hidden'>
                                        <Image
                                             src={SwiperImages[10]}
                                             alt={`${name} product image`}
                                             width={1000}
                                             height={1000}
                                             className='object-center'
                                        />
                                   </div>
                              )}
                               {decodeName === "MemeMarket" && SwiperImages[11] && (
                                   <div  onClick={()=> window.open(SwiperImages[11], "_blank", "noopener,noreferrer")} className=' cursor-zoom-in relative overflow-hidden'>
                                        <Image
                                             src={SwiperImages[11]}
                                             alt={`${name} product image`}
                                             width={1000}
                                             height={1000}
                                             className='object-center'
                                        />
                                   </div>
                              )}
                                {team.title  && (
                                   <h3 className='text-[30px] text-primary font-bold tracking-[-0.02rem] leading-tight'> {team.title}</h3>
                              )}
                               {team?.contents.map((item, idx) => {
   
                                   const contentItem =
                                        typeof item === "string"
                                        ? { title: "", content: item }
                                        : { title: item?.title ?? "", content: item?.content ?? "" };

                                   return (
                                        <div key={idx} className="flex flex-col gap-1 ">
                                        {contentItem.title && (
                                             <p className="font-bold text-[17px] sm:text-[19px] text-[var(--type-9)]">
                                             {contentItem.title}
                                             </p>
                                        )}
                                        {contentItem.content && (
                                             <p className="font-[600] text-[17px] sm:text-[19px] leading-9 text-[var(--type-8)]">
                                                  {contentItem.content}
                                             </p>
                                        )}
                                        </div>
                                   );
                              })}
                              {team?.list?.length > 0 && (
                                   <div className=" mt- flex flex-col gap-4">
                                        {team.list.map((item, idx) => (
                                             <div key={idx} className="flex items-start gap-2">
                                                  <span className="mt-0.5 font-bold text-[19px] text-[var(--type-9)]">•</span>
                                                  <div className="flex flex-col gap-0.5">
                                                  {item.title ? (
                                                       <p className="font-bold text-[17px] sm:text-[19px] text-[var(--type-9)]">
                                                            {item.title}
                                                       </p>
                                                  ) :(
                                                       null
                                                  )}
                                                  {item.content && (
                                                       <p className="font-[600] text-[17px] sm:text-[19px] leading-8 text-[var(--type-8)]">
                                                            {item.content}
                                                       </p>
                                                  )}
                                             
                                              

                                             </div>
                                        </div>
                              ))}
                                   </div>
                              )}
                               {team.morecontent && (
                                   <p className="font-[600] text-[17px] sm:text-[19px] leading-8 text-[var(--type-8)]">
                                        {team.morecontent}
                                   </p>
                              )}
                              {team.bottomTitle && (
                                   <h3 className="font-bold text-[24px] sm:text-[24px] leading-8 tracking-[-0.02rem]">
                                        {team.bottomTitle}
                                   </h3>
                              )}
                              {decodeName === "Friendly Giant AI" && SwiperImages[5] && (
                                   <div  onClick={()=> window.open(SwiperImages[5], "_blank", "noopener,noreferrer")} className=' cursor-zoom-in w-full relative overflow-hidden'>
                                        <Image
                                             src={SwiperImages[5]}
                                             alt={`${name} product image`}
                                             width={1000}
                                             height={1000}
                                             priority
                                             className='object-center'
                                        />
                                   </div>
                              )}   
                         </div>
                         <div className='mt-10 flex flex-col gap-8 ' data-slot="Business Model for the upcoming Projects">
                              <div className='flex flex-row gap-2 w-full  items-center'>
                                   <h3 className=' sm:text-[20px] text-[18px] leading-[0.4rem] text-[var(--type-6)] tracking-[0.6rem] uppercase font-[600]'>
                                       Token utility
                                    </h3>
                                    <hr className="flex-grow border-0 h-[1px] bg-[length:5px_1px] bg-repeat-x bg-[center] bg-[linear-gradient(90deg,rgba(0,187,255,0.6)_30%,rgba(255,255,255,0)_0px)]" />
                              </div>
                              {decodeName === "MemeMarket" && SwiperImages[12] && (
                                   <div  onClick={()=> window.open(SwiperImages[12], "_blank", "noopener,noreferrer")} className=' cursor-zoom-in relative overflow-hidden'>
                                        <Image
                                             src={SwiperImages[12]}
                                             alt={`${name} product image`}
                                             width={1000}
                                             height={1000}
                                             priority
                                             className='object-center'
                                        />
                                   </div>
                              )}
                               {decodeName === "MemeMarket" && SwiperImages[13] && (
                                   <div  onClick={()=> window.open(SwiperImages[13], "_blank", "noopener,noreferrer")} className=' cursor-zoom-in relative overflow-hidden'>
                                        <Image
                                             src={SwiperImages[13]}
                                             alt={`${name} product image`}
                                             width={1000}
                                             height={1000}
                                             priority
                                             className='object-center'
                                        />
                                   </div>
                              )}
                              {utility.title  && (
                                   <h3 className='text-[30px] text-primary font-bold tracking-[-0.02rem] leading-tight'> {utility.title}</h3>
                              )}
                               {utility?.contents.map((item, idx) => {
   
                                   const contentItem =
                                        typeof item === "string"
                                        ? { title: "", content: item }
                                        : { title: item?.title ?? "", content: item?.content ?? "" };

                                   return (
                                        <div key={idx} className="flex flex-col gap-1 ">
                                        {contentItem.title && (
                                             <p className="font-bold text-[17px] sm:text-[19px] text-[var(--type-9)]">
                                             {contentItem.title}
                                             </p>
                                        )}
                                        {contentItem.content && (
                                             <p className="font-[600] text-[17px] sm:text-[19px] leading-9  text-[var(--type-8)]">
                                                  {contentItem.content}
                                             </p>
                                        )}
                                        </div>
                                   );
                              })}
                               {utility?.list?.length > 0 && (
                                   <div className=" mt- flex flex-col gap-4">
                                        {utility.list.map((item, idx) => (
                                             <div key={idx} className="flex items-start gap-2">
                                                  <span className="mt-0.5 font-bold text-[19px] text-[var(--type-9)]">
                                                       {decodeName === "KeetaAI" ? "–" : "•"}
                                                  </span>
                                                  <div className="flex flex-col gap-0.5">
                                                  {item.title ? (
                                                       <p className="font-bold text-[17px] sm:text-[19px] text-[var(--type-9)]">
                                                            {item.title}
                                                       </p>
                                                  ) :(
                                                       null
                                                  )}
                                                  {item.content && (
                                                       <p className="font-[600] text-[17px] sm:text-[19px] leading-8 text-[var(--type-8)]">
                                                            {item.content}
                                                       </p>
                                                  )}
                                             
                                              

                                             </div>
                                        </div>
                              ))}
                                   </div>
                              )}
                               {utility.morecontent && (
                                   <p className="font-[600] text-[17px] sm:text-[19px] leading-8 text-[var(--type-8)]">
                                        {team.morecontent}
                                   </p>
                              )}
                               {utility.bottomTitle && (
                                   <h3 className="font-bold text-[24px] sm:text-[24px] leading-8 tracking-[-0.02rem]">
                                        {utility.bottomTitle}
                                   </h3>
                              )}
                              {(
                              (decodeName === "MemeMarket" && SwiperImages[14]) ||
                              (decodeName === "Zesh AI Layer" && SwiperImages[6]) ||
                              (decodeName === "Friendly Giant AI" && SwiperImages[6]) ||
                              (decodeName === "KeetaAI" && SwiperImages[4])
                              ) && (
                              <div
                                   onClick={() =>
                                        window.open(
                                        decodeName === "MemeMarket"
                                             ? SwiperImages[14]
                                             : decodeName === "Zesh AI Layer"
                                             ? SwiperImages[6]
                                             : decodeName === "Friendly Giant AI"
                                             ? SwiperImages[6]
                                             : SwiperImages[4],
                                        "_blank",
                                        "noopener,noreferrer"
                                        )
                                   }
                                   className="w-full cursor-zoom-in  relative overflow-hidden"
                              >
                                   <Image
                                        src={
                                        decodeName === "MemeMarket"
                                             ? SwiperImages[14]
                                             : decodeName === "Zesh AI Layer"
                                             ? SwiperImages[6]
                                             : decodeName === "Friendly Giant AI"
                                             ? SwiperImages[6]
                                             : SwiperImages[4] 
                                        }
                                        alt={`${name} token utility image`}
                                        width={1000}
                                        height={1000}
                                        priority
                                        className="object-center transition-transform duration-300"
                                   />
                              </div>
                          )}
                         </div>
                         <div className='mt-14 flex flex-col gap-8 ' data-slot="Business Model for the upcoming Projects">
                              <div className='flex flex-row gap-2 w-full  items-center'>
                                   <h3 className=' whitespace-normal break-words  sm:text-[20px] text-[18px] leading-8 text-[var(--type-6)] tracking-[0.4rem] sm:tracking-[0.7rem] uppercase font-[600]'>
                                       {` about ${decodeName}`}
                                    </h3>
                                    <hr className="flex-grow border-0 h-[1px] bg-[length:5px_1px] bg-repeat-x bg-[center] bg-[linear-gradient(90deg,rgba(0,187,255,0.6)_30%,rgba(255,255,255,0)_0px)]" />
                              </div>
                              <div className="flex flex-col gap-4">
  {/* Small screens */}
                                   <div className="flex flex-col  [@media(min-width:500px)]:hidden gap-4 px-2">
                                   {/* First row: Website | Image */}
                                   <div className="flex flex-row justify-between items-center">
                                        {/* Website */}
                                        <div className="flex flex-col">
                                        <span className="text-[var(--type-4)] text-[18px] font-[600]">Website</span>
                                        {link && (
                                             <a
                                             href={`https://${link}`}
                                             target="_blank"
                                             rel="noopener noreferrer"
                                             className="text-[var(--type-6)] cursor-pointer font-[600] text-[16px] hover:opacity-70"
                                             >
                                             {link.link}
                                             </a>
                                        )}
                                        </div>

                                        {/* Image */}
                                        <div className="flex justify-end">
                                        <Image
                                             width={100}
                                             height={80}
                                             alt={name}
                                             src={icon}
                                             className="w-24 h-24 object-cover rounded-full"
                                        />
                                        </div>
                                   </div>

                                        {/* Second row: Documents */}
                                        <div className="flex flex-col">
                                             <span className="text-[var(--type-4)] text-[18px] font-[600]">Documents</span>
                                             <a
                                             href="/projects/"
                                             target="_blank"
                                             rel="noopener noreferrer"
                                             className="capitalize text-[var(--type-6)] cursor-pointer font-[600] text-[17px] hover:opacity-70"
                                             >
                                             Whitepaper
                                             </a>
                                        </div>
                                        </div>

                                        {/* Medium+ screens */}
                                        <div className="hidden   [@media(min-width:500px)]:flex [@media(min-width:500px)]:flex-row  [@media(min-width:500px)]:justify-between [@media(min-width:500px)]:gap-6 px-2">
                                        {/* Website */}
                                        <div className="flex flex-col md:flex-1">
                                             <span className="text-[var(--type-4)] text-[18px] font-[600]">Website</span>
                                             {link && (
                                             <a
                                                  href={`https://${link}`}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="text-[var(--type-6)] cursor-pointer font-[600] text-[16px] hover:opacity-70"
                                             >
                                                  {link.link}
                                             </a>
                                             )}
                                        </div>

                                        {/* Documents */}
                                        <div className="flex flex-col md:flex-1">
                                             <span className="text-[var(--type-4)] text-[18px] font-[600]">Documents</span>
                                             <a
                                             href="/projects/"
                                             target="_blank"
                                             rel="noopener noreferrer"
                                             className="capitalize text-[var(--type-6)] cursor-pointer font-[600] text-[17px] hover:opacity-70"
                                             >
                                             Whitepaper
                                             </a>
                                        </div>

                                        {/* Image */}
                                        <div className="flex justify-center md:justify-end md:flex-1">
                                             <Image
                                             width={100}
                                             height={80}
                                             alt={name}
                                             src={icon}
                                             className="w-24 h-24 object-cover rounded-full"
                                             />
                                        </div>
                                        </div>

                                        {/* Social Media always last */}
                                        <div className="flex flex-col gap-2 px-2 mt-4">
                                        <span className="text-[var(--type-4)] text-[18px] font-[600]">Social Media</span>
                                        <div className="flex flex-row gap-2 items-center">
                                             {socials.map(({ label, icon: Icon, href }) => (
                                             <a
                                                  key={label}
                                                  href={href}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="px-1 text-[var(--text-muted)] hover:text-[color:var(--link-hover)]"
                                             >
                                                  <Icon className="size-5" />
                                             </a>
                                             ))}
                                        </div>
                                        </div>
                                        </div>
                                   </div>

                    </div>
                   
               );
               case "Token Sale":
                    const tokenSaleItems = getTokenSale();
                    return (
                         <div className={` h-auto ${resolvedTheme === "dark" ? "bg-[#18181b]" : "bg-[#fff]" } rounded-lg border w-full  overflow-hidden`}>
                              <div className={`  border-b   px-4 py-3 ${resolvedTheme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
                                   <span className="text-[var(--type-4)] text-[14px] font-[600] "> Token sale</span>
                              </div>
                              <div className=' w-full flex flex-col '>
                              {tokenSaleItems.length > 0 && tokenSaleItems.map((item, idx) => (
                                   <div key={idx} className="flex px-4 h-20 justify-between items-center border-b last:border-b-0">
                                        {/* Left side: key */}
                                        <span className="font-[600] text-[var(--type-2)] text-[17px]">{item.key}</span>      
                                        <span className=" text-right text-primary text-[17px] font-[600]">
                                             {typeof item.value === "string"
                                             ? item.value
                                             : (
                                                  <>
                                                  <div className='text-primary text-[17px] font-[600]'>{item.value.date ?? ""}</div>
                                                  <div className="text-[var(--type-2)] text-[14px] font-[600]">{item.value.time ?? ""}</div>
                                                  </>
                                             )}
                                        </span>
                                   </div>
                                   ))}
                                        
                                   </div>
                         </div>
                    );   
          }
     }
   
    return (
     <div className='py-8 relative min-h-full '>
           {resolvedTheme === 'dark'  && backgroundImage && (
                    <div
                    className="absolute -top-8 inset-0 h-[450px] bg-cover bg-no-repeat bg-center z-0"
                    style={{
                      backgroundImage: `linear-gradient(0deg, rgb(9,9,11), rgba(9,9,11,0.6)), url(${backgroundImage})`,
                     
                      filter: "blur(10px) brightness(1.2) saturate(2)",
                      display: "initial",
                      left: 0,
                      right: 0,
                    
                    }}
                  />
                
          )}
          
          <div className='pt-12 px-4 md:px-8 relative z-[1]'>
              
               <div className='mt-4 w-full flex  flex-col gap-4 gap-y-2 md:justify-between md:flex-row'>
                    <div className='flex flex-row gap-2 items-center justify-start [@media(max-width:600px)]:justify-center '>
                         <Link  href="/projects" className="capitalize font-[600] text-[16px] border-none transition-colors duration-300 opacity-70 text-[var(--type-2)] hover:text-primary cursor-pointer ">
                              Projects 
                         </Link>
                         <ChevronRight strokeWidth={2}  className='size-4 text-[var(--type-2)] opacity-70'/>
                         <span className='text-primary text-[16px] capitalize font-[600]'> {name} </span>   
                    </div>
                    <div className="flex flex-col md:flex-row gap-1.5 gap-y-4 items-center text-center lg:justify-end justify-center">
                         <div className="flex flex-row gap-1.5 items-center justify-center">
                              <p className="text-[rgb(161,161,170)] text-[15px] font-[600]">
                                   {dateStatement}
                              </p>
                              <p className="text-primary text-[15px] font-[400] capitalize">
                                   {fulldate ?? "TBA"}
                              </p>
                         </div>
                         {saleActive ? (
                              <div className='border border-transparent  px-1.5 py-1.5 gap-1.5  flex items-center  bg-green-300 rounded-sm '>
                                    <span className="animate-ping absolute inline-flex h-3 w-3 -translate-x-[0.09rem] rounded-full bg-black opacity-75"></span>
                                   <span className="inline-flex h-2 w-2 rounded-full bg-black"></span>
                                   <span className='uppercase text-black font-[550] text-[13px]'> Live now</span>
                              
                              </div>
                         ): (
                         
                           <span
                              className={`
                                   py-1.5 __className_a17902 rounded text-xs  lg:mt-0  font-[500] px-2 tracking-[-0.005rem]
                                   ${
                                        status.toUpperCase() === "ALLOWLIST OPEN"
                                        ? "bg-[rgb(220,239,113)]"
                                        : "bg-gray-500"
                                    }
                                   text-[var(--type-5)] text-center
                              `}
                         >
                              {status}
                         </span>   
                         )
                         
                    }

                         
                    </div>
                       
               </div>
              <div className='w-full flex items-center justify-center gap-x-8  mt-10 relative'>
                    <Image 
                         width={40}
                         height={80}
                         alt={name}
                         src={icon}
                         objectFit='center'
                         className=' w-24 h-24 object-cover rounded-full '
                    />
                    <div className='flex flex-col  w-full justify-center'>
                        <h2 className='text-[36px] text-primary font-bold'> {name} </h2>
                         <p className='text-[var(--type-2)] opacity-80  text-[15px] sm:text-[19px] font-[600] whitespace-normal leading-7'> {about} </p>
                    </div>
                     
               </div> 
               <div className=" mt-12  px-2.5 lg:grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] [@media(min-width:830px)]:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_400px] items-start ">
                    
               {SwiperImages.length > 0 && (
                     <div className='flex flex-col items-start '>
                        <Swiper
                              modules={[Navigation, Thumbs, Autoplay, Pagination]}
                              navigation={{
                                   nextEl: '.swiper-button-next',
                                   prevEl: '.swiper-button-prev',
                              }}
                              thumbs={{ swiper: thumbsSwiper }}
                              autoplay={{ delay: 3000, disableOnInteraction: false }}
                              spaceBetween={10}
                              slidesPerView={1}
                              pagination={{ clickable: true}}
                              className='w-full max-w-2xl md:max-w-4xl lg:max-w-2xl rounded-xl  overflow-hidden relative'
                              
                              onBeforeInit={(swiper) => {
                                   // Attach navigation elements before initialization
                                   // @ts-ignore
                                   swiper.params.navigation.prevEl = prevRef.current;
                                   // @ts-ignore
                                   swiper.params.navigation.nextEl = nextRef.current;
                                 }}
                                 onInit={(swiper) => {
                                   swiperRef.current = swiper;
                                   swiper.navigation.init();
                                   swiper.navigation.update();
                               
                                   // Track boundaries
                                   setIsBeginning(swiper.isBeginning);
                                   setIsEnd(swiper.isEnd);
                                 }}
                                 onSlideChange={(swiper) => {
                                   setActiveIndex(swiper.activeIndex);
                                   setIsBeginning(swiper.isBeginning);
                                   setIsEnd(swiper.isEnd);
                                 }}
                         >
                              {SwiperImages.map((src, index) => (
                                   <SwiperSlide key={index}>
                                        <div
                                             onClick={() => window.open(src, "_blank", "noopener ,noreferrer")} 
                                             className='relative w-full  h-60 sm:h-90 md:h-120 lg:h-95  cursor-zoom-in'
                                        >
                                             <Image
                                                  src={src}
                                                  alt={`Slide ${index + 1}`}
                                                  fill
                                                  className='object-cover rounded-xl'
                                             />
                                        </div>
                                   </SwiperSlide>
                              ))}

                               {/* Navigation Arrows */}
                               <button
                                   ref={prevRef}
                                   disabled={isBeginning}
                                   onClick={() => swiperRef.current?.slidePrev()}
                                   className={` absolute left-2 top-1/2 -translate-y-1/2 z-50  transition-opacity ${
                                                  isBeginning ? "opacity-40 cursor-not-allowed" : "opacity-100 cursor-pointer"
                                             }`}
                               >
                                        <ChevronLeft  className='h-50 w-22 drop-shadow-lg text-white'  strokeWidth={1}/>
                              </button>
                               
                              <button
                                   ref={nextRef}
                                   disabled={isEnd}
                                   onClick={() => swiperRef.current?.slideNext()}
                                   className={`absolute right-2 top-1/2 -translate-y-1/2 z-50  transition-opacity ${
                                        isEnd ? "opacity-30 cursor-not-allowed" : "opacity-100 cursor-pointer"
                                   }`}
                              >
                                   <ChevronRight  className='h-50 w-22 drop-shadow-lg text-white'  strokeWidth={1}/>
                              </button>
                              </Swiper>
                              {/* Thumbnail Swiper */}
                              <Swiper
                                   onSwiper={setThumbsSwiper}
                                   spaceBetween={12}
                                   freeMode={true}
                                   watchSlidesProgress
                                   className='relative w-full max-w-2xl md:max-w-4xl lg:max-w-2xl rounded-xl px-6 overflow-hidden mt-4 '
                                   breakpoints={{
                                        0: {slidesPerView:4},
                                        768:{slidesPerView:5},
                                        1024:{slidesPerView: 6}
                                   }}
                              >
                              {SwiperImages.map((src, index) => (
                                   <SwiperSlide key={index} className='cursor-pointer  '>
                                        <div className={`  w-full aspect-[16/9] border-none  rounded-xl `}>
                                             <Image 
                                             src={src}
                                             alt={`Thumbnail ${index +1}`}
                                             fill
                                             className='object-cover'
                                        />
                                   </div>
                              </SwiperSlide>
                           ))}   
                         </Swiper>
                         {/*  small screen */}
                    <div className={ ` ${resolvedTheme === "dark" ? "bg-[#18181b]" : "bg-[#fafafa]" } block lg:hidden w-full   border overflow-hidden mt-8 lg:mt-0 rounded-lg lg:sticky lg:top-20 lg:self-start   `}>
                         <div className='px-8 py-8 w-full'>
                              <div className='flex flex-row justify-between w-full items-start '>
                              <div className='flex flex-col gap-1 items-start'>
                                   <p className='text-[var(--type-3)] font-[600] tracking-tighter text-[15px]'> Fundraise Goal</p>
                                   <h2 className='text-primary text-[36px] tracking-[-0.02em] font-bold'>{FundRaiseValue} </h2>
                              </div>
                              {CoinIcon && (
                                   <CoinIcon  className='size-10'/>  
                              )}
                        
                    </div>
                    {!saleActive ? (
                         <div className="flex-1 flex-col">
                              <p className="text-[15px] sm:text-[17px] text-zinc-500 font-[600] mt-4">
                                   The allowlist for {decodeName} is now available, and you can apply for it below.
                              </p>
                              <div className="flex flex-col gap-4 items-center justify-center">
                                   <p className="text-zinc-500 text-[13px] font-[600] mt-6 tracking-wide">
                                        APPLICATIONS CLOSE IN
                                   </p>
                                   {(decodeName === "Friendly Giant AI" || decodeName === "MemeMarket") && (
                                        <div className='flex flex-row gap-8 w-full items-center justify-center'>
                                        {timeCountdown.map(({ title, number }, idx) => (
                                             <div key={idx} className='flex flex-col gap-0.5 justify-center items-center '>
                                             <h2 className='font-bold text-[25px] tracking-[-0.02rem]'>{number}</h2>
                                             <p className='text-[rgb(113,113,122)] font-[600] uppercase text-[15px]'>{title}</p>
                                             </div>
                                        ))}
                                        </div>
                                        )}
                                   <p className="mt-3.5 text-zinc-400 font-[600] text-[15px]">
                                        {fulldate}
                                   </p>
                                   
                                    <Link
                                        href="/projects/apply"
                                        className=" mt-2 text-[14px] border border-transparent font-[600]  bg-[#0bf] py-3 px-8 w-full transition-all duration-300 rounded-full  flex justify-center items-center text-[var(--type-5)]"
                                   >
                                        Apply Now
                                   </Link>
                              </div>
                         </div>
                    
                    ) : (
                    // 3️⃣ SALE ACTIVE
                         <div className='flex flex-col gap-3' data-slot="Live token sales">
                              <div className="relative w-full h-3 mt-4 rounded-full overflow-hidden bg-zinc-800/30">
                                   <div
                                        className="absolute left-0 top-0 h-full rounded-full"
                                        style={{
                                        width: `${salePercentage}`, 
                                        background: "linear-gradient(90deg, #5fffe2 0%, #c6f75f 50%, #5fffe2 100%)",
                                        }}
                                   />
                              </div> 
                              <div className='flex flex-row  items-center gap-2 mt-2 '>
                                   <p className={` text-[15px] sm:text-[17px] ${resolvedTheme === 'dark' ? "text-[rgb(172,187,204)]" : "text-gray-500"} font-[600]`} > Participants  </p>
                                   <hr className="mt-2 w-full h-px border-none flex-1 bg-[linear-gradient(90deg,rgba(152,170,192,0.6)_30%,rgba(255,255,255,0)_0px)] bg-[length:5px_1px] bg-repeat-x bg-center" />
                                   <p className='text-primary text-[16px] text-shadow-none font-[600]'> {participants}</p>
                              </div>
                              <div className='flex flex-row  items-center gap-2  '>
                                   <p className={` text-[15px] sm:text-[17px] ${resolvedTheme === 'dark' ? "text-[rgb(172,187,204)]" : "text-gray-500"} font-[600]`} > Price per token </p>
                                   <hr className="mt-2 w-full h-px border-none flex-1 bg-[linear-gradient(90deg,rgba(152,170,192,0.6)_30%,rgba(255,255,255,0)_0px)] bg-[length:5px_1px] bg-repeat-x bg-center" />
                                   <p className='text-primary text-[16px] text-shadow-none font-[600]'> {tokenPrice}</p>
                              </div>
                              <div className='flex flex-row  items-center gap-2  '>
                                   <p className={` text-[15px] sm:text-[17px] ${resolvedTheme === 'dark' ? "text-[rgb(172,187,204)]" : "text-gray-500"} font-[600]`} > Raise token  </p>
                                   <hr className="mt-2 w-full h-px border-none flex-1 bg-[linear-gradient(90deg,rgba(152,170,192,0.6)_30%,rgba(255,255,255,0)_0px)] bg-[length:5px_1px] bg-repeat-x bg-center" />
                                   <p className='text-primary text-[15px] text-shadow-none font-[600]'> {RaiseToken}</p>
                              </div>
                              <div className='flex flex-row justify-between p-0 items-center mt-2'>
                                   <div className='flex flex-col gap-2'>
                                        <p className='text-primary text-[16px] font-[400]'> Allowlisted </p>
                                        <span className='border text-[15px] py-0.5  font-[400] border-transparent p-0 bg-zinc-300 rounded-[7px] px-1 text-[rgb(57,110,168)]'> GUARANTEED</span>
                                   </div>
                                  <div className='flex flex-row gap-2 items-center justify-center'>
                                   <div className='flex items-center justify-center'>
                                        <span className="animate-ping absolute inline-flex h-3.5 w-3.5   rounded-full bg-green-800 opacity-75"></span>
                                        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
                                   </div>
                                   <span className='text-[15px] text-primary font-[400]'> LIVE NOW</span>
                                  </div>
                              </div>
                              <div className='flex flex-row justify-between p-0 items-start mt-2'>
                                   <div className='flex flex-col '>
                                        <p className='text-primary text-[17px] font-[400]  whitespace-normal break-words'> Allowlisted </p>
                                        <p className='text-primary text-[18px] font-[400]  whitespace-normal break-words'> (FCFS) </p>
                                        <span className='mt-1 border text-[15px] w-12 py-0.5 items-center font-[400] border-transparent  bg-zinc-300 rounded-[7px] px-1.5 text-[rgb(57,110,168)]'> FCFS </span>
                                   </div>
                                   <div className='flex flex-col justify-end items-end -space-y-2' >
                                        <div className='flex flex-row gap-1 ' aria-label='FCfS reducing number'>
                                             {FCFS.map((item, idx) => (
                                                  <div className={`${resolvedTheme === "dark" ? "bg-zinc-700" : "bg-zinc-300"} text-primary font-[600] text-center rounded  w-6 px-0.5`} key={idx}>
                                                       {item}
                                                  </div>
                                             ))}
                                        </div>`
                                        <p className='text-[15px] font-[400] text-zinc-500'> {getTodayFormatted()} at  {time ? time : "2:00 PM UTC"} </p>
                                   </div>
                                  
                              </div>
                                   <button
                                        onClick={() => router.push("/projects/sale")}
                                        disabled={!isAllowedtoJoin}
                                        className={` ${isAllowedtoJoin ? "bg-primary cursor-pointer hover:opacity-85" : "bg-[#767676] cursor-not-allowed"} 
                                        focus:none outline:none mt-5 text-[14px] font-[600] border border-transparent
                                         py-3 px-8 w-full transition-all duration-300 rounded-full  
                                         focus-visible:ring-contrast focus-visible:ring-offset-[var(--background-1)]
                                          text-center  focus-visible:ring-offset-2
                                         flex justify-center items-center text-[var(--type-5)] `}
                                   >
                                        {salesbuttonText}
                                   </button>
                         </div>
                    )}
                    </div>
                    <div className='relative bg-[linear-gradient(200deg,rgba(0,187,255,0.05)_0%,rgba(0,187,255,0.15)_100%)] rounded-b-[7px] items-center text-center mt-4 p-1.5'>
                         <p className='uppercase text-[var(--type-6)] font-[500] text-[15px] '> token sale  </p>
                    </div>
                   </div>
                   
               <div className={` mt-8 order-2 border-b ${resolvedTheme === 'dark' ? 'bg-transparent' : 'bg-zinc-50'} h-14 flex w-full items-center px-4 `}>
                    <div className='flex flex-row items-center justify-center'>
                         {InfoTab.map((item, idx) => (
                              <div className='relative group' key={idx}>
                                   <button
                                        onClick={() => setActiveInfoTab(item)}
                                        className={`  focus-visible:ring-contrast focus-visible:ring-offset-[var(--background-1)] text-center border-transparent focus-visible:ring-offset-2 
                                        py-2 pr-6 transition-colors duration-200 text-[15px] font-[600]
                                        ${ActiveInfoTab === item ? "text-primary" : "text-[var(--type-3)] cursor-pointer hover:text-[var(--type-2)]"}
                                   `}
                                   >
                                        {item}
                                   </button>
                              <div
                                   className={` absolute -bottom-2.5  -left-4  h-px w-[17vh]
                                        ${ActiveInfoTab === item ? "bg-[#0bf]" : "bg-transparent group-hover:bg-[#a5a4a4]"}`} />
                              </div>
                         ))}
                    </div>
               </div>
                         <div className='mt-6 order-3 relative w-full '>
                    <DispalyProjectInfo />
               </div>
              
                     </div>
                     
                   )} 

                   {/*  for large scrren */}
                   <div className={ ` ${resolvedTheme === "dark" ? "bg-[#18181b]" : "bg-[#fafafa]" } hidden lg:block w-full  border overflow-hidden mt-8 lg:mt-0 rounded-lg lg:sticky lg:top-20 lg:self-start order-1 lg:order-none  `}>
                    <div className='px-8 py-8 w-full'>
                    <div className='flex flex-row justify-between w-full items-start '>
                         <div className='flex flex-col gap-1 items-start'>
                              <p className='text-[var(--type-3)] font-[600] tracking-tighter text-[15px]'> Fundraise Goal</p>
                              <h2 className='text-primary text-[36px] tracking-[-0.02em] font-bold'>{FundRaiseValue} </h2>
                         </div>
                         {CoinIcon && (
                              <CoinIcon  className='size-10'/>  
                         )}
                        
                    </div>
                    {!saleActive ? (
                         <div className="flex-1 flex-col">
                              <p className="text-[15px] sm:text-[17px] text-zinc-500 font-[600] mt-4">
                                   The allowlist for {decodeName} is now available, and you can apply for it below.
                              </p>
                              <div className="flex flex-col gap-4 items-center justify-center">
                                   <p className="text-zinc-500 text-[13px] font-[600] mt-6 tracking-wide">
                                        APPLICATIONS CLOSE IN
                                   </p>
                                   {(decodeName === "Friendly Giant AI" || decodeName === "MemeMarket") && (
                                        <div className='flex flex-row gap-8 w-full items-center justify-center'>
                                        {timeCountdown.map(({ title, number }, idx) => (
                                             <div key={idx} className='flex flex-col gap-0.5 justify-center items-center '>
                                             <h2 className='font-bold text-[25px] tracking-[-0.02rem]'>{number}</h2>
                                             <p className='text-[rgb(113,113,122)] font-[600] uppercase text-[15px]'>{title}</p>
                                             </div>
                                        ))}
                                        </div>
                                        )}
                                   <p className="mt-3.5 text-zinc-400 font-[600] text-[15px]">
                                        {fulldate}
                                   </p>
                                   
                                    <Link
                                        href="/projects/apply"
                                        className=" mt-2 text-[14px] border border-transparent font-[600]  bg-[#0bf] py-3 px-8 w-full transition-all duration-300 rounded-full  flex justify-center items-center text-[var(--type-5)]"
                                   >
                                        Apply Now
                                   </Link>
                              </div>
                         </div>
                    
                    ) : (
                    // 3️⃣ SALE ACTIVE
                         <div className='flex flex-col gap-3' data-slot="Live token sales">
                              <div className="relative w-full h-3 mt-4 rounded-full overflow-hidden bg-zinc-800/30">
                                   <div
                                        className="absolute left-0 top-0 h-full rounded-full"
                                        style={{
                                        width: `${salePercentage}`, 
                                        background: "linear-gradient(90deg, #5fffe2 0%, #c6f75f 50%, #5fffe2 100%)",
                                        }}
                                   />
                              </div> 
                              <div className='flex flex-row  items-center gap-2 mt-2 '>
                                   <p className={` text-[15px] sm:text-[17px] ${resolvedTheme === 'dark' ? "text-[rgb(172,187,204)]" : "text-gray-500"} font-[600]`} > Participants  </p>
                                   <hr className="mt-2 w-full h-px border-none flex-1 bg-[linear-gradient(90deg,rgba(152,170,192,0.6)_30%,rgba(255,255,255,0)_0px)] bg-[length:5px_1px] bg-repeat-x bg-center" />
                                   <p className='text-primary text-[16px] text-shadow-none font-[600]'> {participants}</p>
                              </div>
                              <div className='flex flex-row  items-center gap-2  '>
                                   <p className={` text-[15px] sm:text-[17px] ${resolvedTheme === 'dark' ? "text-[rgb(172,187,204)]" : "text-gray-500"} font-[600]`} > Price per token </p>
                                   <hr className="mt-2 w-full h-px border-none flex-1 bg-[linear-gradient(90deg,rgba(152,170,192,0.6)_30%,rgba(255,255,255,0)_0px)] bg-[length:5px_1px] bg-repeat-x bg-center" />
                                   <p className='text-primary text-[16px] text-shadow-none font-[600]'> {tokenPrice}</p>
                              </div>
                              <div className='flex flex-row  items-center gap-2  '>
                                   <p className={` text-[15px] sm:text-[17px] ${resolvedTheme === 'dark' ? "text-[rgb(172,187,204)]" : "text-gray-500"} font-[600]`} > Raise token  </p>
                                   <hr className="mt-2 w-full h-px border-none flex-1 bg-[linear-gradient(90deg,rgba(152,170,192,0.6)_30%,rgba(255,255,255,0)_0px)] bg-[length:5px_1px] bg-repeat-x bg-center" />
                                   <p className='text-primary text-[15px] text-shadow-none font-[600]'> {RaiseToken}</p>
                              </div>
                              <div className='flex flex-row justify-between p-0 items-center mt-2'>
                                   <div className='flex flex-col gap-2'>
                                        <p className='text-primary text-[16px] font-[400]'> Allowlisted </p>
                                        <span className='border text-[15px] py-0.5  font-[400] border-transparent p-0 bg-zinc-300 rounded-[7px] px-1 text-[rgb(57,110,168)]'> GUARANTEED</span>
                                   </div>
                                  <div className='flex flex-row gap-2 items-center justify-center'>
                                   <div className='flex items-center justify-center'>
                                        <span className="animate-ping absolute inline-flex h-3.5 w-3.5   rounded-full bg-green-800 opacity-75"></span>
                                        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
                                   </div>
                                   <span className='text-[15px] text-primary font-[400]'> LIVE NOW</span>
                                  </div>
                              </div>
                              <div className='flex flex-row justify-between p-0 items-start mt-2'>
                                   <div className='flex flex-col '>
                                        <p className='text-primary text-[17px] font-[400]  whitespace-normal break-words'> Allowlisted </p>
                                        <p className='text-primary text-[18px] font-[400]  whitespace-normal break-words'> (FCFS) </p>
                                        <span className='mt-1 border text-[15px] w-12 py-0.5 items-center font-[400] border-transparent  bg-zinc-300 rounded-[7px] px-1.5 text-[rgb(57,110,168)]'> FCFS </span>
                                   </div>
                                   <div className='flex flex-col justify-end items-end -space-y-2' >
                                        <div className='flex flex-row gap-1 ' aria-label='FCfS reducing number'>
                                             {FCFS.map((item, idx) => (
                                                  <div className={`${resolvedTheme === "dark" ? "bg-zinc-700" : "bg-zinc-300"} text-primary font-[600] text-center rounded  w-6 px-0.5`} key={idx}>
                                                       {item}
                                                  </div>
                                             ))}
                                        </div>`
                                        <p className='text-[15px] font-[400] text-zinc-500'> {getTodayFormatted()} at  {time ? time : "2:00 PM UTC"} </p>
                                   </div>
                                  
                              </div>
                                   
                                   <button
                                        disabled={!isAllowedtoJoin}
                                   onClick={() => router.push("/projects/sale")}
                                        className={` ${isAllowedtoJoin ? "bg-primary cursor-pointer hover:opacity-85" : "bg-[#767676] cursor-not-allowed"} 
                                        focus:none outline:none mt-5 text-[14px] font-[600] border border-transparent
                                         py-3 px-8 w-full transition-all duration-300 rounded-full  
                                         focus-visible:ring-contrast focus-visible:ring-offset-[var(--background-1)]
                                          text-center  focus-visible:ring-offset-2
                                         flex justify-center items-center text-[var(--type-5)] `}
                                   >
                                        {salesbuttonText}
                                   </button>
                         </div>
                    )}
                    </div>
                    <div className='relative bg-[linear-gradient(200deg,rgba(0,187,255,0.05)_0%,rgba(0,187,255,0.15)_100%)] rounded-b-[7px] items-center text-center mt-4 p-1.5'>
                         <p className='uppercase text-[var(--type-6)] font-[500] text-[15px] '> token sale  </p>
                    </div>
                   </div>
                   
               </div>
              
              
          </div> 
     </div>
  )
}

export default ProjectInfo;
