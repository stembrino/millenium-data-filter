import type { XmlInvoiceRecord } from "../types/reconciliation";

const sanitizeInvoiceNumber = (value: string): string =>
  value.replace(/[^\d]/g, "").replace(/^0+/, "").trim();

const sanitizeCnpj = (value: string): string => value.replace(/\D/g, "").trim();

export const parseXmlFile = async (
  file: File,
): Promise<XmlInvoiceRecord | null> => {
  try {
    const xmlText = await file.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    const nNF = xmlDoc.getElementsByTagName("nNF")[0]?.textContent || "";
    const cnpj = xmlDoc.getElementsByTagName("CNPJ")[0]?.textContent || "";
    const xNome = xmlDoc.getElementsByTagName("xNome")[0]?.textContent || "";
    const dhEmi = xmlDoc.getElementsByTagName("dhEmi")[0]?.textContent || "";
    const chNFe = xmlDoc.getElementsByTagName("chNFe")[0]?.textContent || "";

    if (!nNF || !cnpj) return null;

    const invoiceNumber = sanitizeInvoiceNumber(nNF);
    const issuerCnpj = sanitizeCnpj(cnpj);
    const issueDate = dhEmi ? dhEmi.split("T")[0] : "";

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
