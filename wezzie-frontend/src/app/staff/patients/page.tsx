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
  Heart,
  Hospital,
  Edit,
  Eye,
  UserCheck,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";

// Custom Badge Component
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-foreground/20",
        success: "border-transparent bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800 dark:text-green-100 dark:hover:bg-green-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface CustomBadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function CustomBadge({ className, variant, ...props }: CustomBadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

// Type definitions
interface SidebarLink {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface Patient {
  id: number;
  fullName: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  admissionDate: string;
  condition: string;
  conditionDetails: string;
  department: string;
  status: "Admitted" | "Discharged" | "Under Observation";
}

const sidebarLinks: SidebarLink[] = [
  { title: "Dashboard", href: "/staff", icon: LayoutDashboard },
  { title: "Appointments", href: "/staff/appointments", icon: Calendar },
  { title: "Patients", href: "/staff/patients", icon: Users },
  { title: "Clinics", href: "/staff/clinics", icon: Hospital },
  { title: "Drivers", href: "/staff/Drivers", icon: Ambulance },
  { title: "Notifications", href: "/staff/notifications", icon: Bell },
  { title: "Settings", href: "/staff/settings", icon: Settings },
];

const initialPatients: Patient[] = [
  {
    id: 1,
    fullName: "John Michael Doe",
    age: 45,
    gender: "Male",
    admissionDate: "2025-09-01",
    condition: "Stable",
    conditionDetails: "Hypertension, requires regular BP monitoring",
    department: "Cardiology",
    status: "Admitted",
  },
  {
    id: 2,
    fullName: "Jane Elizabeth Smith",
    age: 32,
    gender: "Female",
    admissionDate: "2025-09-02",
    condition: "Critical",
    conditionDetails: "Severe pneumonia, on oxygen support",
    department: "General Medicine",
    status: "Under Observation",
  },
  {
    id: 3,
    fullName: "Alice Marie Johnson",
    age: 60,
    gender: "Female",
    admissionDate: "2025-09-03",
    condition: "Recovering",
    conditionDetails: "Post-operative care for hip replacement",
    department: "Orthopedics",
    status: "Admitted",
  },
  {
    id: 4,
    fullName: "Bob Andrew Wilson",
    age: 28,
    gender: "Male",
    admissionDate: "2025-08-30",
    condition: "Stable",
    conditionDetails: "Fractured ankle, cast applied",
    department: "Orthopedics",
    status: "Discharged",
  },
  {
    id: 5,
    fullName: "Mary Ellen Brown",
    age: 55,
    gender: "Female",
    admissionDate: "2025-09-04",
    condition: "Stable",
    conditionDetails: "Suspected tuberculosis, awaiting test results",
    department: "Infectious Diseases",
    status: "Admitted",
  },
];

export default function StaffPatientsPage() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [editPatientId, setEditPatientId] = useState<number | null>(null);
  const [confirmEditPatientId, setConfirmEditPatientId] = useState<number | null>(null);
  const [viewPatientId, setViewPatientId] = useState<number | null>(null);
  const [dischargePatientId, setDischargePatientId] = useState<number | null>(null);
  const [editPatientData, setEditPatientData] = useState<Partial<Patient>>({});
  const pathname = usePathname();
  const router = useRouter();

  const departments = ["all", "Cardiology", "General Medicine", "Orthopedics", "Infectious Diseases"];
  const statuses = ["Admitted", "Under Observation", "Discharged"];

