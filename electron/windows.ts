import { BrowserWindow, app } from 'electron'
import * as path from 'path'

const RENDERER_URL = 'http://localhost:3000/app'
const RENDERER_OUT = path.join(__dirname, '..', '..', 'out', 'app')

const APP_ICON = app.isPackaged
  ? path.join(process.resourcesPath, 'icon.png')
  : path.join(__dirname, '..', '..', 'resources', 'icon.png')

export function createMainWindow(isDev: boolean): BrowserWindow {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 500,
    icon: APP_ICON,
    backgroundColor: '#100e0c',
    frame: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload', 'index.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  })

  if (isDev) {
    win.loadURL(RENDERER_URL)
    win.webContents.openDevTools({ mode: 'detach' })
  } else {
    win.loadFile(path.join(RENDERER_OUT, 'index.html'))
  }

  win.once('ready-to-show', () => win.show())

  // Sync maximize/restore state to renderer
  win.on('maximize', () => {
    win.webContents.send('window:maximized', true)
  })
  win.on('unmaximize', () => {
    win.webContents.send('window:maximized', false)
  })

  return win
}
