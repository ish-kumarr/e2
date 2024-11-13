"use client";

import { IEvent } from '@/lib/database/models/event.model';
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import Checkout from './Checkout';
import { useRouter } from 'next/navigation';

const CheckoutButton = ({ event }: { event: IEvent }) => {
  const { user, isLoaded } = useUser(); // Add `isLoaded` to check if user is loaded
  const userId = user?.publicMetadata.userId as string;
  const hasEventFinished = new Date(event.endDateTime) < new Date();

  const [hasPurchased, setHasPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkIfPurchased = async () => {
      if (userId && event._id) {
        try {
          const response = await fetch(`/api/ticket-purchase?userId=${userId}&eventId=${event._id}`);
          
          if (!response.ok) {
            console.error('Error response from server:', response.statusText);
            return;
          }

          const data = await response.json();
          setHasPurchased(data.hasPurchased);
        } catch (error) {
          console.error('Error checking ticket purchase:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false); // Stop loading if no userId is available
      }
    };

    if (userId) {
      checkIfPurchased();
    } else {
      setIsLoading(false); // No need to check if the user is not logged in
    }
  }, [userId, event._id]);

  const handleRedirect = () => {
    router.push('/profile');
  };

  if (!isLoaded) {
    return <Button disabled className="rounded-full w-auto px-4 py-2">Loading...</Button>;
  }

  return (
    <div className="flex items-center gap-3">
      {hasEventFinished ? (
        <p className="bg-red-100 text-red-800 text-sm font-medium px-4 py-2 rounded-full dark:bg-red-900 dark:text-red-300">
          Sorry, tickets are no longer available.
        </p>
      ) : (
        <>
          <SignedOut>
            <Button asChild className="button rounded-full" size="lg">
              <Link href="/sign-in">
                Login to Get Ticket
              </Link>
            </Button>
          </SignedOut>

          <SignedIn>
            {isLoading ? (
              <Button disabled className="rounded-full w-auto px-4 py-2">Loading...</Button>
            ) : (
              hasPurchased ? (
                <div className="flex items-center gap-4">
                  <Button 
                    className="bg-green-500 text-white rounded-full px-4 py-2 hover:bg-green-600" 
                    onClick={handleRedirect}
                  >
                    Ticket Purchased
                  </Button>
                  <p className="text-sm text-gray-600">
                    Check your e-mail for details.
                  </p>
                </div>
              ) : (
                <Checkout event={event} userId={userId} />
              )
            )}
          </SignedIn>
        </>
      )}
    </div>
  );
};

export default CheckoutButton;
