import Link from "next/link";

export default function Component() {
    return (
      <div className="inline-block">
        <div className="relative group">
        <Link href="/about" className="inline-block">
      <button
        className="relative px-3 sm:px-4 py-2.5 mb-4 bg-black/20 backdrop-blur-md rounded-full outline outline-1 sm:outline-0.5 outline-white/20 leading-none flex items-center divide-x divide-gray-600 text-xs sm:text-sm"
        aria-label="See what's new in Eventia 2.0"
      >
        <span className="flex items-center space-x-2 sm:space-x-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 sm:h-4 sm:w-4 text-pink-600 -rotate-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
          <span className="pr-2 sm:pr-3 text-gray-100">Eventia 2.0 is here!</span>
        </span>
        <span className="pl-2 sm:pl-3 text-indigo-400 group-hover:text-gray-100 transition duration-200">
          See what's new
        </span>
      </button>
    </Link>
        </div>
      </div>
    )
  }