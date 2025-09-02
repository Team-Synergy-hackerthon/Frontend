'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordSchema } from '@/lib/validations/auth'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Eye, EyeOff, Lock, Check } from 'lucide-react'
import Image from 'next/image'

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetPasswordSchema)
  })

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsSuccess(true)
      console.log(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="flex flex-col lg:flex-row max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 flex flex-col justify-center items-center">
          <div className="w-28 h-28 relative mb-8 bg-white rounded-full p-2">
            <Image
              src="/logo.png"
              alt="Wezi Clinic Logo"
              fill
              className="object-contain p-2"
              priority
            />
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-6">Reset Password</h2>
          <p className="text-blue-100 text-center text-lg">
            Please enter your new password. Make sure it's secure and easy to remember.
          </p>
        </div>

        <Card className="lg:w-1/2 w-full border-none">
          <CardContent className="pt-8 px-8 pb-8">
            {isSuccess ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Password Reset Success!</h2>
                <p className="text-gray-600">
                  Your password has been successfully reset.
                </p>
                <Link href="/auth/login">
                  <Button className="mt-4">
                    Back to Login
                  </Button>
                </Link>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-lg"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? 
                        <EyeOff className="h-5 w-5 text-gray-400" /> : 
                        <Eye className="h-5 w-5 text-gray-400" />
                      }
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{`${errors.password.message}`}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('confirmPassword')}
                      type={showPassword ? 'text' : 'password'}
                      className="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-lg"
                      placeholder="Confirm new password"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{`${errors.confirmPassword.message}`}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                      Resetting password...
                    </div>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}