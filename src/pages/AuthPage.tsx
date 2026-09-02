import { useNavigate } from 'react-router-dom'

interface Props {
  redirectAfterAuth?: string
}

export default function AuthPage({ redirectAfterAuth = '/' }: Props) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f5f0eb]">
      <div className="clay-card p-8 max-w-md w-full text-center">
        <div className="text-4xl mb-4">🔐</div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-4">AlatauPeaks</h1>
        <p className="text-[#999] mb-6">
          Авторизация пока не реализована. Все данные доступны без входа.
        </p>
        <button
          className="clay-button w-full"
          onClick={() => navigate(redirectAfterAuth)}
        >
          Продолжить
        </button>
      </div>
    </div>
  )
}
