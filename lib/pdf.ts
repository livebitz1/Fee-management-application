import { domToPng } from "modern-screenshot";
import jsPDF from "jspdf";

export async function downloadReceipt(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // We capture at high scale for clarity
    const dataUrl = await domToPng(element, {
      scale: 3,
      backgroundColor: "#ffffff",
      quality: 1,
    });

    const img = new Image();
    img.src = dataUrl;
    
    await new Promise((resolve) => (img.onload = resolve));

    // A4 dimensions in points (pt)
    const pdfWidth = 595.28;
    const pdfHeight = 841.89;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    // Calculate image dimensions to fit A4 while maintaining aspect ratio
    const imgProps = pdf.getImageProperties(dataUrl);
    const ratio = imgProps.width / imgProps.height;
    
    // Fill the width of the PDF with some margin
    const margin = 40;
    const width = pdfWidth - (margin * 2);
    const height = width / ratio;

    pdf.addImage(dataUrl, "PNG", margin, margin, width, height);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Modern PDF Generation Error:", error);
    throw new Error("Failed to generate PDF");
  }
}
