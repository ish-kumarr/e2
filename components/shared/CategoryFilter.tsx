'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { getAllCategories } from '@/lib/actions/category.actions'
import { ICategory } from '@/lib/database/models/category.model'
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'

const CategoryFilter = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState('All') // Default to 'All'
  const [categories, setCategories] = useState<ICategory[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllCategories()
      categoryList && setCategories(categoryList as ICategory[])
    }

    getCategories()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleOptionSelect = (category: string) => {
    setSelectedOption(category)
    setIsOpen(false)

    let newUrl = ''

    if (category && category !== 'All') {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'category',
        value: category,
      })
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ['category'],
      })
    }

    router.push(newUrl, { scroll: false })
  }

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <button
          onClick={toggleDropdown}
          className="w-full bg-gray-800 text-white rounded-full py-4 px-6 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-lg"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="truncate">{selectedOption}</span>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown className="text-gray-400" size={24} />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.ul
              className="absolute w-full mt-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10"
              role="listbox"
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <li
                onClick={() => handleOptionSelect('All')}
                className="px-6 py-3 text-white hover:bg-gray-700 cursor-pointer transition-colors duration-300"
                role="option"
                aria-selected={selectedOption === 'All'}
              >
                All
              </li>
              {categories.map((category) => (
                <li
                  key={category._id}
                  onClick={() => handleOptionSelect(category.name)}
                  className="px-6 py-3 text-white hover:bg-gray-700 cursor-pointer transition-colors duration-300"
                  role="option"
                  aria-selected={selectedOption === category.name}
                >
                  {category.name}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default CategoryFilter
