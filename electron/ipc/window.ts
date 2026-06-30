import { ipcMain, BrowserWindow } from 'electron'

interface Chrome {
  bg: string
  symbol: string
}

export function setupWindowIPC(getMainWindow: () => BrowserWindow | null): void {
  ipcMain.on('window:minimize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win && !win.isDestroyed()) win.minimize()
  })

  ipcMain.on('window:maximize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win && !win.isDestroyed()) {
      win.isMaximized() ? win.unmaximize() : win.maximize()
    }
  })

  ipcMain.on('window:close', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win && !win.isDestroyed()) win.close()
  })

  ipcMain.handle('window:is-maximized', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    return win ? win.isMaximized() : false
  })

  ipcMain.handle('window:set-chrome', async (_e: Electron.IpcMainInvokeEvent, chrome: Chrome) => {
    const win = getMainWindow()
    if (!win || win.isDestroyed()) return
    win.setBackgroundColor(chrome.bg)
    try {
      win.setTitleBarOverlay?.({ color: chrome.bg, symbolColor: chrome.symbol, height: 38 })
    } catch {
      /* not available on all platforms */
    }
  })
}
