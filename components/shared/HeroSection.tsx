'use client'

import { useRef, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'; // Import Clerk hook
import { Button } from "@/components/ui/button"
import Component from './Badge';
import Link from 'next/link';

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { user } = useUser(); // Fetch current user status

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.9;
      videoRef.current.loop = true;
    }
  }, [])

  return (
    <div className="h-[100vh] flex flex-col relative overflow-hidden">
      {/* Video for large and medium devices */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 hidden sm:block"
        aria-hidden="true"
      >
        <source src="\assets\videos\herolg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Video for small devices */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 sm:hidden"
        aria-hidden="true"
      >
        <source src="\assets\videos\in-y2mate.com - PIET College shorts youtube celebration college piet haryana explore fyp_1080p.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay to darken the video */}
      <div className="absolute inset-0 bg-black/25 z-10" aria-hidden="true" />

      {/* Main Content */}
      <main className="flex-grow flex lg:ml-16 items-end pb-16 px-4 sm:px-6 lg:px-8 relative z-30">
        <div className="max-w-7xl">
          <Component />
          <h1 className="lg:text-6xl max-w-7xl md:text-7xl sm:text-3xl text-3xl font-bold text-white mb-6 lg:leading-tight">
            Elevate Your Campus Experience, and<br />Grow your Network.
          </h1>
          <p className="lg:text-2xl max-w-2xl sm:text-xl text-white mb-10">
            Your go-to platform for exploring and participating in campus events, make every moment count.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 -mt-3">
            <Link
             href={user ? '#events' : '/sign-in'} 
              className="group w-full max-w-sm h-14 px-6 rounded-full transition-transform duration-300 ease-in-out hover:scale-105 backdrop-blur-md bg-black/5  border  border-gray-300 hover:bg-gray-300"
              
            >
              <div className="flex items-center mt-3 space-x-3 w-full justify-center">
                {!user ? (
                  <>
                    {/* Show Google SVG when the user is not logged in */}
                    <svg
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      <path d="M1 1h22v22H1z" fill="none"/>
                    </svg>
                    <span className="text-lg  font-semibold text-gray-200 group-hover:text-black">
                      Sign in with Google
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-semibold text-gray-200 group-hover:text-black">
                    Explore Events
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* Gradient Animation */}
      <div
        className="absolute inset-x-0 -bottom-32 h-96 bg-gradient-to-t from-[#ff0050] via-[#cc00ff] via-[#ff00f5] to-[#8000ff] opacity-20 blur-3xl z-20 animate-gradient"
        aria-hidden="true"
      />

      {/* Styles for gradient animation */}
      <style jsx>{`
        @keyframes gradientMove {
          0%, 100% { transform: translateY(30%) scaleY(0.8); }
          25% { transform: translateY(20%) scaleY(1) skewY(-1deg); }
          50% { transform: translateY(10%) scaleY(1.1) skewY(1deg); }
          75% { transform: translateY(5%) scaleY(1) skewY(-1deg); }
        }
        .animate-gradient {
          animation: gradientMove 15s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-gradient { animation: none; }
        }
      `}</style>
    </div>
  )
}
