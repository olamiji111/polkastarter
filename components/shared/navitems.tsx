'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from "next/link";
import { ChevronDown, ChevronUp} from 'lucide-react';
import {Popover, PopoverTrigger, PopoverContent} from "@/components/ui/popover"
import {headerLinks, popoverSections, socialLinks} from "@/constants";


const Navitems = () => {
  const pathname = usePathname();
  const [popoverOpen, setpopoverOpen] = useState(false);
  const wasOpenBeforeShrink = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      const isSmall = window.innerWidth < 768;

      if (isSmall) {
        if (popoverOpen) {
          wasOpenBeforeShrink.current = true;
          setpopoverOpen(false);
        }
      } else {
        if (wasOpenBeforeShrink.current) {
          setpopoverOpen(true);
          wasOpenBeforeShrink.current = false;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [popoverOpen]);

  return (
    <>
      {headerLinks.map((link) => {
          const isActive = pathname === link.route;

          return (
               <Link
                    key={link.route}
                    href={link.route}
                    className={` __className_a17902 font-[600] nav-link ${isActive ? 'nav-link-active' : ''}`}

               > 
               {link.label} </Link> 

          );
      })}

      {/* Popover Button */}
      <Popover onOpenChange={setpopoverOpen} open={popoverOpen}>
        <PopoverTrigger asChild>
          <button 
            className={`nav-link cursor-pointer h-10 ${popoverOpen ? 'bg-[var(--popover-bg)]' : ''}`}
            aria-expanded={popoverOpen}
          >
            {popoverOpen ? (
              <ChevronUp className=' w-4 h-6 bg-inherit' color='#7d7d7f' strokeWidth={2.5}/>
            ): (
              <ChevronDown className=' w-4 h-6 bg-inherit' color='#7d7d7f' strokeWidth={2.5}/>
            )}
            
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          className="flex w-58 flex-col gap-4 rounded-xl border 
                   shadow-xl z-[99999] shadow-[var(--shadow-10)] px-4 py-4"
        >
         
          {popoverSections.map((section) => (
              <div key={section.title} className='flex flex-col'> 
                <p className='font-[500]  mb-1 px-1 text-[15px]'> {section.title} </p>
                  {section.links.map(({label}) => (
                    <a 
                      key={label}
                      href="/"
                      className=' __className_a17902 popover-link tracking-wide leading-snug py-1'
                    >
                      {label}
                    </a>
                  ))}
                 
                  
              </div>
            ))} 
             <div className='h-px w-full border-t border-border-1' />
             <div className='flex flex-row items-center justify-between px-2 gap-1.5'>
                    {socialLinks.map(({label, icon:Icon, href}) => (
                      <Link 
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className='popover-social-link'
                      >
                        <Icon className='size-4' />
                      </Link>
                    ))}
             </div>
      </PopoverContent>
    </Popover>

  </>
  )
}

export default Navitems
