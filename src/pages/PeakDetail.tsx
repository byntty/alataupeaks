import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Cloud,
  ChevronLeft,
  ChevronRight,
  Compass,
  Route,
  Clock,
  ArrowUpRight,
  Thermometer,
  Droplets,
  Wind,
  Heart,
  Backpack,
  Shield,
  AlertTriangle,
  Phone,
  CheckCircle2,
  MapPin,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { useLanguage } from '../lib/language'
import { getPeakById, type Peak } from '../data/peaksData'

const OPENWEATHER_API_KEY = ''

const coordsMap: Record<string, { lat: number; lon: number }> = {
  khreshchatyj: { lat: 43.095, lon: 77.065 },
  sovietov: { lat: 43.07, lon: 77.08 },
  turist: { lat: 43.08, lon: 77.05 },
  belukha: { lat: 43.05, lon: 77.1 },
  tuyuksu: { lat: 43.06, lon: 77.07 },
  manas: { lat: 43.04, lon: 77.12 },
}

function weatherIconFromCode(code: string): string {
  if (code.startsWith('01')) return '☀️'
  if (code.startsWith('02')) return '⛅'
  if (code.startsWith('03')) return '☁️'
  if (code.startsWith('04')) return '☁️'
  if (code.startsWith('09')) return '🌧️'
  if (code.startsWith('10')) return '🌦️'
  if (code.startsWith('11')) return '⛈️'
  if (code.startsWith('13')) return '❄️'
  if (code.startsWith('50')) return '🌫️'
  return '🌤️'
}

async function fetchWeather(lat: number, lon: number) {
  if (!OPENWEATHER_API_KEY) return null
  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}&lang=ru`
      ),
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}&lang=ru`
      ),
    ])
    if (!currentRes.ok) return null
    const current = await currentRes.json()
    const forecast = forecastRes.ok ? await forecastRes.json() : null
    return { current, forecast }
  } catch {
    return null
  }
}

