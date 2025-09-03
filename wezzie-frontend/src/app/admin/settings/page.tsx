
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  SettingsIcon,
  Clipboard,
  Calendar,
  Bell,
  ChevronLeft,
  LogOut,
  User,
  Search,
  Ambulance,
  Globe,
  Mail,
  Smartphone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge"; 
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

// Type definitions
interface SidebarLink {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface RolePermission {
  role: "Admin" | "Clinician" | "Driver";
  canManageUsers: boolean;
  canManageAmbulances: boolean;
  canManageSchedules: boolean;
}

interface SystemSettings {
  timeZone: string;
  language: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

const sidebarLinks: SidebarLink[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "User Management", href: "/admin/users", icon: Users },
  { title: "Ambulances", href: "/admin/ambulances", icon: Ambulance },
  { title: "Resource Management", href: "/admin/resources", icon: Clipboard },
  { title: "Appointments Calendar", href: "/admin/calendar", icon: Calendar },
  { title: "Notifications", href: "/admin/notifications", icon: Bell },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

const initialRolePermissions: RolePermission[] = [
  { role: "Admin", canManageUsers: true, canManageAmbulances: true, canManageSchedules: true },
  { role: "Clinician", canManageUsers: false, canManageAmbulances: false, canManageSchedules: true },
  { role: "Driver", canManageUsers: false, canManageAmbulances: true, canManageSchedules: false },
];

const timeZones = [
  "UTC",
  "Africa/Johannesburg",
  "America/New_York",
  "Europe/London",
  "Asia/Tokyo",
];

const languages = ["English", "French", "Spanish"];

export default function Settings() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>(initialRolePermissions);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    timeZone: "Africa/Johannesburg",
    language: "English",
    emailNotifications: true,
    smsNotifications: false,
  });
  const [selectedRole, setSelectedRole] = useState<RolePermission | null>(null);
  const [isEditPermissionsModalOpen, setIsEditPermissionsModalOpen] = useState(false);
  const [isEditSystemSettingsModalOpen, setIsEditSystemSettingsModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push("/auth/login");
  };

  const handleSystemSettingsChange = (field: keyof SystemSettings, value: string | boolean) => {
    setSystemSettings({ ...systemSettings, [field]: value });
  };

  const handlePermissionChange = (role: RolePermission, field: keyof RolePermission, value: boolean) => {
    const updatedPermissions = rolePermissions.map((perm) =>
      perm.role === role.role ? { ...perm, [field]: value } : perm
    );
    setRolePermissions(updatedPermissions);
  };

  const openEditPermissionsModal = (role: RolePermission) => {
    setSelectedRole(role);
    setIsEditPermissionsModalOpen(true);
  };

  const savePermissions = () => {
    if (selectedRole) {
      const updatedPermissions = rolePermissions.map((perm) =>
        perm.role === selectedRole.role ? selectedRole : perm
      );
      setRolePermissions(updatedPermissions);
      setIsEditPermissionsModalOpen(false);
      setSelectedRole(null);
    }
  };

  const saveSystemSettings = () => {
    setIsEditSystemSettingsModalOpen(false);
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
          {!isCollapsed && <h1 className="text-xl font-bold text-blue-700">Wezi Admin</h1>}
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
              <Input className="pl-10 focus:ring-2 focus:ring-blue-500" placeholder="Search settings..." aria-label="Search settings" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="relative focus:ring-2 focus:ring-blue-500" aria-label="Notifications">
              <Bell className="h-5 w-5 text-gray-500" />
             <Badge variant="destructive" className="absolute top-0 right-0 h-4 w-4 p-0 flex items-center justify-center text-xs">
  5
</Badge>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer focus:ring-2 focus:ring-blue-500" aria-label="User profile">
                  <AvatarImage src="/admin-avatar.png" alt="Admin" onError={() => console.log("Failed to load avatar")} />
                  <AvatarFallback>AD</AvatarFallback>
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
                  <SettingsIcon className="mr-2 h-4 w-4" />
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

        {/* Settings Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
            <Dialog open={isEditSystemSettingsModalOpen} onOpenChange={setIsEditSystemSettingsModalOpen}>
              <DialogTrigger asChild>
                <Button variant="default">Edit System Settings</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit System Settings</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="timeZone" className="text-right">
                      Time Zone
                    </Label>
                    <Select
                      value={systemSettings.timeZone}
                      onValueChange={(value) => handleSystemSettingsChange("timeZone", value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select time zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeZones.map((tz) => (
                          <SelectItem key={tz} value={tz}>
                            {tz}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="language" className="text-right">
                      Language
                    </Label>
                    <Select
                      value={systemSettings.language}
                      onValueChange={(value) => handleSystemSettingsChange("language", value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="emailNotifications" className="text-right">
                      Email Notifications
                    </Label>
                    <div className="col-span-3 flex items-center gap-2">
                      <Switch
                        id="emailNotifications"
                        checked={systemSettings.emailNotifications}
                        onCheckedChange={(checked) => handleSystemSettingsChange("emailNotifications", checked)}
                      />
                      <span>{systemSettings.emailNotifications ? "Enabled" : "Disabled"}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="smsNotifications" className="text-right">
                      SMS Notifications
                    </Label>
                    <div className="col-span-3 flex items-center gap-2">
                      <Switch
                        id="smsNotifications"
                        checked={systemSettings.smsNotifications}
                        onCheckedChange={(checked) => handleSystemSettingsChange("smsNotifications", checked)}
                      />
                      <span>{systemSettings.smsNotifications ? "Enabled" : "Disabled"}</span>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={saveSystemSettings}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* System Settings Overview */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">System Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-gray-500" />
                <span><strong>Time Zone:</strong> {systemSettings.timeZone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-gray-500" />
                <span><strong>Language:</strong> {systemSettings.language}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-500" />
                <span><strong>Email Notifications:</strong> {systemSettings.emailNotifications ? "Enabled" : "Disabled"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-gray-500" />
                <span><strong>SMS Notifications:</strong> {systemSettings.smsNotifications ? "Enabled" : "Disabled"}</span>
              </div>
            </div>
          </div>

          {/* Role Permissions Table */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Role Permissions</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Manage Users</TableHead>
                  <TableHead>Manage Ambulances</TableHead>
                  <TableHead>Manage Schedules</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rolePermissions.length > 0 ? (
                  rolePermissions.map((role) => (
                    <TableRow key={role.role}>
                      <TableCell>{role.role}</TableCell>
                      <TableCell>
                       <Badge variant={role.canManageUsers ? "secondary" : "destructive"}>
  {role.canManageUsers ? "Allowed" : "Not Allowed"}
</Badge>

                      </TableCell>
                      <TableCell>
                       <Badge variant={role.canManageUsers ? "secondary" : "destructive"}>
  {role.canManageUsers ? "Allowed" : "Not Allowed"}
</Badge>

                      </TableCell>
                      <TableCell>
                       <Badge variant={role.canManageUsers ? "secondary" : "destructive"}>
  {role.canManageUsers ? "Allowed" : "Not Allowed"}
</Badge>

                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => openEditPermissionsModal(role)}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      No role permissions configured
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>

      {/* Edit Permissions Modal */}
      <Dialog open={isEditPermissionsModalOpen} onOpenChange={setIsEditPermissionsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Permissions for {selectedRole?.role}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Checkbox
                id="canManageUsers"
                checked={selectedRole?.canManageUsers}
                onCheckedChange={(checked) =>
                  setSelectedRole((prev) => prev ? { ...prev, canManageUsers: checked as boolean } : prev)
                }
              />
              <Label htmlFor="canManageUsers">Can Manage Users</Label>
            </div>
            <div className="flex items-center gap-4">
              <Checkbox
                id="canManageAmbulances"
                checked={selectedRole?.canManageAmbulances}
                onCheckedChange={(checked) =>
                  setSelectedRole((prev) => prev ? { ...prev, canManageAmbulances: checked as boolean } : prev)
                }
              />
              <Label htmlFor="canManageAmbulances">Can Manage Ambulances</Label>
            </div>
            <div className="flex items-center gap-4">
              <Checkbox
                id="canManageSchedules"
                checked={selectedRole?.canManageSchedules}
                onCheckedChange={(checked) =>
                  setSelectedRole((prev) => prev ? { ...prev, canManageSchedules: checked as boolean } : prev)
                }
              />
              <Label htmlFor="canManageSchedules">Can Manage Schedules</Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={savePermissions}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
