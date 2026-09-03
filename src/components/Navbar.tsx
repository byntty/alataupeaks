import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Menu, X, Mountain } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage, type Lang } from '../lib/language'
import { searchPeaks, type Peak } from '../data/peaksData'

export function Navbar() {
  const { lang, setLang, t } = useLanguage()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Peak[]>([])
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSearch(value: string) {
    setSearchQuery(value)
    if (value.trim()) {
      const results = searchPeaks(value)
      setSearchResults(results)
      setShowSearchDropdown(true)
    } else {
      setSearchResults([])
      setShowSearchDropdown(false)
    }
  }

  function handlePeakClick(id: string) {
    navigate(`/peak/${id}`)
    setSearchQuery('')
    setShowSearchDropdown(false)
    setMobileMenuOpen(false)
  }

  function displayName(peak: Peak): string {
    if (lang === 'en') return peak.nameEn
    if (lang === 'kz') return peak.nameKz
    return peak.name
  }

  const difficultyColors: Record<number, string> = {
    1: '#5a6e3c',
    2: '#d4a520',
    3: '#c44d2c',
    4: '#7b2d8e',
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-2">
      <div
        className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4"
        style={{
          background: '#f5e6c8',
          border: '3px solid #3d2b1f',
          borderRadius: '6px',
          boxShadow: '4px 4px 0px #3d2b1f',
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0 no-underline">
          <div
            className="w-10 h-10 flex items-center justify-center"
            style={{
              background: '#c44d2c',
              border: '2px solid #3d2b1f',
              borderRadius: '4px',
              boxShadow: '2px 2px 0px #3d2b1f',
            }}
          >
            <Mountain className="w-5 h-5" style={{ color: '#fdf6e3' }} />
          </div>
          <span
            className="text-lg font-bold hidden sm:block"
            style={{
              color: '#3d2b1f',
              fontFamily: "'Playfair Display', Georgia, serif",
            }}
          >
            Alatau<span style={{ color: '#c44d2c' }}>Peaks</span>
          </span>
        </Link>

        {/* Search */}
        <div ref={searchRef} className="flex-1 relative max-w-md">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: '#8b7355' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="retro-input w-full pl-10 pr-4 text-sm"
            />
          </div>

          <AnimatePresence>
            {showSearchDropdown && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-2 p-2 z-50"
                style={{
                  background: '#f5e6c8',
                  border: '3px solid #3d2b1f',
                  borderRadius: '6px',
                  boxShadow: '4px 4px 0px #3d2b1f',
                }}
              >
                {searchResults.map((peak) => (
                  <button
                    key={peak.id}
                    onClick={() => handlePeakClick(peak.id)}
                    className="w-full flex items-center justify-between p-3 rounded text-left hover:bg-[#eddcbc] transition-colors"
                    style={{ borderBottom: '1px dashed #8b7355' }}
                  >
                    <div>
                      <div
                        className="font-bold text-sm"
                        style={{ color: '#3d2b1f' }}
                      >
                        {displayName(peak)}
                      </div>
                      <div className="text-xs" style={{ color: '#8b7355' }}>
                        {peak.elevation} м
                      </div>
                    </div>
                    <span
                      className="retro-badge text-xs"
                      style={{ color: difficultyColors[peak.difficultyLevel], borderColor: difficultyColors[peak.difficultyLevel] }}
                    >
                      {peak.difficulty}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Language switcher — desktop */}
        <div className="hidden md:flex items-center gap-1">
          {(['ru', 'en', 'kz'] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className="px-3 py-1.5 text-xs font-bold uppercase transition-all"
              style={{
                fontFamily: "'Special Elite', Georgia, serif",
                letterSpacing: '0.1em',
                border: lang === l ? '2px solid #3d2b1f' : '2px solid #8b7355',
                borderRadius: '3px',
                background: lang === l ? '#c44d2c' : 'transparent',
                color: lang === l ? '#fdf6e3' : '#8b7355',
                boxShadow: lang === l ? '2px 2px 0px #3d2b1f' : 'none',
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded transition-colors"
          style={{
            border: '2px solid #8b7355',
            background: 'transparent',
          }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" style={{ color: '#3d2b1f' }} />
          ) : (
            <Menu className="w-5 h-5" style={{ color: '#3d2b1f' }} />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="max-w-7xl mx-auto mt-2 p-4 md:hidden"
            style={{
              background: '#f5e6c8',
              border: '3px solid #3d2b1f',
              borderRadius: '6px',
              boxShadow: '4px 4px 0px #3d2b1f',
            }}
          >
            {/* Mobile search */}
            <div className="relative mb-4">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: '#8b7355' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="retro-input w-full pl-10 pr-4 text-sm"
              />
            </div>

            {/* Mobile language switcher */}
            <div className="flex items-center gap-2">
              {(['ru', 'en', 'kz'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setLang(l)
                    setMobileMenuOpen(false)
                  }}
                  className="flex-1 px-3 py-2 text-sm font-bold uppercase transition-all"
                  style={{
                    fontFamily: "'Special Elite', Georgia, serif",
                    letterSpacing: '0.1em',
                    border: lang === l ? '2px solid #3d2b1f' : '2px solid #8b7355',
                    borderRadius: '3px',
                    background: lang === l ? '#c44d2c' : 'transparent',
                    color: lang === l ? '#fdf6e3' : '#8b7355',
                    boxShadow: lang === l ? '2px 2px 0px #3d2b1f' : 'none',
                  }}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
