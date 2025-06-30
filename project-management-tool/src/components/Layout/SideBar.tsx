"use client"
import { signOut, useSession } from "next-auth/react"
import type React from "react"
import { toastRequest } from "../toast/toaster"
import { Routes } from "@/constant/accountRoutes"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/UI/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar"
import { LogOut, Home, FolderKanban, Users, Settings, BarChart3, Calendar, FileText, Bell } from "lucide-react"
import { Badge } from "@/components/UI/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/UI/alert-dialog"
import { useState } from "react"

// Icon mapping for routes - you can customize these based on your actual routes
const getRouteIcon = (routeName: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    Dashboard: <Home className="h-4 w-4" />,
    Projects: <FolderKanban className="h-4 w-4" />,
    Team: <Users className="h-4 w-4" />,
    Analytics: <BarChart3 className="h-4 w-4" />,
    Calendar: <Calendar className="h-4 w-4" />,
    Documents: <FileText className="h-4 w-4" />,
    Notifications: <Bell className="h-4 w-4" />,
    Settings: <Settings className="h-4 w-4" />,
  }
  return iconMap[routeName] || <Home className="h-4 w-4" />
}

export default function SideBar() {
  const { data: session } = useSession()
  const pathName = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      await signOut({ redirect: true, callbackUrl: "/login" })
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="SideBar">
      <Sidebar className="fixed top-10 left-0 bottom-0 w-64 border-r border-slate-200 bg-white shadow-sm">
        {/* Header with Profile */}
        <SidebarHeader className="border-b border-slate-100 p-4">
          <div className="hidden lg:flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-blue-100">
              <AvatarImage src={session?.user.image || ""} alt="Profile" />
              <AvatarFallback className="bg-blue-600 text-white font-semibold">
                {session?.user.username?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 truncate">{session?.user.username}</span>
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  Pro
                </Badge>
              </div>
              <span className="text-xs text-slate-500 truncate">{session?.user.email}</span>
            </div>
          </div>
        </SidebarHeader>

        {/* Navigation Content */}
        <SidebarContent className="px-2 py-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {Routes.map((route) => (
                  <SidebarMenuItem key={route.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={route.path === pathName}
                      className="w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700 data-[active=true]:border-r-2 data-[active=true]:border-blue-600"
                    >
                      <Link href={route.path} className="flex items-center gap-3 w-full">
                        {getRouteIcon(route.name)}
                        <span className="truncate">{route.name}</span>
                        {route.path === pathName && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer with Sign Out */}
        <SidebarFooter className="border-t border-slate-100 p-16">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full justify-start gap-3 py-2.5 text-base bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border border-red-200 shadow-sm transition-all duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sign Out</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sign Out Confirmation</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to sign out? You'll need to sign in again to access your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Signing out...</span>
                    </div>
                  ) : (
                    "Sign out"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Additional Footer Info */}
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Version 2.1.0</span>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>Online</span>
              </div>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}
