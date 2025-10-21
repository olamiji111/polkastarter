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
  useEffect(() => {
     if (open) {
       y.set(0);
       requestAnimationFrame(() => {
         if (sheetRef.current) {
           setSheetHeight(sheetRef.current.offsetHeight);
         }
       });
     }
 
     const unsubscribe = y.on('change', (v) => {
       // Optional: monitor y changes
     });
 
     const handleResize = () => {
       if (window.innerWidth >= 768) {
         setOpen(false);
       }
     };
 
     window.addEventListener('resize', handleResize);
     return () => {
       unsubscribe();
       window.removeEventListener('resize', handleResize);
     };
   }, [open]);
 
   const handleDismiss = () => {
     animate(y, window.innerHeight, {
       duration: 0.2,
       onComplete: () => setOpen(false),
     });
   };

   const handleDelayedNavigation = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, 
    href: string,
  ) => {

    e.preventDefault();
    setTimeout(() => {
      router.push(href)
      handleDismiss();
   }, 2000)
  }
 
  return (
     <Dialog.Root open={open} onOpenChange={setOpen}>
     <Dialog.Portal>
       <Dialog.Overlay
         className="fixed inset-0 z-40 bg-black/40 outline-none transition-opacity"
         onClick={handleDismiss}
       />
       <Dialog.Content asChild forceMount>
         <motion.div
           ref={sheetRef}
           style={{ y }}
           drag="y"
           dragDirectionLock
           dragConstraints={{ top: 5 }}
           dragElastic={0.05}
           dragMomentum={false}
           onDragEnd={(e, info) => {
             if (info.offset.y > (sheetHeight || 0) * 0.5) {
               handleDismiss();
             } else {
               animate(y, 0, {
                 type: 'spring',
                 stiffness: 300,
                 damping: 40,
               });
             }
           }}
               className="fixed bottom-0 left-0 right-0 z-50 w-full rounded-t-2xl min-h-[60vh]  px-4  shadow-2xl bg-background transition-transform outline-none"
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
                         onClick={() => setOpen(false)}
                    > 
                         {link.label} 
                    </Link> 

               );
               })}

               <div className="flex w-full py-6 gap-x-24 items-start px-2">
                    {popoverSections.map((section) => (
                         <div key={section.title} className="flex flex-col items-start  space-x-6">
                              <p className='font-[500]  mb-1 px-1 text-[15px]'> {section.title} </p>
                                   <div className="flex flex-col gap-1">
                                   {section.links.map(({label}) => (
                                        <a 
                                             key={label}
                                             href="/"
                                             className='popover-link tracking-wide leading-snug py-1 '
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