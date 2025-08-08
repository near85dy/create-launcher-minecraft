import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  sendMessage: (channel: string, data: unknown) =>
    ipcRenderer.send(channel, data),
  onMessage: (channel: string, callback: (...args: unknown[]) => void) => {
    ipcRenderer.on(channel, (_event, ...args) => callback(...args));
  },
  removeListener: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  },
});
