import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../lib/language'

export default function NotFound() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-[#f5f0eb] flex items-center justify-center">
      <div className="clay-card p-8 max-w-md text-center">
        <div className="text-6xl mb-4 clay-float">🏔️</div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">
          {t.notFoundTitle}
        </h1>
        <p className="text-[#999] mb-6">
          Эта страница не найдена. Возможно, путь неверный.
        </p>
        <button
          className="clay-button"
          onClick={() => navigate('/')}
        >
          {t.notFoundBack}
        </button>
      </div>
    </div>
  )
}
