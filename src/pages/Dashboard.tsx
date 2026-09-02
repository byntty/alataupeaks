import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/Navbar'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />
      <main className="pt-24 px-4 max-w-4xl mx-auto">
        <div className="clay-card p-8 text-center">
          <div className="text-4xl mb-4">📊</div>
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">Dashboard</h1>
          <p className="text-[#999] mb-6">
            Панель управления скоро будет доступна.
          </p>
          <button
            className="clay-button"
            onClick={() => navigate('/')}
          >
            На главную
          </button>
        </div>
      </main>
    </div>
  )
}
