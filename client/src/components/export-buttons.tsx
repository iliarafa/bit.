import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileText, File } from 'lucide-react';
import { Transaction } from '@/hooks/use-portfolio';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportButtonsProps {
  transactions: Transaction[];
  btcPrice: number | null;
}

export function ExportButtons({ transactions, btcPrice }: ExportButtonsProps) {
  const formatData = () => {
    return transactions.map(t => {
      const cost = t.amount * t.priceAtPurchase;
      const currentVal = btcPrice ? t.amount * btcPrice : 0;
      const pl = t.type === 'buy' ? currentVal - cost : 0;
      
      return {
        Type: t.type === 'buy' ? 'Buy' : 'Send',
        Date: format(new Date(t.date), 'yyyy-MM-dd HH:mm'),
        'Amount (BTC)': t.amount,
        'Price/BTC (USD)': t.priceAtPurchase.toFixed(2),
        'Total Value (USD)': cost.toFixed(2),
        'Current Value (USD)': t.type === 'buy' ? currentVal.toFixed(2) : '-',
        'P/L (USD)': t.type === 'buy' ? pl.toFixed(2) : '-',
      };
    });
  };

  const exportCSV = () => {
    const data = formatData();
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(h => `"${row[h as keyof typeof row]}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `btc-portfolio-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const exportPDF = () => {
    const data = formatData();
    if (data.length === 0) return;
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.setTextColor(247, 147, 26);
    doc.text('Bitcoin Portfolio Report', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${format(new Date(), 'MMMM dd, yyyy HH:mm')}`, 14, 30);
    if (btcPrice) {
      doc.text(`Current BTC Price: $${btcPrice.toLocaleString()}`, 14, 36);
    }
    
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(h => String(row[h as keyof typeof row])));
    
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 42,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [247, 147, 26] },
    });
    
    doc.save(`btc-portfolio-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  if (transactions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 border-primary/20 hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all" 
          data-testid="button-export"
        >
          <Download className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportCSV} className="gap-2 cursor-pointer" data-testid="button-export-csv">
          <FileText className="h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportPDF} className="gap-2 cursor-pointer" data-testid="button-export-pdf">
          <File className="h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
