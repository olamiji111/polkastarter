'use client'

import Image from "next/image";

import React, { useEffect, useState } from 'react'
import {UpcomingProjects, FundedProjects, projectTableElement} from "@/constants/index";
import {ChevronDown,  SearchIcon, ChevronRight, ChevronLeft} from "lucide-react"
import {useResolvedTheme} from "@/components/shared/theme-context"
import { Table, TableBody, TableCell,  TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {   ProjectTableRow } from '@/types'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { projectsTableColumn } from '@/components/shared/project-tablecolumn';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger , DropdownMenu} from '@/components/ui/dropdown-menu';
import {useProjectStore}  from "@/store/index"
import {useRouter} from "next/navigation";
import { getIcon, getCountdownString } from "@/utils";

const numberOfDataShown = [
     "Show 5 results",
     "Show 15 results",
     "Show 25 results",
     "Show 50 results",
] as const 

type numberOfDataShownProps = (typeof numberOfDataShown)[number]

function useMediaQuery(query: string) {
     const [matches, setMatches] = useState(false);
   
     useEffect(() => {
       const media = window.matchMedia(query);
       if (media.matches !== matches) setMatches(media.matches);
   
       const listener = () => setMatches(media.matches);
       media.addEventListener("change", listener);
   
       return () => media.removeEventListener("change", listener);
     }, [matches, query]);
   
     return matches;
}



const searchQueryHelps = [
     "All", "Ethereum", "BNB Chain", "Polygon", "Celo", "Avalanche", "Arbitrum", "Base", "Sei", "Mode",
] as const;
type searchQueryValue = (typeof searchQueryHelps)[number];


const ProjectHome = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("")
  const {resolvedTheme, mounted} = useResolvedTheme();
  const setselectedProject = useProjectStore((state) => state.setSelectedProject);
  const [rowsToShow, setRowsToShow] = useState<numberOfDataShownProps>("Show 15 results");
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [isLoggedIn , setIsLoggedIn] = useState<boolean>(true);
  const [isWalletetConnected , setIsWalletConnected] = useState<boolean>(true);
  const [activeButton, setActiveButton] = useState<searchQueryValue>("All")
  const [activeHeader, setActiveHeader] = useState<keyof ProjectTableRow | null>(null);
  const [tableData, setTableData] = useState<ProjectTableRow[]>(projectTableElement);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;
  const [friendlyCountdown, setFriendlyCountdown] = useState("");
  const [memeCountdown, setMemeCountdown] = useState("");

