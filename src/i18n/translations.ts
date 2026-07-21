export type Locale = 'en' | 'es'

export const defaultLocale: Locale = 'en'
export const locales: Locale[] = ['en', 'es']

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
}

export interface Translations {
  // Meta
  siteTitle: string
  siteDescription: string

  // Welcome screen
  welcomeTitle: string
  welcomeDescription: string
  playPauseShortcut: string
  stepShortcut: string

  // Sidebar
  searchPlaceholder: string
  algorithmsCount: string // "{count} algorithms"
  algorithmCountLabel: string // "{count} algorithms" for screen readers
  expandSidebar: string
  collapseSidebar: string

  // Code panel
  tabCode: string
  tabAbout: string
  selectAlgorithmCode: string
  expandCodePanel: string
  collapseCodePanel: string
  variables: string
  codeLanguage: string

  // Controls
  speed: string
  skipToStart: string
  stepBackward: string
  playPause: string
  stepForward: string
  skipToEnd: string
  step: string // "Step {n}:"
  controlsLabel: string
  progressStep: string // "Step {current} of {total}"
  speedLevel: string // "Speed level {n} of 5"

  // Drag handles
  resizeSidebar: string
  resizeCodePanel: string

  // Mobile / aria labels
  sidebarAriaLabel: string
  codePanelAriaLabel: string
  visualizationLabel: string
  mobileMenuTitle: string
  openMenu: string
  closeMenu: string
  closePanel: string
  viewCode: string
  languageLabel: string

  // 404
  notFoundTitle: string
  notFoundDescription: string
  backToHome: string
  notFoundHint: string
  notFoundSearchLabel: string
  notFoundSearchPlaceholder: string
  notFoundDidYouMean: string
  notFoundPopular: string
  notFoundBrowseCategories: string
  notFoundNoResults: string
  notFoundViewAll: string

  // Graph visualizer
  queue: string
  stack: string
  empty: string
  distances: string

  // Categories
  categories: Record<string, string>
}

