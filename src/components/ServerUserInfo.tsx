import { getServerUser } from '@/lib/supabaseServer'

export default async function ServerUserInfo() {
  const user = await getServerUser()
  
  if (!user) {
    return (
      <div className="text-gray-400 text-sm">
        Not authenticated
      </div>
    )
  }

  return (
    <div className="text-white text-sm">
      <p>Welcome, {user.email}</p>
      <p className="text-gray-400 text-xs">User ID: {user.id}</p>
    </div>
  )
}
