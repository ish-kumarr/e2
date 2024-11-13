"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation"; // Use Next.js routing

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  message,
}) => {
  const [countdown, setCountdown] = useState(4); // Initialize countdown
  const router = useRouter(); // Access the router for redirection

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";

    if (isOpen) {
      // Start countdown when modal opens
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            router.push("/profile"); // Redirect to profile page
            return prev; // Prevent countdown from going below 1
          }
          return prev - 1; // Decrease countdown
        });
      }, 1000); // Update countdown every second

      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [isOpen, router]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-gray-900 rounded-2xl p-8 shadow-2xl w-full max-w-md relative overflow-hidden"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-blue-600/30 animate-gradient-xy" />

            {/* Success icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.2,
              }}
              className="relative w-32 h-32 mx-auto mb-8"
            >
              <div className="absolute inset-0 bg-green-500 rounded-full opacity-20 animate-pulse" />
              <div className="absolute inset-2 bg-gray-900 rounded-full flex items-center justify-center">
                <CheckIcon className="w-16 h-16 text-green-500" />
              </div>
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-green-500 animate-[dash_1.5s_ease-in-out_forwards]"
                  strokeDasharray="283"
                  strokeDashoffset="283"
                />
              </svg>
            </motion.div>

            {/* Text content */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                Ticket Purchase Successful!
              </h2>
              <p className="text-gray-300 mb-4">{message}</p>
              {/* Countdown message */}
              <p className="text-gray-200">
                Redirecting you to profile page in {countdown}...
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
