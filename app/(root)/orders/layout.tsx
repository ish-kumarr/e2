import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default async function OrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = auth()
  const user = await currentUser()

  if (!userId || !user) {
    redirect('/sign-in')
  }

  if (user.emailAddresses[0].emailAddress !== 'ishkumar.dev@gmail.com') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-red-500">Access Denied</h1>
            <p className="text-xl text-gray-300">You do not have permission to view this page.</p>
          </div>
          <div className="bg-gray-900 p-8 rounded-lg shadow-lg space-y-4">
            <p className="text-gray-400">
              This page is restricted to authorized personnel only. If you believe you should have access, please contact the administrator.
            </p>
            <div className="flex flex-col space-y-2">
              <p className="text-sm text-gray-500">Logged in as:</p>
              <p className="text-lg font-semibold text-blue-400">{user.emailAddresses[0].emailAddress}</p>
            </div>
          </div>
          <div className="space-y-4">
            <Button asChild variant="default" className="w-full bg-gray-800 text-white">
              <Link href="/">Return to Home</Link>
            </Button>
            <p className="text-sm text-gray-500">
              If you have any questions, please contact{' '}
              <a href="mailto:support@eventia.com" className="text-blue-400 hover:underline">
                support@eventia.com
              </a>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}