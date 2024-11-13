"use client";

import { ReactNode } from 'react';

interface BackgroundProps {
  children: ReactNode;
}

export default function Background({ children }: BackgroundProps) {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="blob blob-purple"></div>
        <div className="blob blob-pink"></div>
      </div>
      <div className="grain absolute inset-0 z-0"></div>

      {/* Ensure the content is layered above the background */}
      <div className="relative z-10">{children}</div>

      <style jsx>{`
        .blob {
          position: absolute;
          filter: blur(80px);
          opacity: 0.7;
          mix-blend-mode: screen;
        }
        .blob-purple {
          top: -20%;
          left: -10%;
          width: 50%;
          height: 60%;
          background: radial-gradient(
            circle at center,
            rgba(138, 43, 226, 0.8) 0%,
            rgba(103, 32, 169, 0.6) 25%,
            rgba(81, 25, 133, 0.4) 50%,
            rgba(59, 18, 97, 0.2) 75%,
            rgba(138, 43, 226, 0) 100%
          );
          animation: move 20s infinite alternate;
        }
        .blob-pink {
          bottom: -20%;
          right: -10%;
          width: 60%;
          height: 70%;
          background: radial-gradient(
            circle at center,
            rgba(255, 105, 180, 0.8) 0%,
            rgba(219, 90, 155, 0.6) 25%,
            rgba(183, 75, 129, 0.4) 50%,
            rgba(147, 60, 103, 0.2) 75%,
            rgba(255, 105, 180, 0) 100%
          );
          animation: move 25s infinite alternate-reverse;
        }
        .grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.05;
          mix-blend-mode: overlay;
        }
        @keyframes move {
          0% {
            transform: translate(0, 0) scale(1);
          }
          100% {
            transform: translate(5%, 5%) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
