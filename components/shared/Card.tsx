import { IEvent } from '@/lib/database/models/event.model'
import { formatDateTime } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { DeleteConfirmation } from './DeleteConfirmation'
import { CalendarIcon, MapPinIcon, TicketIcon, User, BarChart2, Send, Edit, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { auth } from '@clerk/nextjs/server'

type CardProps = {
  event: IEvent,
  hasOrderLink?: boolean,
  hidePrice?: boolean,
  isMyTicket?: boolean
}

export default function Card({ event, hasOrderLink, hidePrice, isMyTicket }: CardProps) {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const isEventCreator = userId === event.organizer._id.toString();

  const handleSendTicket = () => {
    console.log('Sending ticket for event:', event._id)
  }

  return (
    <div className="group relative flex w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-gray-800 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <Link 
        href={`/events/${event._id}`}
        className="relative aspect-[4/3] w-full overflow-hidden"
      >
        <Image 
          src={event.imageUrl} 
          alt={event.title} 
          layout="fill" 
          objectFit="cover"
          className="transition-transform duration-300 transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent opacity-80 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-2xl font-bold text-white line-clamp-2">{event.title}</h3>
        </div>
      </Link>

      {isEventCreator && (
        <div className="absolute right-2 top-2 flex gap-2 rounded-lg bg-gray-800/50 backdrop-blur-lg p-2 shadow-sm transition-all">
          <Link href={`/events/${event._id}/update`}>
            <Button  size="icon" className="h-8 w-8 rounded-full bg-gray-700">
              <Edit className="h-4 w-4 text-gray-200" />
              <span className="sr-only">Edit</span>
            </Button>
          </Link>
          <DeleteConfirmation eventId={event._id}>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-gray-700 hover:bg-red-600">
              <Trash2 className="h-4 w-4 text-gray-200" />
              <span className="sr-only">Delete</span>
            </Button>
          </DeleteConfirmation>
        </div>
      )}

      <div className="flex flex-col gap-3 p-5 md:gap-4 flex-grow">
        {!hidePrice && (
          <div className="flex items-center gap-2">
            <span className="px-4 py-1 text-md font-regular rounded-full bg-green-900 text-green-300">
              {event.isFree ? 'FREE' : `₹${event.price}`}
            </span>
            <span className="px-4 py-1 text-md font-regular rounded-full bg-gray-700 text-gray-300">
              {event.category.name}
            </span>
          </div>
        )}

        <div className="flex items-center text-gray-400 text-sm">
          <CalendarIcon className="w-4 h-4 mr-2 flex-shrink-0" />
          <p>{formatDateTime(event.startDateTime).dateTime}</p>
        </div>

        <div className="flex items-start text-gray-400 text-md">
          <MapPinIcon className="w-4 h-4 mr-2 flex-shrink-0 mt-1" />
          <p className="break-words">{event.location}</p>
        </div>

        <div className="flex items-start text-gray-400 text-md">
          <User className="w-4 h-4 mr-2 flex-shrink-0 mt-1" />
          <p className="break-words">
            {event.organizer.firstName} {event.organizer.lastName} 
          </p>
        </div>

        {hasOrderLink && (
          <div className="mt-auto flex gap-2">
            <Link 
              href={`/orders?eventId=${event._id}`} 
              className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm font-medium text-blue-400 bg-blue-900/30 rounded-lg hover:bg-blue-900/50 transition-colors"
            >
              <TicketIcon className="w-5 h-5" />
              <span>View Orders</span>
            </Link>
            <Link 
              href={`/dashboard/${event._id}`} 
              className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm font-medium text-purple-400 bg-purple-900/30 rounded-lg hover:bg-purple-900/50 transition-colors"
            >
              <BarChart2 className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
          </div>
        )}

        {/* {isMyTicket && (
          <Button 
            className="mt-auto w-full bg-green-900/40 hover:bg-green-900/60 text-green-400"
            onClick={handleSendTicket}
          >
            <Send className="w-4 h-4 mr-2" />
            Resend Ticket on E-mail
          </Button>
        )} */}
      </div>
    </div>
  )
}