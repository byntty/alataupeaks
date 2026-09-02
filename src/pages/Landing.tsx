import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Mountain, Info } from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { useLanguage } from '../lib/language'
import { peaksData, type Peak } from '../data/peaksData'

const categoryColors: Record<number, { color: string; bg: string; label: string }> = {
  1: { color: '#4ade80', bg: '#4ade8020', label: 'categoryEasy' },
  2: { color: '#fb923c', bg: '#fb923c20', label: 'categoryMedium' },
  3: { color: '#ef4444', bg: '#ef444420', label: 'categoryHard' },
  4: { color: '#a855f7', bg: '#a855f720', label: 'categoryExtreme' },
}

export default function Landing() {
  const { t, lang } = useLanguage()
  const navigate = useNavigate()
  const [filterLevel, setFilterLevel] = useState<number | null>(null)
  const [hoveredPeak, setHoveredPeak] = useState<string | null>(null)

  function displayName(peak: Peak): string {
    if (lang === 'en') return peak.nameEn
    if (lang === 'kk') return peak.nameKz
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
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />

      {/* Map Section */}
      <main className="pt-24 pb-8 px-4 max-w-7xl mx-auto">
        <div className="clay-card overflow-hidden relative" style={{ minHeight: 500 }}>
          <svg
            viewBox="0 0 1000 600"
            className="w-full h-full clay-map-area"
            style={{ minHeight: 500 }}
          >
            {/* Background */}
            <rect width="1000" height="600" fill="#f5f0eb" />

            {/* Grid lines */}
            {Array.from({ length: 20 }).map((_, i) => (
              <line
                key={`vgrid-${i}`}
                x1={i * 50}
                y1={0}
                x2={i * 50}
                y2={600}
                stroke="#ddd"
                strokeWidth={0.5}
                strokeDasharray="4 8"
              />
            ))}
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={`hgrid-${i}`}
                x1={0}
                y1={i * 50}
                x2={1000}
                y2={600}
                stroke="#ddd"
                strokeWidth={0.5}
                strokeDasharray="4 8"
              />
            ))}

            {/* Mountain silhouettes — back range */}
            <path
              d="M0,400 L100,320 L200,350 L350,250 L450,300 L550,220 L650,280 L750,200 L850,260 L950,180 L1000,300 L1000,600 L0,600 Z"
              fill="#d4cfc8"
              opacity={0.4}
            />

            {/* Mountain silhouettes — front range */}
            <path
              d="M0,450 L80,380 L180,420 L300,340 L420,390 L520,310 L640,370 L740,290 L860,350 L960,270 L1000,380 L1000,600 L0,600 Z"
              fill="#c8c0b5"
              opacity={0.5}
            />

            {/* Contour lines */}
            <path
              d="M100,500 Q300,400 500,450 T900,380"
              fill="none"
              stroke="#bbb"
              strokeWidth={1}
              opacity={0.4}
            />
            <path
              d="M50,480 Q250,380 450,430 T850,360"
              fill="none"
              stroke="#bbb"
              strokeWidth={0.8}
              opacity={0.3}
            />
            <path
              d="M150,460 Q350,360 550,410 T950,340"
              fill="none"
              stroke="#bbb"
              strokeWidth={0.6}
              opacity={0.3}
            />

            {/* Peak markers */}
            {peaksData.map((peak) => {
              const isVisible = filterLevel === null || peak.difficultyLevel === filterLevel
              const top = parseFloat(peak.mapPosition.top) / 100 * 600
              const left = parseFloat(peak.mapPosition.left) / 100 * 1000
              const isHovered = hoveredPeak === peak.id

              return (
                <g
                  key={peak.id}
                  style={{
                    cursor: 'pointer',
                    opacity: isVisible ? 1 : 0.15,
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
                    r={isHovered ? 20 : 14}
                    fill="none"
                    stroke="#e07030"
                    strokeWidth={2}
                    opacity={isHovered ? 0.6 : 0.3}
                    style={{ transition: 'all 0.2s ease' }}
                  >
                    <animate
                      attributeName="r"
                      values="14;22;14"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.3;0.1;0.3"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Main marker */}
                  <circle
                    cx={left}
                    cy={top}
                    r={isHovered ? 10 : 7}
                    fill="url(#orangeGrad)"
                    style={{ transition: 'r 0.2s ease' }}
                  />

                  {/* Tooltip on hover */}
                  {isHovered && (
                    <>
                      <rect
                        x={left - 90}
                        y={top - 60}
                        width={180}
                        height={44}
                        rx={12}
                        fill="#faf6f1"
                        stroke="#e07030"
                        strokeWidth={1.5}
                        filter="url(#tooltipShadow)"
                      />
                      <text
                        x={left}
                        y={top - 42}
                        textAnchor="middle"
                        fill="#1a1a1a"
                        fontSize={12}
                        fontWeight={700}
                      >
                        {displayName(peak)}
                      </text>
                      <text
                        x={left}
                        y={top - 26}
                        textAnchor="middle"
                        fill="#999"
                        fontSize={10}
                      >
                        {peak.elevation}м · {peak.difficulty}
                      </text>
                    </>
                  )}
                </g>
              )
            })}

            {/* Gradient definition */}
            <defs>
              <radialGradient id="orangeGrad">
                <stop offset="0%" stopColor="#ff8c42" />
                <stop offset="100%" stopColor="#e07030" />
              </radialGradient>
              <filter id="tooltipShadow">
                <feDropShadow dx={2} dy={2} stdDeviation={4} floodOpacity={0.12} />
              </filter>
            </defs>
          </svg>

          {/* Map label badge */}
          <div className="absolute top-4 left-4 clay-badge text-xs text-[#999]">
            <MapPin className="w-3 h-3 mr-1" />
            {t.mapTitle}
          </div>

          {/* Click hint badge */}
          <div className="absolute bottom-4 right-4 clay-badge text-xs text-[#999]">
            <Info className="w-3 h-3 mr-1" />
            {t.mapHint}
          </div>
        </div>

        {/* Category filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {([1, 2, 3, 4] as const).map((level) => {
            const cat = categoryColors[level]
            const isActive = filterLevel === level
            return (
              <motion.button
                key={level}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggleFilter(level)}
                className="clay-card p-4 text-left transition-all"
                style={{
                  border: isActive ? `3px solid ${cat.color}` : '3px solid transparent',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: cat.color }}
                  />
                  <span className="font-bold text-sm text-[#1a1a1a]">
                    {t[cat.label as keyof typeof t]}
                  </span>
                </div>
                <span className="text-xs text-[#999]">
                  {t.routesCount(routesCountByLevel(level))}
                </span>
              </motion.button>
            )
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 px-4" style={{ background: '#1a1a1a' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #e07030, #ff8c42)' }}
            >
              <Mountain className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold">
              Alatau<span className="text-[#ff8c42]">Peaks</span>
            </span>
          </div>
          <p className="text-[#888] text-sm text-center">
            {t.footerText}
          </p>
          <p className="text-[#666] text-xs">
            © {new Date().getFullYear()} AlatauPeaks
          </p>
        </div>
      </footer>
    </div>
  )
}