export default function PeakDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t, lang } = useLanguage()
  const peak = id ? getPeakById(id) : undefined

  const [dateOffset, setDateOffset] = useState(0)
  const [showHourly, setShowHourly] = useState(false)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [liveWeather, setLiveWeather] = useState<any>(null)
  const [liveForecast, setLiveForecast] = useState<any>(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherError, setWeatherError] = useState<string | null>(null)

  useEffect(() => {
    if (!peak) return
    const coords = coordsMap[peak.id]
    if (!coords) return

    let cancelled = false
    setWeatherLoading(true)
    setWeatherError(null)

    fetchWeather(coords.lat, coords.lon).then((data) => {
      if (cancelled) return
      if (data) {
        setLiveWeather(data.current)
        setLiveForecast(data.forecast)
      } else if (OPENWEATHER_API_KEY) {
        setWeatherError('Не удалось загрузить данные о погоде')
      }
      setWeatherLoading(false)
    })

    return () => { cancelled = true }
  }, [peak])

  function displayName(p: Peak): string {
    if (lang === 'en') return p.nameEn
    if (lang === 'kz') return p.nameKz
    return p.name
  }

  function toggleItem(key: string) {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function getDisplayDate(): string {
    const d = new Date()
    d.setDate(d.getDate() + dateOffset)
    return d.toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'kz' ? 'kk-KZ' : 'en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
  }

  if (!peak) {
    return (
      <div className="min-h-screen bg-[#f5f0eb]">
        <Navbar />
        <main className="pt-24 px-4 flex items-center justify-center">
          <div className="clay-card p-8 max-w-md text-center">
            <div className="text-4xl mb-4">🏔️</div>
            <h1 className="text-xl font-bold text-[#1a1a1a] mb-4">
              {t.notFoundTitle}
            </h1>
            <button className="clay-button" onClick={() => navigate('/')}>
              {t.backToCatalog}
            </button>
          </div>
        </main>
      </div>
    )
  }

  const difficultyColors: Record<number, string> = {
    1: '#4ade80',
    2: '#fb923c',
    3: '#ef4444',
    4: '#a855f7',
  }

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />

      <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-[#999] hover:text-[#e07030] transition-colors mb-6 no-underline"
        >
          <ChevronLeft className="w-4 h-4" />
          {t.backToCatalog}
        </Link>

        {/* Top row: Route + Weather side by side */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Route Block — 65% */}
          <div className="lg:w-[65%]">
            <div className="clay-card-orange p-6 h-full">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">
                    {displayName(peak)}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span className="clay-badge text-xs text-white/80">
                      {peak.elevation} м
                    </span>
                    <span
                      className="clay-badge text-xs"
                      style={{
                        background: difficultyColors[peak.difficultyLevel],
                        color: '#fff',
                      }}
                    >
                      {peak.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Route content */}
              <div className="clay-inset p-5 rounded-2xl bg-white/20">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Route schematic SVG */}
                  <div className="sm:w-1/3 flex items-center justify-center">
                    <svg viewBox="0 0 120 200" width={120} height={200}>
                      <defs>
                        <linearGradient id="routeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#fff" stopOpacity={0.9} />
                          <stop offset="100%" stopColor="#fff" stopOpacity={0.5} />
                        </linearGradient>
                      </defs>
                      <path
                        d="M60,20 C30,50 90,80 50,110 C20,130 80,160 60,185"
                        fill="none"
                        stroke="url(#routeGrad)"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeDasharray="6 4"
                      />
                      <circle cx={60} cy={20} r={5} fill="#fff" />
                      <circle cx={60} cy={185} r={5} fill="#fff" />
                      <text x={75} y={25} fill="#fff" fontSize={9} opacity={0.8}>
                        Старт
                      </text>
                      <text x={75} y={190} fill="#fff" fontSize={9} opacity={0.8}>
                        Вершина
                      </text>
                    </svg>
                  </div>

                  {/* Stats */}
                  <div className="sm:w-2/3 space-y-3">
                    <RouteStatRow
                      icon={<Compass className="w-4 h-4" />}
                      label={t.distance}
                      value={peak.routeStats.distance}
                    />
                    <RouteStatRow
                      icon={<Route className="w-4 h-4" />}
                      label={t.difficulty}
                      value={peak.difficulty}
                    />
                    <RouteStatRow
                      icon={<ArrowUpRight className="w-4 h-4" />}
                      label={t.elevationGain}
                      value={peak.routeStats.elevationGain}
                    />
                    <RouteStatRow
                      icon={<Clock className="w-4 h-4" />}
                      label={t.duration}
                      value={peak.routeStats.duration}
                    />
                  </div>
                </div>
              </div>

              {/* Guru Maps link */}
              {peak.routes[0] && (
                <button
                  onClick={() => {
                    const route = peak.routes[0]
                    if (route.guruMapsFile) {
                      // Try to open .guru file via custom URL scheme
                      window.location.href = `gurumaps://open?url=${encodeURIComponent(window.location.origin + route.guruMapsFile)}`
                    } else if (route.guruMapsUrl) {
                      window.open(route.guruMapsUrl, '_blank')
                    }
                  }}
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-white/20 text-white text-sm font-medium hover:bg-white/30 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  {t.guruMaps}
                </button>
              )}
            </div>
          </div>

          {/* Weather Block — 35% */}
          <div className="lg:w-[35%]">
            <WeatherBlock
              peak={peak}
              t={t}
              lang={lang}
              dateOffset={dateOffset}
              setDateOffset={setDateOffset}
              showHourly={showHourly}
              setShowHourly={setShowHourly}
              getDisplayDate={getDisplayDate}
              liveWeather={liveWeather}
              liveForecast={liveForecast}
              loading={weatherLoading}
              error={weatherError}
            />
          </div>
        </div>

        {/* Equipment Block */}
        <EquipmentBlock
          peak={peak}
          t={t}
          checkedItems={checkedItems}
          toggleItem={toggleItem}
        />

        {/* Safety Block */}
        <SafetyBlock peak={peak} t={t} />
      </main>
    </div>
  )
}

/* ─── RouteStatRow ─── */
function RouteStatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 text-white/70">
        {icon}
      </div>
      <div>
        <div className="text-white/60 text-xs">{label}</div>
        <div className="text-white font-semibold text-sm">{value}</div>
      </div>
    </div>
  )
}

