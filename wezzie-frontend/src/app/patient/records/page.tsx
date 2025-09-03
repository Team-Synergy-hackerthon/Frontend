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
  Settings,
  ChevronDown,
  Ambulance,
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

interface MedicalRecord {
  id: number;
  date: string;
  symptoms: string[];
  diagnosis: string;
  causeOfVisit: string;
  prescription: string[];
  clinician: string;
  department: string;
  followUpNeeded: boolean;
  followUpDate?: string;
   Recomandations?: string | null;
}

const sidebarLinks: SidebarLink[] = [
  { title: "Dashboard", href: "/patient", icon: LayoutDashboard },
  { title: "Appointments", href: "/patient/appointments", icon: Calendar },
  { title: "Medical Records", href: "/patient/records", icon: FileText },
  { title: "Profile", href: "/patient/profile", icon: User },
  { title: "Notifications", href: "/patient/notifications", icon: Bell },
];

const medicalRecords: MedicalRecord[] = [
  {
    id: 1,
    date: "2025-08-01",
    symptoms: ["Fatigue", "Headache"],
    diagnosis: "Routine Checkup",
    causeOfVisit: "Annual physical exam",
    prescription: ["Paracetamol 500mg as needed"],
    clinician: "Dr. John Doe",
    department: "General Medicine",
    followUpNeeded: false,
    Recomandations: "Normal vitals, advised regular exercise",
  },
  {
    id: 2,
    date: "2025-07-20",
    symptoms: ["High blood pressure", "Dizziness"],
    diagnosis: "Hypertension",
    causeOfVisit: "Persistent high blood pressure readings",
    prescription: ["Amlodipine 5mg daily", "Hydrochlorothiazide 25mg daily"],
    clinician: "Dr. Jane Smith",
    department: "Cardiology",
    followUpNeeded: true,
    followUpDate: "2025-08-20",
  },
  {
    id: 3,
    date: "2025-06-15",
    symptoms: ["Cough", "Fever", "Sore throat"],
    diagnosis: "Upper Respiratory Infection",
    causeOfVisit: "Persistent cough and fever",
    prescription: ["Azithromycin 500mg for 5 days"],
    clinician: "Dr. Alice Brown",
    department: "Infectious Diseases",
    followUpNeeded: true,
    followUpDate: "2025-06-22",
  },
  {
    id: 4,
    date: "2025-05-10",
    symptoms: ["Joint pain", "Swelling"],
    diagnosis: "Arthritis",
    causeOfVisit: "Chronic knee pain",
    prescription: ["Ibuprofen 400mg as needed"],
    clinician: "Dr. Michael Green",
    department: "Orthopedics",
    followUpNeeded: false,
  },
];

export default function PatientDashboard() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("all");
  const [sortByFollowUp, setSortByFollowUp] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  const filteredRecords = medicalRecords
    .filter((record) => {
      if (filter === "all") return true;
      if (filter === "follow-up") return record.followUpNeeded;
      if (filter === "no-follow-up") return !record.followUpNeeded;
      return record.diagnosis.toLowerCase().includes(filter.toLowerCase());
    })
    .sort((a, b) => {
      if (sortByFollowUp) {
        return a.followUpNeeded === b.followUpNeeded ? 0 : a.followUpNeeded ? -1 : 1;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
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
                {!isCollapsed && (
                  <div className="flex items-center w-full">
                    <span>{link.title}</span>
                    {link.title === "Appointments" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="ml-auto">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="animate-none">
                          <DropdownMenuItem className="focus:bg-blue-50">
                            <Calendar className="mr-2 h-4 w-4" />
                            <Link href="/patient/appointments/book-medical">Book Medical Appointment</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-blue-50">
                            <Ambulance className="mr-2 h-4 w-4" />
                            <Link href="/patient/appointments/book-ambulance">Book Ambulance</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                )}
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
                placeholder="Search by diagnosis..."
                aria-label="Search medical records"
                onChange={(e) => setFilter(e.target.value)}
              />
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
              <DropdownMenuContent align="end" className="animate-none">
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
                <DropdownMenuItem className="focus:bg-blue-50" onClick={() => router.push("/auth/login")}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Medical Records Portal</h2>

          {/* Medical Records Table */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Your Medical Records</h3>
              <div className="flex items-center gap-4">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px] focus:ring-2 focus:ring-blue-500" aria-label="Filter medical records">
                    <SelectValue placeholder="Filter Records" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Records</SelectItem>
                    <SelectItem value="follow-up">Follow-Up Needed</SelectItem>
                    <SelectItem value="no-follow-up">No Follow-Up</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => setSortByFollowUp(!sortByFollowUp)}
                  className="flex items-center gap-2"
                  aria-label={sortByFollowUp ? "Sort by date" : "Sort by follow-up status"}
                >
                  <FileText className="h-4 w-4" />
                  {sortByFollowUp ? "Sort by Date" : "Sort by Follow-Up"}
                </Button>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Symptoms</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Cause of Visit</TableHead>
                  <TableHead>Prescription</TableHead>
                  <TableHead>Clinician</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Follow-Up</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <TableRow
                      key={record.id}
                      className={cn(record.followUpNeeded && "bg-yellow-50")}
                    >
                      <TableCell className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        {record.date}
                      </TableCell>
                      <TableCell>{record.symptoms.join(", ") || "None"}</TableCell>
                      <TableCell>{record.diagnosis}</TableCell>
                      <TableCell>{record.causeOfVisit}</TableCell>
                      <TableCell>{record.prescription.join(", ") || "None"}</TableCell>
                      <TableCell>{record.clinician}</TableCell>
                      <TableCell>{record.department}</TableCell>
                      <TableCell>
                        <Badge variant={record.followUpNeeded ? "destructive" : "default"}>
                          {record.followUpNeeded ? `Yes (${record.followUpDate})` : "No"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-500">
                      No medical records found
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
      `}</style>
    </div>
  );
}