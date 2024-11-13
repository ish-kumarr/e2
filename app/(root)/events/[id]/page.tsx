import Image from "next/image"
import { getEventById, getRelatedEventsByCategory } from "@/lib/actions/event.actions"
import { formatDateTime } from "@/lib/utils"
import { SearchParamProps } from "@/types"
import CheckoutButton from "@/components/shared/CheckoutButton"
import Collection from "@/components/shared/Collection"
import ShareEventButton from "@/components/shared/ShareEventButton"
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const event = await getEventById(params.id)

  if (!event) {
    return {
      title: 'Event Not Found',
      description: 'The requested event could not be found.',
    }
  }

  const ogImageUrl = new URL(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/og`)
  ogImageUrl.searchParams.append('title', event.title)
  ogImageUrl.searchParams.append('date', formatDateTime(event.startDateTime).dateOnly)
  ogImageUrl.searchParams.append('location', event.location)

  return {
    title: event.title,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: event.description,
      images: [ogImageUrl.toString()],
    },
  }
}

const EventDetails = async ({ params: { id }, searchParams }: SearchParamProps) => {
  const event = await getEventById(id)

  if (!event) {
    return <div className="flex items-center justify-center min-h-screen text-white">Event not found</div>
  }

  const relatedEvents = await getRelatedEventsByCategory({
    categoryId: event.category._id,
    eventId: event._id,
    page: searchParams.page as string,
  })

  return (
    <>
      <section className="flex justify-center bg-gray-900 bg-dotted-pattern bg-contain pt-[100px] lg:pt-[110px]">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-[1380px] gap-8 p-4 md:p-8">
          <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              priority
              className="object-cover object-center rounded-lg"
            />
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <h2 className="h2-bold text-white">{event.title}</h2>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-3">
                  <p className="p-bold-20 rounded-full bg-green-800/90 px-5 py-2 text-green-400">
                    {event.isFree ? "FREE" : `₹${event.price}`}
                  </p>
                  <p className="p-medium-16 rounded-full bg-gray-800/90 px-4 py-2.5 text-gray-300">
                    {event.category.name}
                  </p>
                </div>

                <p className="p-medium-18 ml-2 mt-2 sm:mt-0 text-gray-300">
                  by{" "}
                  <span className="text-blue-300">
                    {event.organizer.firstName} {event.organizer.lastName}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex gap-2 md:gap-3">
                <Image
                  src="/assets/icons/calendar.svg"
                  alt="calendar"
                  width={32}
                  height={32}
                />
                <div className="p-medium-16 lg:p-regular-20 flex flex-wrap items-center text-gray-300">
                  <p className="mr-2">
                    {formatDateTime(event.startDateTime).dateOnly} -{" "}
                    {formatDateTime(event.startDateTime).timeOnly}
                  </p>
                  <span className="text-gray-400">To</span>{" "}
                  <p className="ml-2">
                    {formatDateTime(event.endDateTime).dateOnly} -{" "}
                    {formatDateTime(event.endDateTime).timeOnly}
                  </p>
                </div>
              </div>

              <div className="p-regular-20 flex items-center gap-3">
                <Image
                  src="/assets/icons/location.svg"
                  alt="location"
                  width={32}
                  height={32}
                />
                <p className="p-medium-16 lg:p-regular-20 text-gray-300">{event.location}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="p-bold-20 text-gray-300">What You'll Learn:</p>
              <p className="p-medium-16 lg:p-regular-18 text-gray-400">{event.description}</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <CheckoutButton event={event} />
              <ShareEventButton 
                eventId={event._id}
                eventName={event.title}
                eventDate={formatDateTime(event.startDateTime).dateOnly}
                eventLocation={event.location}
                eventImage={event.imageUrl}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold text-white">Related Events</h2>

        <Collection
          data={relatedEvents?.data}
          emptyTitle="No Related Events Found"
          emptyStateSubtext="Check back later for new events"
          collectionType="All_Events"
          limit={3}
          page={searchParams.page as string}
          totalPages={relatedEvents?.totalPages}
        />
      </section>
    </>
  )
}

export default EventDetails