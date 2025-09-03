import { useState, useEffect } from "react"
import { User as UserType } from "@supabase/supabase-js"
import { supabase } from "@/integrations/supabase/client"
import { Bell, Search, User, ChevronDown, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme/ThemeToggle"

export function TopBar() {
  const [user, setUser] = useState<UserType | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      })
    }
  }

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary-glow/5 opacity-50" />
      <div className="flex items-center gap-4 relative z-10">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
        
        <div className="flex items-center gap-2">
          <img src="/lovable-uploads/36fc8716-9747-40f2-a4ee-5256a2fe5ded.png" alt="Hexaware EcoPoint" className="w-10 h-10 rounded-xl shadow-glow" />
          <div>
            <h1 className="font-bold text-lg bg-gradient-to-r from-primary via-primary-glow to-accent-bright bg-clip-text text-transparent">
              Hexaware EcoPoint
            </h1>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 relative z-10">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search profiles, baselines..." 
            className="w-64 pl-10 bg-card/50 backdrop-blur-sm border-border/50 focus:bg-card focus:border-primary/50 transition-all"
          />
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card hover:shadow-glow transition-all">
              <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-semibold">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass-card border-border/50 backdrop-blur-xl">
            <DropdownMenuLabel className="text-foreground">My Account</DropdownMenuLabel>
            {user && (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                {user.email}
              </div>
            )}
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem className="hover:bg-primary/10 hover:text-primary transition-colors">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-primary/10 hover:text-primary transition-colors">Settings</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem onClick={handleSignOut} className="hover:bg-destructive/10 hover:text-destructive transition-colors">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}