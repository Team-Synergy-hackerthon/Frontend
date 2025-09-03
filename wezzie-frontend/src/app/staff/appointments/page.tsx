"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Ambulance,
  Bell,
  Settings,
  ChevronLeft,
  LogOut,
  Search,
  Clock,
  Hospital,
  X,
  Edit,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";

// Type definitions
interface SidebarLink {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface Appointment {
  id: number;
  patient: string;
  date: string;
  time: string;
  clinic: string;
  status: "Requested" | "Scheduled" | "In Progress" | "Completed" | "Cancelled" | "Declined" | "Rescheduled";
}

const sidebarLinks: SidebarLink[] = [
  { title: "Dashboard", href: "/staff", icon: LayoutDashboard },
  { title: "Appointments", href: "/staff/appointments", icon: Calendar },
  { title: "Patients", href: "/staff/patients", icon: Users },
  { title: "Clinics", href: "/staff/clinics", icon: Hospital },
  { title: "Drivers", href: "/staff/drivers", icon: Ambulance },
  { title: "Emergency Requests", href: "/staff/emergency-requests", icon: Bell },
  { title: "Settings", href: "/staff/settings", icon: Settings },
];

const initialAppointments: Appointment[] = [
  { id: 1, patient: "John Doe", date: "2025-09-05", time: "10:00", clinic: "Main Clinic", status: "Scheduled" },
  { id: 2, patient: "Jane Smith", date: "2025-09-06", time: "11:30", clinic: "East Branch", status: "Requested" },
  { id: 3, patient: "Alice Johnson", date: "2025-09-07", time: "14:00", clinic: "Main Clinic", status: "Scheduled" },
  { id: 4, patient: "Bob Wilson", date: "2025-09-08", time: "09:00", clinic: "West Clinic", status: "Requested" },
];

export default function StaffAppointmentsPage() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState<number | null>(null);
  const [confirmRescheduleAppointmentId, setConfirmRescheduleAppointmentId] = useState<number | null>(null);
  const [approveAppointmentId, setApproveAppointmentId] = useState<number | null>(null);
  const [declineAppointmentId, setDeclineAppointmentId] = useState<number | null>(null);
  const [newDate, setNewDate] = useState<Date | undefined>(undefined);
  const [newTime, setNewTime] = useState<string>("");
  const pathname = usePathname();
  const router = useRouter();

  const handleApprove = () => {
    if (approveAppointmentId) {
      setAppointments((prev) =>
        prev.map((app) => (app.id === approveAppointmentId ? { ...app, status: "Scheduled" } : app))
      );
      toast({
        title: "Appointment Approved",
        description: `Appointment for ${appointments.find((app) => app.id === approveAppointmentId)?.patient} has been approved.`,
      });
      setApproveAppointmentId(null);
    }
  };

  const handleDecline = () => {
    if (declineAppointmentId) {
      setAppointments((prev) =>
        prev.map((app) => (app.id === declineAppointmentId ? { ...app, status: "Declined" } : app))
      );
      toast({
        title: "Appointment Declined",
        description: `Appointment for ${appointments.find((app) => app.id === declineAppointmentId)?.patient} has been declined.`,
      });
      setDeclineAppointmentId(null);
    }
  };

