'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navitems from '@/components/shared/navitems';
import Mobilenavsheet from '@/components/shared/mobilenavsheet';
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X } from 'lucide-react';
import Polkastarter from "@/components/icons/polkastarter"
import { useTheme } from 'next-themes';
import {useResolvedTheme} from "@/components/shared/theme-context"
import { useProjectStore } from '@/store';
import { usePathname } from 'next/navigation';

const Header = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const {resolvedTheme, mounted} = useResolvedTheme();
  const selectedProject = useProjectStore((state) => state.selectedProject);
  
  const isProjectRoute =  pathname.startsWith("/projects/");
  if (!mounted) {

    return null;
  }

  
  return (
    <header  className={`fixed shadow-none z-40 backdrop-blur-[8px] w-full ${resolvedTheme === "dark" ? "transparent" : "bg-gray-50/40"}  transition-colors duration-300`}>
      
      <div className="header-wrapper flex flex-wrap items-center justify-between  py-2">
        {/* Logo */}
        <Link href="/" aria-label="Polkastarter Home">
          <Polkastarter
            className="object-contain px-4"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden w-full gap-5 md:flex md:w-auto md:flex-row">
          <Navitems />
        </div>

        {/* Right side: Login + Mobile Nav Toggle */}
        <div className="flex justify-end gap-4 mt-1">
          <div className="flex items-center gap-2">
            {/* Login Button */}
            <Button className="login-button text-md hover:bg-contrast ">
              Login
              <ArrowRight
                strokeWidth={1.5}
                className="h-4 w-4 "
             
              />
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="md:hidden mt-2"
              aria-label="Toggle Menu"
            >
              {isMobileNavOpen ? (
                <X
                  className="h-6 w-6"
                  strokeWidth={1.5}
                 
                />
              ) : (
                <Menu
                  className="mb-2 h-8 w-8"
                  strokeWidth={1.5}
                 
                />
              )}
            </button>
            <Mobilenavsheet open={isMobileNavOpen} setOpen={setIsMobileNavOpen} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;