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
  Upload,
  FileText,
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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
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

interface Shift {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
}

interface EmergencyResponse {
  id: number;
  date: string;
  location: string;
  status: "Completed" | "In Progress" | "Cancelled";
}

interface ClinicianAnalytics {
  appointmentsBooked: number;
  recordsWritten: number;
  patientsSeen: number;
}

interface DriverAnalytics {
  tripsCompleted: number;
  averageResponseTime: string;
  totalDistance: number;
}

interface ProfileData {
  role: "Clinician" | "Driver";
  name: string;
  age: number;
  gender: string;
  location: string;
  contactNumber: string;
  emergencyContact: string;
  profilePicture: string;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
  };
  department?: string; // Clinician-specific
  shifts?: Shift[]; // Clinician-specific
  clinicianAnalytics?: ClinicianAnalytics; // Clinician-specific
  ambulanceStatus?: "Available" | "Under Maintenance" | "In Route"; // Driver-specific
  emergencyResponses?: EmergencyResponse[]; // Driver-specific
  driverAnalytics?: DriverAnalytics; // Driver-specific
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


const initialProfileData: ProfileData = {
  role: "Clinician", // Toggle between "Clinician" and "Driver" for demo
  name: "Dr. Jane Smith",
  age: 42,
  gender: "Female",
  location: "Lilongwe, Malawi",
  contactNumber: "+265-999-123-456",
  emergencyContact: "+265-888-987-654",
  profilePicture: "/staff-avatar.png",
  notificationPreferences: {
    email: true,
    sms: false,
  },
  department: "Cardiology", // Clinician-specific
  shifts: [
    { id: 1, date: "2025-09-05", startTime: "08:00", endTime: "16:00" },
    { id: 2, date: "2025-09-06", startTime: "09:00", endTime: "17:00" },
  ],
  clinicianAnalytics: {
    appointmentsBooked: 45,
    recordsWritten: 32,
    patientsSeen: 28,
  },
  // For Driver role, swap with:
  // role: "Driver",
  // ambulanceStatus: "Available",
  // emergencyResponses: [
  //   { id: 1, date: "2025-09-01", location: "City Center", status: "Completed" },
  //   { id: 2, date: "2025-09-02", location: "East Side", status: "In Progress" },
  // ],
  // driverAnalytics: {
  //   tripsCompleted: 12,
  //   averageResponseTime: "8 min",
  //   totalDistance: 245,
  // },
};

