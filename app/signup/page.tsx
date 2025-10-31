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
      router.push("/levels")
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

          {/* Social sign-up removed */}

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
