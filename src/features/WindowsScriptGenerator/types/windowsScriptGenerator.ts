export interface ShellScriptCriteria {
  sourcePath: string;
  destinationPath: string;
  fileNames: string[];
}

export interface GeneratedShellScript {
  content: string;
  isReady: boolean;
}
