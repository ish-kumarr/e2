import HeroSection from "@/components/shared/HeroSection";
import Collection from "@/components/shared/Collection";
import { getAllEvents } from '@/lib/actions/event.actions';
import { SearchParamProps } from '@/types';
import Search from "@/components/shared/Search";
import CategoryFilter from "@/components/shared/CategoryFilter";

export default async function Home({ searchParams }: SearchParamProps) {
  const page = Number(searchParams?.page) || 1;
  const searchText = (searchParams?.query as string) || '';
  const category = (searchParams?.category as string) || '';

  const events = await getAllEvents({
    query: searchText,
    category,
    page,
    limit: 6
  });

  return (
    <>

    <div className="bg-gray-900">
      <HeroSection />  {/* Using the HeroSection component here */}

      <section id="events" className="wrapper text-white/90 mt-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">
          One Platform that<br /> Hosts{" "}
          <span className="bg-clip-text text-transparent bg-grad-1 bg-[length:200%_auto] animate-gradient-move">
            Many Events
          </span>
        </h2>

        <div className="flex w-full flex-col gap-5 md:flex-row">
          <Search />
          <CategoryFilter />
        </div>

        <Collection
          data={events?.data}
          emptyTitle="No Events Found"
          emptyStateSubtext="No events yet, but we're working on it!"
          collectionType="All_Events"
          limit={6}
          page={page}
          totalPages={events?.totalPages}
        />
      </section>
      </div>
    </>
  );
}
