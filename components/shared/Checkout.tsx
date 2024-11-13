import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IEvent } from '@/lib/database/models/event.model';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import SuccessModal from '@/components/ui/Modal';
import dayjs from 'dayjs';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingOverlay = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Confirming transaction",
    "Generating e-ticket",
    "Sending confirmation email",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = oldProgress + 1;
        if (newProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return newProgress;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setCurrentStep(Math.min(Math.floor(progress / (100 / steps.length)), steps.length - 1));
  }, [progress]);

  const variants = {
    enter: (direction: number) => {
      return {
        y: direction > 0 ? 20 : -20,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        y: direction < 0 ? 20 : -20,
        opacity: 0
      };
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl text-center max-w-md w-full mx-4 border border-gray-800">
        <div className="mb-6">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Processing Your Order</h2>
        <div className="h-12 relative mb-4">
          <AnimatePresence initial={false} custom={currentStep}>
            {steps.map((step, index) => (
              currentStep === index && (
                <motion.p
                  key={step}
                  custom={currentStep}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    y: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="text-gray-400 absolute w-full"
                >
                  {step}
                </motion.p>
              )
            ))}
          </AnimatePresence>
        </div>
        <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress === 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4 flex items-center justify-center text-green-500"
          >
            <CheckCircle2 className="mr-2" />
            <span>Order processed successfully!</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default function Component({ event, userId }: { event: IEvent; userId: string }) {
  const { user } = useUser();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const eventStartDateTime = event.startDateTime;
  const eventDate = dayjs(eventStartDateTime).format('MMMM D, YYYY');
  const eventTime = dayjs(eventStartDateTime).format('h:mm A');

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  const onCheckout = async () => {
    if (event.isFree) {
      // Handle free event ticket
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event._id,
          userId,
          amount: 0,
        }),
      });

      if (response.ok) {
        setIsModalOpen(true);
      } else {
        console.error('Failed to create order for free event');
      }
    } else {
      // Handle paid event ticket
      const priceInPaise = Number(event.price) * 100;
      const contactNumber = user?.publicMetadata?.contactNumber;

      const response = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event._id,
          userId,
          amount: priceInPaise,
        }),
      });

      const data = await response.json();

      if (!data.orderId) {
        console.error('Failed to create order');
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: 'INR',
        name: 'Eventia',
        description: event.title,
        order_id: data.orderId,
        handler: async function (response: any) {
          setIsLoading(true);

          // Create the order in your database
          const orderResponse = await fetch('/api/create-order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              eventId: event._id,
              userId,
              amount: data.amount,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          const orderData = await orderResponse.json();

          // Send confirmation email
          const emailResponse = await fetch('/api/send-confirmation-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              userId,
              eventTitle: event.title,
              userEmail: user?.emailAddresses[0].emailAddress,
              amountPaid: data.amount,
              firstname: user?.firstName,
              lastname: user?.lastName,
            }),
          });

          // Send ticket with ticketId
          const emailTicketResponse = await fetch('/api/send-ticket', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              userId,
              eventTitle: event.title,
              userEmail: user?.emailAddresses[0].emailAddress,
              amountPaid: data.amount,
              firstname: user?.firstName,
              lastname: user?.lastName,
              date: eventDate,
              time: eventTime,
              location: event.location,
              ticketid: orderData.ticketId
            }),
          });

          if (emailResponse.ok && emailTicketResponse.ok) {
            console.log(`Confirmation email and ticket sent successfully to ${user?.firstName}`);
          } else {
            console.error('Failed to send confirmation email or ticket');
          }

          // Simulate waiting for 5-6 seconds
          setTimeout(() => {
            setIsLoading(false);
            router.push('/profile'); // Redirect to profile page
          }, 5500); // 5.5 seconds
        },
        prefill: {
          name: user?.firstName + ' ' + user?.lastName,
          email: user?.emailAddresses[0].emailAddress,
          contact: contactNumber || '',
        },
        theme: {
          color: '#3399cc',
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
          }
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    }
  };

  return (
    <>
      <Button 
        onClick={onCheckout} 
        size="lg" 
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transform transition duration-500 hover:scale-105"
      >
        {event.isFree ? 'Get Ticket' : 'Buy Ticket'}
      </Button>
      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message="Your ticket for the event has been successfully booked."
      />
      {isLoading && <LoadingOverlay />}
    </>
  );
}