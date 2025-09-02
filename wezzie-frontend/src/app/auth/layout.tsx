'use client'

import { motion } from 'framer-motion'

export interface AuthLayoutProps {
  title: string
  subtitle: string
  description?: string
  children: React.ReactNode
}

export default function AuthLayout({ children, title, subtitle, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md sm:max-w-lg"
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 sm:px-8 pt-6 pb-4 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
            <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
            {description && (
              <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto">{description}</p>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, delay: 0.2, ease: 'easeOut' }}
            className="px-6 sm:px-8 pb-6 space-y-6"
          >
            {children}
          </motion.div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}