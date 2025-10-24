'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, useMotionValue, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { headerLinks, popoverSections, socialLinks } from '@/constants';
import Link from 'next/link';
import { usePathname , useRouter} from 'next/navigation';

interface MobilenavsheetProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Mobilenavsheet = ({ open, setOpen }: MobilenavsheetProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const y = useMotionValue(0);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const [sheetHeight, setSheetHeight] = useState(0);
  const sheetHeightRef = useRef(0); // ✅

   useEffect(() => {
    if (open) {
      y.set(0);
      requestAnimationFrame(() => {
        if (sheetRef.current) {
          sheetHeightRef.current = sheetRef.current.offsetHeight;
        }
      });
    }

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [open]);
 
   const handleDismiss = () => {
     animate(y, window.innerHeight, {
       duration: 0.2,
       onComplete: () => setOpen(false),
     });
   };

  
   const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    handleDismiss(); // closes the sheet
    setTimeout(() => router.push(href), 250); // give animation 250ms
  };
 
  return (
     <Dialog.Root open={open} onOpenChange={setOpen}>
     <Dialog.Portal>
       <Dialog.Overlay
         className="fixed inset-0 z-40 bg-black/10 outline-none transition-opacity"
         onClick={handleDismiss}
       />
       <Dialog.Content asChild forceMount>
       <motion.div
          ref={sheetRef}
          style={{ y }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.1} // small elasticity, smooth but tight
          dragMomentum={false}
          onDrag={(e, info) => {
            // Follow finger directly without delay
            if (info.offset.y > 0) y.set(info.offset.y);
            else y.set(info.offset.y * 0.3);
          }}
          onDragEnd={(_, info) => {
            const height = sheetHeightRef.current || 0;
            const shouldDismiss =
              info.offset.y > height * 0.25 || info.velocity.y > 1000;

            if (shouldDismiss) {
              animate(y, window.innerHeight, {
                duration: 0.18, // ⚡ super quick dismiss
                ease: 'easeOut',
                onComplete: () => setOpen(false),
              });
            } else {
              animate(y, 0, {
                type: 'spring',
                stiffness: 400, // ⚡ faster reaction
                damping: 30,
                mass: 0.4,
                velocity: info.velocity.y,
              });
            }
          }}
          className="fixed bottom-0 left-0 right-0 z-50 w-full rounded-t-2xl max-h-[90vh] [@media(min-width:400px)]:min-h-[80vh]  px-4 shadow-3xl bg-background outline-none"
        >
            <Dialog.Title asChild>
                    <span className="sr-only">Mobile Navigation</span>
            </Dialog.Title>
            <div className="mx-auto mt-2 mb-4 h-[5px] w-12 dark:bg-zinc-600 rounded-full dark:hover:bg-zinc-600/80 bg-gray-300/70 cursor-grab active:cursor-grabbing" />

            {/* Nav links */}
            <div className="pb-6 flex flex-col gap-4 items-start px-2">
            {headerLinks.map((link) => {
               const isActive = pathname === link.route;
               return (
                    <Link
                         key={link.route}
                         href={link.route}
                         className={` py-1  mobilenav-link ${isActive ? 'mobilenav-link-active' : ''}`}
                         onClick={(e) => handleNavigation(e, link.route)}
                    > 
                         {link.label} 
                    </Link> 

               );
               })}

               <div className="flex w-full py-6 gap-x-12 items-start px-2">
                    {popoverSections.map((section) => (
                         <div key={section.title} className="flex flex-col items-start  space-x-6 w-full">
                              <p className='font-[600]  mb-1 px-1 text-[15px]'> {section.title} </p>
                                   <div className="flex flex-col gap-1 w-full">
                                   {section.links.map(({label}) => (
                                        <a 
                                             key={label}
                                             href="/"
                                             className=' w-[150%] text-[var(--type-2)] popover-link tracking-wide '
                                        >
                                             {label}
                                        </a> 
                                   ))}
                                   </div>
                         </div>
                    ))}
               </div>
               {/*  social Links*/}
               <div className='flex flex-row items-center justify-between px-2 gap-1.5'>
                    {socialLinks.filter(({label}) => label !== "Github").map(({label, icon:Icon, href}) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className='popover-social-link'
                      >
                        <Icon className='size-4' />
                      </a>
                    ))}
               </div>
          </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Mobilenavsheet;