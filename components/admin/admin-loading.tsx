import { Loader2 } from "lucide-react"

export function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#161616] flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-[#FF5001] mx-auto" />
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-[#E9E7E2]">Loading Admin Panel</h2>
          <p className="text-[#E9E7E2]/60">Please wait while we prepare your dashboard...</p>
        </div>
      </div>
    </div>
  )
}