"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

const SearchBar = ({ placeholder = "Search the universe..." }: { placeholder?: string }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Autofocus on the search bar when component loads
 

  // URL handling with debounce effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let newUrl = "";

      if (query) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: query,
        });
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["query"],
        });
      }

      router.push(newUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchParams, router]);

  const handleClear = () => {
    setQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="flex justify-center items-center w-full">
      <motion.div
        className="relative w-full max-w-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-full py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-lg"
          />
          <Search className="absolute left-4 text-gray-400" size={24} />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                onClick={handleClear}
                className="absolute right-4 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <X size={24} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Animated dropdown for search results */}
        <motion.div
          className="absolute w-full mt-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: query ? 1 : 0, scaleY: query ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ originY: 0 }}
        >

        </motion.div>
      </motion.div>
    </div>
  );
};

export default SearchBar;
