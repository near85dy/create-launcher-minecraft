import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";

function createWindow() {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadFile("../react/index.html");
}

console.log(123);

ipcMain.on("ping", (event, arg) => {
  console.log("Получено сообщение от React:", arg);
  // Отправляем ответ обратно в renderer процесс
  event.reply("pong", "Ответ от main процесса");
});

app.whenReady().then(createWindow);
