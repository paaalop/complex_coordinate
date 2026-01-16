import { User } from '@supabase/supabase-js'

interface UserProfileProps {
  user: User | null;
}

export function UserProfile({ user }: UserProfileProps) {
  if (!user) return null;

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg">
      {user.user_metadata?.avatar_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img 
          src={user.user_metadata.avatar_url} 
          alt={user.user_metadata.full_name || 'User'} 
          className="w-8 h-8 rounded-full"
        />
      )}
      <div className="text-sm font-medium text-gray-700">
        {user.user_metadata?.full_name || user.email}
      </div>
    </div>
  )
}
