import { AppTopBar } from './_components/AppTopBar'
import '@/styles/app-shell.css'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <AppTopBar />
      {children}
    </div>
  )
}
