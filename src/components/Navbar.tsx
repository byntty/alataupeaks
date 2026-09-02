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
    1: '#4ade80',
    2: '#fb923c',
    3: '#ef4444',
    4: '#a855f7',
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto clay-card px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 no-underline">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #e07030, #ff8c42)',
              boxShadow: '4px 4px 8px rgba(0,0,0,0.1)',
            }}
          >
            <Mountain className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-[#1a1a1a] hidden sm:block">
            Alatau<span className="text-[#e07030]">Peaks</span>
          </span>
        </Link>

        {/* Search */}
        <div ref={searchRef} className="flex-1 relative max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="clay-input w-full pl-10 pr-4 text-sm"
            />
          </div>

          <AnimatePresence>
            {showSearchDropdown && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-2 clay-card p-2 z-50"
              >
                {searchResults.map((peak) => (
                  <button
                    key={peak.id}
                    onClick={() => handlePeakClick(peak.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#f0ebe5] transition-colors text-left"
                  >
                    <div>
                      <div className="font-medium text-[#1a1a1a] text-sm">
                        {displayName(peak)}
                      </div>
                      <div className="text-xs text-[#999]">
                        {peak.elevation} м
                      </div>
                    </div>
                    <span
                      className="clay-badge text-xs"
                      style={{ color: difficultyColors[peak.difficultyLevel] }}
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                lang === l
                  ? 'text-white shadow-md'
                  : 'text-[#999] hover:text-[#1a1a1a]'
              }`}
              style={
                lang === l
                  ? {
                      background: 'linear-gradient(135deg, #e07030, #ff8c42)',
                    }
                  : {}
              }
            >
              {l}
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-[#f0ebe5] transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-[#1a1a1a]" />
          ) : (
            <Menu className="w-5 h-5 text-[#1a1a1a]" />
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
            className="max-w-7xl mx-auto mt-2 clay-card p-4 md:hidden"
          >
            {/* Mobile search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="clay-input w-full pl-10 pr-4 text-sm"
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
                  className={`flex-1 px-3 py-2 rounded-xl text-sm font-bold uppercase transition-all ${
                    lang === l
                      ? 'text-white'
                      : 'text-[#999] hover:text-[#1a1a1a]'
                  }`}
                  style={
                    lang === l
                      ? {
                          background: 'linear-gradient(135deg, #e07030, #ff8c42)',
                        }
                      : {}
                  }
                >
                  {l}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
