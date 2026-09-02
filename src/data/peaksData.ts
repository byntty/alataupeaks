export interface RouteHighlight {
  text: string
}

export interface Route {
  name: string
  duration: string
  distance: string
  elevationGain: string
  difficulty: string
  terrain: string
  description: string
  highlights: string[]
  guruMapsUrl: string
  guruMapsFile?: string
}

export interface EquipmentItem {
  name: string
  essential: boolean
  note?: string
}

export interface EquipmentCategory {
  category: string
  items: EquipmentItem[]
}

export interface WeatherCondition {
  temp: number
  feelsLike: number
  humidity: number
  windSpeed: number
  windDirection: string
  tempMax: number
  tempMin: number
  description: string
  icon: string
}

export interface WeatherForecastItem {
  time: string
  temp: number
  icon: string
}

export interface HourlyForecastItem {
  hour: string
  temp: number
  icon: string
  humidity: number
  wind: number
}

export interface EmergencyContact {
  label: string
  number: string
}

export interface Safety {
  rules: string[]
  emergencyContacts: EmergencyContact[]
  tips: string[]
}

export interface RouteStats {
  distance: string
  elevationGain: string
  duration: string
}

export interface Peak {
  id: string
  name: string
  nameKz: string
  nameEn: string
  elevation: number
  coordinates: { lat: number; lng: number }
  mapPosition: { top: string; left: string }
  difficulty: string
  difficultyLevel: 1 | 2 | 3 | 4
  description: string
  routeStats: RouteStats
  weather: WeatherCondition
  weatherForecast: WeatherForecastItem[]
  hourlyForecast: HourlyForecastItem[]
  routes: Route[]
  equipment: EquipmentCategory[]
  safety: Safety
}

export function getPeakById(id: string): Peak | undefined {
  return peaksData.find((p) => p.id === id)
}

export function searchPeaks(query: string): Peak[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  return peaksData.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.nameKz.toLowerCase().includes(q) ||
      p.nameEn.toLowerCase().includes(q)
  )
}

