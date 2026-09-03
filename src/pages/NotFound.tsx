import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../lib/language'

export default function NotFound() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <div style={{ minHeight: '100vh', background: '#fdf6e3' }} className="flex items-center justify-center">
      <div className="retro-card p-8 max-w-md text-center">
        <div className="text-6xl mb-4 retro-float">🏔️</div>
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: '#3d2b1f', fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {t.notFoundTitle}
        </h1>
        <p className="mb-6" style={{ color: '#8b7355', fontFamily: "'Special Elite', Georgia, serif" }}>
          Эта страница не найдена. Возможно, путь неверный.
        </p>
        <button
          className="retro-button"
          onClick={() => navigate('/')}
        >
          {t.notFoundBack}
        </button>
      </div>
    </div>
  )
}
