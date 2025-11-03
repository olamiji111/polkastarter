'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navitems from '@/components/shared/navitems';
import Mobilenavsheet from '@/components/shared/mobilenavsheet';
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X } from 'lucide-react';
import Polkastarter from "@/components/icons/polkastarter"
import {useResolvedTheme} from "@/components/shared/theme-context"
import SignIn from './sign-in';
import { useWalletStore } from "@/store";
import {generateGradientFromAddress} from "@/utils";
import Connectedpopover from "@/components/shared/connectedpopover";
import { useAppKitAccount } from '@reown/appkit/react';



const Header = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSigInOpen, setIsSignInOpen] = useState(false);
  const [isPopoverOpen, setIsPopOverOpen] = useState<boolean>(false);
  const {resolvedTheme, mounted} = useResolvedTheme();
  const {loginType, walletAddress, userName, userImage, logout, setWallet} = useWalletStore();
  const {address, isConnected} = useAppKitAccount();
 
  

  useEffect(() => {
    if (isConnected && address) {
      console.log("🔄 Restoring wallet:", address);
      setWallet(address);
      setIsPopOverOpen(false);
      
    } else {
      console.log("⚠️ No active AppKit wallet session found");
    }
  }, [isConnected, address, setWallet]);


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
            {walletAddress && !userImage ? (
              <>
                <div
                  className="w-8 h-8 rounded-full cursor-pointer"
                  style={{
                    background: generateGradientFromAddress(walletAddress),
                  }}
                onClick={() => setIsPopOverOpen(true)}
                />
                {isPopoverOpen && (
                  <Connectedpopover open={isPopoverOpen} setOpen={setIsPopOverOpen} />
                )

                }  
              </>
            ) : walletAddress && userImage ? (
            
              <div
                className="flex items-center gap-2 cursor-pointer"
          
              >
                <Image
                  src={userImage }
                  alt={userName || "User"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <ArrowRight className="h-4 w-4 " strokeWidth={1.5} />
              </div>
            ) : (
             
              <Button
                className="login-button text-[14px] hover:bg-contrast font-[400] flex items-center gap-1.5"
                onClick={() => setIsSignInOpen(true)} 
              >
                <span>Login</span>
                <ArrowRight className="h-4 w-4 " strokeWidth={1.5} />
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="md:hidden mt-2"
              aria-label="Toggle Menu"
            >
              {isMobileNavOpen ? (
                <X
                  className="h-8 w-8"
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
      <SignIn open={isSigInOpen} onOpenChange={setIsSignInOpen} />
    </header>
  );
};

export default Header;