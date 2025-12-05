import { useState, useEffect } from "react"
import { apiRequest } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { UserPlus, RefreshCw, Trash2 } from "lucide-react"

type User = {
  id: string
  username: string
  email: string
  createdAt?: string
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
  })

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const result = await apiRequest("identity", "/users", "GET")
      if (Array.isArray(result.data)) {
        setUsers(result.data)
      } else if (result.data.users && Array.isArray(result.data.users)) {
        setUsers(result.data.users)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  const createUser = async () => {
    try {
      await apiRequest(
        "identity",
        "/auth/register",
        "POST",
        JSON.stringify(newUser)
      )
      setNewUser({ username: "", email: "", password: "" })
      setShowCreateForm(false)
      fetchUsers()
    } catch (error) {
      console.error("Failed to create user:", error)
    }
  }

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      await apiRequest("identity", `/users/${id}`, "DELETE")
      fetchUsers()
    } catch (error) {
      console.error("Failed to delete user:", error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className='max-w-6xl mx-auto space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>User Management</h1>
          <p className='text-muted-foreground'>
            Manage users from the identity service
          </p>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={fetchUsers} disabled={loading}>
            <RefreshCw className='h-4 w-4 mr-2' />
            Refresh
          </Button>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            <UserPlus className='h-4 w-4 mr-2' />
            Create User
          </Button>
        </div>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New User</CardTitle>
            <CardDescription>Add a new user to the system</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='username'>Username</Label>
                <Input
                  id='username'
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  placeholder='johndoe'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  placeholder='john@example.com'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  placeholder='••••••••'
                />
              </div>
            </div>
            <div className='flex gap-2'>
              <Button onClick={createUser}>Create</Button>
              <Button
                variant='outline'
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>List of all registered users</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='text-center py-8 text-muted-foreground'>
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground'>
              No users found. Try creating one or check the API connection.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className='font-mono text-xs'>
                      {user.id}
                    </TableCell>
                    <TableCell className='font-medium'>
                      {user.username}
                    </TableCell>
                    <TableCell className='text-right'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => deleteUser(user.id)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Users
