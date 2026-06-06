export const sendPDFViaEmail = (email: string, pdfBlob: Blob, fileName: string) => {
  // Create a download link first
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  
  // For email, we'll use mailto with instruction
  const subject = encodeURIComponent(`Mkaazi Navigator: ${fileName}`);
  const body = encodeURIComponent(`I've generated this legal document using Mkaazi Navigator. Please find attached the file. You can download it from the link below once generated.\n\nYou can also download Mkaazi Navigator app for legal help: https://mkaazi-navigator.vercel.app`);
  
  window.open(`mailto:${email}?subject=${subject}&body=${body}`);
  
  // Also trigger download
  link.click();
  URL.revokeObjectURL(url);
};