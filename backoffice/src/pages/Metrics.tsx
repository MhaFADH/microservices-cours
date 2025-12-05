import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Activity, Users, TrendingUp, Server } from "lucide-react"
import { apiRequest, Service } from "@/services/api"

type ServiceMetrics = {
  uptime: number
  activeUsers: number
  endpointCount: number
}

type AggregatedMetrics = {
  totalUsers: number
  activeMatches: number
  totalEndpoints: number
  averageUptime: number
}

type ActivityDataPoint = {
  time: string
  users: number
  matches: number
}

type ServiceDataPoint = {
  name: string
  calls: number
  status: string
  uptime: number
}

const Metrics = () => {
  const [metrics, setMetrics] = useState<AggregatedMetrics>({
    totalUsers: 0,
    activeMatches: 0,
    totalEndpoints: 0,
    averageUptime: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activityData, setActivityData] = useState<ActivityDataPoint[]>(() => {
    try {
      const saved = localStorage.getItem("metricsActivityData")
      const savedDate = localStorage.getItem("metricsActivityDate")
      const today = new Date().toDateString()

      // Check if saved data is from today (after 8am) or yesterday (before 8am)
      const now = new Date()
      const currentDate = now.getHours() >= 8 ? today : new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString()

      if (saved && savedDate === currentDate) {
        return JSON.parse(saved)
      }
      return []
    } catch {
      return []
    }
  })
  const [serviceData, setServiceData] = useState<ServiceDataPoint[]>([])
  const [distributionData, setDistributionData] = useState([
    { name: "Active", value: 0 },
    { name: "Idle", value: 0 },
    { name: "Offline", value: 0 },
  ])

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b"]

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      setError(null)

      const services: Service[] = ["identity", "matchmaking", "economy"]
      const metricsPromises = services.map((service) =>
        apiRequest(service, "/metrics", "GET")
          .then((response) => ({
            service,
            data: response.data as ServiceMetrics,
            status: response.status,
          }))
          .catch((err) => ({
            service,
            data: null,
            status: 0,
            error: err.message,
          }))
      )

      const results = await Promise.all(metricsPromises)

      let totalUsers = 0
      let totalEndpoints = 0
      let uptimeSum = 0
      let validServices = 0
      const newServiceData: ServiceDataPoint[] = []

      results.forEach(({ service, data, status }) => {
        if (data && status === 200) {
          totalUsers += data.activeUsers || 0
          totalEndpoints += data.endpointCount || 0
          uptimeSum += data.uptime || 0
          validServices++

          newServiceData.push({
            name: service.charAt(0).toUpperCase() + service.slice(1),
            calls: data.endpointCount || 0,
            status: "Healthy",
            uptime: data.uptime || 0,
          })
        } else {
          newServiceData.push({
            name: service.charAt(0).toUpperCase() + service.slice(1),
            calls: 0,
            status: "Unhealthy",
            uptime: 0,
          })
        }
      })

      const averageUptime = validServices > 0 ? uptimeSum / validServices : 0

      setMetrics({
        totalUsers: totalUsers || 0,
        activeMatches: Math.floor((totalUsers || 0) * 0.3),
        totalEndpoints: totalEndpoints || 0,
        averageUptime: averageUptime || 0,
      })

      setServiceData(newServiceData)

      const activeUsers = Math.floor(totalUsers * 0.4)
      const idleUsers = Math.floor(totalUsers * 0.35)
      const offlineUsers = totalUsers - activeUsers - idleUsers

      setDistributionData([
        { name: "Active", value: activeUsers },
        { name: "Idle", value: idleUsers },
        { name: "Offline", value: offlineUsers },
      ])

      setActivityData((prev) => {
        const now = new Date()
        const hours = now.getHours()
        const minutes = now.getMinutes()

        const timeStr = hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0")

        // Reset at 8am
        if (hours === 8 && minutes < 10) {
          const result = [{
            time: timeStr,
            users: totalUsers,
            matches: Math.floor(totalUsers * 0.3),
          }]

          try {
            localStorage.setItem("metricsActivityData", JSON.stringify(result))
            localStorage.setItem("metricsActivityDate", now.toDateString())
          } catch (err) {
            console.error("Failed to save activity data:", err)
          }

          return result
        }

        const newPoint = {
          time: timeStr,
          users: totalUsers,
          matches: Math.floor(totalUsers * 0.3),
        }

        // Check if data has changed compared to last point
        const lastPoint = prev[prev.length - 1]
        if (lastPoint && lastPoint.users === newPoint.users && lastPoint.matches === newPoint.matches) {
          // Data hasn't changed, don't add new point
          return prev
        }

        // Data changed, add new point and keep last 60 points (1 hour of minute-level data)
        const result = [...prev, newPoint].slice(-60)

        // Save to localStorage
        try {
          localStorage.setItem("metricsActivityData", JSON.stringify(result))
          const currentDate = hours >= 8 ? now.toDateString() : new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString()
          localStorage.setItem("metricsActivityDate", currentDate)
        } catch (err) {
          console.error("Failed to save activity data:", err)
        }

        return result
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch metrics")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(() => {
      fetchMetrics()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const calculatePercent = (value: number) => {
    const total = distributionData.reduce((a, b) => a + b.value, 0)
    if (total === 0) return "0"
    return ((value / total) * 100).toFixed(0)
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (days > 0) return days + "d " + hours + "h"
    if (hours > 0) return hours + "h " + minutes + "m"
    return minutes + "m"
  }

  if (loading && activityData.length === 0) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Metrics Dashboard</h1>
          <p className="text-muted-foreground">Loading metrics...</p>
        </div>
      </div>
    )
  }

  if (error && activityData.length === 0) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Metrics Dashboard</h1>
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Metrics Dashboard</h1>
        <p className="text-muted-foreground">Real-time system metrics and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Active across all services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Matches</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeMatches}</div>
            <p className="text-xs text-muted-foreground">Live right now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Endpoints</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalEndpoints.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Uptime</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatUptime(metrics.averageUptime)}</div>
            <p className="text-xs text-muted-foreground">System uptime</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Active users and matches over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="matches" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Load</CardTitle>
            <CardDescription>Endpoints per service</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={serviceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="calls" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Current user status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => {
                    const percent = calculatePercent(entry.value)
                    return percent === "0" ? "" : entry.name + " " + percent + "%"
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distributionData.map((_entry, index) => (
                    <Cell key={"cell-" + index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Service status overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {serviceData.map((service) => (
              <div key={service.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={"h-2 w-2 rounded-full " + (service.status === "Healthy" ? "bg-green-500" : "bg-red-500")}></div>
                  <span className="text-sm">{service.name} Service</span>
                </div>
                <span className="text-sm font-medium">{service.status}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-sm font-medium">Refresh Rate</span>
              <span className="text-sm">10s</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last Updated</span>
              <span className="text-sm">{loading ? "Updating..." : "Just now"}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Metrics
