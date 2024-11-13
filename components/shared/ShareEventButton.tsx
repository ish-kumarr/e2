'use client'

import { useState, useRef } from "react"
import { Share, Copy, Check, Calendar, MapPin } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface ShareEventButtonProps {
  eventId: string
  eventName: string
  eventDate: string
  eventLocation: string
  eventImage: string
}

export default function ShareEventButton({ eventId, eventName, eventDate, eventLocation, eventImage }: ShareEventButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const shareUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/events/${eventId}`

  const copyToClipboard = () => {
    if (inputRef.current) {
      inputRef.current.select()
      document.execCommand('copy')
    }
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 3000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full bg-gray-800 hover:text-white/80 text-white hover:bg-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
          <Share className="w-4 sm:w-4 h-6 mr-2" />
          <span>Share</span>
        </Button>
      </DialogTrigger>
      <AnimatePresence>
        {isOpen && (
          <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] mx-auto bg-gray-800 border-gray-700 p-0 overflow-hidden rounded-3xl" forceMount>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={eventImage}
                  alt={eventName}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{eventName}</h3>
                  <div className="flex items-center text-sm mb-1">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{eventDate}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{eventLocation}</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="text-gray-300 mb-4 text-sm"
                >
                  Be the Hero of Your Social Circle! Share this exciting event!
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className="flex items-center space-x-2"
                >
                  <Input
                    ref={inputRef}
                    value={shareUrl}
                    readOnly
                    className="flex-grow bg-gray-700 text-white border-gray-600 focus:border-blue-500 text-sm"
                  />
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Button
                      onClick={copyToClipboard}
                      className={isCopied ? "bg-green-500" : "bg-blue-500"}
                    >
                      <motion.div
                        animate={isCopied ? { rotate: [0, 360] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        {isCopied ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <Copy className="h-5 w-5" />
                        )}
                      </motion.div>
                    </Button>
                  </motion.div>
                </motion.div>
                <AnimatePresence>
                  {isCopied && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="text-green-400 text-center text-sm mt-2"
                    >
                      Link copied to clipboard!
                    </motion.p>
                  )}
                </AnimatePresence>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  className="text-xs text-gray-400 text-center mt-4"
                >
Spread the excitement! Copy the link and share it everywhere!

</motion.p>
              </div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}