import path, { dirname } from "path";
import fs from "fs";
import { folders } from "../../shared";
import { app } from "electron";
import { pipeline } from "stream/promises";

export const minecraftPath: string = path.join("E:", ".minecraft");

export const createDir = async (folderPath: string) => {
  await fs.promises.mkdir(folderPath, { recursive: true });
};

export const createMinecraftFiles = async () => {
  try {
    await Promise.all(
      folders.map(async (folder) => {
        const fullPath = path.join(minecraftPath, folder);
        await fs.promises.mkdir(fullPath, { recursive: true });
      })
    );
  } catch (err) {
    throw err;
  }
};

export const minecraftExist = async () => {
  try {
    const exists = await fs.promises.stat(minecraftPath);
    return exists;
  } catch (err) {
    console.error("Error checking Minecraft path:", err);
    return false;
  }
};

export const fileExist = async (_path: string) => {
  try {
    const fullPath = path.join(minecraftPath, _path);
    await fs.promises.stat(fullPath);
    return true;
  } catch (err) {
    return false;
  }
};

export const loadFile = async (url: string, _path: string) => {
  const fullpath = path.join(minecraftPath, _path);
  console.log(fullpath);
  if (await fileExist(_path)) return;
  const response = await fetch(url);
  const fileStream = await fs.createWriteStream(fullpath);
  if (response.body) {
    await pipeline(response.body, fileStream);
  }
};
