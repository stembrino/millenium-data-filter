import { describe, expect, it } from "vitest";
import { generateWindowsMoveScript } from "../engine/windowsScriptEngine";

describe("generateWindowsMoveScript", () => {
  it("generates the PowerShell script and defaults names to XML", () => {
    const result = generateWindowsMoveScript({
      sourcePath: String.raw`C:\Files\Source`,
      destinationPath: String.raw`C:\Files\Destination`,
      fileNames: ["invoice", "report.xml"],
    });

    expect(result.isReady).toBe(true);
    expect(result.content).toContain("'invoice.xml'");
    expect(result.content).toContain("'report.xml'");
    expect(result.content).toContain("foreach ($fileName in $files)");
    expect(result.content).toContain("[System.IO.File]::Exists($resolvedTarget)");
    expect(result.content).toContain(
      "[System.IO.File]::Move($resolvedSource, $resolvedTarget)",
    );
    expect(result.content).toContain("try {");
    expect(result.content).toContain('$failedCount++');
    expect(result.content).toContain("exit 1");
    expect(result.content).toContain(
      '(Read-Host "Tem certeza que deseja mover os arquivos da pasta [$SourceDir] para a pasta [$DestDir] yes/y/No?").Trim()',
    );
    expect(result.content).toContain(
      "if ($confirmation -notin @('yes', 'y'))",
    );
    expect(result.content).toContain('Write-Host "Operacao cancelada."');
    expect(result.content).toContain('$dots = "." * $counter');
    expect(result.content).toContain("$movedCount++");
    expect(result.content).toContain("$missingCount++");
    expect(result.content).toContain('$duplicateCount = 0');
    expect(result.content).toContain(
      '$matchingFiles = @(Get-ChildItem -LiteralPath $SourceDir -File | Where-Object { $_.Name -match $duplicatePattern })',
    );
    expect(result.content).toContain("if ($matchingFiles.Count -gt 1)");
    expect(result.content).toContain(
      'AVISO: O arquivo $baseName esta repetido $($matchingFiles.Count) vezes, nao sera movido.',
    );
    expect(result.content).toContain("$duplicateCount++");
    expect(result.content).toContain("continue");
  });

  it("waits for both folders before generating a script", () => {
    const result = generateWindowsMoveScript({
      sourcePath: "",
      destinationPath: String.raw`C:\Files\Destination`,
      fileNames: ["invoice.csv"],
    });

    expect(result).toEqual({ content: "", isReady: false });
  });
});
