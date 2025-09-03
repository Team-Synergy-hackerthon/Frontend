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
  Badge,
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
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Type definitions
interface SidebarLink {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DriverVehicle {
  id: string;
  vehicleId: string;
  stationedClinic: string;
  status: "Available" | "In Transit" | "Under Maintenance";
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

const driverVehicle: DriverVehicle = {
  id: "1",
  vehicleId: "AMB-001",
  stationedClinic: "Main Clinic",
  status: "Available",
};

export default function DriverStatusPage() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [vehicle, setVehicle] = useState<DriverVehicle>(driverVehicle);
  const pathname = usePathname();
  const router = useRouter();

  const handleStatusChange = (newStatus: string) => {
    setVehicle((prev) => ({
      ...prev,
      status: newStatus as "Available" | "In Transit" | "Under Maintenance",
    }));
    toast({
      title: "Status Updated",
      description: `Ambulance ${vehicle.vehicleId} status changed to ${newStatus}.`,
    });
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
                placeholder="Search..."
                aria-label="Search driver status"
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

        {/* Driver Status Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Ambulance Status</h2>

          <div className="bg-white p-6 rounded-lg shadow">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Assigned Ambulance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Vehicle ID</p>
                    <p className="text-lg font-bold text-gray-900">{vehicle.vehicleId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Stationed Clinic</p>
                    <p className="text-lg font-bold text-gray-900">{vehicle.stationedClinic}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Current Status</p>
                    <Badge
                      variant={
                        vehicle.status === "Available"
                          ? "default"
                          : vehicle.status === "In Transit"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {vehicle.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Update Status</p>
                    <Select
                      value={vehicle.status}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger className="w-[180px] focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="In Transit">In Transit</SelectItem>
                        <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
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