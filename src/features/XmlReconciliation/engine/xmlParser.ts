import type { XmlInvoiceRecord } from "../types/reconciliation";

const sanitizeInvoiceNumber = (value: string): string =>
  value.replace(/[^\d]/g, "").replace(/^0+/, "").trim();

const sanitizeCnpj = (value: string): string => value.replace(/\D/g, "").trim();

const extractInvoiceNumberFromChNfe = (chNFe: string): string => {
  const cleanKey = chNFe.replace(/\s+/g, "").trim();

  if (cleanKey.length >= 44) {
    return sanitizeInvoiceNumber(cleanKey.slice(25, 34));
  }

  return "";
};

export const parseXmlFile = async (
  file: File,
): Promise<XmlInvoiceRecord | null> => {
  try {
    const xmlText = await file.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    const nNF = xmlDoc.getElementsByTagName("nNF")[0]?.textContent || "";
    const cnpj = xmlDoc.getElementsByTagName("CNPJ")[0]?.textContent || "";
    const xNome =
      xmlDoc.getElementsByTagName("xNome")[0]?.textContent ||
      xmlDoc.getElementsByTagName("xFant")[0]?.textContent ||
      "";
    const dhEmi = xmlDoc.getElementsByTagName("dhEmi")[0]?.textContent || "";
    const dhEvento =
      xmlDoc.getElementsByTagName("dhEvento")[0]?.textContent || "";
    const chNFe = xmlDoc.getElementsByTagName("chNFe")[0]?.textContent || "";

    const rawInvoiceNumber = nNF || extractInvoiceNumberFromChNfe(chNFe);
    const issuerCnpj = sanitizeCnpj(cnpj);

    if (!rawInvoiceNumber || !issuerCnpj) return null;

    const invoiceNumber = sanitizeInvoiceNumber(rawInvoiceNumber);
    const issueDate = (dhEmi || dhEvento || "").split("T")[0];

    return {
      invoiceNumber,
      issuerCnpj,
      issuerName: xNome.trim().toUpperCase(),
      issueDate,
      fileName: file.name,
      nfeKey: chNFe.trim() || undefined,
      compositeKey: `${invoiceNumber}_${issuerCnpj}`,
    };
  } catch {
    return null;
  }
};
