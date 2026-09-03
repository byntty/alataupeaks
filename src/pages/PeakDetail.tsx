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
  Camera,
  Sun,
  TrendingUp,
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
  const [selectedRoute, setSelectedRoute] = useState(0)

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
      <div style={{ minHeight: '100vh', background: '#fdf6e3' }}>
        <Navbar />
        <main className="pt-24 px-4 flex items-center justify-center">
          <div className="retro-card p-8 max-w-md text-center">
            <div className="text-5xl mb-4 retro-float">🏔️</div>
            <h1
              className="text-xl font-bold mb-4"
              style={{ color: '#3d2b1f', fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {t.notFoundTitle}
            </h1>
            <button className="retro-button" onClick={() => navigate('/')}>
              {t.backToCatalog}
            </button>
          </div>
        </main>
      </div>
    )
  }

  const difficultyColors: Record<number, string> = {
    1: '#5a6e3c',
    2: '#d4a520',
    3: '#c44d2c',
    4: '#7b2d8e',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fdf6e3' }}>
      <Navbar />

      <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm no-underline mb-6 transition-colors"
          style={{ color: '#8b7355' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#c44d2c')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#8b7355')}
        >
          <ChevronLeft className="w-4 h-4" />
          {t.backToCatalog}
        </Link>

        {/* Top row: Route + Weather side by side */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Route Block — 65% */}
          <div className="lg:w-[65%]">
            <div className="retro-card-accent p-6 h-full">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1
                    className="text-2xl font-bold mb-1"
                    style={{ color: '#fdf6e3', fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {displayName(peak)}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span
                      className="retro-badge text-xs"
                      style={{ color: '#fdf6e3', borderColor: '#fdf6e3' }}
                    >
                      {peak.elevation} м
                    </span>
                    <span
                      className="retro-badge text-xs"
                      style={{
                        color: '#fdf6e3',
                        borderColor: difficultyColors[peak.difficultyLevel],
                        background: difficultyColors[peak.difficultyLevel],
                      }}
                    >
                      {peak.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Route selector buttons */}
              {peak.routes.length > 1 && (
                <div className="flex gap-2 mb-4 flex-wrap">
                  {peak.routes.map((route, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedRoute(idx)}
                      className="px-4 py-2 text-xs font-bold uppercase transition-all"
                      style={{
                        fontFamily: "'Special Elite', Georgia, serif",
                        letterSpacing: '0.08em',
                        border: selectedRoute === idx ? '2px solid #fdf6e3' : '2px solid rgba(253,246,227,0.3)',
                        borderRadius: '4px',
                        background: selectedRoute === idx ? 'rgba(253,246,227,0.2)' : 'transparent',
                        color: '#fdf6e3',
                        cursor: 'pointer',
                      }}
                    >
                      {route.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Route content */}
              <div className="retro-inset p-5" style={{ background: 'rgba(61,43,31,0.25)', borderColor: 'rgba(253,246,227,0.2)' }}>
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Route schematic SVG */}
                  <div className="sm:w-1/3 flex items-center justify-center">
                    <svg viewBox="0 0 120 200" width={120} height={200}>
                      <defs>
                        <linearGradient id="routeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#fdf6e3" stopOpacity={0.9} />
                          <stop offset="100%" stopColor="#fdf6e3" stopOpacity={0.5} />
                        </linearGradient>
                      </defs>
                      {/* Dashed path */}
                      <path
                        d="M60,20 C30,50 90,80 50,110 C20,130 80,160 60,185"
                        fill="none"
                        stroke="url(#routeGrad)"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeDasharray="8 4"
                      />
                      {/* Start marker */}
                      <circle cx={60} cy={20} r={5} fill="#fdf6e3" stroke="#fdf6e3" strokeWidth={1} />
                      <circle cx={60} cy={20} r={2} fill="#c44d2c" />
                      {/* End marker */}
                      <circle cx={60} cy={185} r={5} fill="#fdf6e3" stroke="#fdf6e3" strokeWidth={1} />
                      <circle cx={60} cy={185} r={2} fill="#c44d2c" />
                      {/* Labels */}
                      <text x={78} y={24} fill="#fdf6e3" fontSize={8} fontFamily="'Special Elite', serif" opacity={0.9}>
                        Старт
                      </text>
                      <text x={78} y={190} fill="#fdf6e3" fontSize={8} fontFamily="'Special Elite', serif" opacity={0.9}>
                        Вершина
                      </text>
                      {/* Decorative dots along path */}
                      <circle cx={45} cy={75} r={1.5} fill="#fdf6e3" opacity={0.4} />
                      <circle cx={55} cy={130} r={1.5} fill="#fdf6e3" opacity={0.4} />
                      <circle cx={65} cy={160} r={1.5} fill="#fdf6e3" opacity={0.4} />
                    </svg>
                  </div>

                  {/* Stats — from selected route */}
                  <div className="sm:w-2/3 space-y-3">
                    <RouteStatRow
                      icon={<Compass className="w-4 h-4" />}
                      label={t.distance}
                      value={peak.routes[selectedRoute]?.distance || peak.routeStats.distance}
                    />
                    <RouteStatRow
                      icon={<Route className="w-4 h-4" />}
                      label={t.difficulty}
                      value={peak.routes[selectedRoute]?.difficulty || peak.difficulty}
                    />
                    <RouteStatRow
                      icon={<ArrowUpRight className="w-4 h-4" />}
                      label={t.elevationGain}
                      value={peak.routes[selectedRoute]?.elevationGain || peak.routeStats.elevationGain}
                    />
                    <RouteStatRow
                      icon={<Clock className="w-4 h-4" />}
                      label={t.duration}
                      value={peak.routes[selectedRoute]?.duration || peak.routeStats.duration}
                    />
                    {peak.routes[selectedRoute]?.terrain && (
                      <RouteStatRow
                        icon={<TrendingUp className="w-4 h-4" />}
                        label={t.terrain}
                        value={peak.routes[selectedRoute].terrain}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Guru Maps link */}
              {peak.routes[selectedRoute] && (
                <button
                  onClick={() => {
                    const route = peak.routes[selectedRoute]
                    if (route.guruMapsFile) {
                      window.location.href = `gurumaps://open?url=${encodeURIComponent(window.location.origin + route.guruMapsFile)}`
                    } else if (route.guruMapsUrl) {
                      window.open(route.guruMapsUrl, '_blank')
                    }
                  }}
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 text-sm font-bold"
                  style={{
                    background: 'rgba(253,246,227,0.15)',
                    border: '2px solid rgba(253,246,227,0.4)',
                    borderRadius: '4px',
                    color: '#fdf6e3',
                    fontFamily: "'Special Elite', Georgia, serif",
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(253,246,227,0.25)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(253,246,227,0.15)')}
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

        {/* Photo Gallery */}
        <PhotoGalleryBlock peak={peak} t={t} />

        {/* Safety Block */}
        <SafetyBlock peak={peak} t={t} />
      </main>
    </div>
  )
}

/* ─── Best Hiking Day ─── */
function getBestHikingDay(): { day: string; icon: string; reason: string } {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  const icons = ['☀️', '⛅', '🌤️']
  const reasons = [
    'Минимум осадков, слабый ветер',
    'Ясная погода, комфортная температура',
    'Лучшие условия для восхождения',
  ]
  const bestIdx = new Date().getDay()
  return {
    day: days[bestIdx],
    icon: icons[bestIdx % 3],
    reason: reasons[bestIdx % 3],
  }
}

/* ─── RouteStatRow ─── */
function RouteStatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 flex items-center justify-center"
        style={{
          background: 'rgba(253,246,227,0.12)',
          border: '1px solid rgba(253,246,227,0.2)',
          borderRadius: '3px',
          color: 'rgba(253,246,227,0.7)',
        }}
      >
        {icon}
      </div>
      <div>
        <div className="text-xs" style={{ color: 'rgba(253,246,227,0.55)', fontFamily: "'Special Elite', serif", textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {label}
        </div>
        <div className="font-bold text-sm" style={{ color: '#fdf6e3' }}>
          {value}
        </div>
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

  const hourlyItems = liveForecast?.list
    ? liveForecast.list.slice(0, 8).map((item: any) => ({
        hour: new Date(item.dt * 1000).toLocaleTimeString(
          lang === 'ru' ? 'ru-RU' : lang === 'kz' ? 'kk-KZ' : 'en-US',
          { hour: '2-digit', minute: '2-digit' }
        ),
        temp: Math.round(item.main.temp),
        icon: weatherIconFromCode(item.weather?.[0]?.icon || '01d'),
        humidity: item.main.humidity,
        wind: Math.round(item.wind.speed),
      }))
    : peak.hourlyForecast

  return (
    <div className="retro-card p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 flex items-center justify-center"
          style={{
            background: '#c44d2c',
            border: '2px solid #3d2b1f',
            borderRadius: '4px',
            boxShadow: '2px 2px 0px #3d2b1f',
          }}
        >
          <Cloud className="w-5 h-5" style={{ color: '#fdf6e3' }} />
        </div>
        <div>
          <h2
            className="text-lg font-bold"
            style={{ color: '#3d2b1f', fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {t.weatherTitle}
          </h2>
          <p className="text-xs" style={{ color: '#8b7355', fontFamily: "'Special Elite', serif" }}>
            {liveWeather
              ? lang === 'ru'
                ? 'Данные OpenWeatherMap'
                : lang === 'kz'
                ? 'OpenWeatherMap деректері'
                : 'OpenWeatherMap data'
              : t.weatherSubtitle}
          </p>
        </div>
      </div>

      {/* Best hiking day */}
      {!loading && (
        <div className="mb-4 p-3 flex items-center gap-3" style={{ background: '#5a6e3c', border: '2px solid #3d2b1f', borderRadius: '4px', boxShadow: '2px 2px 0px #3d2b1f' }}>
          <Sun className="w-5 h-5 shrink-0" style={{ color: '#fdf6e3' }} />
          <div>
            <div className="text-xs font-bold uppercase" style={{ color: 'rgba(253,246,227,0.8)', fontFamily: "'Special Elite', serif", letterSpacing: '0.1em' }}>
              {t.bestHikingDay}
            </div>
            <div className="text-sm font-bold" style={{ color: '#fdf6e3', fontFamily: "'Playfair Display', Georgia, serif" }}>
              {getBestHikingDay().icon} {getBestHikingDay().day} — {getBestHikingDay().reason}
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="retro-inset p-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin mr-2" style={{ color: '#c44d2c' }} />
          <span className="text-sm" style={{ color: '#8b7355', fontFamily: "'Special Elite', serif" }}>
            {lang === 'ru' ? 'Загрузка...' : lang === 'kz' ? 'Жүктелуде...' : 'Loading...'}
          </span>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="retro-inset p-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" style={{ color: '#d4a520' }} />
          <span className="text-xs" style={{ color: '#8b7355' }}>{error}</span>
        </div>
      )}

      {/* Main temp display */}
      {!loading && (
        <div className="retro-inset p-4 mb-4">
          <div className="flex items-center justify-between">
            <button
              className="w-8 h-8 flex items-center justify-center transition-colors"
              style={{ border: '2px solid #8b7355', borderRadius: '3px', background: 'transparent', cursor: 'pointer' }}
              onClick={() => setDateOffset((d) => d - 1)}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#eddcbc')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <ChevronLeft className="w-4 h-4" style={{ color: '#8b7355' }} />
            </button>

            <div className="text-center">
              <div className="text-4xl mb-1">{w.icon}</div>
              <div
                className="text-3xl font-bold"
                style={{ color: '#3d2b1f', fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {w.temp}°C
              </div>
              <div className="text-xs mt-1" style={{ color: '#8b7355', fontFamily: "'Special Elite', serif" }}>
                {w.description}
              </div>
              <div className="text-xs mt-0.5" style={{ color: '#a09078', fontFamily: "'Special Elite', serif" }}>
                {getDisplayDate()}
              </div>
            </div>

            <button
              className="w-8 h-8 flex items-center justify-center transition-colors"
              style={{ border: '2px solid #8b7355', borderRadius: '3px', background: 'transparent', cursor: 'pointer' }}
              onClick={() => setDateOffset((d) => d + 1)}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#eddcbc')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <ChevronRight className="w-4 h-4" style={{ color: '#8b7355' }} />
            </button>
          </div>
        </div>
      )}

      {/* 2x2 data grid */}
      {!loading && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <WeatherMiniBlock
            icon={<Thermometer className="w-4 h-4" style={{ color: '#c44d2c' }} />}
            label={t.temperature}
            value={`${w.tempMax}° / ${w.tempMin}°`}
          />
          <WeatherMiniBlock
            icon={<Droplets className="w-4 h-4" style={{ color: '#4a7ab5' }} />}
            label={t.humidity}
            value={`${w.humidity}%`}
          />
          <WeatherMiniBlock
            icon={<Wind className="w-4 h-4" style={{ color: '#8b7355' }} />}
            label={`${t.wind} ${w.windDirection}`}
            value={`${w.windSpeed} км/ч`}
          />
          <WeatherMiniBlock
            icon={<Heart className="w-4 h-4" style={{ color: '#c44d2c' }} />}
            label={t.feelsLike}
            value={`${w.feelsLike}°C`}
          />
        </div>
      )}

      {/* Hourly forecast toggle */}
      {!loading && (
        <button
          className="w-full py-2 text-center text-sm font-bold transition-colors"
          style={{
            color: '#c44d2c',
            fontFamily: "'Special Elite', Georgia, serif",
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            border: '2px solid #c44d2c',
            borderRadius: '4px',
            background: 'transparent',
            cursor: 'pointer',
          }}
          onClick={() => setShowHourly(!showHourly)}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#c44d2c'
            e.currentTarget.style.color = '#fdf6e3'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#c44d2c'
          }}
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
                  className="flex items-center justify-between py-1.5 px-3 text-xs"
                  style={{
                    background: i % 2 === 0 ? '#eddcbc' : 'transparent',
                    borderRadius: '2px',
                  }}
                >
                  <span className="w-14" style={{ color: '#8b7355', fontFamily: "'Special Elite', monospace" }}>
                    {item.hour}
                  </span>
                  <span className="text-base">{item.icon}</span>
                  <span className="font-bold w-10 text-right" style={{ color: '#3d2b1f' }}>
                    {item.temp}°
                  </span>
                  <span className="w-10 text-right" style={{ color: '#8b7355' }}>
                    {item.humidity}%
                  </span>
                  <span className="w-10 text-right" style={{ color: '#8b7355' }}>
                    {item.wind}
                  </span>
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
    <div className="retro-inset p-3">
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-xs" style={{ color: '#8b7355', fontFamily: "'Special Elite', serif" }}>
          {label}
        </span>
      </div>
      <div className="text-sm font-bold" style={{ color: '#3d2b1f' }}>
        {value}
      </div>
    </div>
  )
}


/* ─── PhotoGalleryBlock ─── */
function PhotoGalleryBlock({ peak, t }: { peak: Peak; t: any }) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)

  return (
    <div className="retro-card p-6 mb-6">
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-10 h-10 flex items-center justify-center"
          style={{
            background: '#c44d2c',
            border: '2px solid #3d2b1f',
            borderRadius: '4px',
            boxShadow: '2px 2px 0px #3d2b1f',
          }}
        >
          <Camera className="w-5 h-5" style={{ color: '#fdf6e3' }} />
        </div>
        <h2
          className="text-lg font-bold"
          style={{ color: '#3d2b1f', fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {t.photosTitle}
        </h2>
      </div>

      <div className="retro-divider mb-5">✦</div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {peak.photos.map((photo, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedPhoto(selectedPhoto === idx ? null : idx)}
            className="overflow-hidden transition-all"
            style={{
              border: selectedPhoto === idx ? '3px solid #c44d2c' : '3px solid #8b7355',
              borderRadius: '4px',
              boxShadow: selectedPhoto === idx ? '3px 3px 0px #c44d2c' : '2px 2px 0px #3d2b1f',
              background: '#f5e6c8',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <div
              style={{
                width: '100%',
                paddingBottom: '65%',
                backgroundImage: `url(${photo})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </button>
        ))}
      </div>

      {/* Lightbox overlay */}
      {selectedPhoto !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(45,27,0,0.85)' }}
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[80vh] w-full mx-4">
            <img
              src={peak.photos[selectedPhoto]}
              alt={peak.name}
              className="w-full h-full object-contain"
              style={{ border: '4px solid #f5e6c8', borderRadius: '4px', boxShadow: '4px 4px 0px #3d2b1f' }}
            />
            <button
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center"
              style={{ background: '#c44d2c', border: '2px solid #3d2b1f', borderRadius: '4px', color: '#fdf6e3', cursor: 'pointer' }}
              onClick={(e) => { e.stopPropagation(); setSelectedPhoto(null) }}
            >
              ✕
            </button>
            {/* Nav arrows */}
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center"
              style={{ background: '#c44d2c', border: '2px solid #3d2b1f', borderRadius: '4px', color: '#fdf6e3', cursor: 'pointer' }}
              onClick={(e) => { e.stopPropagation(); setSelectedPhoto((selectedPhoto - 1 + peak.photos.length) % peak.photos.length) }}
            >
              ‹
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center"
              style={{ background: '#c44d2c', border: '2px solid #3d2b1f', borderRadius: '4px', color: '#fdf6e3', cursor: 'pointer' }}
              onClick={(e) => { e.stopPropagation(); setSelectedPhoto((selectedPhoto + 1) % peak.photos.length) }}
            >
              ›
            </button>
          </div>
        </div>
      )}
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
    <div className="retro-card p-6 mb-6">
      {/* Decorative stripe accent */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-10 h-10 flex items-center justify-center"
          style={{
            background: '#c44d2c',
            border: '2px solid #3d2b1f',
            borderRadius: '4px',
            boxShadow: '2px 2px 0px #3d2b1f',
          }}
        >
          <Backpack className="w-5 h-5" style={{ color: '#fdf6e3' }} />
        </div>
        <h2
          className="text-lg font-bold"
          style={{ color: '#3d2b1f', fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {t.equipmentTitle}
        </h2>
      </div>

      <div className="retro-divider mb-5">✦</div>

      <div className="space-y-6">
        {peak.equipment.map((cat, catIdx) => (
          <div key={catIdx}>
            <h3
              className="text-xs font-bold uppercase tracking-wider mb-3"
              style={{
                color: '#c44d2c',
                fontFamily: "'Special Elite', Georgia, serif",
                letterSpacing: '0.12em',
                borderBottom: '2px solid #c44d2c',
                paddingBottom: '4px',
                display: 'inline-block',
              }}
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
                    className="w-full flex items-center gap-3 p-3 text-left transition-all"
                    style={{
                      background: isChecked ? '#eddcbc' : '#f5e6c8',
                      border: `2px solid ${isChecked ? '#8b7355' : '#c4b49a'}`,
                      borderRadius: '4px',
                      boxShadow: isChecked ? 'inset 1px 1px 3px rgba(61,43,31,0.15)' : '2px 2px 0px rgba(61,43,31,0.08)',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      className="retro-checkbox"
                      style={isChecked ? { background: '#c44d2c', borderColor: '#3d2b1f' } : {}}
                    >
                      {isChecked && (
                        <CheckCircle2 className="w-3 h-3" style={{ color: '#fdf6e3' }} />
                      )}
                    </div>
                    <div className="flex-1">
                      <span
                        className="text-sm font-medium"
                        style={{
                          color: isChecked ? '#8b7355' : '#3d2b1f',
                          textDecoration: isChecked ? 'line-through' : 'none',
                        }}
                      >
                        {item.name}
                      </span>
                      {item.note && (
                        <span className="text-xs ml-2" style={{ color: '#8b7355' }}>
                          ({item.note})
                        </span>
                      )}
                    </div>
                    {item.essential && (
                      <span
                        className="retro-badge text-xs"
                        style={{ color: '#c44d2c', borderColor: '#c44d2c' }}
                      >
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
    <div className="retro-card p-6 mb-6">
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-10 h-10 flex items-center justify-center"
          style={{
            background: '#c44d2c',
            border: '2px solid #3d2b1f',
            borderRadius: '4px',
            boxShadow: '2px 2px 0px #3d2b1f',
          }}
        >
          <Shield className="w-5 h-5" style={{ color: '#fdf6e3' }} />
        </div>
        <h2
          className="text-lg font-bold"
          style={{ color: '#3d2b1f', fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {t.safetyTitle}
        </h2>
      </div>

      <div className="retro-divider mb-5">✦</div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Rules */}
        <div>
          <h3
            className="text-xs font-bold uppercase tracking-wider mb-3"
            style={{
              color: '#c44d2c',
              fontFamily: "'Special Elite', Georgia, serif",
              letterSpacing: '0.12em',
              borderBottom: '2px solid #c44d2c',
              paddingBottom: '4px',
              display: 'inline-block',
            }}
          >
            {t.rules}
          </h3>
          <div className="space-y-2">
            {peak.safety.rules.map((rule, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-sm p-2"
                style={{
                  background: i % 2 === 0 ? '#eddcbc' : 'transparent',
                  borderRadius: '3px',
                }}
              >
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#d4a520' }} />
                <span style={{ color: '#3d2b1f' }}>{rule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency contacts */}
        <div>
          <h3
            className="text-xs font-bold uppercase tracking-wider mb-3"
            style={{
              color: '#c44d2c',
              fontFamily: "'Special Elite', Georgia, serif",
              letterSpacing: '0.12em',
              borderBottom: '2px solid #c44d2c',
              paddingBottom: '4px',
              display: 'inline-block',
            }}
          >
            {t.emergencyContacts}
          </h3>
          <div className="space-y-2">
            {peak.safety.emergencyContacts.map((contact, i) => (
              <a
                key={i}
                href={`tel:${contact.number}`}
                className="flex items-center gap-2 text-sm no-underline transition-colors p-2"
                style={{
                  border: '2px solid #c4b49a',
                  borderRadius: '4px',
                  background: '#f5e6c8',
                  color: '#3d2b1f',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#c44d2c'
                  e.currentTarget.style.color = '#c44d2c'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#c4b49a'
                  e.currentTarget.style.color = '#3d2b1f'
                }}
              >
                <Phone className="w-4 h-4 shrink-0" style={{ color: '#c44d2c' }} />
                <div>
                  <div className="font-bold">{contact.label}</div>
                  <div className="text-xs" style={{ color: '#8b7355' }}>{contact.number}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div>
          <h3
            className="text-xs font-bold uppercase tracking-wider mb-3"
            style={{
              color: '#c44d2c',
              fontFamily: "'Special Elite', Georgia, serif",
              letterSpacing: '0.12em',
              borderBottom: '2px solid #c44d2c',
              paddingBottom: '4px',
              display: 'inline-block',
            }}
          >
            {t.tips}
          </h3>
          <div className="space-y-2">
            {peak.safety.tips.map((tip, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-sm p-2"
                style={{
                  background: i % 2 === 0 ? '#eddcbc' : 'transparent',
                  borderRadius: '3px',
                }}
              >
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#5a6e3c' }} />
                <span style={{ color: '#3d2b1f' }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
