"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  CheckCircle,
  Trash2,
  Download,
  AlertCircle,
  X,
  UserCheck,
  UserMinus,
  Ticket,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import "jspdf-autotable";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InputWithIcon } from "@/components/InputWithIcon";

import { getOrdersByEvent } from "@/lib/actions/order.actions";
import { IOrderItem } from "@/lib/database/models/order.model";

import { ToastProvider, useToast } from "@/components/shared/ToastContext";

interface Attendee {
  id: string;
  name: string;
  ticketId: string;
  status: "Present" | "Not Arrived";
  checkInTime: string;
}

interface Activity {
  id: string;
  type: "check-in" | "check-out" | "validation" | "report";
  message: string;
  time: string;
}

const DashboardContent = ({ initialOrders, eventId }: { initialOrders: IOrderItem[]; eventId: string }) => {
  const [selectedTab, setSelectedTab] = useState("inHall");
  const [orders, setOrders] = useState<IOrderItem[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketValidation, setTicketValidation] = useState("");
  const [validationMessage, setValidationMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [attendeeData, setAttendeeData] = useState<Attendee[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  const { addToast, toasts, removeToast } = useToast();

  useEffect(() => {
    const initialAttendees = orders.map((order) => ({
      id: order.ticketId,
      name: order.buyer,
      ticketId: order.ticketId,
      status: "Not Arrived" as const,
      checkInTime: "-",
    }));
    setAttendeeData(initialAttendees);
  }, [orders]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await getOrdersByEvent({
          eventId,
          searchString: searchQuery,
        });
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        showToast(
          "Error",
          "Failed to fetch orders. Please try again.",
          "error"
        );
      }
    };
    fetchOrders();
  }, [eventId, searchQuery]);

  const filteredAttendees = attendeeData.filter(
    (attendee) =>
      attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.ticketId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inHallAttendees = filteredAttendees.filter(
    (attendee) => attendee.status === "Present"
  );
  const notArrivedAttendees = filteredAttendees.filter(
    (attendee) => attendee.status === "Not Arrived"
  );

  const handleTicketValidation = () => {
    const attendee = attendeeData.find((a) => a.ticketId === ticketValidation);
    if (attendee) {
      setValidationMessage({
        type: "success",
        message: `Ticket ${ticketValidation} is valid for ${attendee.name}.`,
      });
      addRecentActivity({
        type: "validation",
        message: `Ticket ${ticketValidation} validated for ${attendee.name}`,
      });
      showToast("Success", "Ticket validated successfully", "success");
    } else {
      setValidationMessage({
        type: "error",
        message: `Ticket ${ticketValidation} is not valid.`,
      });
      addRecentActivity({
        type: "validation",
        message: `Invalid ticket ${ticketValidation} attempted`,
      });
      showToast("Error", "Invalid ticket", "error");
    }
  };

  const handleMarkAsPresent = (id: string) => {
    setAttendeeData((prevAttendees) =>
      prevAttendees.map((attendee) =>
        attendee.ticketId === id
          ? {
              ...attendee,
              status: "Present",
              checkInTime: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          : attendee
      )
    );
    const attendee = attendeeData.find((a) => a.ticketId === id);
    if (attendee) {
      addRecentActivity({
        type: "check-in",
        message: `${attendee.name} checked in`,
      });
      showToast("Attendee Present", `${attendee.name} has been checked in`, "success");
    }
    setSelectedTab("inHall");
  };

  const handleRemoveAttendee = (id: string) => {
    setAttendeeData((prevAttendees) =>
      prevAttendees.map((attendee) =>
        attendee.ticketId === id
          ? { ...attendee, status: "Not Arrived", checkInTime: "-" }
          : attendee
      )
    );
    const attendee = attendeeData.find((a) => a.ticketId === id);
    if (attendee) {
      addRecentActivity({
        type: "check-out",
        message: `${attendee.name} checked out`,
      });
      showToast("Attendee Removed", `${attendee.name} has been moved to Not Arrived`, "info");
    }
    setSelectedTab("notArrived");
  };

  const addRecentActivity = (activity: Omit<Activity, "id" | "time">) => {
    const newActivity = {
      ...activity,
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString(),
    };
    setRecentActivity((prev) => [newActivity, ...prev.slice(0, 4)]);
  };

  const showToast = (
    title: string,
    description: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    addToast(`${title}: ${description}`, type);
  };

  const calculateAttendanceStats = () => {
    const total = attendeeData.length;
    const present = attendeeData.filter((a) => a.status === "Present").length;
    const notArrived = attendeeData.filter(
      (a) => a.status === "Not Arrived"
    ).length;
    const checkInRate = (present / total) * 100;
    const notArrivedRate = (notArrived / total) * 100;

    return {
      total,
      present,
      checkInRate: checkInRate.toFixed(0),
      notArrivedRate: notArrivedRate.toFixed(0),
    };
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();
    const stats = calculateAttendanceStats();

    doc.setFontSize(20);
    doc.text("Event Attendance Report", 14, 15);

    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    doc.setFontSize(14);
    doc.text("Summary Statistics", 14, 30);
    doc.setFontSize(10);
    doc.text(`Total Attendees: ${stats.total}`, 14, 38);
    doc.text(`Present: ${stats.present}`, 14, 44);
    doc.text(`Not Arrived: ${stats.total - stats.present}`, 14, 50);
    doc.text(`Check-in Rate: ${stats.checkInRate}%`, 14, 56);
    doc.text(`Not Arrived Rate: ${stats.notArrivedRate}%`, 14, 62);

    doc.setFontSize(14);
    doc.text("Present Attendees", 14, 74);
    doc.autoTable({
      startY: 80,
      head: [["Name", "Ticket ID", "Check-in Time"]],
      body: attendeeData
        .filter((a) => a.status === "Present")
        .map((a) => [a.name, a.ticketId, a.checkInTime]),
    });

    const finalY = (doc as any).lastAutoTable.finalY || 150;
    doc.setFontSize(14);
    doc.text("Not Arrived Attendees", 14, finalY + 15);
    doc.autoTable({
      startY: finalY + 20,
      head: [["Name", "Ticket ID"]],
      body: attendeeData
        .filter((a) => a.status === "Not Arrived")
        .map((a) => [a.name, a.ticketId]),
    });

    doc.save("event-attendance-report.pdf");
    addRecentActivity({
      type: "report",
      message: "PDF report generated",
    });
    showToast("Report Generated", "The PDF report has been downloaded.", "success");
  };

  const stats = calculateAttendanceStats();

  return (
    <div className="min-h-screen pt-[100px] lg:pt-[120px] bg-blue-100 text-gray-900 p-4">
      <Card className="container mx-auto max-w-7xl">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <h2 className="text-3xl font-bold">Event Dashboard</h2>
                  <p className="text-gray-500">
                    Manage attendees and validate tickets efficiently.
                  </p>
                </div>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                  onClick={generatePDFReport}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
                    <div>
                      <p className="text-2xl font-bold">
                        {stats.present} / {stats.total}
                      </p>
                      <p className="text-sm text-gray-500">Attendees Present</p>
                    </div>
                    <div className="w-full sm:w-1/2 bg-gray-200 rounded-full h-2.5">
                      <motion.div
                        className="bg-blue-600 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.checkInRate}%` }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    {[
                      {
                        label: "Check-in Rate",
                        value: stats.checkInRate,
                        color: "text-green-600",
                      },
                      {
                        label: "Not Arrived",
                        value: stats.notArrivedRate,
                        color: "text-yellow-600",
                      },
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <p className={`text-xl font-bold ${stat.color}`}>
                          {stat.value}%
                        </p>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 pb-2">
                  <CardTitle>Attendee List</CardTitle>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                    <InputWithIcon
                      icon={<Search className="h-4 w-4" />}
                      placeholder="Search attendees..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-100 sm:w-auto"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs
                    value={selectedTab}
                    onValueChange={setSelectedTab}
                    defaultValue="inHall"
                    className="w-full"
                  >
                    <TabsList className="grid w-full bg-gray-200 grid-cols-2">
                      <TabsTrigger
                        value="inHall"
                        className={`${
                          selectedTab === "inHall"
                            ? "bg-green-300 rounded-lg text-white"
                            : ""
                        }`}
                      >
                        In Hall ({inHallAttendees.length})
                      </TabsTrigger>
                      <TabsTrigger
                        value="notArrived"
                        className={`${
                          selectedTab === "notArrived"
                            ? "bg-red-300 rounded-lg text-white"
                            : ""
                        }`}
                      >
                        Not Arrived ({notArrivedAttendees.length})
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="inHall">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[200px]">Name</TableHead>
                              <TableHead className="hidden sm:table-cell">
                                Ticket ID
                              </TableHead>
                              <TableHead className="hidden sm:table-cell">
                                Check-in Time
                              </TableHead>
                              <TableHead>Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <AnimatePresence>
                              {inHallAttendees.map((attendee) => (
                                <motion.tr
                                  key={attendee.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <TableCell className="font-medium">
                                    {attendee.name}
                                    <div className="sm:hidden text-sm text-gray-500">
                                      {attendee.ticketId} -{" "}
                                      {attendee.checkInTime}
                                    </div>
                                  </TableCell>
                                  <TableCell className="hidden sm:table-cell">
                                    {attendee.ticketId}
                                  </TableCell>
                                  <TableCell className="hidden sm:table-cell">
                                    {attendee.checkInTime}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      className="bg-red-100 hover:bg-red-200 hover:text-red-500 text-red-500"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleRemoveAttendee(attendee.id)
                                      }
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      <span className="hidden sm:inline">
                                        Remove
                                      </span>
                                    </Button>
                                  </TableCell>
                                </motion.tr>
                              ))}
                            </AnimatePresence>
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                    <TabsContent value="notArrived">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[200px]">Name</TableHead>
                              <TableHead className="hidden sm:table-cell">
                                Ticket ID
                              </TableHead>
                              <TableHead className="hidden sm:table-cell">
                                Status
                              </TableHead>
                              <TableHead>Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <AnimatePresence>
                              {notArrivedAttendees.map((attendee) => (
                                <motion.tr
                                  key={attendee.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <TableCell className="font-medium">
                                    {attendee.name}
                                    <div className="sm:hidden text-sm text-gray-500">
                                      {attendee.ticketId} - Not Arrived
                                    </div>
                                  </TableCell>
                                  <TableCell className="hidden sm:table-cell">
                                    {attendee.ticketId}
                                  </TableCell>
                                  <TableCell className="hidden sm:table-cell">
                                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                                      Not Arrived
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      className="bg-green-100 hover:bg-green-200 hover:text-green-500 text-green-500"
                                      size="sm"
                                      onClick={() =>
                                        handleMarkAsPresent(attendee.id)
                                      }
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      <span className="hidden sm:inline">
                                        Mark as Present
                                      </span>
                                    </Button>
                                  </TableCell>
                                </motion.tr>
                              ))}
                            </AnimatePresence>
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ticket Validation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      type="text"
                      className="bg-gray-100"
                      placeholder="Enter ticket ID"
                      value={ticketValidation}
                      onChange={(e) => setTicketValidation(e.target.value)}
                    />
                    <Button onClick={handleTicketValidation} className="w-full">
                      Validate Ticket
                    </Button>
                    {validationMessage && (
                      <Alert
                        variant={
                          validationMessage.type === "success"
                            ? "default"
                            : "destructive"
                        }
                        className={`${
                          validationMessage.type === "success"
                            ? "bg-green-50"
                            : "bg-red-50"
                        } border-l-4 ${
                          validationMessage.type === "success"
                            ? "border-green-500"
                            : "border-red-500"
                        }`}
                      >
                        {validationMessage.type === "success" ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                          <AlertCircle className="h-6 w-6 text-red-500" />
                        )}
                        <AlertTitle
                          className={`text-lg ${
                            validationMessage.type === "success"
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {validationMessage.type === "success"
                            ? "Success"
                            : "Error"}
                        </AlertTitle>
                        <AlertDescription
                          className={`text-base ${
                            validationMessage.type === "success"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {validationMessage.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div className="space-y-4">
                    <AnimatePresence>
                      {recentActivity.map((activity) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center space-x-4 p-2 rounded-md bg-gray-50"
                        >
                          {activity.type === "check-in" && (
                            <UserCheck className="h-5 w-5 text-green-500" />
                          )}
                          {activity.type === "check-out" && (
                            <UserMinus className="h-5 w-5 text-red-500" />
                          )}
                          {activity.type === "validation" && (
                            <Ticket className="h-5 w-5 text-blue-500" />
                          )}
                          {activity.type === "report" && (
                            <FileText className="h-5 w-5 text-purple-500" />
                          )}
                          <div className="flex-grow">
                            <p className="text-sm font-medium">{activity.message}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {recentActivity.length === 0 && (
                      <p className="text-sm text-gray-500">
                        No recent activity
                      </p>
                    )}
                  </motion.div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="fixed top-4 right-4 flex flex-col gap-2 w-full max-w-xs z-50">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`p-4 rounded-md shadow-md flex justify-between items-center ${
                toast.type === 'success' ? 'bg-green-500' :
                toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
              } text-white`}
            >
              <span>{toast.message}</span>
              <button onClick={() => removeToast(toast.id)} className="text-white">
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function UpdatedEventDashboard({ initialOrders, eventId }: { initialOrders: IOrderItem[]; eventId: string }) {
  return (
    <ToastProvider>
      <DashboardContent initialOrders={initialOrders} eventId={eventId} />
    </ToastProvider>
  );
}