export default function StaffProfilePage() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const pathname = usePathname();
  const router = useRouter();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!profileData.name.trim()) newErrors.name = "Name is required";
    if (profileData.age < 0 || isNaN(profileData.age)) newErrors.age = "Valid age is required";
    if (!profileData.gender) newErrors.gender = "Gender is required";
    if (!profileData.location.trim()) newErrors.location = "Location is required";
    if (!profileData.contactNumber.trim()) newErrors.contactNumber = "Contact number is required";
    if (!profileData.emergencyContact.trim()) newErrors.emergencyContact = "Emergency contact is required";
    if (profileData.role === "Clinician" && !profileData.department?.trim())
      newErrors.department = "Department is required";
    if (newPassword && newPassword.length < 8) newErrors.newPassword = "New password must be at least 8 characters";
    if (newPassword && newPassword !== confirmNewPassword) newErrors.confirmNewPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before saving.",
        variant: "destructive",
      });
      return;
    }

    // Simulate saving profile data
    if (profilePictureFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileData((prev) => ({ ...prev, profilePicture: reader.result as string }));
      };
      reader.readAsDataURL(profilePictureFile);
    }

    // Simulate password reset
    if (newPassword) {
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }

    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePictureFile(e.target.files[0]);
    }
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
                aria-label="Search profile"
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
                  <AvatarImage src={profileData.profilePicture} alt="Clinician/Driver" onError={() => console.log("Failed to load avatar")} />
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

        {/* Profile Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Staff Profile</h2>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Profile Details</h3>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2"
                aria-label={isEditing ? "Cancel editing" : "Edit profile"}
              >
                <Settings className="h-4 w-4" />
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>

            {/* Profile Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={profileData.profilePicture} alt="Profile" />
                  <AvatarFallback>CD</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="flex items-center gap-2">
                    <Label htmlFor="profile-picture" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2 inline" />
                      Upload New Picture
                    </Label>
                    <Input
                      id="profile-picture"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePictureChange}
                    />
                  </div>
                )}
              </div>
              <div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className={cn(errors.name && "border-red-500")}
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.name}</p>
                    )}
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    {isEditing ? (
                      <Input
                        id="age"
                        type="number"
                        value={profileData.age}
                        onChange={(e) => setProfileData({ ...profileData, age: parseInt(e.target.value) })}
                        className={cn(errors.age && "border-red-500")}
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.age}</p>
                    )}
                    {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    {isEditing ? (
                      <Select
                        value={profileData.gender}
                        onValueChange={(value) => setProfileData({ ...profileData, gender: value })}
                      >
                        <SelectTrigger className={cn(errors.gender && "border-red-500")}>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-900">{profileData.gender}</p>
                    )}
                    {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        className={cn(errors.location && "border-red-500")}
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.location}</p>
                    )}
                    {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
                  </div>
                  <div>
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    {isEditing ? (
                      <Input
                        id="contactNumber"
                        value={profileData.contactNumber}
                        onChange={(e) => setProfileData({ ...profileData, contactNumber: e.target.value })}
                        className={cn(errors.contactNumber && "border-red-500")}
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.contactNumber}</p>
                    )}
                    {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber}</p>}
                  </div>
                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    {isEditing ? (
                      <Input
                        id="emergencyContact"
                        value={profileData.emergencyContact}
                        onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })}
                        className={cn(errors.emergencyContact && "border-red-500")}
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.emergencyContact}</p>
                    )}
                    {errors.emergencyContact && <p className="text-red-500 text-sm">{errors.emergencyContact}</p>}
                  </div>
                  {profileData.role === "Clinician" && (
                    <div>
                      <Label htmlFor="department">Department</Label>
                      {isEditing ? (
                        <Select
                          value={profileData.department}
                          onValueChange={(value) => setProfileData({ ...profileData, department: value })}
                        >
                          <SelectTrigger className={cn(errors.department && "border-red-500")}>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cardiology">Cardiology</SelectItem>
                            <SelectItem value="General Medicine">General Medicine</SelectItem>
                            <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                            <SelectItem value="Infectious Diseases">Infectious Diseases</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-gray-900">{profileData.department}</p>
                      )}
                      {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
                    </div>
                  )}
                  {profileData.role === "Driver" && (
                    <div>
                      <Label htmlFor="ambulanceStatus">Ambulance Status</Label>
                      {isEditing ? (
                        <Select
                          value={profileData.ambulanceStatus}
                          onValueChange={(value) =>
                            setProfileData({ ...profileData, ambulanceStatus: value as any })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                            <SelectItem value="In Route">In Route</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-gray-900">{profileData.ambulanceStatus}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Password Reset */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Reset Password</h3>
              {isEditing ? (
                <div className="grid grid-cols-1 gap-4 max-w-md">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={cn(errors.newPassword && "border-red-500")}
                    />
                    {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}
                  </div>
                  <div>
                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                    <Input
                      id="confirmNewPassword"
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className={cn(errors.confirmNewPassword && "border-red-500")}
                    />
                    {errors.confirmNewPassword && <p className="text-red-500 text-sm">{errors.confirmNewPassword}</p>}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Click "Edit Profile" to change your password.</p>
              )}
            </div>

            {/* Notification Preferences */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="emailNotifications"
                    checked={profileData.notificationPreferences.email}
                    onCheckedChange={(checked) =>
                      setProfileData({
                        ...profileData,
                        notificationPreferences: { ...profileData.notificationPreferences, email: !!checked },
                      })
                    }
                    disabled={!isEditing}
                  />
                  <Label htmlFor="emailNotifications">Receive notifications via email</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="smsNotifications"
                    checked={profileData.notificationPreferences.sms}
                    onCheckedChange={(checked) =>
                      setProfileData({
                        ...profileData,
                        notificationPreferences: { ...profileData.notificationPreferences, sms: !!checked },
                      })
                    }
                    disabled={!isEditing}
                  />
                  <Label htmlFor="smsNotifications">Receive notifications via SMS</Label>
                </div>
              </div>
            </div>

            {/* Clinician-Specific: Shift Schedule */}
            {profileData.role === "Clinician" && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Shift Schedule</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profileData.shifts?.length ? (
                      profileData.shifts.map((shift) => (
                        <TableRow key={shift.id}>
                          <TableCell className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            {shift.date}
                          </TableCell>
                          <TableCell>{shift.startTime}</TableCell>
                          <TableCell>{shift.endTime}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-gray-500">
                          No shifts scheduled
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Clinician-Specific: Analytics */}
            {profileData.role === "Clinician" && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Analytics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Appointments Booked</p>
                    <p className="text-2xl font-bold text-gray-900">{profileData.clinicianAnalytics?.appointmentsBooked}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Medical Records Written</p>
                    <p className="text-2xl font-bold text-gray-900">{profileData.clinicianAnalytics?.recordsWritten}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Patients Seen</p>
                    <p className="text-2xl font-bold text-gray-900">{profileData.clinicianAnalytics?.patientsSeen}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Driver-Specific: Ambulance Status */}
            {profileData.role === "Driver" && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Ambulance Status</h3>
                <Badge variant={profileData.ambulanceStatus === "Available" ? "default" : profileData.ambulanceStatus === "In Route" ? "secondary" : "destructive"}>
                  {profileData.ambulanceStatus}
                </Badge>
              </div>
            )}

            {/* Driver-Specific: Emergency Response History */}
            {profileData.role === "Driver" && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Emergency Response History</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profileData.emergencyResponses?.length ? (
                      profileData.emergencyResponses.map((response) => (
                        <TableRow key={response.id}>
                          <TableCell className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            {response.date}
                          </TableCell>
                          <TableCell>{response.location}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                response.status === "Completed"
                                  ? "default"
                                  : response.status === "In Progress"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {response.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-gray-500">
                          No emergency responses recorded
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Driver-Specific: Analytics */}
            {profileData.role === "Driver" && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Analytics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Trips Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{profileData.driverAnalytics?.tripsCompleted}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Average Response Time</p>
                    <p className="text-2xl font-bold text-gray-900">{profileData.driverAnalytics?.averageResponseTime}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Total Distance (km)</p>
                    <p className="text-2xl font-bold text-gray-900">{profileData.driverAnalytics?.totalDistance}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            {isEditing && (
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                aria-label="Save profile changes"
              >
                Save Changes
              </Button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}