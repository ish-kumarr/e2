import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { Preloader } from "@/components/shared/Preloader";
const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400","500","600", "700"],
  variable:'--font-poppins',
});

export const metadata: Metadata = {
  title: "Eventia | A PietPulse Project ",
  description: "Taking PIET community to the next level",
  icons:{
    icon: "/assets/images/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) 

{
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={poppins.variable}>
      <Preloader />
        {children}</body>
    </html>
    </ClerkProvider>
  );
}