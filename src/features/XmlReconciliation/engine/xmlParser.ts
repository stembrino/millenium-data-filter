import type { XmlInvoiceRecord } from "../types/reconciliation";

export const parseXmlFile = async (
  file: File,
): Promise<XmlInvoiceRecord | null> => {
  try {
    const xmlText = await file.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    const nNF =
      xmlDoc.getElementsByTagName("nNF")[0]?.textContent || "";
    const cnpj =
      xmlDoc.getElementsByTagName("CNPJ")[0]?.textContent || "";
    const xNome =
      xmlDoc.getElementsByTagName("xNome")[0]?.textContent || "";

    if (!nNF) return null;

    const cleanInvoiceNumber = nNF.replace(/^0+/, "");
    const cleanIssuer = (cnpj || xNome).trim().toUpperCase();

    return {
      invoiceNumber: cleanInvoiceNumber,
      issuerIdentifier: cleanIssuer,
      fileName: file.name,
      compositeKey: `${cleanInvoiceNumber}_${cleanIssuer}`,
    };
  } catch {
    return null;
  }
};
