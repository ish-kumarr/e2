import EventForm from "@/components/shared/EventForm";
import { getEventById } from "@/lib/actions/event.actions";
import { auth } from "@clerk/nextjs/server";

type UpdateEventProps = {
  params: {
    id: string;
  };
};

const UpdateEvent = async ({ params: { id } }: UpdateEventProps) => {
  const { sessionClaims } = auth();

  const userId = sessionClaims?.userId as string;
  const event = await getEventById(id);

  return (
    <>
      {" "}
      <div className="bg-gray-900 pt-[100px] lg:pt-[120px] text-white min-h-screen">
        <section className="bg-gray-800 bg-dottedd-pattern bg-cover bg-center py-4 md:py-10">
          <h3 className="wrapper  h3-bold text-center sm:text-left">
            Update Event
          </h3>
        </section>

        <div className="wrapper my-8">
          <EventForm
            type="Update"
            event={event}
            eventId={event._id}
            userId={userId}
          />
        </div>
      </div>
    </>
  );
};

export default UpdateEvent;
