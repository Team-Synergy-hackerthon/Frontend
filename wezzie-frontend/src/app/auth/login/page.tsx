'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/lib/validations/auth'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Eye, EyeOff, LogIn, UserPlus, Key, Mail } from 'lucide-react'
import Image from 'next/image'

const baseURL = "https://wezzie-api.onrender.com/api/v1";

interface LoginTypes {
  email: string
  password: string
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginTypes) => {
    const payload = {
      email_or_phone: data.email,
      password: data.password,
      remember_me: true
    }
    console.log(payload)    
    setIsLoading(true)
    try {
      const response = await fetch(`${baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
            body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const result = await response.json()
      console.log(result)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Banner */}
        <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-8 flex flex-col justify-center items-center">
          <div className="w-20 h-20 relative mb-6 bg-white rounded-full p-2">
            <Image
              src="/logo.png"
              alt="Wezi Clinic Logo"
              fill
              className="object-contain animate-pulse p-2"
              priority
            />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4">Wezi Clinic</h2>
          <p className="text-blue-100 text-center text-sm max-w-xs leading-relaxed">
            Your trusted healthcare partner. Experience personalized care and seamless service.
          </p>
          <div className="mt-6 space-y-3 text-blue-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-200 rounded-full"></span>
              <p>24/7 Online Consultation</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-200 rounded-full"></span>
              <p>Secure Patient Portal</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-200 rounded-full"></span>
              <p>Expert Healthcare Professionals</p>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <Card className="lg:w-1/2 w-full max-w-md border-none">
          <CardContent className="pt-8 px-6 sm:px-8 pb-8">
            <div className="flex flex-col items-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 hover:scale-105"
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Sign up
                </Link>
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    {...register('email')}
                    type="email"
                    className="pl-10 pr-3 py-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 animate-in slide-in-from-top-2">{`${errors.email.message}`}</p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="pl-10 pr-10 py-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-200 hover:text-blue-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 animate-in slide-in-from-top-2">{`${errors.password.message}`}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 hover:scale-105"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign in
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}