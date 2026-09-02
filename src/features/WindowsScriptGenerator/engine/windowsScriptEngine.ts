import type {
  GeneratedShellScript,
  ShellScriptCriteria,
} from "../types/windowsScriptGenerator";

const quotePowerShell = (value: string) => value.replace(/'/g, "''");
const ensureXmlExtension = (fileName: string) =>
  fileName.toLowerCase().endsWith(".xml") ? fileName : `${fileName}.xml`;

export const generateWindowsCopyScript = (
  criteria: ShellScriptCriteria,
): GeneratedShellScript => {
  const sourcePath = criteria.sourcePath.trim();
  const destinationPath = criteria.destinationPath.trim();
  const fileNames = criteria.fileNames
    .map((fileName) => fileName.trim())
    .filter(Boolean);
  const normalizedFileNames = fileNames.map(ensureXmlExtension);
  const isReady = Boolean(
    sourcePath && destinationPath && normalizedFileNames.length,
  );

  if (!isReady) {
    return { content: "", isReady: false };
  }

  const content = [
    `$SourceDir = '${quotePowerShell(sourcePath)}'`,
    `$DestDir = '${quotePowerShell(destinationPath)}'`,
    "$files = @(",
    ...normalizedFileNames.map(
      (fileName) => `    '${quotePowerShell(fileName)}'`,
    ),
    ")",
    "$copiedCount = 0",
    "$missingCount = 0",
    "$failedCount = 0",
    "",
    "$confirmation = (Read-Host \"Tem certeza que deseja mover os arquivos da pasta [$SourceDir] para a pasta [$DestDir] yes/y/No?\").Trim()",
    "if ($confirmation -notin @('yes', 'y')) {",
    '    Write-Host "Operacao cancelada." -ForegroundColor Yellow',
    "    exit 0",
    "}",
    "",
    "foreach ($fileName in $files) {",
    "    $sourceFile = Join-Path -Path $SourceDir -ChildPath $fileName",
    "    if (Test-Path -Path $sourceFile) {",
    "        $targetFile = Join-Path -Path $DestDir -ChildPath $fileName",
    "        $resolvedTarget = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($targetFile)",
    "",
    "        if ([System.IO.File]::Exists($resolvedTarget)) {",
    '            Write-Host "[WARNING] File \'$fileName\' already exists at destination. Generating new name..." -ForegroundColor Yellow',
    "            $baseName = [System.IO.Path]::GetFileNameWithoutExtension($fileName)",
    "            $extension = [System.IO.Path]::GetExtension($fileName)",
    "            $counter = 1",
    "            while ([System.IO.File]::Exists($resolvedTarget)) {",
    '                $dots = "." * $counter',
    '                $newName = "${baseName}${dots}${extension}"',
    "                $targetFile = Join-Path -Path $DestDir -ChildPath $newName",
    "                $resolvedTarget = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($targetFile)",
    "                $counter++",
    "            }",
    "        }",
    "",
    "        $resolvedSource = (Get-Item -LiteralPath $sourceFile).FullName",
    "        try {",
    "            [System.IO.File]::Copy($resolvedSource, $resolvedTarget, $true)",
    '            Write-Host "[SUCCESS] Copied: $([System.IO.Path]::GetFileName($targetFile))" -ForegroundColor Green',
    "            $copiedCount++",
    "        } catch {",
    '            Write-Host "[ERROR] Failed to copy ${fileName}: $($_.Exception.Message)" -ForegroundColor Red',
    "            $failedCount++",
    "        }",
    "    } else {",
    '        Write-Host "[ERROR] File not found in SOURCE: $fileName" -ForegroundColor Red',
    "        $missingCount++",
    "    }",
    "}",
    "",
    "if (($missingCount + $failedCount) -gt 0) {",
    "    exit 1",
    "}",
    "exit 0",
  ].join("\n");

  return { content, isReady: true };
};
