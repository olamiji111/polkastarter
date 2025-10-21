'use client';

import React, { useState } from 'react'
import {useResolvedTheme} from "@/components/shared/theme-context"
import { useTheme } from 'next-themes';
import Image from "next/image";
import  Link  from 'next/link';
import { Missions, polkastarterMissionPaticipants } from '@/constants';

const MissionTabs = [
   "ALL (4)", "AVAILABLE (1)", "ENDED (3)"
] as const;
type missionTabsValue = (typeof MissionTabs)[number];



const Mission = () => {
     const {resolvedTheme, mounted} = useResolvedTheme();
     const {theme} = useTheme();
     const [isLoggedIn , setIsLoggedIn] = useState<boolean>(true);
     const [isWalletetConnected , setIsWalletConnected] = useState<boolean>(false);
     const [activeMissionTab, setActiveMissionTab] = useState<missionTabsValue>("ALL (4)");

     
     if (!mounted) { 
          return null;
     }

     const MissionTab =  () => {
          let filteredMissions = Missions;

          switch (activeMissionTab) {
               case "AVAILABLE (1)":
                    filteredMissions= Missions.filter(m => m.title === 'Polkastarter');
                    break;
               case "ENDED (3)":
                    filteredMissions=Missions.filter(m => m.title !== "Polkastarter");
                    break;
               case "ALL (4)":
                    filteredMissions = Missions;

          };

          
                    return (
                         <div className="grid gap-6 w-full  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-full cursor-pointer ">
                              {filteredMissions.map(({title, iconImage, coverImage, status, functions, toDo}, idx) => (
                                        <a key={idx} className="group relative w-full "  href="/missions">
                                        <div className='relative z-10 -mb-[6px] flex h-[3rem]'>
                                        <div className= {` relative  ${resolvedTheme === "dark" ? "bg-[#18181b]" : "bg-[#fafafa]" }  w-full  flex items-center gap-2 rounded-t-xl border-l border-t border-r px-4 pt-3 `}>
                                          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full">
                                            <Image
                                              alt={title}
                                              src={iconImage}
                                              width={32}
                                              height={32}
                                              className="h-full w-full object-cover"
                                            />
                                          </span>
                                          <p className="text-[1rem] font-[500] text-primary">{title}</p>
                                        </div>
                                       
                                      
                                        {/* Status badge container */}
                                        <div className={` ${
                                                            resolvedTheme === "dark" ? "bg-[#18181b]" : "bg-[#fafafa]" 
                                                            } relative -ml-[1px] flex w-auto items-center gap-2 rounded-bl-xl border-l border-b pb-1  pl-3 `}
                                        >
                                          {/* Tiny divs for corner shaping */}
                                          <div className={` absolute -left-[1px] top-0 h-[10px] w-[1px] ${resolvedTheme === "dark" ? "bg-[#18181b]" : "bg-[#fafafa]" } `} />
                                          <div className={ ` absolute -bottom-[1px] right-0 h-[1px] w-[11px] ${resolvedTheme === "dark" ? "bg-[#18181b]" : "bg-[#fafafa]" } `} />
                                          <div className={` absolute -bottom-[1px] -left-[1px] h-[8px] w-[1px] ${resolvedTheme === "dark" ? "bg-[#18181b]" : "bg-[#fafafa]" }`} />
                                      
                                          {/* Actual badge */}
                                          <span className= {` items-center justify-center font-[600] whitespace-nowrap rounded-sm border border-transparent ${resolvedTheme === "dark" ? "bg-white text-black" : "bg-black text-white" } px-2 py-0.5 text-sm`}>
                                            {status}
                                          </span>
                                        </div>
                                        
                                       </div> 
                                       <div className={` relative  flex flex-col gap-3 rounded-bl-2xl ${resolvedTheme === "dark" ? "bg-[#18181b]" : "bg-[#fafafa]" } border-b border-l mr-4 pb-4 pl-4 pt-6 text-left  `}>
                                        <div className='w-full'>
                                             <div className={` relative ${title === 'Polkastarter' ? "" : "grayscale"}  aspect-[1.91/1] h-auto w-full overflow-hidden rounded-xl`}>
                                                  <Image 
                                                       alt={title}
                                                       src={coverImage}
                                                       fill
                                                       priority
                                                       className='h-full w-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-105 '
                                                  />
                                             </div>
                                             <div className='flex  h-[9rem] flex-col pt-2 justify-between'>
                                                  <div className='flex w-full flex-col gap-3'>
                                                       <h2 className=' text-[22px] text-[var(--type-1)] font-[600]'> {toDo}</h2>
                                                       <div className='flex gap-[0.3rem] flex-wrap'>
                                                            {functions.map((fn,i) => (
                                                                 <span key={i} className={` inline-flex uppercase items-center justify-center gap-1 
                                                                 whitespace-normal border font-[600] tracking-tight  
                                                                  backdrop-blur-sm h-[1.5rem] rounded
                                                                 px-1.5 text-[0.8rem]
                                                                 ${title === 'Polkastarter' ? "bg-[var(--color-secondary-surface)] text-[var(--color-secondary-type)] border border-transparent" : `${resolvedTheme === 'dark' ? 'bg-zinc-800 border' : 'bg-white border'}`}

                                                             `}> 
                                                                 {fn} 
                                                            </span>
                                                            ))}
                                                            
                                                       </div>
                                                  </div>
                                                  {title === 'Polkastarter' && (
                                                       <div className='mt-5 flex w-full items-end justify-between max-md:items-center '>
                                                       <div className='flex items-center gap-1'>
                                                            <div className='flex'>
                                                                 {polkastarterMissionPaticipants.map((item,idx) => (
                                                                      <span 
                                                                           key={idx} 
                                                                           className={` inline-flex aspect-square shrink-0 slect-none
                                                                                      items-center justify-center overflow-hidden rounded-full 
                                                                                      align-middle h-6 w-6 border border-[var(--surface-1)]
                                                                                     ${idx === 0 ? "" : "-ml-2.5"}
                                                                                      `}         
                                                                      
                                                                      >
                                                                           <Image
                                                                                alt={item.slice(0,7).toString()}
                                                                                src={item}
                                                                                width={32}
                                                                                height={32}
                                                                                className="h-full w-full object-cover"
                                                                           />
                                                                      </span>
                                                                 ))}
                                                            </div>
                                                            <span className='text-xs leading-none font-[600]'>+3,644 completing</span>
                                                       </div>
                                                  </div>
                                                  )}
                                                  
                                             </div>
                                        </div>
                                      </div>
                                      <div className={` absolute bottom-0 right-0 top-[46px] w-[17px] rounded-r-2xl border-b border-r border-t ${resolvedTheme === "dark" ? "bg-[#18181b]" : "bg-[#fafafa]" } `}/>
                                   </a>
                                   
                              ))}
                         </div>
                    );
     
          
     };
     
     return (
          <div className='py-8'>
               <div className='py-16  px-8'>
                    <div  className=' flex flex-row items-center gap-4 mb-6'>
                         {MissionTabs.map((item,idx) => (
                              <button
                                key={idx}
                                onClick={()=> setActiveMissionTab(item)}
                                className={` px-2 py-1 cursor-pointer font-[600] tracking-[0.05rem] text-[var(--type-3)] text-[14px] 
                                   rounded-[6px] ${activeMissionTab === item ? "bg-[var(--color-secondary)] text-black" : "bg-none"}`}
                              >
                                   {item}
                              </button> 
                         ))}
                    </div>
                    <MissionTab />
               </div>
          </div>
     );
};

export default Mission;
