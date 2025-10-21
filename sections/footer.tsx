'use client';

import React, { useEffect, useRef, useState } from 'react';
import {useTheme} from 'next-themes';
import { Button } from '@/components/ui/button';
import PolkastarterIcon from "@/components/icons/polkastarter-icon"
import { footerLinks, socialLinks , themes, ThemeType} from '@/constants';
import {DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem} from "@/components/ui/dropdown-menu"
import Link from 'next/link';
import { fetchPolsPrice } from '@/lib/fetchpolsprice';
import {ChevronUpDown} from "@/components/icons/icons"
import Polkastarter from "@/components/icons/polkastarter"
import { ChevronUp } from 'lucide-react';
import {useRouter} from "next/navigation";
import { usePathname } from 'next/navigation';
import {useResolvedTheme} from "@/components/shared/theme-context"


const Footer = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const {resolvedTheme, mounted} = useResolvedTheme();
  const [polsPrice, setPolsPrice] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const {theme, setTheme} = useTheme();
  const router = useRouter();

  useEffect(() => {
    const getPrice = async () => {
      const price = await fetchPolsPrice();
      setPolsPrice(price);
    }; 
    getPrice();
  }, []);
  
  
  const handleSelect = (value: ThemeType) => {
    setTheme(value);
    setOpen(false);
  
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    }, 50);
  };
  
  
  

  if (!mounted) {

    return null;
  }

  
  const currentTheme = themes.find((t) => t.label === theme) ?? themes[0] ;
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Add EmailJS logic here
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (err) {
      console.error('Failed to submit message:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelayedNavigation = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, 
    href: string,
  ) => {
    e.preventDefault();
    setTimeout(() => {
      router.push(href)
   }, 3000)
  }

  return (
    <footer
    className={`w-full px-4 border-t-border-border-1 ${
      resolvedTheme === "dark"
        ? "bg-[linear-gradient(to_top,#000_0%,#1d1d1f_100%)]"
        : "bg-[linear-gradient(to_top,#ffffff_0%,#fff_100%)]"
    }`}
  >
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-4 pt-8 pb-10 flex flex-col gap-[52px] sm:gap-[80px]">
        {/* Newsletter Section */}
        <div className="footer-container items-center justify-center px-7 py-10">
          <div className="footer-content flex flex-col gap-[6px] justify-center">
            <p className="text-center sm:text-left text-[15px] font-semibold sm:text-[17px] leading-[165%] text-[#2ccbff]">
              Never want to miss a sale?
            </p>
            <h2 className="text-center md:text-left text-[21px] sm:text-[24px] leading-[125%] tracking-[-0.02em] font-extrabold">
              Sign up for our newsletter and get the latest news and updates.
            </h2>
          </div>
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="w-full sm:w-full md:w-[450px] ml-auto relative"
          >
            <div className="w-full relative">
              <input
                type="email"
                name="email"
                className={`input peer pr-[35%] ${resolvedTheme === "light" ? "bg-[#00BBFF]/10]" : "" }`}
                required
              />
              <label htmlFor="email" className="label font-[600]">
                Email Address <span className="text-red-800 text-[12px]">*</span>
              </label>
              <Button type="submit" className="subscribe-button " disabled={loading}>
                {loading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </div>
          </form>
        </div>

        {/* Links + Logo Section */}
        <div className="flex w-full gap-x-25 flex-col md:flex-row lg:flex-row-reverse items-start justify-between gap-y-10">
          {/* Logo + Tagline */}
          <div className="w-full md:w-auto flex flex-col items-center [@media(min-width:600px)]:items-start text-center md:items-start md:text-left lg:items-end lg:text-right">
            <Link href="/" aria-label="Polkastarter Home">
              <Polkastarter
                className="object-contain"
              />
            </Link>
            <p className="__className_a17902 text-[15px] sm:text-[18px]  whitespace-nowrap font-[600] text-[var(--text-muted)] mt-4">
                Feels good to be early
            </p>
          </div>

          {/* Footer Links */}
          <div
            className="w-full grid grid-cols-3 
            [@media(max-width:500px)]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-2 
            text-center md:text-left items-start place-items-center
             md:place-items-start lg:gap-x-20 
            [@media(min-width:700px)]:grid-cols-4 [@media(min-width:600px)]:place-items-start
            [@media(min-width:600px)]:grid-cols-3 
            [@media(min-width:770px)]:grid-cols-2
            [@media(min-width:830px)]:grid-cols-3
            [@media(min-width:980px)]:grid-cols-4
         
            " 
          >
            {/* Mobile view: flat layout */}
            {footerLinks.map(({ title, Links }) => (
              <div key={title} className="flex flex-col gap-1   [@media(min-width:600px)]:items-start items-center min-h-[80px] md:hidden">
                <h3 className="text-[17px] font-extrabold tracking-[-0.04em] text-[color:var(--text-primary)]">
                        {title}
              </h3>
                {Links.map(({ label }) => (
                  <Link
                  key={`${title}-${label}`}
                  href="/"
                  onClick={(e) => handleDelayedNavigation(e, "/")}
                  className="
                    text-[14px] sm:text-sm font-[600]
                    text-[color:var(--link-muted)]
                    hover:text-[color:var(--link-hover)]
                    transition-colors __className_a17902
                    whitespace-nowrap
                  "
                >
                  {label}
                </Link>
                ))}
              </div>
            ))}

            {/* Desktop view: grouped layout */}
            {[
              ['Company'],
              ['Help', 'Developers'],
              ['Information', 'Products'],
              ['Resources'],
            ].map((group, index) => (
              <div key={index} className="hidden md:flex flex-col gap-10 min-h-[110px]">
                {footerLinks
                  .filter(({ title }) => group.includes(title))
                  .map(({ title, Links }) => (
                    <div key={title} className="flex flex-col gap-1">
                       <h3 className="text-[17px] tracking-[-0.04em] font-extrabold text-[color:var(--text-primary)]">
                          {title}
                        </h3>
                      {Links.map(({ label }) => (
                       <Link
                        key={`${title}-${label}`}
                        href="/"
                        onClick={(e) => handleDelayedNavigation(e, "/")}
                        className="
                         text-[15px] font-[600]
                         text-[color:var(--link-muted)]
                         __className_a17902
                         hover:text-[color:var(--link-hover)]
                         transition-colors
                         whitespace-nowrap
                        "
                      >
                       {label}
                     </Link>
                      ))}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
        <div className='items-center w-full flex flex-col gap-4 gap-y-7 md:flex-row-reverse  justify-center md:justify-between'>
          <div className='flex flex-row space-x-1 gap-2 items-center'>
            <div className='flex flex-row gap-1  cursor-pointer nav-link-active rounded-full border-none p-2' >
              <PolkastarterIcon  className='size-5'/> 
              <p className='text-[15px] font-[600] __className_a17902 text-[var(--text-muted)]'> 
                   ${polsPrice} 
              </p>
            </div>
            <Button className="hover:bg-contrast h-7 p-1 px-2 mt-1 rounded-full transition-all cursor-pointer">
              Buy POLS
            </Button> 
          </div>
          <div className='flex flex-col md:flex-row-reverse  gap-6 '>
            <div className='flex flex-row items-center justify-between px-2 gap-x-1.5'>
                    {socialLinks.map(({label, icon:Icon, href}) => (
                      <Link 
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className='px-1 text-[var(--text-muted)]
                        hover:text-[color:var(--link-hover)] '
                      >
                        <Icon className='size-4' />
                      </Link>
                    ))}
              </div> 
              <div className='w-full  items-center'>
              <DropdownMenu open={open} onOpenChange={setOpen} >
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-label="Select theme"
                    className={`items-center rounded-md border justify-center bg-background  py-6  hover:bg-contrast  text-sm cursor-pointer
                        ${theme === 'system' ? 'px-6 w-[120px]' : 'px-4 w-[105px]'}
                    `}
                  >
                    <currentTheme.icon className="ml-2 h-5 w-5 text-[color:var(--icon-color)]" />
                    <span className="px-0 capitalize text-[color:var(--text-primary-alt)] font-[600]">
                        {currentTheme.label}
                    </span>
                    {/* replace with ChevronsUpDown if you want a single double-chevron */}
                  <ChevronUpDown className="size-5 text-[rgb(152, 170, 192)] mt-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-11/12 min-h-[10px] items-start justify-start p-0 m-0 shadow-none " style={{verticalAlign:"middle"}}align="start">
                {themes.map(({ label, icon: Icon }) => {
                  const isActive = label === theme;
                    return (
                      <DropdownMenuItem
                          key={label}
                          onSelect={() => handleSelect(label)}
                          className={`
                          cursor-pointer border-none w-full rounded-none h-12 flex items-center gap-2
                          px-[10px] pt-0
                            ${isActive
                                ? "pointer-events-none bg-[var(--dropdown-bg-active)] text-[var(--dropdown-text-active)]"
                                : "group hover:bg-[var(--dropdown-bg-hover)]"
                            }
                          `}
                      >
                       <Icon
                          className={`h-5 w-4 ${
                              isActive
                                ? 'text-[var(--text-primary)]'
                                : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'
                          }`}
                        />

                        <p
                          className={`font-semibold ${
                            isActive
                              ? 'text-[var(--text-primary)]'
                              : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'
                          }`}
                        >
                          {label.charAt(0).toUpperCase() + label.slice(1)}
                        </p>
                        
                        
                      </DropdownMenuItem>
                   );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {(pathname === "/" || pathname === "/dashboard" || pathname === "/projects" || pathname.startsWith("/projects/")) && (
        <Button
          onClick={() =>  window.scrollTo({top: 0, behavior: 'smooth'})}
          className="fixed bottom-25 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[var(--footer-bg-color)]  cursor-pointer transition-all duration-300 hover:bg-[#00BBFF] group"
          aria-label="Scroll to top"
        >
          <ChevronUp  strokeWidth={2} className="size-6 text-[#00BBFF] transition-all duration-300 group-hover:animate-bounce group-hover:text-[var(--background)]" />
        </Button>
      )}
      
      </div>
    </footer>
  );
};

export default Footer;
