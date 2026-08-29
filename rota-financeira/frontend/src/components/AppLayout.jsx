import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function AppLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-base-bg">
      <div className="pointer-events-none absolute -right-32 -top-24 h-80 w-80 rounded-full bg-brand-700/20 blur-[100px]" />
      <div className="pointer-events-none absolute -left-24 top-96 h-72 w-72 rounded-full bg-brand-500/10 blur-[100px]" />

      <main className="relative mx-auto max-w-lg px-4 pb-28 pt-6 md:pt-10">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
