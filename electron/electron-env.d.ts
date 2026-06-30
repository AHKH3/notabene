interface ElectronAPI {
  minimizeWindow: () => void
  maximizeWindow: () => void
  closeWindow: () => void
  isMaximized: () => Promise<boolean>
  onMaximizedChange: (callback: (maximized: boolean) => void) => () => void
  setWindowChrome: (chrome: { bg: string; symbol: string }) => Promise<void>
}

interface Window {
  electronAPI?: ElectronAPI
}
