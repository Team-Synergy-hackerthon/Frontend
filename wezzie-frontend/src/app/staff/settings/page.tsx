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
  Globe,
  Moon,
  Sun,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Type definitions
interface SidebarLink {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SettingsData {
  role: "Clinician" | "Driver";
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    appointmentAlerts: boolean;
    patientUpdates: boolean;
    emergencyRequests: boolean; // Driver-specific
  };
  department?: string; // Clinician-specific
  defaultClinic?: string; // Both roles
  theme: "light" | "dark";
  language: string;
}

const sidebarLinks: SidebarLink[] = [
  { title: "Dashboard", href: "/staff", icon: LayoutDashboard },
  { title: "Appointments", href: "/staff/appointments", icon: Calendar },
  { title: "Patients", href: "/staff/patients", icon: Users },
  { title: "Clinics", href: "/staff/clinics", icon: Hospital },
  { title: "Drivers", href: "/staff/Drivers", icon: Ambulance },
  { title: "Emergency Requests", href: "/staff/emergency-requests", icon: Bell },
  { title: "Settings", href: "/staff/settings", icon: Settings },
];

const initialSettings: SettingsData = {
  role: "Clinician", // Toggle to "Driver" for testing driver-specific settings
  notificationPreferences: {
    email: true,
    sms: false,
    appointmentAlerts: true,
    patientUpdates: true,
    emergencyRequests: false, // Relevant for drivers
  },
  department: "Cardiology", // Clinician-specific
  defaultClinic: "Main Clinic",
  theme: "light",
  language: "English",
};

export default function StaffSettingsPage() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [settings, setSettings] = useState<SettingsData>(initialSettings);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  const departments = ["Cardiology", "General Medicine", "Orthopedics", "Infectious Diseases"];
  const clinics = ["Main Clinic", "East Branch", "West Clinic"];
  const languages = ["English", "Chichewa", "French"];

  const handleSave = () => {
    // Simulate saving settings
    toast({
      title: "Settings Saved",
      description: "Your settings have been successfully updated.",
    });
    setIsEditing(false);
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
                placeholder="Search settings..."
                aria-label="Search settings"
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
                  <AvatarImage src="/staff-avatar.png" alt={settings.role} onError={() => console.log("Failed to load avatar")} />
                  <AvatarFallback>{settings.role === "Clinician" ? "CL" : "DR"}</AvatarFallback>
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

        {/* Settings Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Settings</h2>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">User Settings</h3>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2"
                aria-label={isEditing ? "Cancel editing" : "Edit settings"}
              >
                <Settings className="h-4 w-4" />
                {isEditing ? "Cancel" : "Edit Settings"}
              </Button>
            </div>

            {/* Notification Preferences */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="emailNotifications"
                      checked={settings.notificationPreferences.email}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notificationPreferences: { ...settings.notificationPreferences, email: !!checked },
                        })
                      }
                      disabled={!isEditing}
                    />
                    <Label htmlFor="emailNotifications">Receive notifications via email</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="smsNotifications"
                      checked={settings.notificationPreferences.sms}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notificationPreferences: { ...settings.notificationPreferences, sms: !!checked },
                        })
                      }
                      disabled={!isEditing}
                    />
                    <Label htmlFor="smsNotifications">Receive notifications via SMS</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="appointmentAlerts"
                      checked={settings.notificationPreferences.appointmentAlerts}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notificationPreferences: { ...settings.notificationPreferences, appointmentAlerts: !!checked },
                        })
                      }
                      disabled={!isEditing}
                    />
                    <Label htmlFor="appointmentAlerts">Receive appointment alerts</Label>
                  </div>
                  {settings.role === "Clinician" && (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="patientUpdates"
                        checked={settings.notificationPreferences.patientUpdates}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notificationPreferences: { ...settings.notificationPreferences, patientUpdates: !!checked },
                          })
                        }
                        disabled={!isEditing}
                      />
                      <Label htmlFor="patientUpdates">Receive patient update notifications</Label>
                    </div>
                  )}
                  {settings.role === "Driver" && (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="emergencyRequests"
                        checked={settings.notificationPreferences.emergencyRequests}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notificationPreferences: { ...settings.notificationPreferences, emergencyRequests: !!checked },
                          })
                        }
                        disabled={!isEditing}
                      />
                      <Label htmlFor="emergencyRequests">Receive emergency request notifications</Label>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Role-Specific Settings */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {settings.role} Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {settings.role === "Clinician" && (
                    <div>
                      <Label htmlFor="department">Department</Label>
                      {isEditing ? (
                        <Select
                          value={settings.department}
                          onValueChange={(value) => setSettings({ ...settings, department: value })}
                        >
                          <SelectTrigger className="w-[180px] focus:ring-2 focus:ring-blue-500">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-gray-900">{settings.department}</p>
                      )}
                    </div>
                  )}
                  <div>
                    <Label htmlFor="defaultClinic">Default Clinic</Label>
                    {isEditing ? (
                      <Select
                        value={settings.defaultClinic}
                        onValueChange={(value) => setSettings({ ...settings, defaultClinic: value })}
                      >
                        <SelectTrigger className="w-[180px] focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="Select clinic" />
                        </SelectTrigger>
                        <SelectContent>
                          {clinics.map((clinic) => (
                            <SelectItem key={clinic} value={clinic}>
                              {clinic}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-900">{settings.defaultClinic}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* General Settings */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">General Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    {isEditing ? (
                      <Select
                        value={settings.theme}
                        onValueChange={(value) => setSettings({ ...settings, theme: value as "light" | "dark" })}
                      >
                        <SelectTrigger className="w-[180px] focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">
                            <div className="flex items-center gap-2">
                              <Sun className="h-4 w-4" />
                              Light
                            </div>
                          </SelectItem>
                          <SelectItem value="dark">
                            <div className="flex items-center gap-2">
                              <Moon className="h-4 w-4" />
                              Dark
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-900 capitalize">{settings.theme}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    {isEditing ? (
                      <Select
                        value={settings.language}
                        onValueChange={(value) => setSettings({ ...settings, language: value })}
                      >
                        <SelectTrigger className="w-[180px] focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                {lang}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-900">{settings.language}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            {isEditing && (
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                aria-label="Save settings"
              >
                Save Changes
              </Button>
            )}
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