  const handleEditChange = (field: keyof Patient, value: string | number) => {
    setEditPatientData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = () => {
    if (
      editPatientId &&
      editPatientData.fullName &&
      editPatientData.age &&
      editPatientData.gender &&
      editPatientData.condition &&
      editPatientData.conditionDetails &&
      editPatientData.department &&
      editPatientData.status
    ) {
      setConfirmEditPatientId(editPatientId);
      setEditPatientId(null);
    } else {
      toast({
        title: "Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmEdit = () => {
    if (confirmEditPatientId) {
      setPatients((prev) =>
        prev.map((patient) =>
          patient.id === confirmEditPatientId
            ? { ...patient, ...editPatientData }
            : patient
        )
      );
      toast({
        title: "Patient Updated",
        description: `Patient details for ${editPatientData.fullName} have been updated.`,
      });
      setConfirmEditPatientId(null);
      setEditPatientData({});
    }
  };

  const handleDischarge = () => {
    if (dischargePatientId) {
      setPatients((prev) =>
        prev.map((patient) =>
          patient.id === dischargePatientId ? { ...patient, status: "Discharged" } : patient
        )
      );
      toast({
        title: "Patient Discharged",
        description: `Patient ${patients.find((p) => p.id === dischargePatientId)?.fullName} has been discharged.`,
      });
      setDischargePatientId(null);
    }
  };

  const filteredPatients = selectedDepartment === "all"
    ? patients
    : patients.filter((patient) => patient.department === selectedDepartment);

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
                placeholder="Search patients..."
                aria-label="Search patients"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="relative focus:ring-2 focus:ring-blue-500" aria-label="Notifications">
              <Bell className="h-5 w-5 text-gray-500" />
              <CustomBadge variant="destructive" className="absolute top-0 right-0 h-4 w-4 p-0 flex items-center justify-center text-xs">
                3
              </CustomBadge>
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

        {/* Patients Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Admitted Patients</h2>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Patient List</h3>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-[180px] focus:ring-2 focus:ring-blue-500" aria-label="Filter patients by department">
                  <SelectValue placeholder="Filter by Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept === "all" ? "All Departments" : dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Condition Details</TableHead>
                  <TableHead>Admission Date</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>{patient.fullName}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>{patient.conditionDetails}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        {patient.admissionDate}
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-gray-500" />
                        {patient.condition}
                      </TableCell>
                      <TableCell>{patient.department}</TableCell>
                      <TableCell>
                        <CustomBadge
                          variant={
                            patient.status === "Admitted"
                              ? "secondary"
                              : patient.status === "Under Observation"
                              ? "default"
                              : "success"
                          }
                        >
                          {patient.status}
                        </CustomBadge>
                      </TableCell>
                      <TableCell className="flex gap-2 flex-wrap">
                        <Dialog open={viewPatientId === patient.id} onOpenChange={() => setViewPatientId(null)}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setViewPatientId(patient.id)}
                              aria-label="View patient details"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Patient Details</DialogTitle>
                              <DialogDescription>Details for {patient.fullName}</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Full Name</Label>
                                <span className="col-span-3">{patient.fullName}</span>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Age</Label>
                                <span className="col-span-3">{patient.age}</span>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Gender</Label>
                                <span className="col-span-3">{patient.gender}</span>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Condition</Label>
                                <span className="col-span-3">{patient.condition}</span>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Condition Details</Label>
                                <span className="col-span-3">{patient.conditionDetails}</span>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Admission Date</Label>
                                <span className="col-span-3">{patient.admissionDate}</span>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Department</Label>
                                <span className="col-span-3">{patient.department}</span>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Status</Label>
                                <span className="col-span-3">{patient.status}</span>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setViewPatientId(null)}>
                                Close
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Dialog open={editPatientId === patient.id} onOpenChange={() => setEditPatientId(null)}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditPatientId(patient.id);
                                setEditPatientData({ ...patient });
                              }}
                              aria-label="Edit patient details"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Edit Patient</DialogTitle>
                              <DialogDescription>Update details for {patient.fullName}</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Full Name</Label>
                                <Input
                                  className="col-span-3 focus:ring-2 focus:ring-blue-500"
                                  value={editPatientData.fullName || ""}
                                  onChange={(e) => handleEditChange("fullName", e.target.value)}
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Age</Label>
                                <Input
                                  type="number"
                                  className="col-span-3 focus:ring-2 focus:ring-blue-500"
                                  value={editPatientData.age || ""}
                                  onChange={(e) => handleEditChange("age", parseInt(e.target.value))}
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Gender</Label>
                                <Select
                                  value={editPatientData.gender || ""}
                                  onValueChange={(value) => handleEditChange("gender", value)}
                                >
                                  <SelectTrigger className="col-span-3 focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Condition</Label>
                                <Input
                                  className="col-span-3 focus:ring-2 focus:ring-blue-500"
                                  value={editPatientData.condition || ""}
                                  onChange={(e) => handleEditChange("condition", e.target.value)}
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Condition Details</Label>
                                <Input
                                  className="col-span-3 focus:ring-2 focus:ring-blue-500"
                                  value={editPatientData.conditionDetails || ""}
                                  onChange={(e) => handleEditChange("conditionDetails", e.target.value)}
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Admission Date</Label>
                                <Input
                                  type="date"
                                  className="col-span-3 focus:ring-2 focus:ring-blue-500"
                                  value={editPatientData.admissionDate || ""}
                                  onChange={(e) => handleEditChange("admissionDate", e.target.value)}
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Department</Label>
                                <Select
                                  value={editPatientData.department || ""}
                                  onValueChange={(value) => handleEditChange("department", value)}
                                >
                                  <SelectTrigger className="col-span-3 focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="Select department" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {departments.slice(1).map((dept) => (
                                      <SelectItem key={dept} value={dept}>
                                        {dept}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Status</Label>
                                <Select
                                  value={editPatientData.status || ""}
                                  onValueChange={(value) => handleEditChange("status", value)}
                                >
                                  <SelectTrigger className="col-span-3 focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {statuses.map((status) => (
                                      <SelectItem key={status} value={status}>
                                        {status}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setEditPatientId(null)}>
                                Cancel
                              </Button>
                              <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={handleEdit}
                                disabled={
                                  !editPatientData.fullName ||
                                  !editPatientData.age ||
                                  !editPatientData.gender ||
                                  !editPatientData.condition ||
                                  !editPatientData.conditionDetails ||
                                  !editPatientData.department ||
                                  !editPatientData.status
                                }
                              >
                                Proceed
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Dialog open={confirmEditPatientId === patient.id} onOpenChange={() => setConfirmEditPatientId(null)}>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Confirm Edit</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to update the details for {editPatientData.fullName}?
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Full Name</Label>
                                <span className="col-span-3">{editPatientData.fullName}</span>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Age</Label>
                                <span className="col-span-3">{editPatientData.age}</span>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Gender</Label>
                                <span className="col-span-3">{editPatientData.gender}</span>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Condition</Label>
                                <span className="col-span-3">{editPatientData.condition}</span>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Condition Details</Label>
                                <span className="col-span-3">{editPatientData.conditionDetails}</span>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Admission Date</Label>
                                <span className="col-span-3">{editPatientData.admissionDate}</span>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Department</Label>
                                <span className="col-span-3">{editPatientData.department}</span>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Status</Label>
                                <span className="col-span-3">{editPatientData.status}</span>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setConfirmEditPatientId(null)}>
                                No
                              </Button>
                              <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={handleConfirmEdit}
                              >
                                Yes
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Dialog open={dischargePatientId === patient.id} onOpenChange={() => setDischargePatientId(null)}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDischargePatientId(patient.id)}
                              disabled={patient.status === "Discharged"}
                              aria-label="Discharge patient"
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Discharge
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Confirm Discharge</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to discharge {patient.fullName}? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setDischargePatientId(null)}>
                                No
                              </Button>
                              <Button
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={handleDischarge}
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
                    <TableCell colSpan={9} className="text-center text-gray-500">
                      No patients found
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
