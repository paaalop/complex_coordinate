import { User } from '@supabase/supabase-js'

interface AuthButtonProps {
    signIn: () => void;
    signOut: () => void;
    user: User | null;
    loading: boolean;
}

export function AuthButton({ signIn, signOut, user, loading }: AuthButtonProps) {
  if (loading) {
    return <button disabled className="px-4 py-2 text-sm text-gray-500">Loading...</button>
  }

  if (user) {
    return (
      <button 
        onClick={signOut}
        className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50"
      >
        Sign Out
      </button>
    )
  }

  return (
    <button 
      onClick={signIn}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
    >
      Sign in with Google
    </button>
  )
}
