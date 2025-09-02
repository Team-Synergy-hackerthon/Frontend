"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  User,
  Bell,
  ChevronLeft,
  LogOut,
  Search,
  Clock,
  Clipboard,
  Settings,
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

interface MedicalRecord {
  id: number;
  date: string;
  type: string;
  doctor: string;
  notes: string;
}

const sidebarLinks: SidebarLink[] = [
  { title: "Dashboard", href: "/patient", icon: LayoutDashboard },
  { title: "Appointments", href: "/patient/appointments", icon: Calendar },
  { title: "Medical Records", href: "/patient/records", icon: FileText },
  { title: "Profile", href: "/patient/profile", icon: User },
  { title: "Notifications", href: "/patient/notifications", icon: Bell },
];

const dashboardMetrics: DashboardMetric[] = [
  { title: "Upcoming Appointments", value: "2", icon: Calendar, color: "text-blue-600" },
  { title: "Recent Lab Results", value: "3", icon: FileText, color: "text-green-600" },
  { title: "Prescriptions", value: "5", icon: Clipboard, color: "text-purple-600" },
  { title: "Notifications", value: "1", icon: Bell, color: "text-yellow-600" },
];

const recentMedicalRecords: MedicalRecord[] = [
  { id: 1, date: "2025-08-01", type: "Lab Result", doctor: "Dr. John Doe", notes: "Normal" },
  { id: 2, date: "2025-07-20", type: "Consultation", doctor: "Dr. Jane Smith", notes: "Follow-up needed" },
];

export default function PatientDashboard() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<string>("all");
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
          {!isCollapsed && <h1 className="text-xl font-bold text-blue-700">Wezi Patient</h1>}
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
                1
              </Badge>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer focus:ring-2 focus:ring-blue-500" aria-label="User profile">
                  <AvatarImage src="/patient-avatar.png" alt="Patient" onError={() => console.log("Failed to load avatar")} />
                  <AvatarFallback>PT</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="focus:bg-blue-50">
                  <User className="mr-2 h-4 w-4" />
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
          <h2 className="text-3xl font-bold mb-6 text-gray-900 animate-in fade-in">Patient Dashboard</h2>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Appointments Calendar</h3>
            <p className="text-gray-500">
              Integrate a calendar here to view or book appointments (e.g., react-calendar or FullCalendar).
            </p>
          </div>

          {/* Recent Medical Records */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Recent Medical Records</h3>
              <Select value={selectedRecord} onValueChange={setSelectedRecord}>
                <SelectTrigger className="w-[180px] focus:ring-2 focus:ring-blue-500" aria-label="Filter medical records by type">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Records</SelectItem>
                  <SelectItem value="lab-result">Lab Result</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentMedicalRecords.length > 0 ? (
                  recentMedicalRecords
                    .filter(
                      (record) =>
                        selectedRecord === "all" ||
                        record.type.toLowerCase().replace(" ", "-") === selectedRecord
                    )
                    .map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {record.date}
                        </TableCell>
                        <TableCell>{record.type}</TableCell>
                        <TableCell>{record.doctor}</TableCell>
                        <TableCell>{record.notes}</TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500">
                      No records available
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