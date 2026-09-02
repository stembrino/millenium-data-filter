import { describe, expect, it } from "vitest";
import { generateWindowsCopyScript } from "../engine/windowsScriptEngine";

describe("generateWindowsCopyScript", () => {
  it("generates the PowerShell script and defaults names to XML", () => {
    const result = generateWindowsCopyScript({
      sourcePath: String.raw`C:\Files\Source`,
      destinationPath: String.raw`C:\Files\Destination`,
      fileNames: ["invoice", "report.xml"],
    });

    expect(result.isReady).toBe(true);
    expect(result.content).toContain("'invoice.xml'");
    expect(result.content).toContain("'report.xml'");
    expect(result.content).toContain("foreach ($fileName in $files)");
    expect(result.content).toContain("[System.IO.File]::Exists($win32Target)");
    expect(result.content).toContain(
      "[System.IO.File]::Copy($win32Source, $win32Target, $true)",
    );
    expect(result.content).toContain('$dots = "." * $counter');
    expect(result.content).toContain("$copiedCount++");
    expect(result.content).toContain("$missingCount++");
  });

  it("waits for both folders before generating a script", () => {
    const result = generateWindowsCopyScript({
      sourcePath: "",
      destinationPath: String.raw`C:\Files\Destination`,
      fileNames: ["invoice.csv"],
    });

    expect(result).toEqual({ content: "", isReady: false });
  });
});
