import { spawn, ChildProcess, execSync } from "child_process";
import path from "path";
import fs from "fs";
import { VersionMeta } from "../../../interfaces";
import { minecraftPath } from "./files";

export interface LaunchOptions {
  username: string;
  versionName: string;
  versionId: string;
  memory: {
    min: string;
    max: string;
  };
  javaPath?: string;
  gameDir?: string;
  customArgs?: string[];
  accessToken?: string;
  uuid?: string;
  clientId?: string;
}

export interface LaunchResult {
  success: boolean;
  process?: ChildProcess;
  error?: string;
}

export namespace Launcher {
  export const findJava = (): string | null => {
    const possiblePaths = [
      process.env.JAVA_HOME,
      "C:\\Program Files\\Common Files\\Oracle\\Java\\javapath",
      "C:\\Program Files\\Java",
      "C:\\Program Files (x86)\\Java",
      "C:\\Program Files\\Eclipse Adoptium",
      "C:\\Program Files\\Eclipse Foundation",
      "C:\\Program Files\\Amazon Corretto",
      "C:\\Program Files\\Microsoft\\jdk",
      "/usr/lib/jvm",
      "/Library/Java/JavaVirtualMachines",
    ];

    // First try to find java.exe directly in PATH
    try {
      const javaPath = execSync("where java", { encoding: "utf8" })
        .trim()
        .split("\n")[0];
      if (javaPath && fs.existsSync(javaPath)) {
        return javaPath;
      }
    } catch {}

    // Then check the possible paths
    for (const basePath of possiblePaths) {
      if (!basePath) continue;

      try {
        // Check for java.exe in bin directory
        const javaPath = path.join(basePath, "bin", "java.exe");
        if (fs.existsSync(javaPath)) {
          return javaPath;
        }

        // Also check for java (without .exe) for Unix-like systems
        const javaPathUnix = path.join(basePath, "bin", "java");
        if (fs.existsSync(javaPathUnix)) {
          return javaPathUnix;
        }
      } catch {}
    }

    return null;
  };

  export const buildClasspath = (
    versionMeta: VersionMeta,
    versionName: string
  ): string => {
    const libraries = versionMeta.libraries
      .map((lib) => {
        const artifact = lib.downloads.artifact;
        if (!artifact) return null;
        return path.join(minecraftPath, "libraries", artifact.path);
      })
      .filter(Boolean);

    console.log(versionName);
    console.log(versionMeta);
    const clientJar = path.join(
      minecraftPath,
      "versions",
      versionName,
      `${versionMeta.id}.jar`
    );
    libraries.push(clientJar);

    return libraries.join(path.delimiter);
  };

  export const buildArguments = (
    versionMeta: VersionMeta,
    options: LaunchOptions
  ): string[] => {
    const javaPath = options.javaPath || findJava();
    if (!javaPath) {
      throw new Error(
        "Java not found. Please install Java or specify a custom path."
      );
    }

    const args: string[] = [
      javaPath,
      `-Xmx${options.memory.max}`,
      `-Xms${options.memory.min}`,
      "-Djava.library.path=" +
        path.join(minecraftPath, "versions", options.versionName, "natives"),
      "-cp",
      buildClasspath(versionMeta, options.versionName),
      "net.minecraft.client.main.Main",
      "--username",
      options.username,
      "--version",
      options.versionId,
      "--gameDir",
      path.join(minecraftPath),
      "--assetsDir",
      path.join(minecraftPath, "assets"),
      "--assetIndex",
      versionMeta.assetIndex.id,
    ];

    // Add authentication parameters if provided
    if (options.accessToken) {
      args.push("--accessToken", options.accessToken);
    }
    if (options.uuid) {
      args.push("--uuid", options.uuid);
    }
    if (options.clientId) {
      args.push("--clientId", options.clientId);
    }

    if (options.customArgs) {
      args.push(...options.customArgs);
    }

    return args;
  };

  export const launchGame = async (
    versionMeta: VersionMeta,
    options: LaunchOptions
  ): Promise<LaunchResult> => {
    try {
      const args = buildArguments(versionMeta, options);
      const cwd =
        options.gameDir ||
        path.join(minecraftPath, "versions", options.versionName);

      if (!fs.existsSync(cwd)) {
        fs.mkdirSync(cwd, { recursive: true });
      }

      if (!args[0]) {
        throw new Error("Invalid launch arguments: command is undefined");
      }

      const process = spawn(args[0], args.slice(1), {
        cwd,
        stdio: ["pipe", "pipe", "pipe"],
      });

      console.log(args);
      console.log(cwd);
      process.stdout?.on("data", (data) => {
        console.log("Minecraft:", data.toString());
      });

      process.stderr?.on("data", (data) => {
        console.error("Minecraft Error:", data.toString());
      });

      process.on("close", (code) => {
        console.log(`Minecraft process exited with code ${code}`);
      });

      return {
        success: true,
        process,
      };
    } catch (error) {
      console.log(error);

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };
}
