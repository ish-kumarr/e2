import { useState, useEffect } from 'react';
import { Ticket } from 'lucide-react';

type AttentionButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string; // Allow custom class names for different uses
};

export default function AttentionButton({ children, onClick, disabled = false, className }: AttentionButtonProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Ensure it renders only on client side
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center px-12 py-6 overflow-hidden text-xl font-bold text-white rounded-full group bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 animate-pulse ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className || ''}`} // Add custom styles if passed
    >
      <span className="relative flex items-center">
        <Ticket className="w-6 h-6 mr-2" />
        {children}
      </span>
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent shimmer"></div>
      <span className="absolute top-0 left-0 w-full bg-gradient-to-b from-white to-transparent opacity-10 h-1/3"></span>
      <span className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white to-transparent opacity-10"></span>
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .shimmer {
          animation: shimmer 1.5s infinite;
          opacity: 0.2;
        }
        @keyframes attention {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .group {
          animation: attention 2s infinite;
        }
      `}</style>
    </button>
  );
}
