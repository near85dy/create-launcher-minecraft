import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { getAviableVersions, Minecraft } from "./app/minecraft/index";

async function createWindow() {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  await Minecraft.initialize();
  //await Minecraft.downloadMinecraft({ versionId: "1.10", name: "lol" });

  // await Minecraft.launchMinecraft({
  //   username: "Kirills",
  //   versionName: "1.12.2",
  //   versionId: "1.12.2",
  //   memory: { min: "1024M", max: "2048M" },
  //   javaPath:
  //     "C:\\Program Files\\Microsoft\\jdk-17.0.14.7-hotspot\\bin\\java.exe",
  //   accessToken: "dummy_token_for_testing",
  //   uuid: "dummy_uuid_for_testing",
  //   clientId: "dummy_client_id_for_testing",
  // });
  win.loadURL("http://localhost:5173");
}

ipcMain.on("versions", async (event, arg) => {
  const versions = await getAviableVersions();
  event.reply("responseVersions", versions);
});

app.whenReady().then(createWindow);
