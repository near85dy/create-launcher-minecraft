import { VersionList, VersionMeta } from "../../../interfaces";

import path from "path";
import fs from "fs";
import { minecraftExist } from "./files";

let manifestURL: string =
  "https://launchermeta.mojang.com/mc/game/version_manifest.json";

export const getAviableVersions = async (): Promise<VersionList> => {
  const response = await fetch(manifestURL);
  const data: VersionList = await response.json();
  return data;
};

export const getVersionMeta = async (
  versionId: string
): Promise<VersionMeta> => {
  const manifest: VersionList = await getAviableVersions();
  const version = manifest.versions.find((v) => v.id === versionId);
  if (!version) throw new Error("Версия не найдена");

  const versionData = await fetch(version.url);
  const versionJson = await versionData.json();

  return versionJson;
};

export const launchVersion = async (versionId: string) => {};
