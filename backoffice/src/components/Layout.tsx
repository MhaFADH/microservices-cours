import { ReactNode } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, TestTube, LogOut, BarChart3 } from "lucide-react"

type LayoutProps = {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/api-tester", label: "API Tester", icon: TestTube },
    { path: "/users", label: "Users", icon: Users },
    { path: "/metrics", label: "Metrics", icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <span>Backoffice</span>
          </div>
          <nav className="flex items-center gap-1 ml-8">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.username}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}

export default Layout
