import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { apiRequest, Service } from "@/services/api"
import { FileText, AlertCircle, Info, AlertTriangle } from "lucide-react"

type LogEntry = {
  ts: string
  level: string
  msg: string
  service: string
}

const Logs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<string>("all")
  const [selectedLevel, setSelectedLevel] = useState<string>("all")

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const services: Service[] = ["identity", "matchmaking", "economy"]

      const logsPromises = services.map((service) =>
        apiRequest(service, "/logs", "GET")
          .then((response) => {
            const serviceLogs = response.data as { ts: string; level: string; msg: string }[]
            return serviceLogs.map((log) => ({ ...log, service }))
          })
          .catch(() => [])
      )

      const results = await Promise.all(logsPromises)
      const allLogs = results.flat()

      allLogs.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())

      setLogs(allLogs)
    } catch (err) {
      console.error("Failed to fetch logs:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
    const interval = setInterval(() => {
      fetchLogs()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const filteredLogs = logs.filter((log) => {
    const serviceMatch = selectedService === "all" || log.service === selectedService
    const levelMatch = selectedLevel === "all" || log.level === selectedLevel
    return serviceMatch && levelMatch
  })

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "ERROR":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "WARN":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "INFO":
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "ERROR":
        return "text-red-600 bg-red-50"
      case "WARN":
        return "text-yellow-600 bg-yellow-50"
      case "INFO":
        return "text-blue-600 bg-blue-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getServiceColor = (service: string) => {
    switch (service) {
      case "identity":
        return "text-green-600 bg-green-50"
      case "matchmaking":
        return "text-purple-600 bg-purple-50"
      case "economy":
        return "text-orange-600 bg-orange-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const formatTime = (ts: string) => {
    const date = new Date(ts)
    return date.toLocaleTimeString() + "." + date.getMilliseconds().toString().padStart(3, "0")
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Logs</h1>
        <p className="text-muted-foreground">Real-time logs from all microservices</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter logs by service and level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="service">Service</Label>
              <Select
                id="service"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
              >
                <option value="all">All Services</option>
                <option value="identity">Identity</option>
                <option value="matchmaking">Matchmaking</option>
                <option value="economy">Economy</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select
                id="level"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                <option value="all">All Levels</option>
                <option value="INFO">Info</option>
                <option value="WARN">Warning</option>
                <option value="ERROR">Error</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Logs ({filteredLogs.length})</span>
            <span className="text-sm text-muted-foreground">
              {loading ? "Updating..." : "Auto-refresh: 5s"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Loading logs...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No logs found</div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredLogs.map((log, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">{getLevelIcon(log.level)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={"text-xs px-2 py-0.5 rounded-full font-medium " + getLevelColor(log.level)}>
                        {log.level}
                      </span>
                      <span className={"text-xs px-2 py-0.5 rounded-full font-medium " + getServiceColor(log.service)}>
                        {log.service}
                      </span>
                      <span className="text-xs text-muted-foreground">{formatTime(log.ts)}</span>
                    </div>
                    <p className="text-sm break-words">{log.msg}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Logs
