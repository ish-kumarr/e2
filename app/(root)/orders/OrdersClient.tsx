'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getOrdersByEvent } from '@/lib/actions/order.actions'
import { formatDateTime, formatPrice } from '@/lib/utils'
import { IOrderItem } from '@/lib/database/models/order.model'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default function OrdersClient({ initialOrders, eventId, initialSearchTerm }: { initialOrders: IOrderItem[], eventId: string, initialSearchTerm: string }) {
  const [orders, setOrders] = useState<IOrderItem[]>(initialOrders)
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [eventTitle, setEventTitle] = useState("Event")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialOrders.length > 0) {
      setEventTitle(initialOrders[0].eventTitle)
    }
  }, [initialOrders])

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      setError(null)
      try {
        console.log('Fetching orders for eventId:', eventId, 'with searchTerm:', searchTerm)
        const fetchedOrders = await getOrdersByEvent({ eventId, searchString: searchTerm })
        console.log('Orders fetched:', fetchedOrders.length)
        setOrders(fetchedOrders)
        if (fetchedOrders.length > 0) {
          setEventTitle(fetchedOrders[0].eventTitle)
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
        setError('Failed to fetch orders. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [eventId, searchTerm])

  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
  const latestOrder = orders.length > 0 ? new Date(Math.max(...orders.map(o => new Date(o.createdAt).getTime()))) : new Date()

  const formatPriceForPDF = (amount: string) => {
    const numAmount = Number(amount)
    return `INR ${numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    
    doc.setFontSize(18)
    doc.text(`${eventTitle} Sales Report`, 14, 22)
    
    doc.setFontSize(12)
    doc.text(`Total Orders: ${totalOrders}`, 14, 32)
    doc.text(`Total Revenue: ${formatPriceForPDF((totalRevenue / 100).toString())}`, 14, 40)
    doc.text(`Latest Order: ${formatDateTime(latestOrder).dateTime}`, 14, 48)

    doc.autoTable({
      head: [['Order ID', 'Buyer', 'Created', 'Amount']],
      body: orders.map(order => [
        order._id,
        order.buyer,
        formatDateTime(order.createdAt).dateTime,
        formatPriceForPDF((Number(order.totalAmount) / 100).toString())
      ]),
      startY: 60,
    })

    doc.save(`${eventTitle.replace(/\s+/g, '_')}_sales_report.pdf`)
  }

  if (isLoading) {
    return <div className="min-h-screen bg-gray-950 pt-[100px] lg:pt-[120px] text-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center">Loading orders...</h1>
    </div>
  }

  if (error) {
    return <div className="min-h-screen bg-gray-950 pt-[100px] lg:pt-[120px] text-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center">Error</h1>
      <p className="text-center">{error}</p>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-[100px] lg:pt-[120px] text-gray-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">{`${eventTitle} Sales`}</h1>
        
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Orders</CardTitle>
              <Search className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{totalOrders}</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
              <Download className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{formatPrice(totalRevenue.toString())}</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Latest Order</CardTitle>
              <Search className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{formatDateTime(latestOrder).dateTime}</div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gray-900 border-gray-800 rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <h2 className="text-3xl font-bold text-gray-100 w-full">Order Details</h2>
            <div className="flex flex-row md:justify-end space-x-2 w-full">
              <div className="relative w-[90%] md:w-[70%]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search buyer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              <Button 
                onClick={downloadPDF} 
                className="bg-blue-600 hover:bg-blue-700 text-white w-[13%] px-2 py-2 h-10"
                aria-label="Download PDF"
              >
                <Download className="h-4 w-4 mx-auto" />
                <span className="sr-only">Download PDF</span>
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-t border-gray-800">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="py-3 px-4 text-left font-semibold text-gray-300">Order ID</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-300">Buyer</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-300">Created</th>
                  <th className="py-3 px-4 text-right font-semibold text-gray-300">Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-500">
                      Sorry, No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order: IOrderItem) => (
                    <tr key={order._id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                      <td className="py-3 px-4 font-medium text-blue-400">{order._id}</td>
                      <td className="py-3 px-4 text-gray-100">{order.buyer}</td>
                      <td className="py-3 px-4 text-gray-100">{formatDateTime(order.createdAt).dateTime}</td>
                      <td className="py-3 px-4 text-right text-gray-100">{formatPrice(order.totalAmount)}</td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-800">
                  <td colSpan={3} className="py-3 px-4 font-semibold text-gray-300">Total</td>
                  <td className="py-3 px-4 text-right font-bold text-green-400">{formatPrice(totalRevenue.toString())}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}