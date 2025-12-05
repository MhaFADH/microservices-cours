import { useState, useEffect } from "react"
import { apiRequest, Service } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Send, Lock } from "lucide-react"

type ApiTemplate = {
  id: string
  service: Service
  serviceName: string
  method: string
  endpoint: string
  name: string
  fields: {
    name: string
    label: string
    type: string
    placeholder?: string
    required?: boolean
  }[]
}

const API_TEMPLATES: ApiTemplate[] = [
  {
    id: "identity-register",
    service: "identity",
    serviceName: "Identity Service",
    method: "POST",
    endpoint: "/auth/register",
    name: "Register User",
    fields: [
      {
        name: "username",
        label: "Username",
        type: "text",
        placeholder: "johndoe",
        required: true,
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "john@example.com",
        required: true,
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
        required: true,
      },
    ],
  },
  {
    id: "identity-login",
    service: "identity",
    serviceName: "Identity Service",
    method: "POST",
    endpoint: "/auth/login",
    name: "Login User",
    fields: [
      {
        name: "username",
        label: "Username",
        type: "text",
        placeholder: "johndoe",
        required: true,
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
        required: true,
      },
    ],
  },
  {
    id: "identity-logout",
    service: "identity",
    serviceName: "Identity Service",
    method: "POST",
    endpoint: "/auth/logout",
    name: "Logout User",
    fields: [],
  },
  {
    id: "identity-get-users",
    service: "identity",
    serviceName: "Identity Service",
    method: "GET",
    endpoint: "/users",
    name: "Get All Users",
    fields: [],
  },
  {
    id: "identity-get-user",
    service: "identity",
    serviceName: "Identity Service",
    method: "GET",
    endpoint: "/users/{id}",
    name: "Get User by ID",
    fields: [
      {
        name: "id",
        label: "User ID",
        type: "text",
        placeholder: "123",
        required: true,
      },
    ],
  },
  {
    id: "identity-delete-user",
    service: "identity",
    serviceName: "Identity Service",
    method: "DELETE",
    endpoint: "/users/{id}",
    name: "Delete User",
    fields: [
      {
        name: "id",
        label: "User ID",
        type: "text",
        placeholder: "123",
        required: true,
      },
    ],
  },
  {
    id: "identity-metrics",
    service: "identity",
    serviceName: "Identity Service",
    method: "GET",
    endpoint: "/metrics",
    name: "Get Metrics",
    fields: [],
  },
  {
    id: "matchmaking-join-queue",
    service: "matchmaking",
    serviceName: "Matchmaking Service",
    method: "POST",
    endpoint: "/queue/join",
    name: "Join Queue",
    fields: [
      {
        name: "playerId",
        label: "Player ID",
        type: "text",
        placeholder: "123",
        required: true,
      },
    ],
  },
  {
    id: "matchmaking-leave-queue",
    service: "matchmaking",
    serviceName: "Matchmaking Service",
    method: "POST",
    endpoint: "/queue/leave",
    name: "Leave Queue",
    fields: [
      {
        name: "playerId",
        label: "Player ID",
        type: "text",
        placeholder: "123",
        required: true,
      },
    ],
  },
  {
    id: "matchmaking-get-queue",
    service: "matchmaking",
    serviceName: "Matchmaking Service",
    method: "GET",
    endpoint: "/queue",
    name: "Get Queue",
    fields: [],
  },
  {
    id: "matchmaking-create-match",
    service: "matchmaking",
    serviceName: "Matchmaking Service",
    method: "POST",
    endpoint: "/matches",
    name: "Create Match",
    fields: [
      {
        name: "player1Id",
        label: "Player 1 ID",
        type: "text",
        placeholder: "123",
        required: true,
      },
      {
        name: "player2Id",
        label: "Player 2 ID",
        type: "text",
        placeholder: "456",
        required: true,
      },
    ],
  },
  {
    id: "matchmaking-complete-match",
    service: "matchmaking",
    serviceName: "Matchmaking Service",
    method: "POST",
    endpoint: "/matches/{id}/complete",
    name: "Complete Match",
    fields: [
      {
        name: "id",
        label: "Match ID",
        type: "text",
        placeholder: "123",
        required: true,
      },
      {
        name: "winnerId",
        label: "Winner ID",
        type: "text",
        placeholder: "123",
        required: true,
      },
    ],
  },
  {
    id: "matchmaking-get-matches",
    service: "matchmaking",
    serviceName: "Matchmaking Service",
    method: "GET",
    endpoint: "/matches",
    name: "Get All Matches",
    fields: [],
  },
  {
    id: "matchmaking-get-match",
    service: "matchmaking",
    serviceName: "Matchmaking Service",
    method: "GET",
    endpoint: "/matches/{id}",
    name: "Get Match by ID",
    fields: [
      {
        name: "id",
        label: "Match ID",
        type: "text",
        placeholder: "123",
        required: true,
      },
    ],
  },
  {
    id: "matchmaking-get-player-matches",
    service: "matchmaking",
    serviceName: "Matchmaking Service",
    method: "GET",
    endpoint: "/matches/player/{playerId}",
    name: "Get Player Matches",
    fields: [
      {
        name: "playerId",
        label: "Player ID",
        type: "text",
        placeholder: "123",
        required: true,
      },
    ],
  },
  {
    id: "matchmaking-metrics",
    service: "matchmaking",
    serviceName: "Matchmaking Service",
    method: "GET",
    endpoint: "/metrics",
    name: "Get Metrics",
    fields: [],
  },
  {
    id: "economy-get-posts",
    service: "economy",
    serviceName: "Economy Service",
    method: "GET",
    endpoint: "/posts",
    name: "Get All Posts",
    fields: [],
  },
  {
    id: "economy-create-post",
    service: "economy",
    serviceName: "Economy Service",
    method: "POST",
    endpoint: "/posts",
    name: "Create Post",
    fields: [
      {
        name: "title",
        label: "Title",
        type: "text",
        placeholder: "My Post Title",
        required: true,
      },
      {
        name: "content",
        label: "Content",
        type: "textarea",
        placeholder: "Post content here...",
        required: true,
      },
      {
        name: "authorId",
        label: "Author ID",
        type: "text",
        placeholder: "123",
        required: true,
      },
    ],
  },
  {
    id: "economy-get-post",
    service: "economy",
    serviceName: "Economy Service",
    method: "GET",
    endpoint: "/posts/{id}",
    name: "Get Post by ID",
    fields: [
      {
        name: "id",
        label: "Post ID",
        type: "text",
        placeholder: "123",
        required: true,
      },
    ],
  },
  {
    id: "economy-like-post",
    service: "economy",
    serviceName: "Economy Service",
    method: "POST",
    endpoint: "/posts/{id}/like",
    name: "Like Post",
    fields: [
      {
        name: "id",
        label: "Post ID",
        type: "text",
        placeholder: "123",
        required: true,
      },
    ],
  },
  {
    id: "economy-get-purchases",
    service: "economy",
    serviceName: "Economy Service",
    method: "GET",
    endpoint: "/purchases",
    name: "Get All Purchases",
    fields: [],
  },
  {
    id: "economy-create-purchase",
    service: "economy",
    serviceName: "Economy Service",
    method: "POST",
    endpoint: "/purchases",
    name: "Create Purchase",
    fields: [
      {
        name: "userId",
        label: "User ID",
        type: "text",
        placeholder: "123",
        required: true,
      },
      {
        name: "itemId",
        label: "Item ID",
        type: "text",
        placeholder: "456",
        required: true,
      },
      {
        name: "amount",
        label: "Amount",
        type: "number",
        placeholder: "100",
        required: true,
      },
    ],
  },
  {
    id: "economy-metrics",
    service: "economy",
    serviceName: "Economy Service",
    method: "GET",
    endpoint: "/metrics",
    name: "Get Metrics",
    fields: [],
  },
]

