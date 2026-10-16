const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const { spawn } = require('node:child_process');
const { Client, Authenticator } = require('minecraft-launcher-core');

let win;
const launcher = new Client();
const gameRoot = path.join(app.getPath('userData'), 'minecraft');
function createWindow() {
  win = new BrowserWindow({
    width: 1440, height: 920, minWidth: 980, minHeight: 680,
    backgroundColor: '#f4f7f4',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false }
  });
  win.loadFile(path.join(__dirname, 'index.html'));
  launcher.on('debug', message => sendStatus('debug', String(message)));
  launcher.on('data', message => sendStatus('data', String(message)));
  launcher.on('progress', progress => sendStatus('progress', progress));
  launcher.on('close', () => sendStatus('close', 'Minecraft завершил работу.'));
}
function sendStatus(type, message) { if (win && !win.isDestroyed()) win.webContents.send('launcher-status', { type, message }); }

ipcMain.handle('luma:launch', async (_event, options) => {
  const name = String(options?.username || '').trim();
  const version = String(options?.version || '1.21.8');
  const memory = Math.max(1, Math.min(32, Number(options?.memory) || 4));
  const loader = String(options?.loader || 'vanilla');
  if (!/^[A-Za-z0-9_]{3,16}$/.test(name)) throw new Error('Для офлайн-запуска нужен ник из 3–16 латинских букв, цифр или _.');
  if (!/^\d+\.\d+(\.\d+)?$/.test(version)) throw new Error('Пока поддерживаются только конкретные релизные версии, например 1.21.8.');
  if (loader !== 'vanilla') throw new Error('В этой сборке реальный запуск пока поддерживает только Vanilla. Загрузчики Fabric/Forge/NeoForge будут добавлены следующим этапом.');
  fs.mkdirSync(gameRoot, { recursive: true });
  sendStatus('status', `Подготовка Minecraft ${version}…`);
  try {
    await launcher.launch({
      authorization: Authenticator.getAuth(name),
      root: gameRoot,
      version: { number: version, type: 'release' },
      memory: { max: `${memory}G`, min: '1G' },
      javaPath: undefined,
      customArgs: ['-XX:+UseG1GC']
    });
    return { ok: true, message: `Запуск Minecraft ${version} начат.` };
  } catch (err) {
    sendStatus('error', err.message || String(err));
    throw new Error(err.message || String(err));
  }
});

ipcMain.handle('luma:openGameFolder', async () => {
  fs.mkdirSync(gameRoot, { recursive: true });
  await shell.openPath(gameRoot);
  return gameRoot;
});
ipcMain.handle('luma:openExternal', async (_event, url) => {
  if (typeof url === 'string' && /^https:\/\//i.test(url)) await shell.openExternal(url);
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (!BrowserWindow.getAllWindows().length) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
