import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import log from 'electron-log'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function setupAutoUpdate(): void {
  autoUpdater.logger = log
  ;(autoUpdater.logger as typeof log).transports.file.level = 'info'

  autoUpdater.autoDownload = true
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('checking-for-update', () => {
    log.info('[updater] checking-for-update')
  })

  autoUpdater.on('update-available', (info) => {
    log.info('[updater] update-available', info.version)
    dialog.showMessageBox({
      type: 'info',
      title: 'Update available',
      message: `Version ${info.version} is available. Downloading now...`
    })
  })

  autoUpdater.on('download-progress', (progressObj) => {
    log.info(
      `[updater] download ${progressObj.percent.toFixed(1)}% (${(progressObj.bytesPerSecond / 1024 / 1024).toFixed(2)} MB/s)`
    )
    if (mainWindow) mainWindow.setProgressBar(progressObj.percent / 100)
  })

  autoUpdater.on('update-downloaded', (info) => {
    log.info('[updater] update-downloaded', info.version)
    if (mainWindow) mainWindow.setProgressBar(-1)

    dialog
      .showMessageBox({
        type: 'info',
        title: 'Update ready',
        message: `Version ${info.version} downloaded successfully.\nRestart now to install?`,
        buttons: ['Restart now', 'Later']
      })
      .then((result) => {
        if (result.response === 0) autoUpdater.quitAndInstall(false, true)
      })
  })

  autoUpdater.on('update-not-available', () => {
    log.info('[updater] update-not-available')
  })

  autoUpdater.on('error', (err) => {
    log.error('[updater] error', err)
    dialog.showMessageBox({
      type: 'error',
      title: 'Update error',
      message: String(err)
    })
  })

  autoUpdater.checkForUpdates()
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.jy465.tomototasks')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  if (!is.dev) {
    setupAutoUpdate()
  } else {
    log.info('[updater] skipped in development mode')
  }

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})