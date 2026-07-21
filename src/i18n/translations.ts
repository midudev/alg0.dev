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
    siteTitle: 'alg0.dev - Algorithm Visualizer',
    siteDescription:
      'A modern, interactive algorithm visualizer. Learn algorithms through beautiful step-by-step visualizations.',

    welcomeTitle: 'Welcome to alg0.dev',
    welcomeDescription:
      'Select an algorithm from the sidebar to start visualizing.\nWatch algorithms come to life with step-by-step animations.',
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

    notFoundTitle: '404 — Page not found',
    notFoundDescription: "The page you're looking for doesn't exist or has been moved.",
    backToHome: 'Back to home',

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
    siteTitle: 'alg0.dev - Visualizador de Algoritmos',
    siteDescription:
      'Un visualizador de algoritmos moderno e interactivo. Aprende algoritmos con hermosas visualizaciones paso a paso.',

    welcomeTitle: 'Bienvenido a alg0.dev',
    welcomeDescription:
      'Selecciona un algoritmo de la barra lateral para comenzar a visualizar.\nObserva cómo los algoritmos cobran vida con animaciones paso a paso.',
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

    notFoundTitle: '404 — Página no encontrada',
    notFoundDescription: 'Lo sentimos, no pudimos encontrar la página que estás buscando.',
    backToHome: 'Volver al inicio',

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
