import React from 'react';
import { jsPDF } from "jspdf";

const PDFExport = ({ data }) => {
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(JSON.stringify(data, null, 2), 10, 10);
    doc.save("financial_analysis.pdf");
  };

  return (
    <button onClick={exportPDF}>Export PDF</button>
  );
};

export default PDFExport;
