import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import NavItems from "./NavItems"

const MobileNav = () => {
  return (
    <nav className="md:hidden">
      <Sheet>
        <SheetTrigger className="p-3 rounded-md hover:bg-gray-700 transition-colors">
          <Image
            src="/assets/icons/menu.svg"
            width={50}
            height={50}
            alt="menu"
            className="cursor-pointer text-white"
          />
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-6 bg-gray-900 text-gray-100 p-6 rounded-lg shadow-lg backdrop-blur-sm bg-opacity-80">
          <div className="flex items-center justify-between">
            <Image
              src="/assets/images/logo.svg"
              alt="logo"
              width={250}  // Adjusted size
              height={38}  // Adjusted size
              className="mt-10 invert"
            />
           
          </div>
          
          <Separator className="border-gray-700 mb-4" />
          
          <NavItems />
          
          <footer className="mt-auto text-center text-gray-400 text-sm">
            <p className="mb-2">&copy; {new Date().getFullYear()} Your Company</p>
            <p>
              <a href="#" className="hover:underline">Privacy Policy</a> | 
              <a href="#" className="hover:underline"> Terms of Service</a>
            </p>
          </footer>
        </SheetContent>
      </Sheet>
    </nav>
  )
}

export default MobileNav
