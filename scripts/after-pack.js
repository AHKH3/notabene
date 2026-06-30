/**
 * afterPack hook — runs after electron-builder unpacks the app but BEFORE
 * the installer is created. Embeds the custom icon into the .exe via rcedit.
 */
const path = require('path')
const { execFileSync } = require('child_process')

exports.default = async function afterPack(context) {
  if (context.electronPlatformName !== 'win32') return

  const exeName = `${context.packager.appInfo.productName}.exe`
  const exePath = path.join(context.appOutDir, exeName)
  const rceditExe = path.resolve(__dirname, '..', 'node_modules', 'rcedit', 'bin', 'rcedit-x64.exe')
  const iconPath = path.resolve(__dirname, '..', 'resources', 'icon.ico')

  console.log(`[afterPack] embedding icon into ${exeName} …`)

  execFileSync(rceditExe, [
    exePath,
    '--set-icon', iconPath,
    '--set-version-string', 'FileDescription', 'Notabene — Think in the margin',
    '--set-version-string', 'ProductName', 'Notabene',
    '--set-version-string', 'CompanyName', 'Notabene',
    '--set-file-version', '0.1.0.0',
    '--set-product-version', '0.1.0.0',
    '--set-requested-execution-level', 'asInvoker',
  ])

  console.log('[afterPack] icon embedded successfully.')
}
