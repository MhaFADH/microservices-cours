import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { TestTube, Users, BarChart3, Activity, Zap, Shield, ShoppingCart, FileText, Target, UsersIcon } from "lucide-react"
import { apiRequest, Service } from "@/services/api"

type ServiceMetrics = {
  uptime: number
  activeUsers: number
  endpointCount: number
  totalPosts?: number
  totalPurchases?: number
  totalMatches?: number
  queueSize?: number
}

type ServiceStatus = {
  name: string
  status: "Online" | "Offline"
  uptime: number
  activeUsers: number
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState<ServiceStatus[]>([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalEndpoints, setTotalEndpoints] = useState(0)
  const [totalPosts, setTotalPosts] = useState(0)
  const [totalPurchases, setTotalPurchases] = useState(0)
  const [totalMatches, setTotalMatches] = useState(0)
  const [queueSize, setQueueSize] = useState(0)

  const fetchServicesStatus = async () => {
    try {
      const serviceList: Service[] = ["identity", "matchmaking", "economy"]
      const statusPromises = serviceList.map((service) =>
        apiRequest(service, "/metrics", "GET")
          .then((response) => ({
            name: service.charAt(0).toUpperCase() + service.slice(1),
            status: "Online" as const,
            uptime: (response.data as ServiceMetrics).uptime,
            activeUsers: (response.data as ServiceMetrics).activeUsers,
          }))
          .catch(() => ({
            name: service.charAt(0).toUpperCase() + service.slice(1),
            status: "Offline" as const,
            uptime: 0,
            activeUsers: 0,
          }))
      )

      const results = await Promise.all(statusPromises)
      setServices(results)

      const users = results.reduce((sum, svc) => sum + (svc.activeUsers || 0), 0)
      setTotalUsers(users || 0)

      const identityResponse = await apiRequest("identity", "/metrics", "GET").catch(() => null)
      const matchmakingResponse = await apiRequest("matchmaking", "/metrics", "GET").catch(() => null)
      const economyResponse = await apiRequest("economy", "/metrics", "GET").catch(() => null)

      let endpoints = 0
      if (identityResponse && identityResponse.status === 200) {
        endpoints += (identityResponse.data as ServiceMetrics).endpointCount || 0
      }
      if (matchmakingResponse && matchmakingResponse.status === 200) {
        endpoints += (matchmakingResponse.data as ServiceMetrics).endpointCount || 0
        const matchmakingData = matchmakingResponse.data as ServiceMetrics
        setTotalMatches(matchmakingData.totalMatches || 0)
        setQueueSize(matchmakingData.queueSize || 0)
      }
      if (economyResponse && economyResponse.status === 200) {
        endpoints += (economyResponse.data as ServiceMetrics).endpointCount || 0
        const economyData = economyResponse.data as ServiceMetrics
        setTotalPosts(economyData.totalPosts || 0)
        setTotalPurchases(economyData.totalPurchases || 0)
      }

      setTotalEndpoints(endpoints || 0)
    } catch (err) {
      console.error("Failed to fetch services status:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServicesStatus()
    const interval = setInterval(() => {
      fetchServicesStatus()
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the backoffice control panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/api-tester">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <TestTube className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle>API Tester</CardTitle>
                  <CardDescription>Test endpoints</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Send requests to any microservice and inspect responses in real-time.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/users">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage users</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View, create, edit, and delete users from the identity service.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/metrics">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle>Metrics Dashboard</CardTitle>
                  <CardDescription>View analytics</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Monitor system performance with real-time charts and statistics.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : (
              services.map((service) => (
                <div key={service.name} className="flex items-center justify-between">
                  <span className="text-sm">{service.name} Service</span>
                  <span className={"text-xs px-2 py-1 rounded-full " + (service.status === "Online" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                    {service.status}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Total Active Users</span>
                  </div>
                  <span className="font-semibold">{totalUsers.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Total Posts</span>
                  </div>
                  <span className="font-semibold">{totalPosts.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Total Purchases</span>
                  </div>
                  <span className="font-semibold">{totalPurchases.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">Total Matches</span>
                  </div>
                  <span className="font-semibold">{totalMatches.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <UsersIcon className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Players in Queue</span>
                  </div>
                  <span className="font-semibold">{queueSize.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm">Total Endpoints</span>
                  </div>
                  <span className="font-semibold">{totalEndpoints}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Authentication</span>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">JWT</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Services Protected</span>
              <span className="font-semibold">{services.filter(s => s.status === "Online").length}/3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Auto Refresh</span>
              <span className="text-xs">15s</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Microservices</CardTitle>
          <CardDescription>Connected backend services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Identity Player</h3>
              <p className="text-sm text-muted-foreground mb-2">
                User authentication and profile management
              </p>
              <p className="text-xs font-mono bg-muted px-2 py-1 rounded">localhost:8081</p>
              {!loading && services[0] && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Active Users: {services.find(s => s.name === "Identity")?.activeUsers || 0}
                </div>
              )}
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Matchmaking</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Player matchmaking and lobby management
              </p>
              <p className="text-xs font-mono bg-muted px-2 py-1 rounded">localhost:8082</p>
              {!loading && services[1] && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Active Users: {services.find(s => s.name === "Matchmaking")?.activeUsers || 0}
                </div>
              )}
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Economy Community</h3>
              <p className="text-sm text-muted-foreground mb-2">
                In-game economy and community features
              </p>
              <p className="text-xs font-mono bg-muted px-2 py-1 rounded">localhost:8083</p>
              {!loading && services[2] && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Active Users: {services.find(s => s.name === "Economy")?.activeUsers || 0}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
