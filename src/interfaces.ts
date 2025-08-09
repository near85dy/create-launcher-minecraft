export interface Version {
  id: string;
  type: string;
  url: string;
  time: string;
  releaseTime: string;
}

export interface VersionList {
  latest: { release: string; snapshot: "25w32a" };
  versions: Version[];
}

export interface VersionObjects {
  objects: Record<string, ObjectInfo>;
}

export interface VersionMeta {
  id: string;
  assetIndex: {
    id: string;
    url: string;
  };
  downloads: {
    client: { sha1: string; size: number; url: string };
  };
  javaVersion: {
    component: string;
    majorVersion: number;
  };
  libraries: {
    downloads: {
      artifact: Artifact;
      classifiers: Record<string, Classifier>;
    };
    name: string;
  }[];
}

export interface Artifact {
  path: string;
  sha1: string;
  size: number;
  url: string;
}

export interface Classifier {
  path: string;
  sha1: string;
  size: number;
  url: string;
}

export interface ObjectInfo {
  hash: string;
  size: number;
}

export interface DownloadOptions {
  name: string;
  versionId: string;
}
