import { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DashboardCardProps {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  trend?: {
    value: number
    label: string
    positive: boolean
  }
  className?: string
}

export function DashboardCard({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  className 
}: DashboardCardProps) {
  return (
    <Card className={cn("group relative overflow-hidden border-border/50 bg-gradient-to-br from-card/80 to-card/40 hover:from-card to-card/60 will-change-transform transform-gpu", className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          {title}
        </CardTitle>
        {icon && (
          <div className="text-muted-foreground group-hover:text-primary transition-colors duration-300 will-change-transform transform-gpu">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold text-foreground mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary-glow group-hover:bg-clip-text transition-all duration-300">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center mt-3 p-2 rounded-lg bg-background/50 backdrop-blur-sm">
            <span className={cn(
              "text-sm font-semibold flex items-center gap-1",
              trend.positive ? "text-success" : "text-destructive"
            )}>
              {trend.positive ? "↗" : "↘"} {trend.positive ? "+" : ""}{trend.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-2">
              {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}