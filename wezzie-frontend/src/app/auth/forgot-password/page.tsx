'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema } from '@/lib/validations/auth'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading'
import { Modal } from '@/components/ui/modal'
import AuthLayout from '../layout'
import Link from 'next/link'
import { Mail, ArrowLeft, Check } from 'lucide-react'

interface AuthLayoutProps {
  title: string
  subtitle: string
  description: string
  children: React.ReactNode
}

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema)
  })

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setShowSuccessModal(true)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <AuthLayout
        title="Password Recovery"
        subtitle="Reset your password"
        //description="Don't worry! It happens. Please enter the email address associated with your account."
      >
        <Card className="h-full border-none">
          <CardContent className="h-full pt-8 px-8 pb-8">
            <Link 
              href="/auth/login" 
              className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to login
            </Link>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register('email')}
                    type="email"
                    className="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 animate-in slide-in-from-top-2">
                    {`${errors.email.message}`}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 transition-all duration-200 transform hover:translate-y-[-2px]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner className="border-white mr-2" />
                    Sending...
                  </div>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </AuthLayout>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Check your email
          </h3>
          <p className="text-gray-600 mb-6">
            We've sent a password reset link to your email address.
          </p>
          <Button
            onClick={() => setShowSuccessModal(false)}
            className="w-full"
          >
            Got it
          </Button>
        </div>
      </Modal>
    </>
  )
}