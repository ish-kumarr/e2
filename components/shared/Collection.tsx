import { IEvent } from '@/lib/database/models/event.model'
import React from 'react'
import Card from './Card'
import Pagination from './Pagination'
import EmptyState from './EmptyState'

type CollectionProps = {
  data: IEvent[],
  emptyTitle: string,
  emptyStateSubtext: string,
  limit: number,
  page: number | string,
  totalPages?: number,
  urlParamName?: string,
  collectionType?: 'Events_Organized' | 'My_Tickets' | 'All_Events'
}

export default function Collection({
  data = [],
  emptyTitle,
  emptyStateSubtext,
  page,
  totalPages = 0,
  collectionType = 'All_Events',
  urlParamName,
}: CollectionProps) {
  return (
    <>
      {data.length > 0 ? (
        <div className="flex flex-col items-center gap-10">
          <ul className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
            {data.map((event) => {
              if (!event || !event._id) {
                console.warn('Skipping event due to missing or invalid _id:', event);
                return null;
              }

              const hasOrderLink = collectionType === 'Events_Organized';
              const hidePrice = collectionType === 'My_Tickets';
              const isMyTicket = collectionType === 'My_Tickets';

              return (
                <li key={event._id} className="flex justify-center">
                  <Card 
                    event={event} 
                    hasOrderLink={hasOrderLink} 
                    hidePrice={hidePrice} 
                    isMyTicket={isMyTicket}
                    
                  />
                </li>
              );
            })}
          </ul>

          {totalPages > 1 && (
            <Pagination urlParamName={urlParamName} page={page} totalPages={totalPages} />
          )}
        </div>
      ) : (
        <EmptyState
          collectionType={collectionType}
          emptyTitle={emptyTitle}
          emptyStateSubtext={emptyStateSubtext}
        />
      )}
    </>
  )
}