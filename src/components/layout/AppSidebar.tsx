import { useState } from "react"
import { 
  BarChart3, 
  Users, 
  Settings, 
  Target, 
  Building2, 
  Lightbulb,
  Activity,
  Shield,
  TrendingUp
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const mainItems = [
  { title: "Overview", url: "/", icon: BarChart3 },
  { title: "User Profiles", url: "/profiles", icon: Users },
  { title: "Baselines", url: "/baselines", icon: Target },
  { title: "Endpoints", url: "/endpoints", icon: Activity },
  { title: "Organizations", url: "/organizations", icon: Building2 },
  { title: "Recommendations", url: "/recommendations", icon: Lightbulb },
]

const analyticsItems = [
  { title: "Security Analytics", url: "/security", icon: Shield },
  { title: "Performance Trends", url: "/trends", icon: TrendingUp },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"

  const isActive = (path: string) => currentPath === path

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground shadow-glow font-medium" 
      : "text-muted-foreground hover:bg-card-hover hover:text-card-foreground transition-smooth"

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-64"} border-r border-border bg-card`}
    >
      <SidebarContent className="bg-card">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">H</span>
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-semibold text-card-foreground">EchoPoint</h2>
                <p className="text-xs text-muted-foreground">Workplace Analytics</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavClass}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analyticsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavClass}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}