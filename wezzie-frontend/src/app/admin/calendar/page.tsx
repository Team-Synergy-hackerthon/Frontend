"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Settings,
  Clipboard,
  Calendar,
  Bell,
  ChevronLeft,
  LogOut,
  User,
  Search,
  Ambulance,
  Clock,
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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

interface Department {
  id: string;
  name: string;
}

interface Staff {
  id: number;
  name: string;
  role: "Admin" | "Clinician" | "Driver";
}

interface Schedule {
  id: number;
  staffId: number;
  departmentId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "Scheduled" | "Occupied" | "Completed";
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

const initialDepartments: Department[] = [
  { id: "DEPT-001", name: "OPD" },
  { id: "DEPT-002", name: "Emergency" },
  { id: "DEPT-003", name: "Radiology" },
];

const initialStaff: Staff[] = [
  { id: 1, name: "Dr. Alice Brown", role: "Clinician" },
  { id: 2, name: "Bob Carter", role: "Driver" },
  { id: 3, name: "Nurse Charlie Davis", role: "Clinician" },
  { id: 4, name: "Dana Evans", role: "Admin" },
];

const initialSchedules: Schedule[] = [
  {
    id: 1,
    staffId: 1,
    departmentId: "DEPT-001",
    date: "2025-09-05",
    startTime: "09:00",
    endTime: "17:00",
    status: "Scheduled",
  },
  {
    id: 2,
    staffId: 3,
    departmentId: "DEPT-002",
    date: "2025-09-05",
    startTime: "10:00",
    endTime: "18:00",
    status: "Scheduled",
  },
];

export default function AppointmentCalendar() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [isAddDepartmentModalOpen, setIsAddDepartmentModalOpen] = useState(false);
  const [isAddScheduleModalOpen, setIsAddScheduleModalOpen] = useState(false);
  const [isEditScheduleModalOpen, setIsEditScheduleModalOpen] = useState(false);
  const [isDeleteScheduleModalOpen, setIsDeleteScheduleModalOpen] = useState(false);
  const [departmentFormData, setDepartmentFormData] = useState<{ name: string }>({ name: "" });
  const [scheduleFormData, setScheduleFormData] = useState<{
    staffId: number;
    departmentId: string;
    date: string;
    startTime: string;
    endTime: string;
    status: "Scheduled" | "Occupied" | "Completed";
  }>({
    staffId: 1,
    departmentId: "DEPT-001",
    date: "",
    startTime: "",
    endTime: "",
    status: "Scheduled",
  });
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push("/auth/login");
  };

  const handleDepartmentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepartmentFormData({ name: e.target.value });
  };

  const handleScheduleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScheduleFormData({ ...scheduleFormData, [e.target.id]: e.target.value });
  };

  const handleScheduleSelectChange = (value: string, field: string) => {
    setScheduleFormData({ ...scheduleFormData, [field]: value });
  };

  const handleAddDepartment = () => {
    const newDepartment = {
      id: `DEPT-${(departments.length + 1).toString().padStart(3, "0")}`,
      name: departmentFormData.name,
    };
    setDepartments([...departments, newDepartment]);
    setIsAddDepartmentModalOpen(false);
    setDepartmentFormData({ name: "" });
  };

  const handleAddSchedule = () => {
    const newSchedule = {
      id: schedules.length + 1,
      ...scheduleFormData,
    };
    setSchedules([...schedules, newSchedule]);
    setIsAddScheduleModalOpen(false);
    setScheduleFormData({
      staffId: 1,
      departmentId: "DEPT-001",
      date: "",
      startTime: "",
      endTime: "",
      status: "Scheduled",
    });
  };

  const handleEditSchedule = () => {
    if (selectedSchedule) {
      const updatedSchedules = schedules.map((schedule) =>
        schedule.id === selectedSchedule.id ? { ...schedule, ...scheduleFormData } : schedule
      );
      setSchedules(updatedSchedules);
      setIsEditScheduleModalOpen(false);
      setSelectedSchedule(null);
    }
  };

  const handleDeleteSchedule = () => {
    if (selectedSchedule) {
      const updatedSchedules = schedules.filter((schedule) => schedule.id !== selectedSchedule.id);
      setSchedules(updatedSchedules);
      setIsDeleteScheduleModalOpen(false);
      setSelectedSchedule(null);
    }
  };

  const openEditScheduleModal = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setScheduleFormData({
      staffId: schedule.staffId,
      departmentId: schedule.departmentId,
      date: schedule.date,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      status: schedule.status,
    });
    setIsEditScheduleModalOpen(true);
  };

  const openDeleteScheduleModal = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsDeleteScheduleModalOpen(true);
  };

  const calendarEvents = schedules.map((schedule) => ({
    title: `${initialStaff.find((staff) => staff.id === schedule.staffId)?.name} - ${
      departments.find((dept) => dept.id === schedule.departmentId)?.name
    }`,
    start: `${schedule.date}T${schedule.startTime}:00`,
    end: `${schedule.date}T${schedule.endTime}:00`,
  }));

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
              <Input className="pl-10 focus:ring-2 focus:ring-blue-500" placeholder="Search schedules..." aria-label="Search schedules" />
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

        {/* Appointment Calendar Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Appointments Calendar</h2>
            <div className="flex gap-2">
              <Dialog open={isAddDepartmentModalOpen} onOpenChange={setIsAddDepartmentModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="default">Add Department</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Department</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Department Name
                      </Label>
                      <Input
                        id="name"
                        value={departmentFormData.name}
                        onChange={handleDepartmentInputChange}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddDepartment}>Add Department</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog open={isAddScheduleModalOpen} onOpenChange={setIsAddScheduleModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="default">Add Schedule</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Schedule</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="staffId" className="text-right">
                        Staff
                      </Label>
                      <Select
                        value={scheduleFormData.staffId.toString()}
                        onValueChange={(value) => handleScheduleSelectChange(value, "staffId")}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select staff" />
                        </SelectTrigger>
                        <SelectContent>
                          {initialStaff.map((staff) => (
                            <SelectItem key={staff.id} value={staff.id.toString()}>
                              {staff.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="departmentId" className="text-right">
                        Department
                      </Label>
                      <Select
                        value={scheduleFormData.departmentId}
                        onValueChange={(value) => handleScheduleSelectChange(value, "departmentId")}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date" className="text-right">
                        Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={scheduleFormData.date}
                        onChange={handleScheduleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="startTime" className="text-right">
                        Start Time
                      </Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={scheduleFormData.startTime}
                        onChange={handleScheduleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="endTime" className="text-right">
                        End Time
                      </Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={scheduleFormData.endTime}
                        onChange={handleScheduleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">
                        Status
                      </Label>
                      <Select
                        value={scheduleFormData.status}
                        onValueChange={(value) => handleScheduleSelectChange(value, "status")}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Scheduled">Scheduled</SelectItem>
                          <SelectItem value="Occupied">Occupied</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddSchedule}>Add Schedule</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Staff Schedule Calendar</h3>
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

          {/* Schedules Table */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Staff Schedules</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.length > 0 ? (
                  schedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>{initialStaff.find((staff) => staff.id === schedule.staffId)?.name}</TableCell>
                      <TableCell>{departments.find((dept) => dept.id === schedule.departmentId)?.name}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        {schedule.date}
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        {`${schedule.startTime} - ${schedule.endTime}`}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            schedule.status === "Scheduled"
                              ? "default"
                              : schedule.status === "Occupied"
                              ? "secondary"
                              : "success"
                          }
                        >
                          {schedule.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditScheduleModal(schedule)}>
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => openDeleteScheduleModal(schedule)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      No schedules available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Departments Table */}
          <div className="bg-white p-6 rounded-lg shadow mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Departments</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.length > 0 ? (
                  departments.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell>{dept.id}</TableCell>
                      <TableCell>{dept.name}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-gray-500">
                      No departments available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>

      {/* Edit Schedule Modal */}
      <Dialog open={isEditScheduleModalOpen} onOpenChange={setIsEditScheduleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Schedule</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="staffId" className="text-right">
                Staff
              </Label>
              <Select
                value={scheduleFormData.staffId.toString()}
                onValueChange={(value) => handleScheduleSelectChange(value, "staffId")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select staff" />
                </SelectTrigger>
                <SelectContent>
                  {initialStaff.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id.toString()}>
                      {staff.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="departmentId" className="text-right">
                Department
              </Label>
              <Select
                value={scheduleFormData.departmentId}
                onValueChange={(value) => handleScheduleSelectChange(value, "departmentId")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={scheduleFormData.date}
                onChange={handleScheduleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">
                Start Time
              </Label>
              <Input
                id="startTime"
                type="time"
                value={scheduleFormData.startTime}
                onChange={handleScheduleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endTime" className="text-right">
                End Time
              </Label>
              <Input
                id="endTime"
                type="time"
                value={scheduleFormData.endTime}
                onChange={handleScheduleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={scheduleFormData.status}
                onValueChange={(value) => handleScheduleSelectChange(value, "status")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Occupied">Occupied</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditSchedule}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteScheduleModalOpen} onOpenChange={setIsDeleteScheduleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete the schedule for{" "}
            {initialStaff.find((staff) => staff.id === selectedSchedule?.staffId)?.name} in{" "}
            {departments.find((dept) => dept.id === selectedSchedule?.departmentId)?.name} on {selectedSchedule?.date}?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteScheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSchedule}>
              Delete
            </Button>
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