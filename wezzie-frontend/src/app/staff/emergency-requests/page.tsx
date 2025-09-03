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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Type definitions
interface SidebarLink {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface EmergencyRequest {
  id: number;
  requestingUser: string;
  location: string;
  requestTime: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
}

interface Analytics {
  totalRequests: number;
  averageResponseTime: string;
  completedRequests: number;
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

const initialRequests: EmergencyRequest[] = [
  {
    id: 1,
    requestingUser: "Dr. Jane Smith",
    location: "City Center, Lilongwe",
    requestTime: "2025-09-03T08:30:00",
    status: "Pending",
  },
  {
    id: 2,
    requestingUser: "Nurse Mary Brown",
    location: "East Side, Lilongwe",
    requestTime: "2025-09-03T09:15:00",
    status: "In Progress",
  },
  {
    id: 3,
    requestingUser: "Dr. John Doe",
    location: "West Clinic, Lilongwe",
    requestTime: "2025-09-02T14:00:00",
    status: "Completed",
  },
];

const analytics: Analytics = {
  totalRequests: 10,
  averageResponseTime: "7 min",
  completedRequests: 6,
};

export default function EmergencyRequestsPage() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const pathname = usePathname();
  const router = useRouter();

  const filteredRequests = selectedStatus === "all"
    ? initialRequests
    : initialRequests.filter((request) => request.status.toLowerCase() === selectedStatus);

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
                placeholder="Search emergency requests..."
                aria-label="Search emergency requests"
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
                  <AvatarImage src="/staff-avatar.png" alt="Driver" onError={() => console.log("Failed to load avatar")} />
                  <AvatarFallback>DR</AvatarFallback>
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

        {/* Emergency Requests Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Emergency Requests</h2>

          {/* Analytics Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">Total Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalRequests}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">Average Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">{analytics.averageResponseTime}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">Completed Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">{analytics.completedRequests}</p>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Requests Table */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">All Emergency Requests</h3>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px] focus:ring-2 focus:ring-blue-500" aria-label="Filter requests by status">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Requesting User</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Request Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.requestingUser}</TableCell>
                      <TableCell>{request.location}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        {request.requestTime}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            request.status === "Pending"
                              ? "outline"
                              : request.status === "In Progress"
                              ? "secondary"
                              : request.status === "Completed"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {request.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500">
                      No emergency requests found
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