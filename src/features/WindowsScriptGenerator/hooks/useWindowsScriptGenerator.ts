import { useState } from "react";
import { generateWindowsCopyScript } from "../engine/windowsScriptEngine";
import type { ShellScriptCriteria } from "../types/windowsScriptGenerator";

const initialCriteria: ShellScriptCriteria = {
  sourcePath: "",
  destinationPath: "",
  fileNames: [],
};

export function useWindowsScriptGenerator() {
  const [criteria, setCriteria] = useState<ShellScriptCriteria>(initialCriteria);
  const generatedScript = generateWindowsCopyScript(criteria);

  const updateCriteria = (
    field: "sourcePath" | "destinationPath",
    value: string,
  ) => {
    setCriteria((current) => ({ ...current, [field]: value }));
  };

  const updateFileNames = (value: string) => {
    setCriteria((current) => ({ ...current, fileNames: value.split("\n") }));
  };

  return { criteria, generatedScript, updateCriteria, updateFileNames };
}
