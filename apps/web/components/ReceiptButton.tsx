'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function ReceiptButton({ payment }: { payment: any }) {
  const handleDownloadReceipt = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('Library Payment Receipt', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Receipt No: ${payment.receiptNumber}`, 20, 40);
    doc.text(`Date: ${new Date(payment.paymentDate).toLocaleDateString()}`, 20, 50);
    
    doc.line(20, 55, 190, 55);
    
    doc.text(`Student Name: ${payment.student?.name}`, 20, 70);
    doc.text(`Amount Paid: Rs. ${payment.amount}`, 20, 80);
    doc.text(`Payment Method: ${payment.paymentMethod}`, 20, 90);
    doc.text(`Month Covered: ${new Date(payment.monthCovered).toLocaleDateString('default', { month: 'short', year: 'numeric' })}`, 20, 100);
    
    doc.line(20, 110, 190, 110);
    
    doc.setFontSize(10);
    doc.text('Thank you for your payment!', 105, 120, { align: 'center' });
    doc.text('This is a computer-generated receipt.', 105, 130, { align: 'center' });
    
    doc.save(`Receipt_${payment.receiptNumber}.pdf`);
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleDownloadReceipt}>
      <Download className="h-4 w-4" />
    </Button>
  );
}
