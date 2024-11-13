// components/shared/EventDetailsSkeleton.tsx

const EventDetailsSkeleton = () => {
    return (
      <div className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl animate-pulse">
          <div className="h-full min-h-[300px] bg-gray-300" />
  
          <div className="flex w-full flex-col gap-8 p-5 md:p-10">
            <div className="flex flex-col gap-6">
              <div className="h-8 bg-gray-300 rounded w-3/4" />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-3">
                  <div className="h-10 w-20 bg-gray-300 rounded-full" />
                  <div className="h-10 w-20 bg-gray-300 rounded-full" />
                </div>
                <div className="h-6 bg-gray-300 rounded w-1/2 mt-2 sm:mt-0" />
              </div>
            </div>
            <div className="h-12 bg-gray-300 rounded w-full" />
            <div className="flex flex-col gap-5">
              <div className="flex gap-2 md:gap-3">
                <div className="h-8 w-8 bg-gray-300 rounded-full" />
                <div className="h-8 bg-gray-300 rounded w-full" />
              </div>
              <div className="h-8 bg-gray-300 rounded w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-8 bg-gray-300 rounded w-full" />
              <div className="h-8 bg-gray-300 rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default EventDetailsSkeleton;
  