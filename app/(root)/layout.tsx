import Footer from "@/sections/footer";
import Header from "@/sections/header";
import {Toaster} from "sonner";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col ">
      <Header  />
          <main className="pt-8  antialiased flex-1">{children}</main>
          <Toaster position="bottom-center" richColors/>
      <Footer />
    </div>
  )
}
