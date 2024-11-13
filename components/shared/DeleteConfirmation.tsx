'use client'

import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteEvent } from '@/lib/actions/event.actions'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface DeleteConfirmationProps {
  eventId: string
  children: React.ReactNode
}

export const DeleteConfirmation = ({ eventId, children }: DeleteConfirmationProps) => {
  const router = useRouter()

  const handleDeleteEvent = async () => {
    try {
      await deleteEvent({ eventId, path: '/profile' })
      router.refresh()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-gray-900 border border-gray-800 shadow-lg max-w-md w-[90vw]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-red-500 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Delete Event
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            This action cannot be undone. This will permanently delete your event and remove all associated data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel asChild>
            <Button variant="outline" className="w-full sm:w-auto bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border-gray-700">
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button 
              variant="destructive" 
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
              onClick={handleDeleteEvent}
            >
              <Trash2 className="h-4 w-4" />
              Delete Event
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}