export const peaksData: Peak[] = [
  {
    id: 'khreshchatyj',
    name: 'Пик Хрещатий',
    nameKz: 'Хрещатий шыңы',
    nameEn: 'Khreshchaty Peak',
    elevation: 4308,
    coordinates: { lat: 43.0950, lng: 77.0650 },
    mapPosition: { top: '28%', left: '42%' },
    difficulty: 'Средний',
    difficultyLevel: 2,
    description:
      'Один из самых красивых пиков Заилийского Алатау, расположенный в верховьях реки Хрещатик. Маршрут проходит через живописные альпийские луга и каменистые осыпи с потрясающими видами на окрестные горы и ледники.',
    routeStats: {
      distance: '18 км',
      elevationGain: '1600 м',
      duration: '14 ч',
    },
    weather: {
      temp: -2,
      feelsLike: -7,
      humidity: 65,
      windSpeed: 15,
      windDirection: 'СЗ',
      tempMax: 3,
      tempMin: -8,
      description: 'Облачно, местами снег',
      icon: '🌨️',
    },
    weatherForecast: [
      { time: 'Ночь', temp: -6, icon: '🌙' },
      { time: 'Утро', temp: -2, icon: '⛅' },
      { time: 'День', temp: 3, icon: '☀️' },
      { time: 'Вечер', temp: -1, icon: '🌤️' },
    ],
    hourlyForecast: [
      { hour: '00:00', temp: -6, icon: '🌙', humidity: 70, wind: 12 },
      { hour: '03:00', temp: -7, icon: '🌙', humidity: 72, wind: 10 },
      { hour: '06:00', temp: -4, icon: '🌅', humidity: 68, wind: 11 },
      { hour: '09:00', temp: -1, icon: '⛅', humidity: 63, wind: 14 },
      { hour: '12:00', temp: 3, icon: '☀️', humidity: 55, wind: 18 },
      { hour: '15:00', temp: 2, icon: '⛅', humidity: 58, wind: 16 },
      { hour: '18:00', temp: -1, icon: '🌤️', humidity: 62, wind: 13 },
      { hour: '21:00', temp: -4, icon: '🌙', humidity: 67, wind: 11 },
    ],
    routes: [
      {
        name: 'Южный маршрут',
        duration: '14 ч',
        distance: '18 км',
        elevationGain: '1600 м',
        difficulty: 'Средний',
        terrain: 'Тропа → каменистая осыпь → скалы',
        description:
          'Классический маршрут от приюта до вершины. Проходит через альпийские луга, пересекает реку Хрещатик и поднимается по восточному гребню.',
        highlights: [
          'Вид на ледник Хрещатик',
          'Альпийские луга до 3200 м',
          'Восхождение по гребню',
        ],
        guruMapsUrl: 'https://maps.guru/peaks/khreshchatyj-south',
        guruMapsFile: '/guru/khreshchatyj-south.guru',
      },
      {
        name: 'Северный маршрут',
        duration: '16 ч',
        distance: '20 км',
        elevationGain: '1750 м',
        difficulty: 'Средний+',
        terrain: 'Тропа → камни → снежные поля',
        description:
          'Более техничный маршрут с северной стороны. Включает прохождение по ледниковому полю и скальному участку перед вершиной.',
        highlights: [
          'Вид на северную стену',
          'Ледниковое поле',
          'Скальный участок IV категории',
        ],
        guruMapsUrl: 'https://maps.guru/peaks/khreshchatyj-north',
      },
    ],
    equipment: [
      {
        category: 'Одежда',
        items: [
          { name: 'Мембранная куртка', essential: true },
          { name: 'Тёплая куртка (пуховик)', essential: true },
          { name: 'Трекинговые штаны', essential: true },
          { name: 'Термобельё', essential: true, note: 'Синтетика или шерсть' },
          { name: 'Шапка и перчатки', essential: true },
          { name: 'Балаклава', essential: false, note: 'Для ветреной погоды' },
          { name: 'Гетры', essential: true },
        ],
      },
      {
        category: 'Обувь',
        items: [
          { name: 'Трекинговые ботинки', essential: true, note: 'Жёсткая подошва' },
          { name: 'Тrekking poles', essential: true },
          { name: 'Колодки (кроссовки)', essential: false, note: 'Для подхода' },
        ],
      },
      {
        category: 'Навигация',
        items: [
          { name: 'GPS-навигатор', essential: true },
          { name: 'Компас', essential: true },
          { name: 'Топографическая карта', essential: true },
          { name: 'Power bank', essential: true },
        ],
      },
      {
        category: 'Питание',
        items: [
          { name: 'Вода (2-3 л)', essential: true },
          { name: 'Энергетические батончики', essential: true },
          { name: 'Термос с горячим напитком', essential: true },
          { name: 'Сухой паёк', essential: true },
        ],
      },
      {
        category: 'Безопасность',
        items: [
          { name: 'Аптечка первой помощи', essential: true },
          { name: 'Солнцезащитный крем SPF 50', essential: true },
          { name: 'Альпинистская каска', essential: true, note: 'Для скальных участков' },
          { name: 'Страховочная система', essential: false, note: 'Для опытных' },
        ],
      },
    ],
    safety: {
      rules: [
        'Не отправляйтесь в горы один — группа минимум 3 человека',
        'Зарегистрируйтесь в спасательной службе перед выходом',
        'Следите за прогнозом погоды — штормы возникают быстро',
        'Всегда берите запасное время — не планируйте спуск на закат',
        'Не приближайтесь к краю ледника без опыта',
      ],
      emergencyContacts: [
        { label: 'МЧС Казахстана', number: '112' },
        { label: 'Служба спасения Алматы', number: '+7-727-250-39-39' },
        { label: 'Горная служба спасения', number: '+7-727-272-25-45' },
        { label: 'Полиция', number: '102' },
      ],
      tips: [
        'Начинайте маршрут рано утром (5:00-6:00), чтобы избежать afternoon storms',
        'При первых признаках ухудшения погоды — спускайтесь',
        'Соблюдайте правило разворота — не позже 14:00',
        'Носите свисток для экстренной сигнализации',
      ],
    },
  },
  {
    id: 'sovietov',
    name: 'Пик Советов',
    nameKz: 'Советов шыңы',
    nameEn: 'Pik Sovetov',
    elevation: 4317,
    coordinates: { lat: 43.0700, lng: 77.0800 },
    mapPosition: { top: '35%', left: '52%' },
    difficulty: 'Средний',
    difficultyLevel: 2,
    description:
      'Пик Советов — один из популярных маршрутов для опытных туристов. Расположен в районе ледника Тургунай, открывая великолепные панорамные виды на южные хребты Алатау.',
    routeStats: {
      distance: '16 км',
      elevationGain: '1500 м',
      duration: '12 ч',
    },
    weather: {
      temp: -1,
      feelsLike: -5,
      humidity: 60,
      windSpeed: 12,
      windDirection: 'Ю',
      tempMax: 4,
      tempMin: -7,
      description: 'Переменная облачность',
      icon: '⛅',
    },
    weatherForecast: [
      { time: 'Ночь', temp: -5, icon: '🌙' },
      { time: 'Утро', temp: -1, icon: '⛅' },
      { time: 'День', temp: 4, icon: '☀️' },
      { time: 'Вечер', temp: 0, icon: '🌤️' },
    ],
    hourlyForecast: [
      { hour: '00:00', temp: -5, icon: '🌙', humidity: 65, wind: 10 },
      { hour: '03:00', temp: -6, icon: '🌙', humidity: 67, wind: 8 },
      { hour: '06:00', temp: -3, icon: '🌅', humidity: 62, wind: 9 },
      { hour: '09:00', temp: 0, icon: '⛅', humidity: 58, wind: 12 },
      { hour: '12:00', temp: 4, icon: '☀️', humidity: 50, wind: 15 },
      { hour: '15:00', temp: 3, icon: '⛅', humidity: 53, wind: 14 },
      { hour: '18:00', temp: 0, icon: '🌤️', humidity: 57, wind: 11 },
      { hour: '21:00', temp: -3, icon: '🌙', humidity: 62, wind: 9 },
    ],
    routes: [
      {
        name: 'Основной маршрут',
        duration: '12 ч',
        distance: '16 км',
        elevationGain: '1500 м',
        difficulty: 'Средний',
        terrain: 'Тропа → морена → гребень',
        description:
          'Стандартный маршрут через долину ледника Тургунай с подъёмом по восточному гребню к вершине.',
        highlights: [
          'Ледник Тургунай',
          'Вид с восточного гребня',
          'Панорама на южные хребты',
        ],
        guruMapsUrl: 'https://maps.guru/peaks/sovietov-main',
        guruMapsFile: '/guru/sovietov-main.guru',
      },
    ],
    equipment: [
      {
        category: 'Одежда',
        items: [
          { name: 'Мембранная куртка', essential: true },
          { name: 'Тёплая куртка', essential: true },
          { name: 'Трекинговые штаны', essential: true },
          { name: 'Термобельё', essential: true },
          { name: 'Шапка и перчатки', essential: true },
        ],
      },
      {
        category: 'Обувь',
        items: [
          { name: 'Трекинговые ботинки', essential: true },
          { name: 'Трекинговые палки', essential: true },
        ],
      },
      {
        category: 'Навигация',
        items: [
          { name: 'GPS-навигатор', essential: true },
          { name: 'Компас', essential: true },
          { name: 'Power bank', essential: true },
        ],
      },
      {
        category: 'Питание',
        items: [
          { name: 'Вода (2 л)', essential: true },
          { name: 'Энергетические батончики', essential: true },
          { name: 'Термос', essential: true },
        ],
      },
      {
        category: 'Безопасность',
        items: [
          { name: 'Аптечка', essential: true },
          { name: 'Солнцезащитный крем', essential: true },
          { name: 'Каска', essential: false },
        ],
      },
    ],
    safety: {
      rules: [
        'Группа минимум 3 человека',
        'Зарегистрируйтесь в спасательной службе',
        'Следите за погодой',
        'Не выходите без карта GPS',
      ],
      emergencyContacts: [
        { label: 'МЧС Казахстана', number: '112' },
        { label: 'Служба спасения', number: '+7-727-250-39-39' },
      ],
      tips: [
        'Начинайте рано утром',
        'Берите запас воды — на маршруте нет источников после 3000 м',
        'Возвращайтесь по тому же маршруту',
      ],
    },
  },
  {
    id: 'turist',
    name: 'Пик Туристов',
    nameKz: 'Туристер шыңы',
    nameEn: 'Pik Turistov',
    elevation: 3974,
    coordinates: { lat: 43.0800, lng: 77.0500 },
    mapPosition: { top: '45%', left: '30%' },
    difficulty: 'Лёгкий',
    difficultyLevel: 1,
    description:
      'Идеальный пик для первого высотного маршрута. Хорошая тропа, красивые виды и относительно простой подъём делают его популярным среди начинающих туристов.',
    routeStats: {
      distance: '12 км',
      elevationGain: '900 м',
      duration: '6 ч',
    },
    weather: {
      temp: 2,
      feelsLike: -2,
      humidity: 55,
      windSpeed: 10,
      windDirection: 'З',
      tempMax: 7,
      tempMin: -3,
      description: 'Ясно',
      icon: '☀️',
    },
    weatherForecast: [
      { time: 'Ночь', temp: -2, icon: '🌙' },
      { time: 'Утро', temp: 2, icon: '☀️' },
      { time: 'День', temp: 7, icon: '☀️' },
      { time: 'Вечер', temp: 3, icon: '🌤️' },
    ],
    hourlyForecast: [
      { hour: '00:00', temp: -2, icon: '🌙', humidity: 58, wind: 8 },
      { hour: '03:00', temp: -3, icon: '🌙', humidity: 60, wind: 7 },
      { hour: '06:00', temp: 0, icon: '🌅', humidity: 55, wind: 8 },
      { hour: '09:00', temp: 4, icon: '☀️', humidity: 48, wind: 10 },
      { hour: '12:00', temp: 7, icon: '☀️', humidity: 42, wind: 12 },
      { hour: '15:00', temp: 6, icon: '☀️', humidity: 44, wind: 11 },
      { hour: '18:00', temp: 3, icon: '🌤️', humidity: 50, wind: 9 },
      { hour: '21:00', temp: 1, icon: '🌙', humidity: 54, wind: 8 },
    ],
    routes: [
      {
        name: 'Тропа туриста',
        duration: '6 ч',
        distance: '12 км',
        elevationGain: '900 м',
        difficulty: 'Лёгкий',
        terrain: 'Хорошая тропа → каменистый участок',
        description:
          'Простой маршрут для начинающих. Чёткая тропа от стоянки до вершины с небольшим каменистым участком в финале.',
        highlights: [
          'Панорамный вид с вершины',
          'Альпийские луга',
          'Доступен для семейного отдыха',
        ],
        guruMapsUrl: 'https://maps.guru/peaks/turistov-trail',
        guruMapsFile: '/guru/turistov-trail.guru',
      },
    ],
    equipment: [
      {
        category: 'Одежда',
        items: [
          { name: 'Ветровка', essential: true },
          { name: 'Флиска', essential: true },
          { name: 'Удобные штаны', essential: true },
        ],
      },
      {
        category: 'Обувь',
        items: [
          { name: 'Трекинговые кроссовки', essential: true },
        ],
      },
      {
        category: 'Питание',
        items: [
          { name: 'Вода (1.5 л)', essential: true },
          { name: 'Перекусы', essential: true },
        ],
      },
      {
        category: 'Безопасность',
        items: [
          { name: 'Солнцезащитный крем', essential: true },
          { name: 'Аптечка', essential: false },
        ],
      },
    ],
    safety: {
      rules: [
        'Не ходите один',
        'Берите достаточно воды',
        'Следите за погодой',
      ],
      emergencyContacts: [
        { label: 'МЧС', number: '112' },
      ],
      tips: [
        'Отличный маршрут для первого опыта',
        'Начинайте до 9:00 утра',
        'Вернитесь до 16:00',
      ],
    },
  },
  {
    id: 'belukha',
    name: 'Пик Белуха',
    nameKz: 'Белуха шыңы',
    nameEn: 'Belukha Peak',
    elevation: 4062,
    coordinates: { lat: 43.0500, lng: 77.1000 },
    mapPosition: { top: '55%', left: '65%' },
    difficulty: 'Сложный',
    difficultyLevel: 3,
    description:
      'Один из самых требовательных маршрутов в районе. Длинная дистанция, значительный набор высоты и технические участки требуют хорошей физической подготовки и опыта горных походов.',
    routeStats: {
      distance: '24 км',
      elevationGain: '2100 м',
      duration: '20 ч',
    },
    weather: {
      temp: -5,
      feelsLike: -12,
      humidity: 75,
      windSpeed: 20,
      windDirection: 'С',
      tempMax: 0,
      tempMin: -12,
      description: 'Снег, ветер',
      icon: '❄️',
    },
    weatherForecast: [
      { time: 'Ночь', temp: -10, icon: '🌙' },
      { time: 'Утро', temp: -5, icon: '🌨️' },
      { time: 'День', temp: 0, icon: '⛅' },
      { time: 'Вечер', temp: -4, icon: '❄️' },
    ],
    hourlyForecast: [
      { hour: '00:00', temp: -10, icon: '🌙', humidity: 80, wind: 18 },
      { hour: '03:00', temp: -11, icon: '🌙', humidity: 82, wind: 16 },
      { hour: '06:00', temp: -8, icon: '🌨️', humidity: 78, wind: 17 },
      { hour: '09:00', temp: -4, icon: '🌨️', humidity: 73, wind: 20 },
      { hour: '12:00', temp: 0, icon: '⛅', humidity: 68, wind: 24 },
      { hour: '15:00', temp: -1, icon: '⛅', humidity: 70, wind: 22 },
      { hour: '18:00', temp: -4, icon: '❄️', humidity: 74, wind: 19 },
      { hour: '21:00', temp: -8, icon: '🌙', humidity: 78, wind: 17 },
    ],
    routes: [
      {
        name: 'Западный маршрут',
        duration: '20 ч',
        distance: '24 км',
        elevationGain: '2100 м',
        difficulty: 'Сложный',
        terrain: 'Тропа → морена → ледник → скалы',
        description:
          'Требовательный маршрут через западный подход. Включает прохождение ледникового участка и скального гребня. Необходим альпинистский опыт.',
        highlights: [
          'Ледниковое поле',
          'Скальный гребень V категории',
          'Вершинная панорама',
        ],
        guruMapsUrl: 'https://maps.guru/peaks/belukha-west',
        guruMapsFile: '/guru/belukha-west.guru',
      },
    ],
    equipment: [
      {
        category: 'Одежда',
        items: [
          { name: 'Мембранная куртка', essential: true },
          { name: 'Пуховик', essential: true },
          { name: 'Альпинистские штаны', essential: true },
          { name: 'Термобельё (2 слоя)', essential: true },
          { name: 'Балаклава', essential: true },
          { name: 'Альпинистские перчатки', essential: true },
        ],
      },
      {
        category: 'Обувь',
        items: [
          { name: 'Альпинистские ботинки', essential: true },
          { name: 'Кошки', essential: true },
          { name: 'Гамаши', essential: true },
        ],
      },
      {
        category: 'Навигация',
        items: [
          { name: 'GPS-навигатор', essential: true },
          { name: 'Компас', essential: true },
          { name: 'Топографическая карта', essential: true },
          { name: 'Power bank (2 шт)', essential: true },
        ],
      },
      {
        category: 'Альпинистское снаряжение',
        items: [
          { name: 'Каска', essential: true },
          { name: 'Страховочная система', essential: true },
          { name: 'Верёвка (50 м)', essential: true },
          { name: 'Гропрессоры', essential: true },
          { name: 'Карабины (4 шт)', essential: true },
        ],
      },
      {
        category: 'Питание',
        items: [
          { name: 'Вода (3 л)', essential: true },
          { name: 'Энергетические батончики', essential: true },
          { name: 'Термос', essential: true },
          { name: 'Горячее питание', essential: true },
        ],
      },
      {
        category: 'Безопасность',
        items: [
          { name: 'Аптечка (расширенная)', essential: true },
          { name: 'Солнцезащитный крем SPF 50', essential: true },
          { name: 'Спасательное одеяло', essential: true },
          { name: 'Свисток', essential: true },
        ],
      },
    ],
    safety: {
      rules: [
        'Минимальный опыт: 3 высотных маршрута',
        'Группа минимум 4 человека',
        'Обязательна регистрация в спасательной службе',
        'Обязательное альпинистское снаряжение',
        'Не начинайте при угрозе шторма',
        'Всегда берите запас времени на спуск',
      ],
      emergencyContacts: [
        { label: 'МЧС Казахстана', number: '112' },
        { label: 'Служба спасения Алматы', number: '+7-727-250-39-39' },
        { label: 'Горная служба спасения', number: '+7-727-272-25-45' },
      ],
      tips: [
        'Тренируйтесь на более простых пиках перед этим маршрутом',
        'Выходите в 4:00-5:00 утра',
        'Разворот не позже 12:00',
        'Носите GPS с записанным маршрутом обратно',
      ],
    },
  },
  {
    id: 'tuyuksu',
    name: 'Пик Туюксу',
    nameKz: 'Түйүксу шыңы',
    nameEn: 'Pik Tuyuksu',
    elevation: 4156,
    coordinates: { lat: 43.0600, lng: 77.0700 },
    mapPosition: { top: '38%', left: '48%' },
    difficulty: 'Средний',
    difficultyLevel: 2,
    description:
      'Классический маршрут среди ледников и скал. Пик Туюксу расположен в живописном районе с видом на массив Туюксу и окрестные ледники.',
    routeStats: {
      distance: '14 км',
      elevationGain: '1300 м',
      duration: '10 ч',
    },
    weather: {
      temp: 0,
      feelsLike: -4,
      humidity: 62,
      windSpeed: 14,
      windDirection: 'ЮЗ',
      tempMax: 5,
      tempMin: -6,
      description: 'Облачно',
      icon: '☁️',
    },
    weatherForecast: [
      { time: 'Ночь', temp: -4, icon: '🌙' },
      { time: 'Утро', temp: 0, icon: '☁️' },
      { time: 'День', temp: 5, icon: '⛅' },
      { time: 'Вечер', temp: 1, icon: '☁️' },
    ],
    hourlyForecast: [
      { hour: '00:00', temp: -4, icon: '🌙', humidity: 65, wind: 12 },
      { hour: '03:00', temp: -5, icon: '🌙', humidity: 67, wind: 10 },
      { hour: '06:00', temp: -2, icon: '🌅', humidity: 63, wind: 11 },
      { hour: '09:00', temp: 2, icon: '☁️', humidity: 58, wind: 13 },
      { hour: '12:00', temp: 5, icon: '⛅', humidity: 52, wind: 16 },
      { hour: '15:00', temp: 4, icon: '☁️', humidity: 55, wind: 15 },
      { hour: '18:00', temp: 1, icon: '☁️', humidity: 60, wind: 12 },
      { hour: '21:00', temp: -1, icon: '🌙', humidity: 63, wind: 11 },
    ],
    routes: [
      {
        name: 'Ледниковый маршрут',
        duration: '10 ч',
        distance: '14 км',
        elevationGain: '1300 м',
        difficulty: 'Средний',
        terrain: 'Тропа → морена → ледник → гребень',
        description:
          'Основной маршрут через ледник Туюксу. Проходит мимо одноимённого ледника с подъёмом по восточному гребню.',
        highlights: [
          'Ледник Туюксу',
          'Вид на массив Актау',
          'Подъём по гребню',
        ],
        guruMapsUrl: 'https://maps.guru/peaks/tuyuksu-glacier',
        guruMapsFile: '/guru/tuyuksu-glacier.guru',
      },
    ],
    equipment: [
      {
        category: 'Одежда',
        items: [
          { name: 'Мембранная куртка', essential: true },
          { name: 'Тёплая куртка', essential: true },
          { name: 'Трекинговые штаны', essential: true },
          { name: 'Шапка и перчатки', essential: true },
        ],
      },
      {
        category: 'Обувь',
        items: [
          { name: 'Трекинговые ботинки', essential: true },
          { name: 'Трекинговые палки', essential: true },
          { name: 'Кошки (опционально)', essential: false, note: 'При наличии льда' },
        ],
      },
      {
        category: 'Навигация',
        items: [
          { name: 'GPS-навигатор', essential: true },
          { name: 'Компас', essential: true },
          { name: 'Power bank', essential: true },
        ],
      },
      {
        category: 'Питание',
        items: [
          { name: 'Вода (2 л)', essential: true },
          { name: 'Энергетические батончики', essential: true },
          { name: 'Термос', essential: true },
        ],
      },
      {
        category: 'Безопасность',
        items: [
          { name: 'Аптечка', essential: true },
          { name: 'Солнцезащитный крем', essential: true },
        ],
      },
    ],
    safety: {
      rules: [
        'Группа минимум 3 человека',
        'Зарегистрируйтесь перед выходом',
        'Следите за погодой',
        'На леднике — верёвка обязательна',
      ],
      emergencyContacts: [
        { label: 'МЧС Казахстана', number: '112' },
        { label: 'Служба спасения', number: '+7-727-250-39-39' },
      ],
      tips: [
        'Начинайте рано — в 6:00',
        'На леднике соблюдайте дистанцию',
        'Избегайте ледниковых разломов — идите за проводником',
      ],
    },
  },
  {
    id: 'manas',
    name: 'Пик Манас',
    nameKz: 'Манас шыңы',
    nameEn: 'Pik Manas',
    elevation: 4482,
    coordinates: { lat: 43.0400, lng: 77.1200 },
    mapPosition: { top: '62%', left: '72%' },
    difficulty: 'Очень сложный',
    difficultyLevel: 4,
    description:
      'Один из самых высоких и технически сложных пиков Заилийского Алатау. Требует серьёзной альпинистской подготовки, хорошей акклиматизации и опыта высотных восхождений. Длинный маршрут с техническими участками.',
    routeStats: {
      distance: '28 км',
      elevationGain: '2400 м',
      duration: '30 ч',
    },
    weather: {
      temp: -8,
      feelsLike: -18,
      humidity: 80,
      windSpeed: 25,
      windDirection: 'С',
      tempMax: -2,
      tempMin: -15,
      description: 'Сильный ветер, снег',
      icon: '🌨️',
    },
    weatherForecast: [
      { time: 'Ночь', temp: -13, icon: '🌙' },
      { time: 'Утро', temp: -8, icon: '🌨️' },
      { time: 'День', temp: -2, icon: '❄️' },
      { time: 'Вечер', temp: -6, icon: '🌨️' },
    ],
    hourlyForecast: [
      { hour: '00:00', temp: -13, icon: '🌙', humidity: 82, wind: 22 },
      { hour: '03:00', temp: -14, icon: '🌙', humidity: 84, wind: 20 },
      { hour: '06:00', temp: -11, icon: '🌨️', humidity: 80, wind: 21 },
      { hour: '09:00', temp: -7, icon: '🌨️', humidity: 76, wind: 24 },
      { hour: '12:00', temp: -2, icon: '❄️', humidity: 70, wind: 28 },
      { hour: '15:00', temp: -3, icon: '❄️', humidity: 72, wind: 26 },
      { hour: '18:00', temp: -6, icon: '🌨️', humidity: 75, wind: 23 },
      { hour: '21:00', temp: -10, icon: '🌙', humidity: 79, wind: 21 },
    ],
    routes: [
      {
        name: 'Юго-западный маршрут',
        duration: '30 ч',
        distance: '28 км',
        elevationGain: '2400 м',
        difficulty: 'Экспертный',
        terrain: 'Тропа → морена → ледник → скалы → гребень',
        description:
          'Экспертный маршрут для опытных альпинистов. Включает прохождение ледника, скального участка VI категории и выход по🔪ножу к вершине. Требуется двухдневное восхождение с промежуточным лагерем.',
        highlights: [
          'Вершина — высшая точка маршрута',
          'Ледниковое поле длиной 1.5 км',
          'Скальный участок VI категории',
          'Вершинный гребень',
        ],
        guruMapsUrl: 'https://maps.guru/peaks/manas-sw',
        guruMapsFile: '/guru/manas-sw.guru',
      },
    ],
    equipment: [
      {
        category: 'Одежда',
        items: [
          { name: 'Экспедиционная куртка', essential: true },
          { name: 'Пуховик (800+)', essential: true },
          { name: 'Альпинистские штаны', essential: true },
          { name: 'Термобельё (3 слоя)', essential: true },
          { name: 'Балаклава', essential: true },
          { name: 'Альпинистские перчатки (2 пары)', essential: true },
          { name: 'Гетры', essential: true },
        ],
      },
      {
        category: 'Обувь',
        items: [
          { name: 'Экспедиционные ботинки', essential: true },
          { name: 'Кошки (12-зубые)', essential: true },
          { name: 'Гамаши', essential: true },
        ],
      },
      {
        category: 'Навигация',
        items: [
          { name: 'GPS-навигатор', essential: true },
          { name: 'Компас', essential: true },
          { name: 'Топографическая карта', essential: true },
          { name: 'Power bank (3 шт)', essential: true },
          { name: 'Солнечная зарядка', essential: false },
        ],
      },
      {
        category: 'Альпинистское снаряжение',
        items: [
          { name: 'Каска', essential: true },
          { name: 'Страховочная система', essential: true },
          { name: 'Верёвка (60 м, 2 шт)', essential: true },
          { name: 'Гропрессоры', essential: true },
          { name: 'Жумар', essential: true },
          { name: 'Карабины (8 шт)', essential: true },
          { name: 'Петли (6 шт)', essential: true },
          { name: 'Ледоруб', essential: true },
        ],
      },
      {
        category: 'Лагерь',
        items: [
          { name: 'Палатка (4-сезонная)', essential: true },
          { name: 'Спальный мешок (-15°C)', essential: true },
          { name: 'Коврик (R-value 5+)', essential: true },
          { name: 'Горелка + топливо', essential: true },
        ],
      },
      {
        category: 'Питание',
        items: [
          { name: 'Вода (4 л)', essential: true },
          { name: 'Высококалорийная еда (2 дня)', essential: true },
          { name: 'Энергетические гели', essential: true },
          { name: 'Термос', essential: true },
        ],
      },
      {
        category: 'Безопасность',
        items: [
          { name: 'Аптечка (альпинистская)', essential: true },
          { name: 'Солнцезащитный крем SPF 50+', essential: true },
          { name: 'Спасательное одеяло', essential: true },
          { name: 'Свисток', essential: true },
          { name: 'Сигнальные ракеты', essential: false },
          { name: 'Кислород (опционально)', essential: false, note: 'Для экстренных случаев' },
        ],
      },
    ],
    safety: {
      rules: [
        'Минимальный опыт: 5 высотных маршрутов (включая технические)',
        'Группа минимум 4 человека с опытным проводником',
        'Обязательная регистрация в спасательной службе (24 ч)',
        'Полное альпинистское снаряжение обязательно',
        'Двухдневное восхождение с промежуточным лагерем',
        'Мониторинг погоды каждые 3 часа',
        'Немедленный спуск при ухудшении погоды',
      ],
      emergencyContacts: [
        { label: 'МЧС Казахстана', number: '112' },
        { label: 'Служба спасения Алматы', number: '+7-727-250-39-39' },
        { label: 'Горная служба спасения', number: '+7-727-272-25-45' },
        { label: 'Центр управления полётами', number: '+7-727-258-38-00' },
      ],
      tips: [
        'Акклиматизация: минимум 3 дня на высоте 3000+ м перед восхождением',
        'Выход из промежуточного лагеря: 3:00-4:00',
        'Разворот: не позже 11:00 в любом случае',
        'Двигайтесь медленно — высота требует адаптации',
        'Всегда имейте план Б — худший сценарий',
      ],
    },
  },
]
