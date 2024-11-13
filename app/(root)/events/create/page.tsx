import EventForm from "@/components/shared/EventForm";
import { auth } from "@clerk/nextjs/server"

const CreateEvent = () => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  return (
    <div className="bg-gray-900 pt-[100px] lg:pt-[120px] text-white min-h-screen">
      <section className="bg-gray-800 bg-dottedd-pattern bg-cover bg-center py-4 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left text-gray-100">Create Event</h3>
      </section>

      <div className="wrapper text-gray-50 mb-0 py-5 my-8">
        <EventForm userId={userId} type="Create" />
      </div>
    </div>
  )
}

export default CreateEvent