const ApiTester = () => {
  const [authToken, setAuthToken] = useState<string>("")
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({})
  const [customHeaders, setCustomHeaders] = useState("")
  const [response, setResponse] = useState<string>("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setAuthToken(token)
    }
  }, [])

  const selectedTemplate = API_TEMPLATES.find(
    (t) => t.id === selectedTemplateId
  )

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId)
    setFieldValues({})
    setResponse("")
  }

  const handleFieldChange = (fieldName: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [fieldName]: value }))
  }

  const buildEndpoint = () => {
    if (!selectedTemplate) return ""
    let endpoint = selectedTemplate.endpoint
    Object.entries(fieldValues).forEach(([key, value]) => {
      endpoint = endpoint.replace(`{${key}}`, value)
    })
    return endpoint
  }

  const buildBody = () => {
    if (
      !selectedTemplate ||
      selectedTemplate.method === "GET" ||
      selectedTemplate.method === "DELETE"
    )
      return undefined

    const bodyFields: Record<string, string> = {}
    selectedTemplate.fields.forEach((field) => {
      if (!selectedTemplate.endpoint.includes(`{${field.name}}`)) {
        bodyFields[field.name] = fieldValues[field.name] || ""
      }
    })

    return Object.keys(bodyFields).length > 0
      ? JSON.stringify(bodyFields)
      : undefined
  }

  const handleSubmit = async () => {
    if (!selectedTemplate) return

    setLoading(true)
    setResponse("")

    try {
      let parsedHeaders: Record<string, string> = {}
      if (customHeaders.trim()) {
        parsedHeaders = JSON.parse(customHeaders)
      }

      if (authToken.trim()) {
        parsedHeaders["Authorization"] = `Bearer ${authToken.trim()}`
      }

      const endpoint = buildEndpoint()
      const body = buildBody()

      const result = await apiRequest(
        selectedTemplate.service,
        endpoint,
        selectedTemplate.method,
        body,
        parsedHeaders
      )

      setResponse(JSON.stringify(result, null, 2))
    } catch (error) {
      setResponse(JSON.stringify({ error: String(error) }, null, 2))
    } finally {
      setLoading(false)
    }
  }

  const groupedTemplates = API_TEMPLATES.reduce((acc, template) => {
    if (!acc[template.serviceName]) {
      acc[template.serviceName] = []
    }
    acc[template.serviceName].push(template)
    return acc
  }, {} as Record<string, ApiTemplate[]>)

  return (
    <div className='max-w-6xl mx-auto space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>API Tester</h1>
        <p className='text-muted-foreground'>
          Test API endpoints across microservices
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Lock className='h-5 w-5' />
            Authorization Token (Optional)
          </CardTitle>
          <CardDescription>
            This token will be used for all API requests that require
            authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type='text'
            placeholder='Bearer token (auto-filled from login)'
            value={authToken}
            onChange={(e) => setAuthToken(e.target.value)}
          />
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Request</CardTitle>
            <CardDescription>
              Select an endpoint template and fill in the parameters
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='template'>Endpoint Template</Label>
              <Select
                id='template'
                value={selectedTemplateId}
                onChange={(e) => handleTemplateChange(e.target.value)}
              >
                <option value=''>Select an endpoint...</option>
                {Object.entries(groupedTemplates).map(
                  ([serviceName, templates]) => (
                    <optgroup key={serviceName} label={serviceName}>
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.method} - {template.name}
                        </option>
                      ))}
                    </optgroup>
                  )
                )}
              </Select>
            </div>

            {selectedTemplate && (
              <>
                <div className='p-4 bg-muted rounded-md space-y-2'>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs font-semibold px-2 py-1 bg-primary text-primary-foreground rounded'>
                      {selectedTemplate.method}
                    </span>
                    <span className='text-sm font-mono'>
                      {selectedTemplate.endpoint}
                    </span>
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {selectedTemplate.serviceName}
                  </p>
                </div>

                {selectedTemplate.fields.length > 0 && (
                  <div className='space-y-4'>
                    <Label>Parameters</Label>
                    {selectedTemplate.fields.map((field) => (
                      <div key={field.name} className='space-y-2'>
                        <Label htmlFor={field.name}>
                          {field.label}
                          {field.required && (
                            <span className='text-destructive ml-1'>*</span>
                          )}
                        </Label>
                        {field.type === "textarea" ? (
                          <Textarea
                            id={field.name}
                            placeholder={field.placeholder}
                            value={fieldValues[field.name] || ""}
                            onChange={(e) =>
                              handleFieldChange(field.name, e.target.value)
                            }
                            rows={3}
                          />
                        ) : (
                          <Input
                            id={field.name}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={fieldValues[field.name] || ""}
                            onChange={(e) =>
                              handleFieldChange(field.name, e.target.value)
                            }
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className='space-y-2'>
                  <Label htmlFor='headers'>
                    Custom Headers (JSON, optional)
                  </Label>
                  <Textarea
                    id='headers'
                    placeholder='{"Authorization": "Bearer token"}'
                    value={customHeaders}
                    onChange={(e) => setCustomHeaders(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className='w-full'
                >
                  <Send className='h-4 w-4 mr-2' />
                  {loading ? "Sending..." : "Send Request"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
            <CardDescription>API response will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className='bg-muted p-4 rounded-md overflow-auto max-h-[600px] text-sm'>
              {response ||
                "No response yet. Select a template and send a request to see results."}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ApiTester
