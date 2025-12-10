import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRightIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuthStore } from "@/stores/authStore"
import { useNavigate } from "react-router-dom"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const { loginUser, loading, token, role, error: authError } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.")
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }

    try {
      await loginUser(email, password)
    } catch (err) {
      setError("Invalid credentials, please try again.")
    }
  }

  useEffect(() => {
    if (token && role !== null) {
      if (role === "Director" || role === "1") {
        navigate("/director/dashboard")
      } else if (role === "Secretary" || role === "0") {
        navigate("/receptionist/teachers")
      }
    }
  }, [token, role, navigate])

  return (
    <form
  onSubmit={handleSubmit}
  className="shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto rounded-3xl gap-3 py-5 px-6 sm:px-10 flex flex-col"
>
  <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-center">Sign In</h1>

  <div className="flex flex-col mb-3">
    <label className="text-sm text-gray-600 mb-1">Email</label>
    <Input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="example@email.com"
    />
  </div>

  <div className="flex flex-col mb-4">
    <label className="text-sm text-gray-600 mb-1">Password</label>
    <Input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Enter your password"
    />
  </div>

  {(error || authError) && (
  <div className="text-sm text-red-600 text-center mb-2">
    {error || authError}
  </div>
)}


  <div className="flex flex-col items-center gap-4 mt-2">
    <Button
      type="submit"
      size="lg"
      variant="default"
      className="rounded-full w-full sm:w-auto px-10"
      iconPosition="right"
      icon={<ArrowRightIcon />}
      disabled={loading}
    >
      {loading ? "Logging in..." : "Login"}
    </Button>
  </div>
</form>
  )
}
