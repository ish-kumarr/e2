"use client"

import { useState, useEffect, startTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDownIcon, PlusCircleIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { createCategory, getAllCategories } from "@/lib/actions/category.actions"
import { ICategory } from "@/lib/database/models/category.model"

type DropdownProps = {
  value?: string
  onChangeHandler?: () => void
}

export default function FuturisticDarkDropdown({ value, onChangeHandler }: DropdownProps) {
  const [categories, setCategories] = useState<ICategory[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const handleAddCategory = () => {
    createCategory({
      categoryName: newCategory.trim()
    })
      .then((category) => {
        setCategories((prevState) => [...prevState, category])
      })
  }

  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllCategories()
      categoryList && setCategories(categoryList as ICategory[])
    }
    getCategories()
  }, [])

  return (
    <div className="relative w-full">
      <Select onValueChange={onChangeHandler} defaultValue={value} onOpenChange={setIsOpen}>
        <SelectTrigger className="w-full bg-gray-800 text-gray-200 rounded-full py-[25px] shadow-lg hover:shadow-xl transition-all duration-300 focus:ring-2 focus:ring-gray-600 focus:outline-none border border-gray-700">
          <SelectValue placeholder="Select Category" />
          {/* <ChevronDownIcon className={`ml-2 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} /> */}
        </SelectTrigger>
        <SelectContent className="bg-gray-800 text-gray-200 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
          <AnimatePresence>
            {categories.length > 0 && categories.map((category) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <SelectItem value={category._id} className="p-3 hover:bg-gray-700 transition-colors duration-200">
                  {category.name}
                </SelectItem>
              </motion.div>
            ))}
          </AnimatePresence>

          <AlertDialog>
            <AlertDialogTrigger className="w-full p-3 mt-2 flex items-center justify-center text-gray-200 bg-gray-700 rounded-md hover:bg-gray-600 transition-all duration-300">
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              Add new category
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-gray-800 text-gray-200 border border-gray-700 rounded-xl shadow-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-bold">New Category</AlertDialogTitle>
                <AlertDialogDescription>
                  <Input
                    type="text"
                    placeholder="Enter category name"
                    className="mt-4 bg-gray-700 text-gray-200 placeholder-gray-400 border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-600 focus:outline-none"
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors duration-200">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => startTransition(handleAddCategory)}
                  className="bg-gray-600 text-gray-200 hover:bg-gray-500 transition-all duration-300"
                >
                  Add
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SelectContent>
      </Select>
    </div>
  )
}