  const handleReschedule = () => {
    if (rescheduleAppointmentId && newDate && newTime) {
      setConfirmRescheduleAppointmentId(rescheduleAppointmentId);
      setRescheduleAppointmentId(null);
    } else {
      toast({
        title: "Error",
        description: "Please select a valid date and time.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmReschedule = () => {
    if (confirmRescheduleAppointmentId && newDate && newTime) {
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === confirmRescheduleAppointmentId
            ? { ...app, date: format(newDate, "yyyy-MM-dd"), time: newTime, status: "Rescheduled" }
            : app
        )
      );
      toast({
        title: "Appointment Rescheduled",
        description: `Appointment for ${appointments.find((app) => app.id === confirmRescheduleAppointmentId)?.patient} has been rescheduled to ${format(newDate, "PPP")} at ${newTime}.`,
      });
      setConfirmRescheduleAppointmentId(null);
      setNewDate(undefined);
      setNewTime("");
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    if (selectedFilter === "all") return true;
    return app.status.toLowerCase() === selectedFilter;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          {!isCollapsed && <h1 className="text-xl font-bold text-blue-700">Wezi Clinician/Driver</h1>}
          <Button
            variant="ghost"
            size="sm"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn("ml-auto rounded hover:bg-gray-100 focus:ring-2 focus:ring-blue-500", isCollapsed && "mx-auto")}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronLeft
              className={cn("h-5 w-5 text-gray-500 transition-transform", isCollapsed && "rotate-180")}
            />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded hover:bg-gray-100 text-gray-600 transition-colors focus:ring-2 focus:ring-blue-500",
                  isActive && "bg-blue-50 text-blue-600",
                  isCollapsed && "justify-center"
                )}
                aria-label={link.title}
              >
                <link.icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                {!isCollapsed && <span>{link.title}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className={cn(
              "flex items-center w-full px-3 py-2 rounded hover:bg-gray-100 text-gray-600 focus:ring-2 focus:ring-blue-500",
              isCollapsed && "justify-center"
            )}
            onClick={() => router.push("/auth/login")}
            aria-label="Logout"
          >
            <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center h-16 px-6 bg-white border-b border-gray-200">
          <div className="flex-1 flex items-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-10 focus:ring-2 focus:ring-blue-500"
                placeholder="Search appointments..."
                aria-label="Search appointments"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="relative focus:ring-2 focus:ring-blue-500" aria-label="Notifications">
              <Bell className="h-5 w-5 text-gray-500" />
              <Badge variant="destructive" className="absolute top-0 right-0 h-4 w-4 p-0 flex items-center justify-center text-xs">
                3
              </Badge>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer focus:ring-2 focus:ring-blue-500" aria-label="User profile">
                  <AvatarImage src="/staff-avatar.png" alt="Clinician/Driver" onError={() => console.log("Failed to load avatar")} />
                  <AvatarFallback>CD</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="focus:bg-blue-50">
                  <Users className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-blue-50">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="focus:bg-blue-50" onClick={() => router.push("/auth/login")}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Appointments Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">My Appointments</h2>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Patient Appointments</h3>
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-[180px] focus:ring-2 focus:ring-blue-500" aria-label="Filter appointments by status">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="requested">Requested</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="rescheduled">Rescheduled</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Clinic</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.patient}</TableCell>
                      <TableCell>{appointment.date}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        {appointment.time}
                      </TableCell>
                      <TableCell>{appointment.clinic}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            appointment.status === "Requested"
                              ? "outline"
                              : appointment.status === "Scheduled"
                              ? "secondary"
                              : appointment.status === "Rescheduled"
                              ? "default"
                              : appointment.status === "Declined"
                              ? "destructive"
                              : "destructive"
                          }
                        >
                          {appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex gap-2">
                        {appointment.status === "Requested" && (
                          <Dialog open={approveAppointmentId === appointment.id} onOpenChange={() => setApproveAppointmentId(null)}>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setApproveAppointmentId(appointment.id)}
                                aria-label="Approve appointment"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Confirm Approval</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to approve the appointment for {appointment.patient} on {appointment.date} at {appointment.time}?
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setApproveAppointmentId(null)}>
                                  No
                                </Button>
                                <Button
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                  onClick={handleApprove}
                                >
                                  Yes
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                        <Dialog open={declineAppointmentId === appointment.id} onOpenChange={() => setDeclineAppointmentId(null)}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeclineAppointmentId(appointment.id)}
                              disabled={appointment.status !== "Requested" && appointment.status !== "Scheduled"}
                              aria-label="Decline appointment"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Decline
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Confirm Decline</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to decline the appointment for {appointment.patient} on {appointment.date} at {appointment.time}? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setDeclineAppointmentId(null)}>
                                No
                              </Button>
                              <Button
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={handleDecline}
                              >
                                Yes
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Dialog open={rescheduleAppointmentId === appointment.id} onOpenChange={() => setRescheduleAppointmentId(null)}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setRescheduleAppointmentId(appointment.id)}
                              disabled={appointment.status !== "Requested" && appointment.status !== "Scheduled"}
                              aria-label="Reschedule appointment"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Reschedule
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Reschedule Appointment</DialogTitle>
                              <DialogDescription>
                                Select a new date and time for the appointment with {appointment.patient}.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">New Date</Label>
                                <div className="col-span-3">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className={cn(
                                          "w-full justify-start text-left font-normal",
                                          !newDate && "text-muted-foreground"
                                        )}
                                      >
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {newDate ? format(newDate, "PPP") : <span>Pick a date</span>}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                      <CalendarComponent
                                        mode="single"
                                        selected={newDate}
                                        onSelect={setNewDate}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  {newDate && (
                                    <p className="text-sm text-gray-500 mt-1">
                                      Day: {format(newDate, "EEEE")}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">New Time</Label>
                                <div className="col-span-3">
                                  <Input
                                    type="time"
                                    value={newTime}
                                    onChange={(e) => setNewTime(e.target.value)}
                                    className="focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setRescheduleAppointmentId(null)}>
                                Cancel
                              </Button>
                              <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={handleReschedule}
                                disabled={!newDate || !newTime}
                              >
                                Proceed
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Dialog open={confirmRescheduleAppointmentId === appointment.id} onOpenChange={() => setConfirmRescheduleAppointmentId(null)}>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Confirm Reschedule</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to reschedule the appointment for {appointment.patient} to {newDate ? format(newDate, "PPP") : ""} ({newDate ? format(newDate, "EEEE") : ""}) at {newTime}?
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setConfirmRescheduleAppointmentId(null)}>
                                No
                              </Button>
                              <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={handleConfirmReschedule}
                              >
                                Yes
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      No appointments available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}