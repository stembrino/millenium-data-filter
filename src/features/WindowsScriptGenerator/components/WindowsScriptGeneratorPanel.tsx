import type { ChangeEvent } from "react";
import { useState } from "react";
import { useWindowsScriptGenerator } from "../hooks/useWindowsScriptGenerator";

function WindowsScriptGeneratorPanel() {
  const { criteria, generatedScript, updateCriteria, updateFileNames } =
    useWindowsScriptGenerator();
  const [copyFeedback, setCopyFeedback] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  const handleChange =
    (field: "sourcePath" | "destinationPath") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      updateCriteria(field, event.target.value);
    };

  const handleCopy = async () => {
    if (!generatedScript.isReady) return;

    try {
      await navigator.clipboard.writeText(generatedScript.content);
      setCopyFeedback("copied");
      window.setTimeout(() => setCopyFeedback("idle"), 2000);
    } catch {
      setCopyFeedback("error");
    }
  };

  const handleDownload = () => {
    if (!generatedScript.isReady) return;

    let utf16Content = "";
    for (let index = 0; index < generatedScript.content.length; index += 1) {
      const codeUnit = generatedScript.content.charCodeAt(index);
      utf16Content += String.fromCharCode(codeUnit & 0xff, codeUnit >> 8);
    }

    const encodedCommand = btoa(utf16Content);
    const commandScript = [
      "@echo off",
      "setlocal",
      "powershell.exe -NoProfile -ExecutionPolicy Bypass -EncodedCommand " +
        encodedCommand,
      "exit /b %ERRORLEVEL%",
    ].join("\r\n");
    const scriptBlob = new Blob([commandScript], {
      type: "application/bat;charset=utf-8",
    });
    const downloadUrl = URL.createObjectURL(scriptBlob);
    const downloadLink = document.createElement("a");

    downloadLink.href = downloadUrl;
    downloadLink.download = "copiar-arquivos-xml.cmd";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="m-[24px]">
          <section className="bg-white p-6 shadow-sm">
            <div className="mb-6"></div>
            <div className="space-y-5">
              <label className="block text-sm font-semibold text-slate-700">
                Source folder
                <input
                  value={criteria.sourcePath}
                  onChange={handleChange("sourcePath")}
                  placeholder={String.raw`C:\Files\Source`}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-mono text-sm font-normal text-slate-900 outline-none transition focus:border-[#5a7dff] focus:ring-2 focus:ring-[#5a7dff]/20"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Destination folder
                <input
                  value={criteria.destinationPath}
                  onChange={handleChange("destinationPath")}
                  placeholder={String.raw`C:\Files\Destination`}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-mono text-sm font-normal text-slate-900 outline-none transition focus:border-[#5a7dff] focus:ring-2 focus:ring-[#5a7dff]/20"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Files to copy
                <textarea
                  value={criteria.fileNames.join("\n")}
                  onChange={(event) => updateFileNames(event.target.value)}
                  placeholder={"1207\n1256\n1255"}
                  rows={5}
                  className="mt-2 w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 font-mono text-sm font-normal text-slate-900 outline-none transition focus:border-[#5a7dff] focus:ring-2 focus:ring-[#5a7dff]/20"
                />
                <span className="mt-1 block text-xs font-normal text-slate-500">
                  Um nome por linha. A extensão .xml será adicionada
                  automaticamente.
                </span>
              </label>
            </div>
          </section>
          <section className="bg-slate-950 p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Script draft
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Preview for the current criteria.
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  generatedScript.isReady
                    ? "bg-emerald-400/15 text-emerald-300"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {generatedScript.isReady ? "Ready" : "Waiting"}
              </span>
            </div>
            <pre className="min-h-64 overflow-x-auto rounded-lg border border-slate-800 bg-slate-900 p-4 font-mono text-xs leading-6 text-slate-300">
              {generatedScript.content ||
                "Enter a source and destination folder to preview the script."}
            </pre>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!generatedScript.isReady}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {copyFeedback === "copied"
                  ? "Copiado"
                  : copyFeedback === "error"
                    ? "Falha ao copiar"
                    : "Copiar script"}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={!generatedScript.isReady}
                className="rounded-lg bg-[#5a7dff] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4563e8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Baixar arquivo .cmd
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default WindowsScriptGeneratorPanel;
