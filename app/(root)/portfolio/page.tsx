
'use client';

import React, { useEffect, useState } from 'react'
import PortfolioRect from "@/components/icons/portfoliorect";
import {useResolvedTheme} from "@/components/shared/theme-context"
import { useTheme } from 'next-themes';
import Image from "next/image";
import  Link  from 'next/link';


const Portfolio = () => {
     const {resolvedTheme, mounted} = useResolvedTheme();
     const {theme} = useTheme();
     const [isLoggedIn , setIsLoggedIn] = useState<boolean>(true);
     const [isWalletetConnected , setIsWalletConnected] = useState<boolean>(false);

     
     if (!mounted) { 
          return null;
     }

     return (
     <div className='py-8'>
          <div className='py-16 px-8'>
               <div className='flex flex-col items-center justify-center gap-4'>
                    <div className='w-full p-3 bg-[#00BBFF29]/40 border border-[rgba(0,187,255,0.2)] rounded-[7px] items-center text-center'>
                         <p className='text-[var(--type-6)] text-[15px] font-[600] '> It can take up to 2 minutes after joining a sale for Allocations to appear. </p>
                        
                    </div>
                    <div className='h-full mt-10 min-w-[450px]'>
                              <PortfolioRect className='aspect'/>
                    </div>
                    {!isWalletetConnected  ? (
                         <h2 className='sm:text-[36px] text-[32px] text-center  text-primary font-extrabold'> Connect your wallet to see your allocations </h2>
                    ) : (
                         <h2 className='text-[36px]  font-extrabold'> You dont have any allocations yet </h2>  
                    )}
                    <p className='text-[var(--type-3)] text-center whitespace-normal font-[600] opacity-80 text-[16px] leading-loose tracking-[0.04rem]'> Allocations for all the sales that you are participating in will show up here.</p>
          
                    <Link
                         className=" flex items-center justify-center 
                         whitespace-nowrap rounded-full border 
                         outline-none transition-all duration-200 
                         cursor-pointer text-center  font-[600] text-[17px]
                         border-transparent  hover:opacity-90 
                         h-14 px-6 bg-[var(--color-primary)] text-[var(--type-5)] mt-2 "
                         
                         href="/projects"
                    >
                         Go to Projects
                    </Link>
          </div>

     </div>
      
    </div>
  )
}

export default Portfolio
