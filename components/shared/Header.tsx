import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";

function Header() {
  return (
    <header className="fixed top-3 items-center left-1/2 -translate-x-1/2 w-auto h-12 md:h-16 lg:h-18 sm:px-8 md:px-8 z-50 border border-white/40 rounded-full bg-gray-900/30 text-white backdrop-blur">
      <div className="wrapper flex items-center gap-14 -mt-3 md:-mt-1.5 justify-between  md:gap-80">
        {/* Logo */}
        <Link href="/" className="w-28 md:mb-1 mb-3 md:w-36">
          <SignedIn>
            <Image
              src="/assets/images/logo.svg"
              width={128}
              height={38}
              alt="Eventia logo"
              className=" md:mt-0 mt-1" // Added md:mt-1 for logged-in users
            />
          </SignedIn>
          <SignedOut>
            <Image
              src="/assets/images/logo.svg"
              width={128}
              height={38}
              alt="Eventia logo"
              className=" md:mt-0" // Kept md:mt-0 for logged-out users
            />
          </SignedOut>
        </Link>

        {/* Navigation Items - visible on larger screens */}
        <SignedIn>
          <nav className="hidden -mt-1 -ml-[100px] md:flex md:items-center gap-x-8">
            <NavItems />
          </nav>
        </SignedIn>

        {/* User Actions and Mobile Navigation */}
        <div className="flex items-center justify-end -mt-4 md:-mt-2 gap-1 md:gap-6">
          <SignedIn>
            <div className="flex items-center -mb-2 md:mb-0">
              <UserButton />
              <MobileNav />
            </div>
          </SignedIn>
          <SignedOut>
            <Button asChild className="rounded-full bg-white text-gray-950 hover:bg-gray-300 " size="md">
              <Link href="/sign-in">Get Started</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}

export default Header;