/* ─── WeatherBlock ─── */
function WeatherBlock({
  peak,
  t,
  lang,
  dateOffset,
  setDateOffset,
  showHourly,
  setShowHourly,
  getDisplayDate,
  liveWeather,
  liveForecast,
  loading,
  error,
}: {
  peak: Peak
  t: any
  lang: string
  dateOffset: number
  setDateOffset: React.Dispatch<React.SetStateAction<number>>
  showHourly: boolean
  setShowHourly: React.Dispatch<React.SetStateAction<boolean>>
  getDisplayDate: () => string
  liveWeather: any
  liveForecast: any
  loading: boolean
  error: string | null
}) {
  // Use live API data if available, otherwise fall back to mock
  const w = liveWeather
    ? {
        icon: weatherIconFromCode(liveWeather.weather?.[0]?.icon || '01d'),
        temp: Math.round(liveWeather.main?.temp ?? peak.weather.temp),
        feelsLike: Math.round(liveWeather.main?.feels_like ?? peak.weather.feelsLike),
        humidity: liveWeather.main?.humidity ?? peak.weather.humidity,
        windSpeed: Math.round(liveWeather.wind?.speed ?? peak.weather.windSpeed),
        windDirection: peak.weather.windDirection,
        tempMax: Math.round(liveWeather.main?.temp_max ?? peak.weather.tempMax),
        tempMin: Math.round(liveWeather.main?.temp_min ?? peak.weather.tempMin),
        description: liveWeather.weather?.[0]?.description ?? peak.weather.description,
      }
    : peak.weather

  // Build hourly data from live forecast or mock
  const hourlyItems = liveForecast?.list
    ? liveForecast.list.slice(0, 8).map((item: any) => ({
        hour: new Date(item.dt * 1000).toLocaleTimeString(lang === 'ru' ? 'ru-RU' : lang === 'kz' ? 'kk-KZ' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
        temp: Math.round(item.main.temp),
        icon: weatherIconFromCode(item.weather?.[0]?.icon || '01d'),
        humidity: item.main.humidity,
        wind: Math.round(item.wind.speed),
      }))
    : peak.hourlyForecast

  return (
    <div className="clay-card p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #e07030, #ff8c42)' }}
        >
          <Cloud className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#1a1a1a]">{t.weatherTitle}</h2>
          <p className="text-xs text-[#999]">
            {liveWeather ? (lang === 'ru' ? 'Данные OpenWeatherMap' : lang === 'kz' ? 'OpenWeatherMap деректері' : 'OpenWeatherMap data') : t.weatherSubtitle}
          </p>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="clay-inset p-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-[#e07030] animate-spin mr-2" />
          <span className="text-sm text-[#999]">{lang === 'ru' ? 'Загрузка...' : lang === 'kz' ? 'Жүктелуде...' : 'Loading...'}</span>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="clay-inset p-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#fb923c] shrink-0" />
          <span className="text-xs text-[#999]">{error}</span>
        </div>
      )}

      {/* Main temp display */}
      {!loading && (
        <div className="clay-inset p-4 mb-4">
          <div className="flex items-center justify-between">
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/50 transition-colors"
              onClick={() => setDateOffset((d) => d - 1)}
            >
              <ChevronLeft className="w-4 h-4 text-[#999]" />
            </button>

            <div className="text-center">
              <div className="text-4xl mb-1">{w.icon}</div>
              <div className="text-3xl font-bold text-[#1a1a1a]">{w.temp}°C</div>
              <div className="text-xs text-[#999] mt-1">{w.description}</div>
              <div className="text-xs text-[#888] mt-0.5">{getDisplayDate()}</div>
            </div>

            <button
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/50 transition-colors"
              onClick={() => setDateOffset((d) => d + 1)}
            >
              <ChevronRight className="w-4 h-4 text-[#999]" />
            </button>
          </div>
        </div>
      )}

      {/* 2x2 data grid */}
      {!loading && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <WeatherMiniBlock
            icon={<Thermometer className="w-4 h-4 text-[#e07030]" />}
            label={t.temperature}
            value={`${w.tempMax}° / ${w.tempMin}°`}
          />
          <WeatherMiniBlock
            icon={<Droplets className="w-4 h-4 text-[#60a5fa]" />}
            label={t.humidity}
            value={`${w.humidity}%`}
          />
          <WeatherMiniBlock
            icon={<Wind className="w-4 h-4 text-[#94a3b8]" />}
            label={`${t.wind} ${w.windDirection}`}
            value={`${w.windSpeed} км/ч`}
          />
          <WeatherMiniBlock
            icon={<Heart className="w-4 h-4 text-[#f87171]" />}
            label={t.feelsLike}
            value={`${w.feelsLike}°C`}
          />
        </div>
      )}

      {/* Hourly forecast toggle */}
      {!loading && (
        <button
          className="w-full py-2 text-center text-sm text-[#e07030] font-medium hover:bg-[#f0ebe5] rounded-xl transition-colors"
          onClick={() => setShowHourly(!showHourly)}
        >
          {showHourly ? t.hideDetails : t.showDetails}
        </button>
      )}

      <AnimatePresence>
        {showHourly && !loading && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-1">
              {hourlyItems.map((item: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1.5 px-3 rounded-lg text-xs"
                  style={{ background: i % 2 === 0 ? '#f5f0eb' : 'transparent' }}
                >
                  <span className="text-[#999] w-14">{item.hour}</span>
                  <span className="text-base">{item.icon}</span>
                  <span className="font-semibold text-[#1a1a1a] w-10 text-right">{item.temp}°</span>
                  <span className="text-[#999] w-10 text-right">{item.humidity}%</span>
                  <span className="text-[#999] w-10 text-right">{item.wind}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function WeatherMiniBlock({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="clay-inset p-3 rounded-xl">
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-xs text-[#999]">{label}</span>
      </div>
      <div className="text-sm font-semibold text-[#1a1a1a]">{value}</div>
    </div>
  )
}

/* ─── EquipmentBlock ─── */
function EquipmentBlock({
  peak,
  t,
  checkedItems,
  toggleItem,
}: {
  peak: Peak
  t: any
  checkedItems: Record<string, boolean>
  toggleItem: (key: string) => void
}) {
  return (
    <div className="clay-card p-6 mb-6">
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #e07030, #ff8c42)' }}
        >
          <Backpack className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg font-bold text-[#1a1a1a]">{t.equipmentTitle}</h2>
      </div>

      <div className="space-y-6">
        {peak.equipment.map((cat, catIdx) => (
          <div key={catIdx}>
            <h3
              className="text-xs font-bold uppercase tracking-wider mb-3"
              style={{ color: '#e07030' }}
            >
              {cat.category}
            </h3>
            <div className="space-y-2">
              {cat.items.map((item, itemIdx) => {
                const itemKey = `${catIdx}-${itemIdx}`
                const isChecked = checkedItems[itemKey] || false
                return (
                  <button
                    key={itemIdx}
                    onClick={() => toggleItem(itemKey)}
                    className="w-full flex items-center gap-3 p-3 clay-inset rounded-xl text-left transition-all hover:shadow-md"
                  >
                    <div
                      className={`clay-checkbox ${isChecked ? 'checked' : ''}`}
                    >
                      {isChecked && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <span
                        className={`text-sm font-medium ${
                          isChecked ? 'text-[#999] line-through' : 'text-[#1a1a1a]'
                        }`}
                      >
                        {item.name}
                      </span>
                      {item.note && (
                        <span className="text-xs text-[#999] ml-2">
                          ({item.note})
                        </span>
                      )}
                    </div>
                    {item.essential && (
                      <span className="clay-badge text-xs" style={{ color: '#e07030' }}>
                        {t.essential}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── SafetyBlock ─── */
function SafetyBlock({ peak, t }: { peak: Peak; t: any }) {
  return (
    <div className="clay-card p-6 mb-6">
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #e07030, #ff8c42)' }}
        >
          <Shield className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg font-bold text-[#1a1a1a]">{t.safetyTitle}</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Rules */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#e07030' }}>
            {t.rules}
          </h3>
          <div className="space-y-2">
            {peak.safety.rules.map((rule, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-[#1a1a1a]">
                <AlertTriangle className="w-4 h-4 text-[#fb923c] mt-0.5 shrink-0" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency contacts */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#e07030' }}>
            {t.emergencyContacts}
          </h3>
          <div className="space-y-2">
            {peak.safety.emergencyContacts.map((contact, i) => (
              <a
                key={i}
                href={`tel:${contact.number}`}
                className="flex items-center gap-2 text-sm text-[#1a1a1a] no-underline hover:text-[#e07030] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#e07030] shrink-0" />
                <div>
                  <div className="font-medium">{contact.label}</div>
                  <div className="text-xs text-[#999]">{contact.number}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#e07030' }}>
            {t.tips}
          </h3>
          <div className="space-y-2">
            {peak.safety.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-[#1a1a1a]">
                <CheckCircle2 className="w-4 h-4 text-[#4ade80] mt-0.5 shrink-0" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
