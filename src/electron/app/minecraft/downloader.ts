import path, { dirname } from "path";
import fs from "fs";
import { Classifier, VersionMeta, VersionObjects } from "../../../interfaces";
import { createDir, fileExist, loadFile, minecraftPath } from "./files";
import { pipeline } from "stream/promises";
import AdmZip from "adm-zip";

export namespace Downloader {
  export const downloadAssets = async (assetIndexUrl: string, id: string) => {
    try {
      const data = await fetch(assetIndexUrl);
      const assetsIndex: VersionObjects = await data.json();

      await createDir(path.join(minecraftPath, "assets", "indexes"));
      await loadFile(
        assetIndexUrl,
        path.join("assets", "indexes", `${id}.json`)
      );

      if (!assetsIndex.objects) {
        console.error("No objects found in assets index");
        return;
      }

      for (const [assetName, assetInfo] of Object.entries(
        assetsIndex.objects
      )) {
        const hash = assetInfo.hash;
        const twoHash = hash.substring(0, 2);
        const assetUrl = `https://resources.download.minecraft.net/${hash.substring(
          0,
          2
        )}/${hash}`;

        const assetPath = path.join(
          minecraftPath,
          "assets",
          "objects",
          twoHash
        );
        await createDir(assetPath);

        const response = await fetch(assetUrl);
        const filePath = path.join(assetPath, hash);
        const fileStream = fs.createWriteStream(filePath);
        if (response.body) {
          await pipeline(response.body, fileStream);
        }
      }
    } catch (error) {
      console.error("Error downloading assets:", error);
      throw error;
    }
  };

  export const downloadLibraries = async (
    versionMeta: VersionMeta,
    name: string
  ) => {
    for (let i = 0; i < versionMeta.libraries.length; i++) {
      const artifact = versionMeta.libraries[i]?.downloads.artifact;

      try {
        const classifier =
          versionMeta.libraries[i]?.downloads.classifiers["natives-windows"];
        if (classifier) await downloadNative(classifier, versionMeta.id);
      } catch {}

      if (!artifact) {
        continue;
      }

      const artifactPath = artifact.path;
      const artifactUrl = artifact.url;
      const fullLibraryPath = path.join("libraries", artifactPath);

      if (await fileExist(fullLibraryPath)) continue;

      const libraryDir = path.dirname(fullLibraryPath);
      await createDir(libraryDir);

      const response = await fetch(artifactUrl);
      const fileStream = fs.createWriteStream(fullLibraryPath);
      if (response.body) {
        await pipeline(response.body, fileStream);
      }
    }
  };

  export const downloadVersion = async (
    versionMeta: VersionMeta,
    versionName: string
  ) => {
    const url = versionMeta.downloads.client.url;
    const versionId = versionMeta.id;
    const versionPath = path.join("versions", versionName);

    if (!(await fileExist(versionPath))) {
      await createDir(path.join(minecraftPath, versionPath));
      await loadFile(url, path.join(versionPath, versionId + ".jar"));
    }
  };
}

export const downloadNative = async (classifier: Classifier, name: string) => {
  const nativesPath = path.join("versions", name, "natives");
  const globalFilePath = path.join(minecraftPath, nativesPath, "temp.zip");
  const extractPath = path.join(minecraftPath, nativesPath);
  const url = classifier.url;

  if (!(await fileExist(nativesPath)))
    await createDir(path.join(minecraftPath, nativesPath));

  await loadFile(url, path.join(nativesPath, "temp.zip"));

  console.log("Extracting to:", extractPath);

  const archive = new AdmZip(globalFilePath);
  archive.extractAllTo(extractPath, true);

  await fs.promises.unlink(globalFilePath);
};
