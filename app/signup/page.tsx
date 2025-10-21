"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { register as firebaseRegister } from "@/lib/auth" 

export default function RegisterPage() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      await firebaseRegister(email, password)
      console.log("User registered")
      router.push("/game/level1")
    } catch (err: any) {
      setError(err?.message ?? "Registration failed")
      console.error("Register error", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/10 bubble"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute top-20 left-10 text-6xl opacity-40 float-animation filter brightness-75">🐠</div>
      <div
        className="absolute top-40 right-20 text-4xl opacity-35 float-animation filter brightness-75"
        style={{ animationDelay: "1s" }}
      >
        🐙
      </div>
      <div
        className="absolute bottom-32 left-20 text-5xl opacity-40 float-animation filter brightness-75"
        style={{ animationDelay: "2s" }}
      >
        🦀
      </div>
      <div
        className="absolute bottom-20 right-10 text-3xl opacity-35 float-animation filter brightness-75"
        style={{ animationDelay: "3s" }}
      >
        🐚
      </div>

      <div
        className="absolute top-60 left-32 text-4xl opacity-30 float-animation filter brightness-75"
        style={{ animationDelay: "4s" }}
      >
        🦈
      </div>
      <div
        className="absolute top-80 right-32 text-5xl opacity-35 float-animation filter brightness-75"
        style={{ animationDelay: "5s" }}
      >
        🐢
      </div>
      <div
        className="absolute bottom-60 left-8 text-3xl opacity-40 float-animation filter brightness-75"
        style={{ animationDelay: "6s" }}
      >
        🦞
      </div>
      <div
        className="absolute bottom-80 right-8 text-4xl opacity-30 float-animation filter brightness-75"
        style={{ animationDelay: "7s" }}
      >
        🐋
      </div>
      <div
        className="absolute top-32 right-48 text-5xl opacity-35 float-animation filter brightness-75"
        style={{ animationDelay: "8s" }}
      >
        🦭
      </div>
      <div
        className="absolute bottom-48 left-48 text-3xl opacity-40 float-animation filter brightness-75"
        style={{ animationDelay: "9s" }}
      >
        🐡
      </div>

      <Card className="w-full max-w-md backdrop-blur-sm bg-card/80 border-primary/20 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Syntax Saga
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground text-lg">Create your account and set sail</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="captain@syntaxsaga.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50 border-primary/30 focus:border-primary focus:ring-primary/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50 border-primary/30 focus:border-primary focus:ring-primary/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-background/50 border-primary/30 focus:border-primary focus:ring-primary/20"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold py-3 transition-all duration-300 transform hover:scale-[1.02]"
            >
              {loading ? "Preparing the ship..." : "Join the Crew"}
            </Button>
          </form>

          {error && (
            <div className="text-sm text-destructive mt-2 text-center">
              {error}
            </div>
          )}

          <div className="text-center">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Need help with verification?
            </Link>
          </div>

          <Separator className="bg-border/50" />

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full border-primary/30 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 bg-transparent"
              onClick={() => alert("Social sign up not implemented yet")}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <Button
              variant="outline"
              className="w-full border-primary/30 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 bg-transparent"
              onClick={() => alert("Social sign up not implemented yet")}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.017z" />
              </svg>
              Continue with GitHub
            </Button>
          </div>

          <Separator className="bg-border/50" />

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already sailing with us?{" "}
              <Link href="/login" className="text-primary hover:text-secondary transition-colors font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bottom navigation link */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <Link
          href="/"
          className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2"
        >
          ← Back to shore
        </Link>
      </div>
    </div>
  )
}
