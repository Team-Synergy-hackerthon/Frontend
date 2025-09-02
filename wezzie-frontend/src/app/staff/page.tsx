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
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

// Type definitions
interface SidebarLink {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardMetric {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface Appointment {
  id: number;
  patient: string;
  time: string;
  clinic: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
}

interface Driver {
  id: number;
  name: string;
  status: "Available" | "On Duty" | "Off Duty";
  vehicle: string;
}

interface Clinic {
  id: number;
  name: string;
  location: string;
  appointmentsToday: number;
  status: "Open" | "Closed";
}

const sidebarLinks: SidebarLink[] = [
  { title: "Dashboard", href: "/clinician-driver", icon: LayoutDashboard },
  { title: "Appointments", href: "/clinician-driver/appointments", icon: Calendar },
  { title: "Patients", href: "/clinician-driver/patients", icon: Users },
  { title: "Clinics", href: "/clinician-driver/clinics", icon: Hospital },
  { title: "Drivers", href: "/clinician-driver/drivers", icon: Ambulance },
  { title: "Notifications", href: "/clinician-driver/notifications", icon: Bell },
  { title: "Settings", href: "/clinician-driver/settings", icon: Settings },
];

const dashboardMetrics: DashboardMetric[] = [
  { title: "Appointments Today", value: "12", icon: Calendar, color: "text-blue-600" },
  { title: "Patients Scheduled", value: "25", icon: Users, color: "text-green-600" },
  { title: "Available Drivers", value: "5", icon: Ambulance, color: "text-red-600" },
  { title: "Active Clinics", value: "3", icon: Hospital, color: "text-indigo-600" },
  { title: "Notifications", value: "3", icon: Bell, color: "text-yellow-600" },
];

const recentAppointments: Appointment[] = [
  { id: 1, patient: "John Doe", time: "2025-09-05T10:00", clinic: "Main Clinic", status: "Scheduled" },
  { id: 2, patient: "Jane Smith", time: "2025-09-05T11:30", clinic: "East Branch", status: "In Progress" },
];

const drivers: Driver[] = [
  { id: 1, name: "Mike Johnson", status: "Available", vehicle: "AMB-001" },
  { id: 2, name: "Sarah Lee", status: "On Duty", vehicle: "AMB-002" },
  { id: 3, name: "Tom Harris", status: "Off Duty", vehicle: "AMB-003" },
];

const clinics: Clinic[] = [
  { id: 1, name: "Main Clinic", location: "City Center", appointmentsToday: 12, status: "Open" },
  { id: 2, name: "East Branch", location: "East Side", appointmentsToday: 8, status: "Open" },
  { id: 3, name: "West Clinic", location: "West Side", appointmentsToday: 0, status: "Closed" },
];

const calendarEvents = [
  { title: "Appointment with John Doe", start: "2025-09-05T10:00:00", end: "2025-09-05T10:30:00" },
  { title: "Appointment with Jane Smith", start: "2025-09-05T11:30:00", end: "2025-09-05T12:00:00" },
  { title: "Driver Shift - Mike", start: "2025-09-05T08:00:00", end: "2025-09-05T16:00:00" },
  { title: "Clinic Shift - Main Clinic", start: "2025-09-05T09:00:00", end: "2025-09-05T17:00:00" },
];

export default function ClinicianDriverDashboard() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState<string>("all");
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push("/auth/login");
  };

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
            onClick={handleLogout}
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
              <Input className="pl-10 focus:ring-2 focus:ring-blue-500" placeholder="Search..." aria-label="Search dashboard" />
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
                  <AvatarImage src="/clinician-driver-avatar.png" alt="Clinician/Driver" onError={() => console.log("Failed to load avatar")} />
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
                <DropdownMenuItem className="focus:bg-blue-50" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 animate-in fade-in">Clinician/Driver Dashboard</h2>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
            {dashboardMetrics.length > 0 ? (
              dashboardMetrics.map((metric) => (
                <div
                  key={metric.title}
                  className="bg-white p-4 rounded-lg shadow flex items-center gap-4 transform transition-all hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-500"
                  tabIndex={0}
                  aria-label={metric.title}
                >
                  <div className={`p-2 rounded-full bg-${metric.color.split("-")[1]}-100`}>
                    <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No metrics available</p>
            )}
          </div>

          {/* Calendar Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Appointments & Driver Shifts</h3>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={calendarEvents}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              editable={true}
              selectable={true}
              height="auto"
            />
          </div>

          {/* Appointments Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Recent Appointments</h3>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger className="w-[180px] focus:ring-2 focus:ring-blue-500" aria-label="Filter appointments by patient">
                  <SelectValue placeholder="Filter by Patient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Patients</SelectItem>
                  <SelectItem value="john-doe">John Doe</SelectItem>
                  <SelectItem value="jane-smith">Jane Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Clinic</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAppointments.length > 0 ? (
                  recentAppointments
                    .filter(
                      (appointment) =>
                        selectedPatient === "all" ||
                        appointment.patient.toLowerCase().replace(" ", "-") === selectedPatient
                    )
                    .map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>{appointment.patient}</TableCell>
                        <TableCell className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          {appointment.time}
                        </TableCell>
                        <TableCell>{appointment.clinic}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              appointment.status === "Scheduled"
                                ? "secondary"
                                : appointment.status === "In Progress"
                                ? "default"
                                : appointment.status === "Completed"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {appointment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500">
                      No appointments available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Drivers Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Driver Status</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Vehicle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.length > 0 ? (
                  drivers.map((driver) => (
                    <TableRow key={driver.id}>
                      <TableCell>{driver.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            driver.status === "Available"
                              ? "default"
                              : driver.status === "On Duty"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {driver.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{driver.vehicle}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500">
                      No drivers available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Clinics Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Clinics Overview</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Appointments Today</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clinics.length > 0 ? (
                  clinics.map((clinic) => (
                    <TableRow key={clinic.id}>
                      <TableCell>{clinic.name}</TableCell>
                      <TableCell>{clinic.location}</TableCell>
                      <TableCell>{clinic.appointmentsToday}</TableCell>
                      <TableCell>
                        <Badge variant={clinic.status === "Open" ? "default" : "destructive"}>
                          {clinic.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500">
                      No clinics available
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