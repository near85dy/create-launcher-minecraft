import { DownloadOptions, Version, VersionMeta } from "../../../interfaces";
import { Downloader } from "./downloader";
import { minecraftExist, createMinecraftFiles } from "./files";
import { getVersionMeta } from "./versions";
import { Launcher, LaunchOptions, LaunchResult } from "./launcher";

export { getAviableVersions } from "./versions";
export type { LaunchOptions, LaunchResult } from "./launcher";

export namespace Minecraft {
  export const initialize = async () => {
    if (!(await minecraftExist())) await createMinecraftFiles();
    const versionMeta: VersionMeta = await getVersionMeta("1.12.2");
  };

  export const downloadMinecraft = async (options: DownloadOptions) => {
    const versionMeta: VersionMeta = await getVersionMeta(options.versionId);
    await Downloader.downloadAssets(
      versionMeta.assetIndex.url,
      versionMeta.assetIndex.id
    );
    await Downloader.downloadVersion(versionMeta, options.name);
    await Downloader.downloadLibraries(versionMeta, options.name);
  };

  export const launchMinecraft = async (options: LaunchOptions) => {
    const versionMeta: VersionMeta = await getVersionMeta(options.versionId);
    await Launcher.launchGame(versionMeta, options);
  };
}
