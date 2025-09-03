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

// Type definitions
interface SidebarLink {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface Ambulance {
  id: string;
  license: string;
  model: string;
  status: "Available" | "In Transit" | "Occupied" | "In Repair" | "Unavailable";
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

const initialAmbulances: Ambulance[] = [
  { id: "AMB-001", license: "ABC123", model: "Ford Transit", status: "Available" },
  { id: "AMB-002", license: "DEF456", model: "Mercedes Sprinter", status: "In Transit" },
  { id: "AMB-003", license: "GHI789", model: "Ford Transit", status: "Occupied" },
  { id: "AMB-004", license: "JKL012", model: "Mercedes Sprinter", status: "In Repair" },
  { id: "AMB-005", license: "MNO345", model: "Ford Transit", status: "Unavailable" },
];

export default function AmbulanceManagement() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [ambulances, setAmbulances] = useState<Ambulance[]>(initialAmbulances);
  const [selectedAmbulance, setSelectedAmbulance] = useState<Ambulance | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState<{ license: string; model: string; status: "Available" | "In Transit" | "Occupied" | "In Repair" | "Unavailable" }>({
    license: "",
    model: "",
    status: "Available",
  });
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push("/auth/login");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, status: value as any });
  };

  const generateId = () => {
    const num = ambulances.length + 1;
    return `AMB-${num.toString().padStart(3, "0")}`;
  };

  const handleAddAmbulance = () => {
    const newAmbulance = {
      id: generateId(),
      ...formData,
    };
    setAmbulances([...ambulances, newAmbulance]);
    setIsAddModalOpen(false);
    setFormData({ license: "", model: "", status: "Available" });
  };

  const handleEditAmbulance = () => {
    if (selectedAmbulance) {
      const updatedAmbulances = ambulances.map((amb) =>
        amb.id === selectedAmbulance.id ? { ...amb, ...formData } : amb
      );
      setAmbulances(updatedAmbulances);
      setIsEditModalOpen(false);
      setSelectedAmbulance(null);
    }
  };

  const handleDeleteAmbulance = () => {
    if (selectedAmbulance) {
      const updatedAmbulances = ambulances.filter((amb) => amb.id !== selectedAmbulance.id);
      setAmbulances(updatedAmbulances);
      setIsDeleteModalOpen(false);
      setSelectedAmbulance(null);
    }
  };

  const handleSetStatus = (ambulance: Ambulance, newStatus: Ambulance["status"]) => {
    const updatedAmbulances = ambulances.map((amb) =>
      amb.id === ambulance.id ? { ...amb, status: newStatus } : amb
    );
    setAmbulances(updatedAmbulances);
  };

  const openEditModal = (ambulance: Ambulance) => {
    setSelectedAmbulance(ambulance);
    setFormData({ license: ambulance.license, model: ambulance.model, status: ambulance.status });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (ambulance: Ambulance) => {
    setSelectedAmbulance(ambulance);
    setIsDeleteModalOpen(true);
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
              <Input className="pl-10 focus:ring-2 focus:ring-blue-500" placeholder="Search ambulances..." aria-label="Search ambulances" />
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

        {/* Ambulance Management Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Ambulance Management</h2>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button variant="default">Add Ambulance</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Ambulance</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="license" className="text-right">
                      License
                    </Label>
                    <Input
                      id="license"
                      value={formData.license}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="model" className="text-right">
                      Model
                    </Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="In Transit">In Transit</SelectItem>
                        <SelectItem value="Occupied">Occupied</SelectItem>
                        <SelectItem value="In Repair">In Repair</SelectItem>
                        <SelectItem value="Unavailable">Unavailable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddAmbulance}>Add Ambulance</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>License</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ambulances.length > 0 ? (
                  ambulances.map((ambulance) => (
                    <TableRow key={ambulance.id}>
                      <TableCell>{ambulance.id}</TableCell>
                      <TableCell>{ambulance.license}</TableCell>
                      <TableCell>{ambulance.model}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            ambulance.status === "Available"
                              ? "success"
                              : ambulance.status === "In Transit" || ambulance.status === "Occupied"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {ambulance.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleSetStatus(ambulance, "Available")}>
                          Mark Available
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleSetStatus(ambulance, "In Repair")}>
                          Mark In Repair
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleSetStatus(ambulance, "Unavailable")}>
                          Mark Unavailable
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEditModal(ambulance)}>
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => openDeleteModal(ambulance)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      No ambulances available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Ambulance</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="license" className="text-right">
                License
              </Label>
              <Input
                id="license"
                value={formData.license}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model" className="text-right">
                Model
              </Label>
              <Input
                id="model"
                value={formData.model}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Occupied">Occupied</SelectItem>
                  <SelectItem value="In Repair">In Repair</SelectItem>
                  <SelectItem value="Unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditAmbulance}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete ambulance {selectedAmbulance?.id}?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAmbulance}>
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