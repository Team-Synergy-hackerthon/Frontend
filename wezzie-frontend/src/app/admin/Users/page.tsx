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
  Key,
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
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

// Type definitions
interface SidebarLink {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  role: "Admin" | "Clinician" | "Driver";
  gender: "Male" | "Female" | "Other";
  status: "Active" | "Inactive";
}

interface FormErrors {
  name?: string;
  email?: string;
  username?: string;
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

const initialUsers: User[] = [
  {
    id: 1,
    name: "Dr. Alice Brown",
    email: "alice.brown@wezi.com",
    username: "alice_brown",
    role: "Clinician",
    gender: "Female",
    status: "Active",
  },
  {
    id: 2,
    name: "Bob Carter",
    email: "bob.carter@wezi.com",
    username: "bob_carter",
    role: "Driver",
    gender: "Male",
    status: "Active",
  },
  {
    id: 3,
    name: "Charlie Davis",
    email: "charlie.davis@wezi.com",
    username: "charlie_davis",
    role: "Clinician",
    gender: "Male",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Dana Evans",
    email: "dana.evans@wezi.com",
    username: "dana_evans",
    role: "Admin",
    gender: "Female",
    status: "Active",
  },
  {
    id: 5,
    name: "Eve Franklin",
    email: "eve.franklin@wezi.com",
    username: "eve_franklin",
    role: "Driver",
    gender: "Female",
    status: "Active",
  },
];

export default function UserManagement() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    username: string;
    role: "Admin" | "Clinician" | "Driver";
    gender: "Male" | "Female" | "Other";
    status: "Active" | "Inactive";
  }>({
    name: "",
    email: "",
    username: "",
    role: "Clinician",
    gender: "Male",
    status: "Active",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const pathname = usePathname();
  const router = useRouter();

  const validateForm = () => {
    const errors: FormErrors = {};
    if (!formData.name || formData.name.length < 2) {
      errors.name = "Name is required and must be at least 2 characters";
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "A valid email is required";
    }
    if (!formData.username || !/^[a-zA-Z0-9_-]{3,}$/.test(formData.username)) {
      errors.username = "Username is required and must be at least 3 characters (alphanumeric, underscores, or hyphens)";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.id]: undefined });
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData({ ...formData, [field]: value });
    setFormErrors({ ...formErrors, [field]: undefined });
  };

  const handleAddUser = () => {
    if (!validateForm()) return;
    const newUser = {
      id: users.length + 1,
      ...formData,
    };
    setUsers([...users, newUser]);
    setIsAddModalOpen(false);
    setFormData({ name: "", email: "", username: "", role: "Clinician", gender: "Male", status: "Active" });
    setFormErrors({});
    toast({
      title: "User Added",
      description: `${newUser.name} has been added successfully.`,
    });
  };

  const handleEditUser = () => {
    if (!validateForm() || !selectedUser) return;
    const updatedUsers = users.map((user) =>
      user.id === selectedUser.id ? { ...user, ...formData } : user
    );
    setUsers(updatedUsers);
    setIsEditModalOpen(false);
    setSelectedUser(null);
    setFormErrors({});
    toast({
      title: "User Updated",
      description: `${formData.name} has been updated successfully.`,
    });
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      const updatedUsers = users.filter((user) => user.id !== selectedUser.id);
      setUsers(updatedUsers);
      setIsDeleteModalOpen(false);
      toast({
        title: "User Deleted",
        description: `${selectedUser.name} has been deleted successfully.`,
      });
      setSelectedUser(null);
    }
  };

  const handleResetPassword = () => {
    if (selectedUser) {
      // Simulate sending reset password email
      toast({
        title: "Password Reset",
        description: `A password reset email has been sent to ${selectedUser.email}.`,
      });
      setIsResetPasswordModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleSuspendUser = (user: User) => {
    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u
    );
    setUsers(updatedUsers);
    toast({
      title: user.status === "Active" ? "User Suspended" : "User Activated",
      description: `${user.name} has been ${user.status === "Active" ? "suspended" : "activated"}.`,
    });
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      gender: user.gender,
      status: user.status,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const openResetPasswordModal = (user: User) => {
    setSelectedUser(user);
    setIsResetPasswordModalOpen(true);
  };

  const filteredUsers = selectedRole === "all"
    ? users
    : users.filter((user) => user.role.toLowerCase() === selectedRole);

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
                placeholder="Search users..."
                aria-label="Search users"
              />
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
                <DropdownMenuItem className="focus:bg-blue-50" onClick={() => router.push("/auth/login")}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* User Management Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
            <div className="flex items-center gap-4">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-[180px] focus:ring-2 focus:ring-blue-500" aria-label="Filter users by role">
                  <SelectValue placeholder="Filter by Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="clinician">Clinician</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>Enter the details for the new user below.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right font-medium">
                        Name
                      </Label>
                      <div className="col-span-3">
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={cn("focus:ring-2 focus:ring-blue-500", formErrors.name && "border-red-500")}
                          placeholder="Enter full name"
                        />
                        {formErrors.name && <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right font-medium">
                        Email
                      </Label>
                      <div className="col-span-3">
                        <Input
                          id="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={cn("focus:ring-2 focus:ring-blue-500", formErrors.email && "border-red-500")}
                          placeholder="Enter email"
                        />
                        {formErrors.email && <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right font-medium">
                        Username
                      </Label>
                      <div className="col-span-3">
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className={cn("focus:ring-2 focus:ring-blue-500", formErrors.username && "border-red-500")}
                          placeholder="Enter username"
                        />
                        {formErrors.username && <p className="text-sm text-red-500 mt-1">{formErrors.username}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right font-medium">
                        Role
                      </Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) => handleSelectChange(value, "role")}
                      >
                        <SelectTrigger className="col-span-3 focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Clinician">Clinician</SelectItem>
                          <SelectItem value="Driver">Driver</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="gender" className="text-right font-medium">
                        Gender
                      </Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => handleSelectChange(value, "gender")}
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
                      <Label htmlFor="status" className="text-right font-medium">
                        Status
                      </Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => handleSelectChange(value, "status")}
                      >
                        <SelectTrigger className="col-span-3 focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleAddUser}
                      disabled={Object.keys(formErrors).length > 0 || !formData.name || !formData.email || !formData.username}
                    >
                      Add User
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.gender}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === "Active" ? "default" : "destructive"}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(user)}>
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleSuspendUser(user)}>
                          {user.status === "Active" ? "Suspend" : "Activate"}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => openDeleteModal(user)}>
                          Delete
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openResetPasswordModal(user)}
                          className="flex items-center gap-1"
                        >
                          <Key className="h-4 w-4" />
                          Reset
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500">
                      No users available
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update the details for {selectedUser?.name} below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right font-medium">
                Name
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={cn("focus:ring-2 focus:ring-blue-500", formErrors.name && "border-red-500")}
                  placeholder="Enter full name"
                />
                {formErrors.name && <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right font-medium">
                Email
              </Label>
              <div className="col-span-3">
                <Input
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={cn("focus:ring-2 focus:ring-blue-500", formErrors.email && "border-red-500")}
                  placeholder="Enter email"
                />
                {formErrors.email && <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right font-medium">
                Username
              </Label>
              <div className="col-span-3">
                <Input
                  id="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={cn("focus:ring-2 focus:ring-blue-500", formErrors.username && "border-red-500")}
                  placeholder="Enter username"
                />
                {formErrors.username && <p className="text-sm text-red-500 mt-1">{formErrors.username}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right font-medium">
                Role
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange(value, "role")}
              >
                <SelectTrigger className="col-span-3 focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Clinician">Clinician</SelectItem>
                  <SelectItem value="Driver">Driver</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gender" className="text-right font-medium">
                Gender
              </Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleSelectChange(value, "gender")}
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
              <Label htmlFor="status" className="text-right font-medium">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange(value, "status")}
              >
                <SelectTrigger className="col-span-3 focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleEditUser}
              disabled={Object.keys(formErrors).length > 0 || !formData.name || !formData.email || !formData.username}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeleteUser}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Modal */}
      <Dialog open={isResetPasswordModalOpen} onOpenChange={setIsResetPasswordModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Send a password reset email to {selectedUser?.email}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetPasswordModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleResetPassword}
            >
              Send Reset Email
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