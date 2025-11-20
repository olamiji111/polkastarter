 /* eslint-disable @typescript-eslint/no-explicit-any */
 "use client";
import {PolkastarterIconWhite} from '@/components/icons/polkastarter';
import Link from 'next/link';
import  Image from 'next/image';
import React, {useEffect, useRef, useState} from 'react'
import {SearchIcon} from "lucide-react"
import {MostPoppularHelperLinks, supportFaQ} from "@/constants";

declare global {
     interface Window {
       Tawk_API: any;
       Tawk_LoadStart: any;
     }
}
const SupportHeader = () => {
     return (
          <header  className=" bg-[#0a0c0f] shadow-none  w-full transition-colors duration-300" >
               <div className=" flex max-w-full px-1 lg:px-8 md:px-1 mx-auto items-center justify-between  py-6">
                    <Link href="/" aria-label="Polkastarter Home">
                         <PolkastarterIconWhite className="object-contain px-4" />
                    </Link>
                    <button
                         onClick={() => {
                         if (typeof window !== "undefined" && window.Tawk_API) {
                              window.Tawk_API.maximize(); // opens the chat widget
                         }
                         }}
                         className='transition-transform hover:scale-105 pr-2 cursor-pointer bg-none border-none duration-300 text-[#5868e9]'
                         >
                         contact
                         </button>
               </div>
          </header>
     )

}
const SupportPage = () => {
const formRef = useRef<HTMLFormElement | null>(null);
const [searchQuery, setSearchQuery] = useState<string>("");

 // --- Tawk.to integration ---
 useEffect(() => {
     // TypeScript-safe global Tawk_API
     if (typeof window === "undefined") return;
 
     window.Tawk_API = window.Tawk_API || {};
     window.Tawk_LoadStart = new Date();
 
     const s1 = document.createElement("script");
     s1.async = true;
     s1.src = "https://embed.tawk.to/691e76f72c4a521956c73b5e/1jafg1ek4";
     s1.charset = "UTF-8";
     s1.setAttribute("crossorigin", "*");
 
     const s0 = document.getElementsByTagName("script")[0];
     if (s0 && s0.parentNode) {
       s0.parentNode.insertBefore(s1, s0);
     } else {
       // Fallback: append to head if no script found
       document.head.appendChild(s1);
     }
   }, []);
 
     
   // ----------------------------
 

const handleSubmit = () => {
     setTimeout(() =>{
          return ;
     }, 3000)
     return;
}
     
  return (
     <main className='bg-[#0a0c0f] md:bg-gradient-to-r from-[#0b0c10] via-[#131825] to-[#2a2926] min-h-screen font-sans'>
          <SupportHeader /> 
               <section id="myDocSeaerch" className='py-16 mt-6 flex flex-col justify-center items-center gap-4  bg-transparent border-b border-b-[#ffffff14]'>
                    <h1 className='font-bold  text-white leading-9 tracking-[-0.021em] text-[30px] text-center'> Common questions and support documentation </h1>
                    <form ref={formRef}  onSubmit={handleSubmit} className='ml-auto w-full mt-6 '>
                         <div className='relative px-6  md:w-1/2 w-11/12  flex  mx-auto'>
                              <input 
                                   type='text'
                                   placeholder='Search the Knowledge base'
                                   name="search"
                                   value={searchQuery}
                                   onChange={(e)=> setSearchQuery(e.target.value)}
                                   className=' focus:shadow-[0_3px_26px_rgba(0,0,0,0.67)] w-full focus:ring-2 focus:ring-[#00BBFF]/10 relative p-5.5 text-white  text-[18px] sm:text-[19px] placeholder:text-zinc-500 ring-offset-0 outline-none h-auto border rounded-[5px] border-[#ffffff21] bg-[#0000004d]'
                                   
                              />
                              <button className='text-shadow-none  text-[18px] border-none h-auto border-l-[#ffffff21] text-white absolute right-0 top-0 bottom-0 bg-[#5868e9] hover:bg-[rgba(88,104,233,0.792)] md:px-12 px-4 rounded-r-[5px] cursor-pointer '>
                                   Search
                              </button>

                         </div>
                    </form>
               </section>
               <div id="#MostPopularQuestions" className='px-4 mt-8 py-2 flex flex-col items-center gap-4 justify-center'>
                    <h2 className='text-white font-bold text-[25px] tracking-[-0.01em] leading-normal'> Most Popular Articles </h2>
                    <div className='mt-2 grid grid-cols-2 w-full sm:w-fit gap-4 sm:gap-x-8 sm:gap-y-5  md:pl-12 items-start justify-center'>
                         {MostPoppularHelperLinks.map((link, idx) => (
                             <Link href="/support" key={idx} className='font-sans  w-full duration-300 transition-opacity flex flex-row items-baseline  gap-1' >
                                   <Image 
                                        src="/assets/icons/file-doc.png"
                                        alt="file Image"
                                        className='h-4 w-4 mt-1.5'
                                        width={10}
                                        height={10}   
                                   />
                                   <span className=' capitalize  font-normal text-white text-sm hover:text-[#5868e9]'> {link} </span>

                             </Link> 
                         ))}
                    </div>
               </div>
               <div id="#articles" className='py-8 px-5 '>
                    <div className='grid grid-cols-1 w-full md:grid-cols-2 lg:grid-cols-3 md:px-12 gap-3'>
                         {supportFaQ.map(({title, articles}, idx) => (
                               <Link href="/support" key={idx} className=' rounded-[7px] border-[#1f2733] bg-[#1b202c] hover:bg-[#5868e933] transition-colors duration-300 cursor-pointer py-12 flex flex-col items-center justify-center gap-3'>
                                   <h2 className='tracking-[6px] text-[#7986ed] leading-normal font-normal'> {title} </h2>
                                   <span className='text-white text-sm'> {articles}</span>
                               </Link>
                         ))}
                        
                    </div>
                    <p className='text-[#9b9b9b] text-[11px] mt-3 text-center'> © 
                    <Link href="/" target='_blank' rel="noopener noreferer" className='duration-300 transition-colors hover:text-zinc-800'> Polkastarter </Link> 
                    2025. Powered by 
                    <Link href="/" className='duration-300 transition-colors hover:text-zinc-800' target='_blank' rel="noopener noreferer"> Help Scout  </Link> 
               
               </p>      
               </div>
               
     </main>
   
  );
}

export default SupportPage
