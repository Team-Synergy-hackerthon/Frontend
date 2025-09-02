
"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

// Type definitions
interface SidebarLink {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface DashboardMetric {
  title: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

interface Appointment {
  id: number
  patient: string
  date: string
  time: string
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled'
}

interface Ambulance {
  id: string
  status: 'Available' | 'In Use' | 'Maintenance'
  location: string
}

interface User {
  id: number
  name: string
  role: string
  status: 'Active' | 'Inactive'
}

type BadgeVariant = 'default' | 'secondary' | 'success' | 'destructive' | 'warning'

const sidebarLinks: SidebarLink[] = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { title: 'User Management', href: '/admin/users', icon: Users },
  { title: 'Ambulances', href: '/admin/ambulances', icon: Ambulance },
  { title: 'Resource Management', href: '/admin/resources', icon: Clipboard },
  { title: 'Appointments Calendar', href: '/admin/calendar', icon: Calendar },
  { title: 'Notifications', href: '/admin/notifications', icon: Bell },
  { title: 'Settings', href: '/admin/settings', icon: Settings },
]

const dashboardMetrics: DashboardMetric[] = [
  { title: 'Total Users', value: '120', icon: Users, color: 'text-blue-600' },
  { title: 'Appointments Today', value: '75', icon: Calendar, color: 'text-green-600' },
  { title: 'Ambulances Available', value: '8', icon: Ambulance, color: 'text-red-600' },
  { title: 'Resources In Use', value: '34', icon: Clipboard, color: 'text-purple-600' },
  { title: 'Pending Notifications', value: '5', icon: Bell, color: 'text-yellow-600' },
]

const recentAppointments: Appointment[] = [
  { id: 1, patient: 'John Doe', date: '2025-09-02', time: '10:00 AM', status: 'Scheduled' },
  { id: 2, patient: 'Jane Smith', date: '2025-09-02', time: '11:30 AM', status: 'In Progress' },
  { id: 3, patient: 'Mike Johnson', date: '2025-09-03', time: '02:00 PM', status: 'Completed' },
  { id: 4, patient: 'Sarah Williams', date: '2025-09-03', time: '03:15 PM', status: 'Cancelled' },
]

const ambulances: Ambulance[] = [
  { id: 'AMB-001', status: 'Available', location: 'Station A' },
  { id: 'AMB-002', status: 'In Use', location: 'En Route' },
  { id: 'AMB-003', status: 'Maintenance', location: 'Garage' },
  { id: 'AMB-004', status: 'Available', location: 'Station B' },
]

const recentUsers: User[] = [
  { id: 1, name: 'Dr. Alice Brown', role: 'Physician', status: 'Active' },
  { id: 2, name: 'Nurse Bob Carter', role: 'Nurse', status: 'Active' },
  { id: 3, name: 'Patient Charlie Davis', role: 'Patient', status: 'Inactive' },
  { id: 4, name: 'Admin Dana Evans', role: 'Admin', status: 'Active' },
]

// Notification type definition and mock data
interface Notification {
  message: string
  time: string
  type: 'appointment' | 'alert'
}

const recentNotifications: Notification[] = [
  { message: 'New appointment scheduled for John Doe.', time: '2 minutes ago', type: 'appointment' },
  { message: 'Ambulance AMB-002 is now in use.', time: '10 minutes ago', type: 'alert' },
  { message: 'Resource clipboard updated.', time: '30 minutes ago', type: 'alert' },
  { message: 'Appointment for Jane Smith completed.', time: '1 hour ago', type: 'appointment' },
]

export default function AdminDashboard() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
  const [selectedPatient, setSelectedPatient] = useState<string>('all')
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    // Implement logout logic here (e.g., clear auth token, redirect to login)
    router.push('/auth/login')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          {!isCollapsed && <h1 className="text-xl font-bold text-blue-700">Wezi Admin</h1>}
          <Button
            variant="ghost"
            size="sm"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn('ml-auto rounded hover:bg-gray-100 focus:ring-2 focus:ring-blue-500', isCollapsed && 'mx-auto')}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronLeft
              className={cn('h-5 w-5 text-gray-500 transition-transform', isCollapsed && 'rotate-180')}
            />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center px-3 py-2 rounded hover:bg-gray-100 text-gray-600 transition-colors focus:ring-2 focus:ring-blue-500',
                  isActive && 'bg-blue-50 text-blue-600',
                  isCollapsed && 'justify-center'
                )}
                aria-label={link.title}
              >
                <link.icon className={cn('h-5 w-5', !isCollapsed && 'mr-3')} />
                {!isCollapsed && <span>{link.title}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className={cn(
              'flex items-center w-full px-3 py-2 rounded hover:bg-gray-100 text-gray-600 focus:ring-2 focus:ring-blue-500',
              isCollapsed && 'justify-center'
            )}
            onClick={handleLogout}
            aria-label="Logout"
          >
            <LogOut className={cn('h-5 w-5', !isCollapsed && 'mr-3')} />
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
              <Input className="pl-10 focus:ring-2 focus:ring-blue-500" placeholder="Search..." aria-label="Search dashboard" />
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
                  <AvatarImage src="/admin-avatar.png" alt="Admin" onError={() => console.log('Failed to load avatar')} />
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

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 animate-in fade-in">Admin Dashboard</h2>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {dashboardMetrics.length > 0 ? (
              dashboardMetrics.map((metric) => (
                <div
                  key={metric.title}
                  className="bg-white p-4 rounded-lg shadow flex items-center gap-4 transform transition-all hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-500"
                  tabIndex={0}
                  aria-label={metric.title}
                >
                  <div className={`p-2 rounded-full bg-${metric.color.split('-')[1]}-100`}>
                    <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No metrics available</p>
            )}
          </div>

          {/* Appointments Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Recent Appointments</h3>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger className="w-[180px] focus:ring-2 focus:ring-blue-500" aria-label="Filter appointments by patient">
                  <SelectValue placeholder="Filter by Patient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Patients</SelectItem>
                  <SelectItem value="john-doe">John Doe</SelectItem>
                  <SelectItem value="jane-smith">Jane Smith</SelectItem>
                  <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                  <SelectItem value="sarah-williams">Sarah Williams</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAppointments.length > 0 ? (
                  recentAppointments
                    .filter(
                      (appointment) =>
                        selectedPatient === 'all' ||
                        appointment.patient.toLowerCase().replace(' ', '-') === selectedPatient
                    )
                    .map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>{appointment.patient}</TableCell>
                        <TableCell className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {appointment.date}
                        </TableCell>
                        <TableCell className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          {appointment.time}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              appointment.status === 'Scheduled'
                                ? 'default'
                                : appointment.status === 'In Progress'
                                ? 'secondary'
                                : appointment.status === 'Completed'
                                ? 'default'
                                : 'destructive'
                            }
                          >
                            {appointment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500">
                      No appointments available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Ambulances Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Ambulances</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ambulances.length > 0 ? (
                  ambulances.map((ambulance) => (
                    <TableRow key={ambulance.id}>
                      <TableCell>{ambulance.id}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            ambulance.status === 'Available'
                              ? 'default'
                              : ambulance.status === 'In Use'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {ambulance.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{ambulance.location}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500">
                      No ambulances available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* User Management Summary */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Users</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.length > 0 ? (
                  recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500">
                      No users available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Notifications Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Notifications</h3>
            {recentNotifications.length > 0 ? (
              <ul className="space-y-4">
                {recentNotifications.map((notification, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <Bell className={`h-5 w-5 ${notification.type === 'appointment' ? 'text-yellow-500' : 'text-red-500'} mt-1`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No notifications available</p>
            )}
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
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
  )
}

