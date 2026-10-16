const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('lumaApp', {
  version: '0.2.0',
  desktop: true,
  launch: options => ipcRenderer.invoke('luma:launch', options),
  openGameFolder: () => ipcRenderer.invoke('luma:openGameFolder'),
  openExternal: url => ipcRenderer.invoke('luma:openExternal', url),
  onStatus: callback => ipcRenderer.on('launcher-status', (_event, data) => callback(data))
});
