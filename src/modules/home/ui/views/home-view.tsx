"use client";

import { authClient } from "@/lib/auth-client"; 


export const HomeView = () => {
  const { data } = authClient.useSession();


  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight">Welcome back, {data?.user.name} !</h2>
        <p className="text-muted-foreground">Here`&apos;`s what`&apos;`s happening with your AI meetings today.</p>
      </div>

    
    
    </div>
  )
}
