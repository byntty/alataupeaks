import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Mountain, Info, Compass, Phone } from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { useLanguage } from '../lib/language'
import { peaksData, type Peak } from '../data/peaksData'

const categoryColors: Record<number, { color: string; bg: string; label: string }> = {
  1: { color: '#5a6e3c', bg: '#5a6e3c20', label: 'categoryEasy' },
  2: { color: '#d4a520', bg: '#d4a52020', label: 'categoryMedium' },
  3: { color: '#c44d2c', bg: '#c44d2c20', label: 'categoryHard' },
  4: { color: '#7b2d8e', bg: '#7b2d8e20', label: 'categoryExtreme' },
}

export default function Landing() {
  const { t, lang } = useLanguage()
  const navigate = useNavigate()
  const [filterLevel, setFilterLevel] = useState<number | null>(null)
  const [hoveredPeak, setHoveredPeak] = useState<string | null>(null)

  function displayName(peak: Peak): string {
    if (lang === 'en') return peak.nameEn
    if (lang === 'kz') return peak.nameKz
    return peak.name
  }

  function toggleFilter(level: number) {
    setFilterLevel(filterLevel === level ? null : level)
  }

  const filteredPeaks = filterLevel
    ? peaksData.filter((p) => p.difficultyLevel === filterLevel)
    : peaksData

  const routesCountByLevel = (level: number) =>
    peaksData.filter((p) => p.difficultyLevel === level).length

  return (
    <div style={{ minHeight: '100vh', background: '#fdf6e3' }}>
      <Navbar />

      {/* Map Section */}
      <main className="pt-24 pb-8 px-4 max-w-7xl mx-auto">
        {/* Vintage title banner */}
        <div className="text-center mb-4">
          <div className="retro-divider">
            <span>✦ {t.mapTitle} ✦</span>
          </div>
        </div>

        <div className="retro-card overflow-hidden relative" style={{ minHeight: 520 }}>
          {/* Noise overlay */}
          <div className="retro-noise absolute inset-0 pointer-events-none" />

          <svg
            viewBox="0 0 1000 600"
            className="w-full h-full retro-map-area"
            style={{ minHeight: 520 }}
          >
            {/* Parchment background */}
            <rect width="1000" height="600" fill="#f0e1c4" />

            {/* Vintage grid — like old map coordinates */}
            {Array.from({ length: 21 }).map((_, i) => (
              <line
                key={`vgrid-${i}`}
                x1={i * 50}
                y1={0}
                x2={i * 50}
                y2={600}
                stroke="#c4b49a"
                strokeWidth={0.4}
                strokeDasharray="2 6"
              />
            ))}
            {Array.from({ length: 13 }).map((_, i) => (
              <line
                key={`hgrid-${i}`}
                x1={0}
                y1={i * 50}
                x2={1000}
                y2={600}
                stroke="#c4b49a"
                strokeWidth={0.4}
                strokeDasharray="2 6"
              />
            ))}

            {/* Coordinate labels */}
            {Array.from({ length: 21 }).map((_, i) => (
              <text
                key={`vlabel-${i}`}
                x={i * 50}
                y={595}
                textAnchor="middle"
                fill="#b0a080"
                fontSize={6}
                fontFamily="'Special Elite', monospace"
              >
                {i > 0 ? `${77}.${String(i).padStart(2, '0')}` : ''}
              </text>
            ))}
            {Array.from({ length: 13 }).map((_, i) => (
              <text
                key={`hlabel-${i}`}
                x={5}
                y={i * 50 + 4}
                fill="#b0a080"
                fontSize={6}
                fontFamily="'Special Elite', monospace"
              >
                {i > 0 ? `${43}.${String(i).padStart(2, '0')}` : ''}
              </text>
            ))}

            {/* Topographic contour lines — thick contour style */}
            <path
              d="M0,420 Q120,350 250,380 T500,330 T750,360 T1000,300"
              fill="none"
              stroke="#a89474"
              strokeWidth={1.5}
              opacity={0.5}
            />
            <path
              d="M0,400 Q100,330 230,360 T480,310 T730,340 T1000,280"
              fill="none"
              stroke="#a89474"
              strokeWidth={1.2}
              opacity={0.4}
            />
            <path
              d="M0,380 Q80,310 210,340 T460,290 T710,320 T1000,260"
              fill="none"
              stroke="#a89474"
              strokeWidth={1}
              opacity={0.35}
            />
            <path
              d="M0,360 Q60,290 190,320 T440,270 T690,300 T1000,240"
              fill="none"
              stroke="#c4b49a"
              strokeWidth={0.8}
              opacity={0.3}
            />
            <path
              d="M0,340 Q40,270 170,300 T420,250 T670,280 T1000,220"
              fill="none"
              stroke="#c4b49a"
              strokeWidth={0.6}
              opacity={0.25}
            />

            {/* Mountain range silhouettes — vintage brown tones */}
            <path
              d="M0,440 L60,380 L130,400 L200,350 L300,380 L380,320 L480,360 L560,290 L660,340 L740,270 L840,310 L920,250 L1000,330 L1000,600 L0,600 Z"
              fill="#b8a88e"
              opacity={0.35}
            />
            <path
              d="M0,470 L70,410 L160,430 L250,380 L350,410 L450,350 L540,390 L640,330 L720,370 L820,300 L900,340 L1000,280 L1000,600 L0,600 Z"
              fill="#a09078"
              opacity={0.4}
            />
            {/* Closest range — darker */}
            <path
              d="M0,500 L80,450 L170,470 L280,420 L380,450 L480,400 L580,430 L680,380 L780,410 L880,360 L1000,400 L1000,600 L0,600 Z"
              fill="#8b7355"
              opacity={0.3}
            />

            {/* Peak markers */}
            {peaksData.map((peak) => {
              const isVisible = filterLevel === null || peak.difficultyLevel === filterLevel
              const top = (parseFloat(peak.mapPosition.top) / 100) * 600
              const left = (parseFloat(peak.mapPosition.left) / 100) * 1000
              const isHovered = hoveredPeak === peak.id

              const markerColors: Record<number, string> = {
                1: '#5a6e3c',
                2: '#d4a520',
                3: '#c44d2c',
                4: '#7b2d8e',
              }
              const mColor = markerColors[peak.difficultyLevel]

              return (
                <g
                  key={peak.id}
                  style={{
                    cursor: 'pointer',
                    opacity: isVisible ? 1 : 0.12,
                    transition: 'opacity 0.3s ease',
                  }}
                  onClick={() => navigate(`/peak/${peak.id}`)}
                  onMouseEnter={() => setHoveredPeak(peak.id)}
                  onMouseLeave={() => setHoveredPeak(null)}
                >
                  {/* Pulse ring */}
                  <circle
                    cx={left}
                    cy={top}
                    r={isHovered ? 22 : 16}
                    fill="none"
                    stroke={mColor}
                    strokeWidth={2}
                    opacity={isHovered ? 0.5 : 0.25}
                    strokeDasharray="4 3"
                    style={{ transition: 'all 0.2s ease' }}
                  >
                    <animate
                      attributeName="r"
                      values="16;24;16"
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.25;0.08;0.25"
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Main marker — retro stamp style */}
                  <circle
                    cx={left}
                    cy={top}
                    r={isHovered ? 10 : 7}
                    fill={mColor}
                    stroke="#3d2b1f"
                    strokeWidth={2.5}
                    style={{ transition: 'r 0.2s ease' }}
                  />

                  {/* Inner dot */}
                  <circle
                    cx={left}
                    cy={top}
                    r={isHovered ? 4 : 2.5}
                    fill="#fdf6e3"
                  />

                  {/* Tooltip on hover */}
                  {isHovered && (
                    <>
                      <rect
                        x={left - 95}
                        y={top - 65}
                        width={190}
                        height={50}
                        rx={4}
                        fill="#f5e6c8"
                        stroke="#3d2b1f"
                        strokeWidth={2}
                      />
                      {/* Corner accents */}
                      <line
                        x1={left - 93}
                        y1={top - 63}
                        x2={left - 83}
                        y2={top - 63}
                        stroke={mColor}
                        strokeWidth={2}
                      />
                      <line
                        x1={left - 93}
                        y1={top - 63}
                        x2={left - 93}
                        y2={top - 53}
                        stroke={mColor}
                        strokeWidth={2}
                      />
                      <line
                        x1={left + 93}
                        y1={top - 15}
                        x2={left + 83}
                        y2={top - 15}
                        stroke={mColor}
                        strokeWidth={2}
                      />
                      <line
                        x1={left + 93}
                        y1={top - 15}
                        x2={left + 93}
                        y2={top - 25}
                        stroke={mColor}
                        strokeWidth={2}
                      />
                      <text
                        x={left}
                        y={top - 43}
                        textAnchor="middle"
                        fill="#3d2b1f"
                        fontSize={12}
                        fontWeight={700}
                        fontFamily="'Playfair Display', Georgia, serif"
                      >
                        {displayName(peak)}
                      </text>
                      <text
                        x={left}
                        y={top - 26}
                        textAnchor="middle"
                        fill="#8b7355"
                        fontSize={9}
                        fontFamily="'Special Elite', monospace"
                      >
                        {peak.elevation}м · {peak.difficulty}
                      </text>
                    </>
                  )}
                </g>
              )
            })}

            {/* Compass rose decoration */}
            <g transform="translate(920, 80)" opacity={0.25}>
              <circle cx={0} cy={0} r={30} fill="none" stroke="#3d2b1f" strokeWidth={1.5} />
              <circle cx={0} cy={0} r={22} fill="none" stroke="#3d2b1f" strokeWidth={0.8} />
              {/* N */}
              <line x1={0} y1={-28} x2={0} y2={-18} stroke="#3d2b1f" strokeWidth={2} />
              <text x={0} y={-32} textAnchor="middle" fill="#3d2b1f" fontSize={10} fontWeight={700} fontFamily="'Special Elite', serif">N</text>
              {/* S */}
              <line x1={0} y1={28} x2={0} y2={18} stroke="#3d2b1f" strokeWidth={1} />
              <text x={0} y={40} textAnchor="middle" fill="#3d2b1f" fontSize={8} fontFamily="'Special Elite', serif">S</text>
              {/* E */}
              <line x1={28} y1={0} x2={18} y2={0} stroke="#3d2b1f" strokeWidth={1} />
              <text x={38} y={4} textAnchor="middle" fill="#3d2b1f" fontSize={8} fontFamily="'Special Elite', serif">E</text>
              {/* W */}
              <line x1={-28} y1={0} x2={-18} y2={0} stroke="#3d2b1f" strokeWidth={1} />
              <text x={-38} y={4} textAnchor="middle" fill="#3d2b1f" fontSize={8} fontFamily="'Special Elite', serif">W</text>
              {/* Diagonal lines */}
              <line x1={-20} y1={-20} x2={-14} y2={-14} stroke="#3d2b1f" strokeWidth={0.6} />
              <line x1={20} y1={-20} x2={14} y2={-14} stroke="#3d2b1f" strokeWidth={0.6} />
              <line x1={-20} y1={20} x2={-14} y2={14} stroke="#3d2b1f" strokeWidth={0.6} />
              <line x1={20} y1={20} x2={14} y2={14} stroke="#3d2b1f" strokeWidth={0.6} />
              {/* Center star */}
              <text x={0} y={5} textAnchor="middle" fill="#c44d2c" fontSize={14}>✦</text>
            </g>

            {/* Scale bar */}
            <g transform="translate(30, 570)">
              <line x1={0} y1={0} x2={100} y2={0} stroke="#3d2b1f" strokeWidth={1.5} />
              <line x1={0} y1={-4} x2={0} y2={4} stroke="#3d2b1f" strokeWidth={1.5} />
              <line x1={50} y1={-3} x2={50} y2={3} stroke="#3d2b1f" strokeWidth={1} />
              <line x1={100} y1={-4} x2={100} y2={4} stroke="#3d2b1f" strokeWidth={1.5} />
              <text x={0} y={14} textAnchor="middle" fill="#3d2b1f" fontSize={7} fontFamily="'Special Elite', serif">0</text>
              <text x={50} y={14} textAnchor="middle" fill="#3d2b1f" fontSize={7} fontFamily="'Special Elite', serif">5</text>
              <text x={100} y={14} textAnchor="middle" fill="#3d2b1f" fontSize={7} fontFamily="'Special Elite', serif">10 km</text>
            </g>

            {/* Title cartouche */}
            <g transform="translate(30, 40)">
              <rect x={-5} y={-5} width={260} height={42} rx={3} fill="#f5e6c8" stroke="#3d2b1f" strokeWidth={2} />
              <text x={0} y={8} fill="#8b7355" fontSize={7} fontFamily="'Special Elite', monospace" letterSpacing="0.15em">ZAĬLĬYSKY ALATAU</text>
              <text x={0} y={24} fill="#3d2b1f" fontSize={14} fontWeight={700} fontFamily="'Playfair Display', Georgia, serif">Заилийский Алатау</text>
              <text x={250} y={24} fill="#c44d2c" fontSize={11}>✦</text>
            </g>
          </svg>

          {/* Map hint badge */}
          <div
            className="absolute bottom-4 right-4 retro-badge text-xs flex items-center gap-1"
            style={{ color: '#8b7355', borderColor: '#8b7355' }}
          >
            <Compass className="w-3 h-3" />
            {t.mapHint}
          </div>
        </div>

        {/* Category filters — vintage button style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {([1, 2, 3, 4] as const).map((level) => {
            const cat = categoryColors[level]
            const isActive = filterLevel === level
            return (
              <motion.button
                key={level}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggleFilter(level)}
                className="p-4 text-left transition-all"
                style={{
                  background: isActive ? cat.bg : '#f5e6c8',
                  border: `3px solid ${isActive ? cat.color : '#8b7355'}`,
                  borderRadius: '6px',
                  boxShadow: isActive ? `3px 3px 0px ${cat.color}` : '3px 3px 0px #3d2b1f',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-3 h-3"
                    style={{
                      background: cat.color,
                      border: '1.5px solid #3d2b1f',
                      borderRadius: '2px',
                    }}
                  />
                  <span
                    className="font-bold text-sm"
                    style={{
                      color: '#3d2b1f',
                      fontFamily: "'Special Elite', Georgia, serif",
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {t[cat.label as keyof typeof t] as string}
                  </span>
                </div>
                <span className="text-xs" style={{ color: '#8b7355' }}>
                  {t.routesCount(routesCountByLevel(level))}
                </span>
              </motion.button>
            )
          })}
        </div>
      </main>

      {/* Footer — dark vintage band */}
      <footer
        className="mt-12 py-8 px-4"
        style={{ background: '#2d1b00', borderTop: '4px solid #c44d2c' }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Top row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 flex items-center justify-center"
                style={{
                  background: '#c44d2c',
                  border: '2px solid #fdf6e3',
                  borderRadius: '4px',
                }}
              >
                <Mountain className="w-4 h-4" style={{ color: '#fdf6e3' }} />
              </div>
              <span
                style={{
                  color: '#fdf6e3',
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 700,
                }}
              >
                Alatau<span style={{ color: '#c44d2c' }}>Peaks</span>
              </span>
            </div>
            <p
              className="text-sm text-center"
              style={{ color: '#a09078', fontFamily: "'Special Elite', Georgia, serif" }}
            >
              {t.footerText}
            </p>
            <p className="text-xs" style={{ color: '#6b5a3e' }}>
              © {new Date().getFullYear()} AlatauPeaks
            </p>
          </div>

          {/* Divider */}
          <div className="retro-divider mb-6" style={{ color: '#6b5a3e' }}>✦</div>

          {/* Contact row */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            {/* WhatsApp Nis Climbers */}
            <a
              href="https://chat.whatsapp.com/NisClimbers"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 no-underline transition-colors"
              style={{ color: '#5a6e3c' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#7ab955')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#5a6e3c')}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span style={{ fontFamily: "'Special Elite', Georgia, serif", fontWeight: 700, fontSize: '0.9rem' }}>
                Nis Climbers
              </span>
            </a>

            {/* Phone contact */}
            <a
              href="tel:+77054102502"
              className="flex items-center gap-2 no-underline transition-colors"
              style={{ color: '#fdf6e3' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#c44d2c')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#fdf6e3')}
            >
              <Phone className="w-4 h-4" />
              <span style={{ fontFamily: "'Special Elite', Georgia, serif", fontWeight: 700, fontSize: '0.9rem' }}>
                +7 705 410 2502
              </span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
