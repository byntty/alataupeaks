import { createContext, useContext, useState, type ReactNode } from 'react'

export type Lang = 'ru' | 'en' | 'kz'

interface Translations {
  // Nav
  searchPlaceholder: string
  catalog: string
  weather: string
  equipment: string
  safety: string

  // Map
  mapTitle: string
  mapHint: string
  routesCount: (n: number) => string

  // Categories
  categoryEasy: string
  categoryMedium: string
  categoryHard: string
  categoryExtreme: string

  // Peak detail
  backToCatalog: string
  route: string
  distance: string
  elevationGain: string
  duration: string
  difficulty: string
  guruMaps: string

  // Difficulty levels
  level1: string
  level2: string
  level3: string
  level4: string

  // Weather
  weatherTitle: string
  weatherSubtitle: string
  temperature: string
  feelsLike: string
  humidity: string
  wind: string
  windDirection: string
  tempMax: string
  tempMin: string
  hourlyForecast: string
  showDetails: string
  hideDetails: string
  night: string
  morning: string
  day: string
  evening: string

  // Equipment
  equipmentTitle: string
  essential: string

  // Safety
  safetyTitle: string
  rules: string
  emergencyContacts: string
  tips: string

  // Footer
  footerText: string
  madeWith: string

  // 404
  notFoundTitle: string
  notFoundBack: string
}

const ru: Translations = {
  searchPlaceholder: 'Поиск пиков...',
  catalog: 'Каталог',
  weather: 'Погода',
  equipment: 'Снаряжение',
  safety: 'Безопасность',

  mapTitle: 'Заилийский Алатау · Интерактивная карта',
  mapHint: 'Нажмите на маркер для просмотра',
  routesCount: (n: number) => {
    if (n === 1) return '1 маршрут'
    if (n >= 2 && n <= 4) return `${n} маршрута`
    return `${n} маршрутов`
  },

  categoryEasy: 'Лёгкий',
  categoryMedium: 'Средний',
  categoryHard: 'Сложный',
  categoryExtreme: 'Очень сложный',

  backToCatalog: 'Каталог',
  route: 'Маршрут',
  distance: 'Расстояние',
  elevationGain: 'Набор высоты',
  duration: 'Длительность',
  difficulty: 'Сложность',
  guruMaps: 'Guru Maps',

  level1: 'Лёгкий',
  level2: 'Средний',
  level3: 'Сложный',
  level4: 'Очень сложный',

  weatherTitle: 'Погода',
  weatherSubtitle: 'Ожидаемые условия',
  temperature: 'Температура',
  feelsLike: 'Ощущается',
  humidity: 'Влажность',
  wind: 'Ветер',
  windDirection: 'Направление',
  tempMax: 'Макс.',
  tempMin: 'Мин.',
  hourlyForecast: 'Почасовой прогноз',
  showDetails: 'Подробнее...',
  hideDetails: 'Свернуть',
  night: 'Ночь',
  morning: 'Утро',
  day: 'День',
  evening: 'Вечер',

  equipmentTitle: 'Снаряжение',
  essential: 'Обязательно',

  safetyTitle: 'Безопасность',
  rules: 'Правила',
  emergencyContacts: 'Экстренные контакты',
  tips: 'Советы',

  footerText: 'AlatauPeaks — Путеводитель по Заилийскому Алатау',
  madeWith: 'Сделано с любовью к горам',

  notFoundTitle: 'Маршрут не найден',
  notFoundBack: 'На главную',
}

const en: Translations = {
  searchPlaceholder: 'Search peaks...',
  catalog: 'Catalog',
  weather: 'Weather',
  equipment: 'Equipment',
  safety: 'Safety',

  mapTitle: 'Zailiysky Alatau · Interactive Map',
  mapHint: 'Click a marker to view details',
  routesCount: (n: number) => {
    if (n === 1) return '1 route'
    return `${n} routes`
  },

  categoryEasy: 'Easy',
  categoryMedium: 'Medium',
  categoryHard: 'Hard',
  categoryExtreme: 'Extreme',

  backToCatalog: 'Catalog',
  route: 'Route',
  distance: 'Distance',
  elevationGain: 'Elevation Gain',
  duration: 'Duration',
  difficulty: 'Difficulty',
  guruMaps: 'Guru Maps',

  level1: 'Easy',
  level2: 'Medium',
  level3: 'Hard',
  level4: 'Extreme',

  weatherTitle: 'Weather',
  weatherSubtitle: 'Expected Conditions',
  temperature: 'Temperature',
  feelsLike: 'Feels Like',
  humidity: 'Humidity',
  wind: 'Wind',
  windDirection: 'Direction',
  tempMax: 'Max',
  tempMin: 'Min',
  hourlyForecast: 'Hourly Forecast',
  showDetails: 'Show Details...',
  hideDetails: 'Hide',
  night: 'Night',
  morning: 'Morning',
  day: 'Day',
  evening: 'Evening',

  equipmentTitle: 'Equipment',
  essential: 'Essential',

  safetyTitle: 'Safety',
  rules: 'Rules',
  emergencyContacts: 'Emergency Contacts',
  tips: 'Tips',

  footerText: 'AlatauPeaks — Guide to Zailiysky Alatau',
  madeWith: 'Made with love for mountains',

  notFoundTitle: 'Route not found',
  notFoundBack: 'Home',
}

const kz: Translations = {
  searchPlaceholder: 'Шыңдарды іздеу...',
  catalog: 'Каталог',
  weather: 'Ауа-райы',
  equipment: 'Жабдық',
  safety: 'Қауіпсіздік',

  mapTitle: 'Заилийский Алатау · Интерактивті карта',
  mapHint: 'Маркерді басып көру үшін',
  routesCount: (n: number) => {
    if (n === 1) return '1 бағыт'
    return `${n} бағыт`
  },

  categoryEasy: 'Оңай',
  categoryMedium: 'Орташа',
  categoryHard: 'Қиын',
  categoryExtreme: 'Өте қиын',

  backToCatalog: 'Каталог',
  route: 'Бағыт',
  distance: 'Қашықтық',
  elevationGain: 'Биіктік өсу',
  duration: 'Ұзақтық',
  difficulty: 'Қиындық',
  guruMaps: 'Guru Maps',

  level1: 'Оңай',
  level2: 'Орташа',
  level3: 'Қиын',
  level4: 'Өте қиын',

  weatherTitle: 'Ауа-райы',
  weatherSubtitle: 'Күтілетін жағдайлар',
  temperature: 'Температура',
  feelsLike: 'Сезіледі',
  humidity: 'Ылғалдылық',
  wind: 'Жел',
  windDirection: 'Бағыт',
  tempMax: 'Макс.',
  tempMin: 'Мин.',
  hourlyForecast: 'Сағаттық болжам',
  showDetails: 'Толығырақ...',
  hideDetails: 'Жасыру',
  night: 'Түн',
  morning: 'Таң',
  day: 'Күн',
  evening: 'Кеш',

  equipmentTitle: 'Жабдық',
  essential: 'Міндетті',

  safetyTitle: 'Қауіпсіздік',
  rules: 'Ережелер',
  emergencyContacts: 'Төтенше байланыс',
  tips: 'Кеңестер',

  footerText: 'AlatauPeaks — Заилийский Алатау бойынша жетекші',
  madeWith: 'Тауларға деген махаббатпен жасалды',

  notFoundTitle: 'Бағыт табылмады',
  notFoundBack: 'Басты бет',
}

const translations: Record<Lang, Translations> = { ru, en, kz }

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'ru',
  setLang: () => {},
  t: ru,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ru')

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
