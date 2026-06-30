import { app, BrowserWindow } from 'electron'
import { createMainWindow } from './windows'
import { setupWindowIPC } from './ipc/window'

const isDev = process.env.NODE_ENV === 'development'

let mainWindow: BrowserWindow | null = null

app.whenReady().then(() => {
  app.setAppUserModelId('com.notabene.app')

  mainWindow = createMainWindow(isDev)
  setupWindowIPC(() => mainWindow)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow(isDev)
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