useEffect(() => {
  const updateCountdowns = () => {
    setFriendlyCountdown(getCountdownString("2025-10-29", "16:00:00")); // 4:00 PM UTC
    setMemeCountdown(getCountdownString("2025-11-02", "20:45:00")); // 8:45 PM UTC
  };

  updateCountdowns(); // initial call
  const timer = setInterval(updateCountdowns, 1000); // every second

  return () => clearInterval(timer); // cleanup
}, []);



  const reshuffleTableData = () => {
     setTableData((prev) => {
          const array = [...prev];
               for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
               }
               return array;
          });
     };


     const handleHeaderClick = (header: keyof ProjectTableRow) => {
          setActiveHeader(header === activeHeader ? null : header); // toggle active
          reshuffleTableData();
     };


     const table = useReactTable({
          data: tableData,
          columns: projectsTableColumn(activeHeader, handleHeaderClick),
          getCoreRowModel: getCoreRowModel(),
     });

     const goToNexpage = () => {
          if (currentPage < totalPages) {
               setCurrentPage((prev) => prev + 1);
               reshuffleTableData();
          }
     };
     const goToPrevpage = () => {
          if (currentPage > 1) {
               setCurrentPage((prev) => prev - 1);
               reshuffleTableData();
          }
     }

     const isSmall = useMediaQuery("(max-width: 580px)");

     if (!mounted) { 
       return null;
     }
  
     return (
          <div className='pt-8'>
               <div className={` pt-20 ${isSmall ? 'px-4' : 'px-8'} `}>
                    <h2 className='text-2xl font-extrabold sans text-[var(--type-1)]'> Upcoming Projects </h2>
                    <div className="grid gap-6 w-full  grid-cols-1 md:grid-cols-2 [@media(min-width:1150px)]:grid-cols-3 xl:grid-cols-3 h-full cursor-pointer ">
                         {UpcomingProjects.map(({ 
                         name, 
                         backgroundImage, 
                         icon, 
                         about, 
                         FundRaiseValue, 
                         maxAllocation, 
                         status, 
                         cointypeIcon,
                         date,
                         dateStatement,
                         time,
                         tokenPrice,
                         RaiseToken,
                         participants,
                         salePercentage
                    }, idx) => { 
                         const CoinIcon = getIcon(cointypeIcon as "base" | "ethereum"); 
                         return (
                         <div 
                              key={idx} 
                              onClick={() => {
                                   setselectedProject({name, about, participants, salePercentage,  backgroundImage, icon,cointypeIcon, time, maxAllocation, status, date, dateStatement, FundRaiseValue , RaiseToken,tokenPrice})
                                   router.push(`/projects/${encodeURIComponent(name)}`)

                              }}
                              className={`mt-6 transform transition-transform duration-300
                               rounded-xl overflow-hidden    border 
                               hover:-translate-y-2 flex flex-col ${
                              resolvedTheme === "dark" ? "bg-[#18181b]" : "bg-white" 
                              }`}
                         >
                         {!isSmall ? (
                              <>
                              <div className="relative h-60 [@media(max-width:700px)]:h-80 rounded-t-xl overflow-hidden p-1">
                              <Image
                                   alt={name}
                                   src={backgroundImage}
                                   fill
                                   priority
                                   className="absolute  object-center  rounded-t-xl"
                              />
                              <div
                                   className={`absolute inset-0  rounded-xl ${
                                        resolvedTheme === "dark"
                                        ? "bg-gradient-to-b from-zinc-700/40 via-transparent to-transparent"
                                        : "bg-gradient-to-b from-zinc-700/40 via-transparent to-transparent"
                                   }`}
                              />
                              <div className='absolute right-0 top-0 p-2'>
                                   <div  className='relative flex flex-row gap-2 '>
                                        <span
                                             className={`
                                             py-1 __className_a17902 rounded text-xs font-[500] px-1 tracking-[-0.005rem]
                                             ${
                                             status.toUpperCase() === "ALLOWLIST OPEN"
                                             ? "bg-[rgb(220,239,113)] "
                                             : "bg-gray-500 "
                                             } text-[var(--type-5)]
                                             `}
                                        >
                                             {status}
                                        </span>
                                        { name === "KeetaAI" &&(
                                             <span className={`py-1 px-1 rounded uppercase text-xs font-[500] tracking-[-0.005rem] bg-[rgb(220,239,113)] text-[var(--type-5)] `}>
                                                  reFund
                                             </span>
                                         )}
                                   </div>
                              </div>
                         </div>
                         <div className=' flex -mt-10 ml-6 items-center  '>
                              <div className={` relative border-[4px] rounded-[7px]  w-26 h-18 z-2  ${
                                   resolvedTheme === "dark" ? "bg-[#18181b] border-[#18181b]" : "bg-white border-white" 
                              }`}>
                                   <Image 
                                        width={40}
                                        height={40}
                                        alt={name}
                                        src={icon}
                                        objectFit='center'
                                        className=' w-26 h-18 object-cover rounded-[7px] '
                                   />
                              </div>
                              {status.toUpperCase() === "ALLOWLIST OPEN" && (
                                          <div className=" relative mt-10 bg-[linear-gradient(200deg,rgba(0,187,255,0.05)_0%,rgba(0,187,255,0.15)_100%)] flex flex-row justify-between p-2  items-center w-full">
                                             <p className='text-[var(--type-6)] font-[600] text-xs'> {dateStatement} </p>
                                             
                                             <p className='text-[var(--type-6)] font-[600] text-xs'>
                                                  {name === "Friendly Giant AI"
                                                       ? friendlyCountdown
                                                       : name === "MemeMarket"
                                                       ? memeCountdown
                                                       : date}
                                             </p>
                                          </div>
                              )}
                         </div> 
                         <div className='flex flex-col mt-6 px-4 gap-4 w-full '>
                                   
                             <div className='flex justify-between items-center'>
                                <h2 className='font-[700] text-[var(--type-1)] __className_a17902 whitespace-nowrap text-[28px] tracking-[-0.02rem]'> {name} </h2>   
                                {CoinIcon && (
                                   <CoinIcon />
                                )}
                                
                              </div>
                              <p className={` __className_a17902 ${resolvedTheme === 'dark' ? 'text-zinc-400' : 'text-gray-500'} line-clamp-2  text-[17px] w-[85%] text-left font-[600] tracking-[-0.005rem] saturate-50 `}>
                                   {about}   
                              </p>
                         </div>
                         
                         <div className='flex flex-row gap-2 items-center mt-auto p-4' >
                              <p className={` __className_a17902 text-[17px] font-[600] shrink-0  ${resolvedTheme === 'dark' ? "text-[rgb(172,187,204)]" : "text-gray-600"}`}> Fundraise Goal </p>
                              <hr className="flex-grow border-0 h-[1px] bg-[length:5px_1px] bg-repeat-x bg-[center] bg-[linear-gradient(90deg,rgba(0,187,255,0.6)_30%,rgba(255,255,255,0)_0px)]" />
                              <span className='font-[400] text-[18px] __className_a17902 '>
                                   {FundRaiseValue}
                              </span>
                         </div>
                         <div className='flex flex-row gap-2 items-center -mt-1 px-4' >
                              <p className={` __className_a17902 text-[17px] font-[600] shrink-0  ${resolvedTheme === 'dark' ? "text-[rgb(172,187,204)]" : "text-gray-600"}`}> Max Allocation </p>
                              <hr className="flex-grow border-0 h-[1px] bg-[length:5px_1px] bg-repeat-x bg-[center] bg-[linear-gradient(90deg,rgba(0,187,255,0.6)_30%,rgba(255,255,255,0)_0px)]" />
                              <span className='font-[400] text-[18px] __className_a17902 '>
                                   {maxAllocation}
                              </span>
                         </div>
                         <div className='bg-[linear-gradient(200deg,rgba(0,187,255,0.05)_0%,rgba(0,187,255,0.15)_100%)] rounded-b-[7px] items-center text-center mt-4 p-1.5'>
                         <p className='uppercase text-[var(--type-6)] font-[500] text-[15px]'> token sale  </p>
                         </div>
                         </>

                         ): (
                           <div>
                               {status.toUpperCase() === "ALLOWLIST OPEN" && (
                                          <div className=" h-7 px-4 relative bg-[linear-gradient(200deg,rgba(0,187,255,0.05)_0%,rgba(0,187,255,0.15)_100%)] flex flex-row justify-between  rounded-t items-center w-full">
                                             <p className='text-[var(--type-6)] font-[600] text-xs'> {dateStatement} </p>
                                             
                                             <p className='text-[var(--type-6)] font-[600] text-xs'>
                                                  {name === "Friendly Giant AI"
                                                       ? friendlyCountdown
                                                       : name === "MemeMarket"
                                                       ? memeCountdown
                                                       : date}
                                             </p>
                         </div>
                              )}
                             <div className=' px-4 flex flex-col gap-4 mt-4'>
                                   <div className=' w-full items-center justify-between flex flex-row'>
                                        <div className=' flex  items-center gap-2'>
                                             <div className={`  border-[4px] rounded-[7px]  w-18 h-18   ${
                                                  resolvedTheme === "dark" ? "bg-[#18181b] border-[#18181b]" : "bg-white border-white" 
                                                  }`}
                                             >
                                                  <Image 
                                                       width={40}
                                                       height={40}
                                                       alt={name}
                                                       src={icon}
                                                       className=' w-16 h-16 object-cover rounded-[4px] '
                                                  />
                                             </div> 
                                             <h2 className='font-[700] text-[var(--type-1)] __className_a17902 whitespace-nowrap text-[17px] tracking-[-0.02rem]'>{name}</h2>
                                        </div>
                                        <div className='  flex flex-col gap-1.5 items-start justify-start'>
                                             <span
                                             className={`
                                             py-1 __className_a17902 text-center rounded text-xs font-[500] w-28 tracking-[-0.005rem]
                                             ${
                                             status.toUpperCase() === "ALLOWLIST OPEN"
                                             ? "bg-[rgb(220,239,113)] "
                                             : "bg-gray-500 "
                                             } text-[var(--type-5)]
                                             `}
                                        >
                                             {status}
                                             </span>
                                              { name === "KeetaAI" &&(
                                             <span className={`py-1 px-1 rounded uppercase text-xs font-[500] tracking-[-0.005rem] bg-[rgb(220,239,113)] text-[var(--type-5)] `}>
                                                  reFund
                                             </span>
                                         )}
                                             {CoinIcon && (
                                                  <CoinIcon  className="size-6"/>
                                             )}
                                
                                        </div>
                                       
                                   </div>
                                   <p className={` __className_a17902 ${resolvedTheme === 'dark' ? 'text-zinc-400' : 'text-gray-500'} line-clamp-2  text-[14px] w-[85%] text-left font-[600] tracking-[-0.005rem] saturate-50 `}>
                                        {about}   
                                   </p>
                                   <div className='flex flex-row  items-center gap-2  ' >
                                        <p className={` __className_a17902 text-[14px] font-[600] shrink-0  ${resolvedTheme === 'dark' ? "text-[rgb(172,187,204)]" : "text-gray-600"}`}> Fundraise Goal </p>
                                        <hr className="flex-grow border-0 h-[1px] bg-[length:5px_1px] bg-repeat-x bg-[center] bg-[linear-gradient(90deg,rgba(0,187,255,0.6)_30%,rgba(255,255,255,0)_0px)]" />
                                        <span className='font-[400] text-[17px] __className_a17902 '>
                                             {FundRaiseValue}
                                        </span>
                                   </div>
                                   <div className='flex flex-row items-center -mt-1 gap-2' >
                                        <p className={` __className_a17902 text-[14px] font-[600] shrink-0  ${resolvedTheme === 'dark' ? "text-[rgb(172,187,204)]" : "text-gray-600"}`}> Max Allocation </p>
                                        <hr className="flex-grow border-0 h-[1px] bg-[length:5px_1px] bg-repeat-x bg-[center] bg-[linear-gradient(90deg,rgba(0,187,255,0.6)_30%,rgba(255,255,255,0)_0px)]" />
                                        <span className='font-[400] text-[17px] __className_a17902 '>
                                             {maxAllocation}
                                        </span>
                                   </div>    
                             </div>
                             <div className='bg-[linear-gradient(200deg,rgba(0,187,255,0.05)_0%,rgba(0,187,255,0.15)_100%)] rounded-b-[7px] items-center text-center mt-4 p-1.5'>
                                   <p className='uppercase text-[var(--type-6)] font-[500] text-[15px] '> token sale  </p>
                              </div>
                           </div>
                          
                         )}
                               
                    </div> 
                    )                         
                                
                    })}
                    
               </div>
               <div className=' py-20 mt-12'>
                    <div className='flex flex-col lg:flex-row  w-full gap-4   items-start'>
                         <div className='flex flex-col gap-2 items-start min-w-[300px] lg:min-w-[400px]'>
                              <h2 className='text-[22px] sm:text-[23px] font-extrabold sans text-[var(--type-1)]'> Funded Projects</h2>
                              <p className='text-zinc-400 text-[19px] md:text-[19px] font-[600] tracking-[-0.02em] '> We bring new technologies to our community </p>
                         </div>
                         <div className='grid grid-cols-1 md:grid-cols-3 w-full items-center gap-3 '>
                              {FundedProjects.map(({title, value, icon:Icon}, idx) => {

                                    const isDark = resolvedTheme === "dark";

                                    const gradients = [
                                      "border-[rgba(255,187,106,0.25)] bg-[linear-gradient(90deg,rgba(255,187,106,0.1)_0%,rgba(255,187,106,0.02)_50%,rgb(9,9,11)_100%)]",
                                      "border-[rgba(220,239,113,0.25)] bg-[linear-gradient(90deg,rgba(220,239,113,0.1)_0%,rgba(220,239,113,0.02)_50%,rgb(9,9,11)_100%)]",
                                      "border-[rgba(0,187,255,0.25)] bg-[linear-gradient(90deg,rgba(0,187,255,0.1)_0%,rgba(0,187,255,0.02)_50%,rgb(9,9,11)_100%)]",
                                    ];

                                    const iconWrapper = [
                                        "bg-[rgba(255,187,106,0.16)] text-[rgb(255,187,106)]",
                                        "bg-[rgba(220,239,113,0.16)] text-[rgb(220,239,113)]",
                                        "bg-[rgba(0,187,255,0.16)] text-[rgb(0,187,255)]",
                                      ];
                                    
                                      // title text accent color
                                      const titleColors = [
                                        "text-[rgb(255,187,106)]",
                                        "text-[var(--color-secondary-type)]",
                                        "text-[#0095CC]",
                                      ];
                                
                                    const darkCard = `border ${gradients[idx] || gradients[0]}`;
                                    const lightCard = `border border bg-white`;
                                
                                    const cardStyle = isDark ? darkCard : lightCard;
                                    const iconStyle = iconWrapper[idx] || iconWrapper[0];
                                    const titleStyle = titleColors[idx] || titleColors[0];
                                
                                  
                                   return (
                                        <div className={` flex flex-col items-center justify-center   w-full  rounded-[8px]  min-h-[90px] overflow-hidden ${cardStyle}`} key={idx}>
                                             <div className=' flex justify-between items-center w-full px-2 gap-4'>
                                                  <div className={` h-10 w-10  shrink-0 flex items-center justify-center rounded-full ${iconStyle}`}>
                                                       <Icon className='size-5 ' />
                                                  </div>
                                                  <div className='flex flex-col gap-2 items-end '>
                                                       <h3 className={` text-right text-[15px] font-[600] ${titleStyle}`}> {title} </h3>
                                                       <h2 className='text-right __className_a17902 text-[17px] font-[700] '> {value} </h2>
                                                  </div>
                                             </div>
                                        </div>
                                   )
                              })}
                         </div>
                         
                    </div>
                    <div className='py-4'>
                         <div className=' mt-10 flex flex-row items-center w-full mb-10 border-b '>
                              <input
                                   type='text'
                                   placeholder={`${isSmall ?"Search Projects" : "Search by project name,token contract address, or token symbol"}`}
                                   value={searchQuery}
                                   onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        reshuffleTableData()
                                   
                                   }}
                                   className={`bg-transparent text-[16px] 
                                   text-primary min-w-[200px]  
                                   border-none outline-none 
                                    __className_a17902 font-[600]
                                   w-full  mb-4 
                                   ${resolvedTheme === 'dark' ? 'placeholder:text-zinc-500' : 'placeholder:text-zinc-400'}
                                   md:text-[19px] px-1 lg:text-[20px]`} 
                                   
                              />
                              <div>
                                   <SearchIcon strokeWidth={2.5} className={`size-6  cursor-pointer rounded ${resolvedTheme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-black'}`}/>
                              </div>
                         </div>
                         <div className={`    gap-4 gap-y-3   ${isSmall ? "grid grid-cols-2 items-center " : " flex flex-row  items-start "} `} >
                            {searchQueryHelps.map((item, idx) => {
                              return (
                                   <button 
                                        key={idx} 
                                        className={` cursor-pointer font-[600] duration-150  shrink-0  rounded-md py-1 px-2  min-w-[35px] text-[13px]  ${activeButton  === item ? "text-[var(--type-5)] bg-[#00BBFF] border border-[#00BBFF] shadow-[0_0_12px_rgba(0,187,255,0.3)]" : "text-[#0095CC] border-none bg-transparent  hover:bg-[linear-gradient(200deg,rgba(0,187,255,0.05)_0%,rgba(0,187,255,0.15)_100%)]"}  `}
                                        onClick={() => {
                                             setActiveButton(item)
                                             reshuffleTableData();
                                        } }
                                   >
                                        {item}
                                   </button>       
                              )
                            })} 
                         </div>
                         <Table className="mt-4  border border-[var(--table-border)] overflow-hidden rounded-md border-separate  border-spacing-y-0 border-spacing-x-0 min-w-[800px] ">
                              <TableHeader className="bg-[var(--table-header)] hover:bg-contrast">
                                   {table.getHeaderGroups().map(headerGroup => (
                                        <TableRow key={headerGroup.id} className={`  h-14 ${resolvedTheme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
                                             {headerGroup.headers.map((header,index) => (
                                                  <TableHead key={header.id} className={`border-b  font-[600] text-[var(--type-2)] opacity-70  text-[13px] text-left ${
                                                                                     index === 0 ? "px-4 " : "px-4 " 
                                                                                     
                                                                                } ${isSmall ? index === 0 ? "border-r" :  "" : "" } `}>
                                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                                  </TableHead>
                                                  ))}
                                             </TableRow>
                                        ))}
                              </TableHeader>
                              <TableBody>
                                   {table.getRowModel().rows.map((row, index) => (
                                        <TableRow
                                             key={row.id}
                                             className={`    cursor-pointer  ${resolvedTheme === "dark" ? "bg-[#18181b] hover:bg-zinc-800" : "bg-white hover:bg-zinc-100" }  `}
                                        >
                                             {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                             key={cell.id}
                                                  className={`  py-3   ${
                                                                 cell.column.id === "Project name" ? "px-4 min-w-[180px]" : "px-4  min-w-[50px]" } 
                                                                 ${index === 14 ? "" : "border-b"}
                                                                 ${isSmall ? cell.column.id === "Project name" ? "border-r" :  "" : "" }
                                                                
  
                                                            }`}
                                        >
                                             {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                   ))}
                              </TableRow>
                         ))}
                         </TableBody>           
                     </Table>
                     <div className='mt-6 flex items-center justify-between gap-4  '>
                    <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown} >
                         <DropdownMenuTrigger asChild>
                              <button
                              aria-label="Select theme"
                              className={`items-center w-36  font-[600]  flex  gap-1 rounded-md border justify-center bg-background  py-3 hover:bg-contrast text-sm cursor-pointer
                                   focus-visible:ring-contrast focus-visible:ring-offset-[var(--background-1) focus:visble:none                         
                              `}
                              >
                                   <span className="capitalize text-[var(--type-1)] ">
                                        {rowsToShow}
                                   </span>
                  
                                   <ChevronDown className="size-4 text-[var(--type-3)]" />
                              </button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent className="min-w-[150px] min-h-[10px] items-start justify-start p-0 m-0 shadow-none " style={{verticalAlign:"middle"}} align="start">
                              {numberOfDataShown.map((item) => (
                                   <DropdownMenuItem
                                        key={item}
                                        onSelect={() => {
                                             setRowsToShow(item);
                                             reshuffleTableData();
                                        }}
                                        className={`
                                        cursor-pointer border-none w-full font-semibold rounded-none h-12 flex items-center gap-2
                                        px-[10px] pt-0
                                        ${item === rowsToShow
                                             ? "pointer-events-none bg-[var(--dropdown-bg-active)] text-[var(--type-1)]"
                                             : "group hover:bg-[var(--dropdown-bg-hover)] text-[var(--type-2)]"
                                        }
                                        `}
                                   >  
                                        {item}
                                   </DropdownMenuItem>
                              ))}
                         </DropdownMenuContent>
                    </DropdownMenu>
                    <div className='flex gap-2 items-center '>
                        <span className='text-[17px] text-[var(--type-3)] font-[600] tracking-[0.15rem]'>
                              <span className='text-[var(--type-6)] font-[600] '> {currentPage} </span>
                                        /
                              <span>{totalPages}</span>
                        </span>
                        <div
                              onClick={goToPrevpage}
                              className={`group items-center rounded-full p-2 transition-colors ${
                              currentPage === 1
                                   ? "bg-[rgba(51,200,255,0.3)] cursor-not-allowed"
                                   : "bg-[rgba(51,200,255,0.3)] cursor-pointer hover:bg-[#0bf] "
                              }`}
                         >
                              <ChevronLeft
                                   className={` transition-colors ${
                                             currentPage === 1
                                                  ? "text-[rgba(51,200,255,0.3)]"
                                                       : "text-[var(--type-6)] group-hover:text-[var(--type-5)]"
                                             }`}
                              />
                         </div>
                         <div
                              onClick={goToNexpage}
                              className={`group items-center rounded-full p-2  transition-colors  ${
                                        currentPage === totalPages
                                        ? "bg-[rgba(51,200,255,0.3)] cursor-not-allowed"
                                             : "bg-[rgba(51,200,255,0.3)] cursor-pointer hover:bg-[#0bf] hover:text-[var(--type-5)] "
                              }`}
                         >
                              <ChevronRight
                                   className={` transition-colors  ${
                                        currentPage === totalPages
                                             ? "text-[rgba(51,200,255,0.3)]"
                                                  : "text-[var(--type-6)]  group-hover:text-[var(--type-5)] "
                                   }`}
                              />
                         </div>

                    </div>
               </div>
                    </div>
               </div>  
          </div>
     </div>
  )
}

export default ProjectHome
