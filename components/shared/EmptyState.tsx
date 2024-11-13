"use client"

import { Search, Calendar, Ticket, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

type EmptyStateProps = {
  collectionType: 'Events_Organized' | 'My_Tickets' | 'All_Events'
  emptyTitle: string
  emptyStateSubtext: string
}

export default function EmptyState({ collectionType, emptyTitle, emptyStateSubtext }: EmptyStateProps) {
  const getIcon = () => {
    switch (collectionType) {
      case 'Events_Organized':
        return <Calendar className="w-12 h-12 text-blue-400" />
      case 'My_Tickets':
        return <Ticket className="w-12 h-12 text-blue-400" />
      default:
        return <Search className="w-12 h-12 text-blue-400" />
    }
  }

  const getButtonText = () => {
    switch (collectionType) {
      case 'Events_Organized':
        return "Create an Event"
      case 'My_Tickets':
        return "Browse Events"
      default:
        return "Explore Events"
    }
  }

  return (
    <div className="w-full h-[400px] bg-gradient-to-br from-gray-900 via-blue-950 to-purple-900 rounded-lg shadow-lg overflow-hidden relative">
      <motion.div 
        className="absolute inset-0 opacity-10"
        initial={{ backgroundPosition: "0 0" }}
        animate={{ backgroundPosition: "100% 100%" }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />
      <div className="w-full h-full flex flex-col justify-between p-8 relative z-6">
        <motion.div 
          className="flex-1 flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row gap-8 md:gap-0 items-center space-x-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="w-24 h-24 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
                {getIcon()}
              </div>
            </motion.div>
            <div className="text-left">
              <motion.h2 
                className="text-4xl font-bold text-white mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                {emptyTitle}
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {emptyStateSubtext}
              </motion.p>
            </div>
          </div>
        </motion.div>
        {/* <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-2 group">
            {getIcon()}
            <span>{getButtonText()}</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </motion.div> */}
      </div>
    </div>
  )
}