export const translations: Record<Locale, Translations> = {
  en: {
    siteTitle: 'Algorithm Visualizer — Sorting, Graphs, DP & More',
    siteDescription:
      'Free interactive algorithm visualizer. Learn sorting, searching, graphs, dynamic programming, and data structures with step-by-step animations.',

    welcomeTitle: 'Algorithm Visualizer',
    welcomeDescription:
      'Learn algorithms through step-by-step visualizations — sorting, graphs, dynamic programming, data structures, and more. Pick one from the sidebar to begin.',
    playPauseShortcut: 'Play / Pause',
    stepShortcut: 'Step',

    searchPlaceholder: 'Search algorithms...',
    algorithmsCount: '{count} algorithms',
    algorithmCountLabel: '{count} algorithms',
    expandSidebar: 'Expand sidebar',
    collapseSidebar: 'Collapse sidebar',

    tabCode: 'Code',
    tabAbout: 'Explanation',
    selectAlgorithmCode: 'Select an algorithm to view its code',
    expandCodePanel: 'Expand code panel',
    collapseCodePanel: 'Collapse code panel',
    variables: 'Variables',
    codeLanguage: 'Programming language',

    speed: 'Speed',
    skipToStart: 'Skip to start',
    stepBackward: 'Step backward (←)',
    playPause: 'Play/Pause (Space)',
    stepForward: 'Step forward (→)',
    skipToEnd: 'Skip to end',
    step: 'Step {n}:',
    controlsLabel: 'Playback controls',
    progressStep: 'Step {current} of {total}',
    speedLevel: 'Speed level {n} of 5',

    resizeSidebar: 'Resize sidebar',
    resizeCodePanel: 'Resize code panel',

    sidebarAriaLabel: 'Algorithm categories',
    codePanelAriaLabel: 'Code and details panel',
    visualizationLabel: 'Algorithm visualization',
    mobileMenuTitle: 'Algorithms',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    closePanel: 'Close panel',
    viewCode: 'View code',
    languageLabel: 'Language',

    notFoundTitle: 'Page not found',
    notFoundDescription:
      "That URL didn't match any algorithm or page. Search below or jump to a popular visualization.",
    backToHome: 'Back to home',
    notFoundHint: 'No match · O(1) not found',
    notFoundSearchLabel: 'Search algorithms',
    notFoundSearchPlaceholder: 'Try bubble sort, dijkstra, binary search…',
    notFoundDidYouMean: 'Did you mean?',
    notFoundPopular: 'Popular visualizations',
    notFoundBrowseCategories: 'Browse by category',
    notFoundNoResults: 'No algorithms match that search.',
    notFoundViewAll: 'View all algorithms',

    queue: 'Queue',
    stack: 'Stack',
    empty: 'empty',
    distances: 'Distances',

    categories: {
      Concepts: 'Concepts',
      'Data Structures': 'Data Structures',
      Sorting: 'Sorting',
      Searching: 'Searching',
      Graphs: 'Graphs',
      'Dynamic Programming': 'Dynamic Programming',
      Backtracking: 'Backtracking',
      'Divide and Conquer': 'Divide and Conquer',
      Math: 'Math',
    },
  },

  es: {
    siteTitle: 'Visualizador de algoritmos — Ordenamiento, Grafos, DP y más',
    siteDescription:
      'Visualizador de algoritmos interactivo y gratis. Aprende ordenamiento, búsqueda, grafos, programación dinámica y estructuras de datos con animaciones paso a paso.',

    welcomeTitle: 'Visualizador de algoritmos',
    welcomeDescription:
      'Aprende algoritmos con visualizaciones paso a paso: ordenamiento, grafos, programación dinámica, estructuras de datos y más. Elige uno en la barra lateral para empezar.',
    playPauseShortcut: 'Reproducir / Pausar',
    stepShortcut: 'Paso',

    searchPlaceholder: 'Buscar algoritmos...',
    algorithmsCount: '{count} algoritmos',
    algorithmCountLabel: '{count} algoritmos',
    expandSidebar: 'Expandir barra lateral',
    collapseSidebar: 'Contraer barra lateral',

    tabCode: 'Código',
    tabAbout: 'Explicación',
    selectAlgorithmCode: 'Selecciona un algoritmo para ver su código',
    expandCodePanel: 'Expandir panel de código',
    collapseCodePanel: 'Contraer panel de código',
    variables: 'Variables',
    codeLanguage: 'Lenguaje de programación',

    speed: 'Velocidad',
    skipToStart: 'Ir al inicio',
    stepBackward: 'Paso anterior (←)',
    playPause: 'Reproducir/Pausar (Espacio)',
    stepForward: 'Paso siguiente (→)',
    skipToEnd: 'Ir al final',
    step: 'Paso {n}:',
    controlsLabel: 'Controles de reproducción',
    progressStep: 'Paso {current} de {total}',
    speedLevel: 'Nivel de velocidad {n} de 5',

    resizeSidebar: 'Redimensionar barra lateral',
    resizeCodePanel: 'Redimensionar panel de código',

    sidebarAriaLabel: 'Categorías de algoritmos',
    codePanelAriaLabel: 'Panel de código y detalles',
    visualizationLabel: 'Visualización del algoritmo',
    mobileMenuTitle: 'Algoritmos',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    closePanel: 'Cerrar panel',
    viewCode: 'Ver código',
    languageLabel: 'Idioma',

    notFoundTitle: 'Página no encontrada',
    notFoundDescription:
      'Esa URL no coincide con ningún algoritmo ni página. Busca abajo o ve a una visualización popular.',
    backToHome: 'Volver al inicio',
    notFoundHint: 'Sin coincidencias · O(1) not found',
    notFoundSearchLabel: 'Buscar algoritmos',
    notFoundSearchPlaceholder: 'Prueba bubble sort, dijkstra, búsqueda binaria…',
    notFoundDidYouMean: '¿Quisiste decir?',
    notFoundPopular: 'Visualizaciones populares',
    notFoundBrowseCategories: 'Explorar por categoría',
    notFoundNoResults: 'Ningún algoritmo coincide con esa búsqueda.',
    notFoundViewAll: 'Ver todos los algoritmos',

    queue: 'Cola',
    stack: 'Pila',
    empty: 'vacía',
    distances: 'Distancias',

    categories: {
      Concepts: 'Conceptos',
      'Data Structures': 'Estructuras de Datos',
      Sorting: 'Ordenamiento',
      Searching: 'Búsqueda',
      Graphs: 'Grafos',
      'Dynamic Programming': 'Programación Dinámica',
      Backtracking: 'Backtracking',
      'Divide and Conquer': 'Divide y Vencerás',
      Math: 'Matemáticas',
    },
  },
}

export function t(locale: Locale, key: keyof Translations): string {
  return translations[locale][key] as string
}

export function getCategoryName(locale: Locale, categoryKey: string): string {
  return translations[locale].categories[categoryKey] || categoryKey
}
