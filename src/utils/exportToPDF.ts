
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (elementIds: string[], filename = 'market_analysis') => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  let isFirstPage = true;

  for (const id of elementIds) {
    const element = document.getElementById(id);
    if (!element) continue;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    if (!isFirstPage) {
      pdf.addPage();
    }

    pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
    isFirstPage = false;
  }

  pdf.save(`${filename}.pdf`);
};
