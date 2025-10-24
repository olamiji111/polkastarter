'use client';
import React, { useEffect, useMemo, useState } from 'react'
import {AlertIcon,  Info, PolsDiamonFlag, PolsPower, Gradient, QuestionPlay} from "@/components/icons/icons"
import { useTheme } from 'next-themes';
import { useRouter } from "next/navigation";

import { polsAssets, polsDashboard, dashboardArchievements, 
  dashboardUpcomingAchievements, dashboardAllowlistTable, 
dashboardHelpQuestions} from '@/constants';
import { Button } from '@/components/ui/button';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import Image from 'next/image';
import Link from 'next/link';
import { ArrowBigRight, ArrowRight } from 'lucide-react';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import {  dashboardAllowlistColumns } from '@/components/shared/dashboardallowlistcolumn';
import { AllowlistRow } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {useResolvedTheme} from "@/components/shared/theme-context"

const Dashboard = () => {
  const {resolvedTheme, mounted} = useResolvedTheme();
  const {theme} = useTheme();
  const router = useRouter();
  const [isLoggedIn , setIsLoggedIn] = useState<boolean>(true);
  const [isWalletetConnected , setIsWalletConnected] = useState<boolean>(true);

  const [connectedAddress, setConnectedAddress]  = useState<string>("0xABCDEF9876543210"); 
  
  const [transform, setTransform] = useState(
    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)"
  );

  const walletAllowlistMap: Record<string, string[]> = {
    "0x1234567890abcdef": ["MemeMarket"], 
    "0xABCDEF9876543210": ["Friendly Giant AI"], 
  };


  const dynamicAllowlistData = useMemo(() => {
    return dashboardAllowlistTable.map((item) => {
      const projectName = item["Project name"].title;
      const isAllowlisted = walletAllowlistMap[connectedAddress]?.includes(projectName);
      return {
        ...item,
        Status: isAllowlisted ? "Allowlisted" : item.Status,
      };
    });
  }, [connectedAddress, walletAllowlistMap]);

  const table = useReactTable({
    data: dynamicAllowlistData as AllowlistRow[],
    columns: dashboardAllowlistColumns,
    getCoreRowModel: getCoreRowModel(),
  });
 

  

  if (!mounted) {

    return null;
  }
 
  const  alertText = isLoggedIn ? "Your POLS stake is insufficent for IDO and private sale participation. consider increasing your stake" : "You are not logged in. Please log in to check your eligibility.";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    // normalize -1 to 1
    const rotateX = ((y / height) + 1) * -10; 
    const rotateY = ((x / width) + 1) * 10;   

    setTransform(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05,1.05,1.05)`
    );
  };

  const handleMouseLeave = () => {
    setTransform("perspective(2000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)");
  };



  return (
    <div className='py-8'>
      <div className='py-20 px-8'>
        <div className="flex-1  grid gap-12
                [@media(max-width:500px)]:grid-cols-[calc(90vw-1rem)_250px]   
                grid-cols-[1fr_23%]
                sm:grid-cols-[1fr_45%]
                lg:grid-cols-[1fr_55%]
                xl:grid-cols-[1fr_60%]
                
        ">
          <div className='sticky top-0 self-start'>
            <div className='mt-8 flex flex-col gap-10'>
              <div className=' relative flex flex-col  gap-3'>
                {!isLoggedIn && (
                  <div className={` flex mt-4 items-center gap-3.5 rounded-lg border py-3 pl-4 pr-4 text-[var(--type-1)] ${resolvedTheme == 'dark' ? 'text-gray-400 bg-zinc-800' : 'bg-gray-200/40'} `} role='alert'>
                    <div className='flex gap-2 items-center '>
                      <Info  className={`${resolvedTheme === 'dark' ? 'text-[color:var(--type-2)]' : 'text-[color:var(--type-1)]' } size-8 `}/>
                      <p className='text-[13px] font-[600] ml-2 leading-tight text-[var(--type-1)]'> Please login to check your POLS Power and overall platform statistics</p>
                  </div>
                </div>
                )}
                <div className={` flex mt-6 items-center gap-3.5 rounded-lg border py-3 pl-4 pr-4  bg-[var(--color-warning)] ${resolvedTheme === 'dark' ? 'dtext-gray-400' : 'text-[var(--type-1)]'}  border-[var(--border-warning-border)] `} role='alert'>
                  <div className='flex gap-2 items-center '>
                    <AlertIcon  className='shrink-0  text-[color:var(--color-warning-foreground)] size-8 '/>
                    <div className='flex flex-col gap-2 ml-2'>
                      <h2 className='text-[color:var(--color-warning-foreground)] font-[600] tracking-[-0.05em] text-[16px]'> {!isLoggedIn ?  "Not Logged In" : "Account Ineligible"} </h2>
                      <p className='text-[14px] font-[600]  text-[var(--type-1)]'> {alertText}</p>
                    </div>
                  </div>
                </div>
                
                <div className='flex  flex-col gap-1.5  mt-8  ' >
                  <div className='flex items-center justify-between min-w-[350px]'>
                    <div className='flex  gap-1 '>
                      <PolsPower  className='text-[color:var(--color-primary-type)] shrink-0 ' />
                        <h2 className='__className_a17902 uppercase text-[var(--type-1)] font-[500] text-xs shrink-0'> POLS Power</h2>
                    </div>
                  <h2 className='__className_a17902 uppercase whitespace-nowrap text-[var(--type-2)] shrink-0  text-[13px] font-[500]'> Allowlist Pobability</h2>
                </div>
                {polsAssets.map(({title, value, percentage}, idx) => (
                  <div className='border min-w-[350px] flex  items-center rounded  px-2.5 py-2  justify-between gap-2' key={idx}>
                    <div className='flex flex-col gap-0.5'>
                      <h2 className='uppercase text-xs __className_a17902 font-[500] text-[var(--type-2)]'>{title} </h2>
                      <div className='flex items-center gap-1'>
                        <p className=' __className_a17902 leading-none text-[14px] font-[500]'> {value}</p>
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
              <p className='text-[0.85rem]  font-[600] opacity-90  text-[var(--type-2)] min-w-[350px]'> Probabilities are averages calculated over the most recent IDOs. Chances are not guaranteed. </p>
              </div>
            </div>
          </div>
            {/*  second column in the grid */}
            <div className='relative flex flex-col gap-12 min-w-[20rem] '>
              <div className='relative flex w-full flex-col items-center h-70 justify-center  gap-5 pt-12'>
                <Gradient className='absolute h-full w-full' />
                <div className='relative z-10 flex w-full flex-col items-center'>
                    <div className='flex flex-col items-center gap-2'>
                        <span className='inline-flex items-center justify-center
                                          gap-1 whitespace-nowrap border __className_a17902
                                           border-transparent backdrop-blur-sm
                                          uppercase h-[1.8rem] rounded-md px-2 text-[0.95rem]
                                          bg-[#00BBFF29] text-[#0095CC] font-[500]
                                        '
                        > 
                          Total POLS Power
                        </span>
                        <div className="bg-gradient-to-r from-[#0bf] to-[#7dd3fc] bg-clip-text text-transparent">
                          <span className="__className_a17902 tracking-tighter text-6xl sm:text-[7.5rem] font-[500]">0</span>
                        </div>
                        <Button className="rounded-full items-center duration-300 cursor-pointer justify-center focus-visible:outline-none focus-visible:ring-contrast mt-4  transition-all  hover:bg-contrast h-9 px-4 w-28 outline-none text-[15px] ">
                            Stake POLS
                        </Button>
                    </div>
                </div>
              </div>
              <div className='relative flex flex-col  min-w-[20rem] '>
              <div className=" relative grid  gap-3 [@media(min-width:960px)]:grid-cols-2  w-full">
                  {polsDashboard.map(({ title, value, icon: Icon }, idx) => (
                    <div
                      key={idx}
                    className={`
                       w-full rounded-xl border bg-gradient-to-r p-[0.3rem] 
                      
                      ${resolvedTheme === "dark" ? 
                      'border-[var(--color-primary-200)]/15 via-[var(--color-primary-400)]/5 from-[var(--color-primary-500)]/10  dto-[var(--color-primary-500)]/0' 
                      : ' from-[var(--color-primary-200)]/5 border-[var(--color-primary-700)]/15 '}
                    
                      `}
                    >
                      <div
                        className={`
                        relative w-full rounded-[0.6rem] bg-gradient-to-r p-3.5
                        ${resolvedTheme === 'dark' ? 'from-[var(--color-primary-500)]/10 via-[var(--color-primary-400)]/5  to-[var(--color-primary-500)]/0' : ' from-[var(--color-primary-200)]/5'}
                  
                      `}
                      >
        
                      <div className="absolute right-0 top-0 p-4">
                          <Icon className={` w-7 h-7 ${resolvedTheme === 'dark' ? "text-[var(--color-primary-200)]" : "text-[var(--color-primary-500)]"}   opacity-70 `} />
                      </div>
                      <div className="flex flex-col gap-2">
                      <h3 className={` text-[1rem] font-[600] ${resolvedTheme === 'dark' ? "text-[var(--color-primary-200)]" : "text-[var(--color-primary-500)]"} leading-none opacity-70  `}>
                          {title}
                      </h3>
                      <p className="__className_a17902 text-[1.5rem] font-[600] leading-none tracking-tight text-[var(--type-1)]">
                          {value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
              </div>
              
            <div className='flex flex-col gap-6 '>
              <div className='flex  flex-col gap-2 '>
                <div className='flex justify-between gap-12 items-center w-full'>
                  <h2 className='font-[600] text-2xl  text-[var(--type-1)]'> Achievements </h2>
                    <span className='text-[var(--type-2)] __className_a17902  text-[15px] font-[500]'>
                     <span className='text-[var(--type-1)] font-[500]'> 0 </span>
                     /18
                    </span>
                </div>
                <div className='grid  gap-5  sm:grid-cols-2 lg:grid-cols-4 '>
                  {dashboardArchievements.map(({ name, path, about }, idx) => (
                    <TooltipProvider delayDuration={300} key={idx}>
                      <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`
                          group relative flex flex-col items-center gap-1 
                          px-4 py-3 rounded-xl border shadow-[var(--surface-1)]
                          w-fit h-full
                          transition-all duration-300 !bg-transparent
                          ${resolvedTheme === "dark" ? "border-zinc-800 bg-[var(--surface-1)]" : "border-gray-200 bg-white"}
                        `}
                        >
                          <div
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            className="relative transition-transform duration-300 ease-out saturate-0  opacity-50 
                                      group-hover:opacity-100 group-hover:saturate-100
                            "
                            style={{
                              transform: transform,
                              willChange: "transform",
                              transition: "transform 300ms cubic-bezier(0.03, 0.98, 0.52, 0.99)",
                            }}
                          >
                            <Image
                              src={path}
                              alt={name}
                              width={220}
                              height={260}
                              className="object-contain rounded-lg pointer-events-none select-none"
                            />
                          </div>
                          <h3 className="line-clamp-1 text-center text-[0.85rem] font-[600]  tracking-tight">
                            {about}
                          </h3>
                          <div className="absolute bottom-0 opacity-0 group-hover:opacity-100 left-0 right-0 translate-y-full px-1.5 pb-1.5 transition-all duration-300 group-hover:translate-y-0">
                            <Link
                              href="/staking"
                              className={`
                                    inline-flex items-center justify-center gap-1.5 
                                    h-7 px-3 py-2 w-full rounded-full text-[0.77rem] 
                                     relative transition-all duration-300 font-[600] 
                                    ${resolvedTheme === "dark" ? "text-black bg-white" : "text-white bg-black"}
                              `}
                            >
                              Unlock
                            </Link>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                      side="top"
                      align="center"
                      avoidCollisions
                      sideOffset={0}
                      className={`w-43 text-center h-full ${
                                resolvedTheme === 'dark' ? 'bg-zinc-800' : 'bg-white'
                                } border-[var(--tooltip-border)] border shadow-md shadow-[var(--surface-1)]`}
                    >
                      <h2 className="text-[var(--type-1)] text-[12px] sans font-semibold tracking-tightest">
                        {about}
                      </h2>
                      <span className="text-[var(--type-2)] sans text-[12px] font-[500]">
                          hasn&apos;t been reached yet
                    </span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            
            </div>
          </div>
          <div className='flex flex-col gap-2 min-h-full'>
            <h2 className='font-[600] text-[var(--type-1)] text-[21px] tracking-wide'> Upcoming Achievements</h2>
            <div className='grid grid-cols-9 gap-4'>
              {dashboardUpcomingAchievements.map(({ name, path, info }, idx) => (
                <TooltipProvider key={idx} delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        role="img"
                        aria-label={name}
                        className="cursor-default bg-white w-full transform rounded-xl 
                                  font-sans transition-all border-gray-200 shadow-[var(--surface-1)] 
                                  dark:border-gray-800 dark:shadow-xl dark:bg-surface-1 group relative flex flex-col
                                  items-center  border-0 !bg-transparent p-0"
                      >
                        <div
                          className="opacity-50 saturate-50 transition-all duration-300 group-hover:opacity-100 group-hover:saturate-100"
                          style={{
                            willChange: "transform",
                            transition: "400ms cubic-bezier(0.03, 0.98, 0.52, 0.99)",
                          }}
                        >
                          <Image
                            alt={name}
                            src={path}
                            width={64}
                            height={64}
                            className="object-contain  rounded-lg pointer-events-none select-none"
                          />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      align="center"
                      className={`w-43 text-center   ${
                                  resolvedTheme === 'dark' ? 'bg-zinc-800' : 'bg-white'
                                  } border-[var(--tooltip-border)] border shadow-md shadow-[var(--surface-1)]`}
                    >
                      <h2 className="text-[var(--type-1)] text-[12px] sans font-semibold tracking-tightest">
                        {info}
                      </h2>
                      <span className="text-[var(--type-2)] sans text-[12px] font-[500]">
                          hasn&apos;t been reached yet
                    </span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div> 
            </div>
          </div>
              <div className={` w-full  ${
                        resolvedTheme === "dark" ? "bg-[#0a0a0a]" : "bg-white"}`}>
                <div className='overflow-x-auto overflow-y-hidden '>
                  <Table className=" border border-[var(--table-border)] overflow-hidden rounded-md border-separate border-spacing-y-0 border-spacing-x-0">
                    <TableHeader className={` ${resolvedTheme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-50'} w-full `}>
                      <TableRow className="h-12 ">
                        <TableHead colSpan={3} className="p-6 font-extrabold text-[21px] text-primary  text-left">
                          Your applications
                        </TableHead>
                      </TableRow>
                      {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id} className={`rounded border h-12 ${resolvedTheme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
                          {headerGroup.headers.map((header, index) => (
                            <TableHead
                               key={header.id}
                              className={` border-b font-[600] text-[var(--type-2)] opacity-70 text-[14px] text-left ${
                                    index === 0 ? "px-6 min-w-[400px]" : "px-8 min-w-[160px]" 
                            }`}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  {!isLoggedIn ? (
                    <TableBody >
                      <TableRow>
                        <TableCell colSpan={3} className={` ${resolvedTheme === "dark" ? "bg-[#18181b]" : "bg-[#fff]" }`} >
                          <div className="flex flex-col  items-center text-center w-full py-10">
                            <h5 className=" text-[var(--type-1)] font-bold mb-2 text-2xl">
                              Start by applying to an upcoming project
                            </h5>
                            <p className=" __className_a17902 font-[600] text-[16px] tracking-wide text-[var(--type-2)] saturate-70 opacity-80 mb-6">
                                
                                  To get allowlisted, you first need to apply to a Project. Learn how to apply here.
                                
                            </p>
                            <Link
                              className="inline-flex items-center justify-center 
                               whitespace-nowrap rounded-full border 
                               outline-none transition-all duration-200 
                               ease-in-out hover:text-black relative 
                               focus-visible:ring-contrast font-[600]
                               focus-visible:ring-offset-2 text-[17px]
                               focus-visible:ring-offset-background-1 
                               text-center border-transparent text-black hover:bg-primary-hover text-md
                              h-12 gap-2 px-7 leading-none bg-[var(--color-primary)]"
                              href="/"
                            >
                              Go to Projects
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  ) : (
                    <TableBody>
                      {table.getRowModel().rows.map((row, index) => {
                          const projectTitle = row.original["Project name"].title;
                          return (
                            <TableRow
                              key={row.id}
                              onClick={() => router.push(`/projects/${encodeURIComponent(projectTitle)}`)}
                              className={`cursor-pointer transition-colors duration-200 ${
                                resolvedTheme === "dark"
                                  ? "bg-[#18181b] hover:bg-zinc-800"
                                  : "bg-white hover:bg-zinc-100"
                              }`}
                            >
                              {row.getVisibleCells().map((cell) => (
                                <TableCell
                                  key={cell.id}
                                  className={`  ${
                                    cell.column.id === "Project name" ? "min-w-[400px]" : "px-8 min-w-[160px]"
                                  } ${index === 3 ? "" : "border-b"}`}
                                >
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                              ))}
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  
                  )}
                </Table>
                </div>
            </div>
          </div>
      </div>
    </div>
    <div className='border-border border-t mt-4  py-8' >
      <div className='flex flex-col gap-4 px-6'>
         <div className='flex items-center justify-between'>
            <h2 className=' text-2xl text-[var(--type-1)] font-[600] '> Learn about Polkastarter</h2>
            <Link href="/" className='gap-x-1 items-center justify-center group  flex text-[var(--type-1)] font-[600] focus:outline-none' >
              Explore our Blog
              <div className= "transition-transform bg-[var(--color-primary)]  shrink-0  rounded-full p-1 text-black ease-in-out group-hover:translate-x-[0.3rem]" >
                <ArrowRight strokeWidth={1.5} className='h-4 w-4' />
              </div>
            </Link>
         </div>
         <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 transition-all duration-300 group'>
         {dashboardHelpQuestions.map(({ question, answer, path }, idx) => (
           <div
           key={idx}
           className="
             w-full group/item cursor-pointer
             transition-all 
             group-hover:opacity-50 group-hover:saturate-50
             hover:!opacity-100 hover:!saturate-100
           "
           role="button"
           tabIndex={0}
           onClick={() => {
             setTimeout(() => {
               router.push("/");
             }, 2000);
           }}
           
         >
          <div className="flex flex-col gap-4 mb-8">
            <div className="relative overflow-hidden">
              <div className="aspect-[1.9/1] h-full w-full ">
                <Image
                  src={path}
                  alt={question}
                  className="object-cover rounded-[0.4rem]"
                  fill 
                  priority
                />
                {idx === 0 && (
                  <>
                    <div className="absolute inset-0  bg-opacity-40 opacity-0 transition-opacity group-hover:opacity-100   duration-300 ease-in-out "></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white transition-all duration-300 ease-in-out group-hover:scale-110">
                      <QuestionPlay />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="transition-all duration-300 ease-in-out">
              <div className="flex flex-col items-start gap-1 text-left">
                <h3 className=" text-lg font-extrabold text-[var(--type-1)]">
                  {question}
                </h3>
                <div className="text-[var(--type-2)] line-clamp-4 text-sm font-[600] opacity-80">{answer}</div>
              </div>
            </div>
          </div>
        </div>
        ))}
         </div>
      </div>
    </div>
  </div>


  )
}

export default Dashboard;
