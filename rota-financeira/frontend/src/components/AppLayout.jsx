import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-base-bg md:pl-60">
      <main className="mx-auto max-w-3xl px-4 pb-28 pt-6 md:px-8 md:pt-10">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
