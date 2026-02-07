import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportColumn {
    header: string;
    key: string;
    width?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExportData = Record<string, any>;

/**
 * Export data to Excel (.xlsx) file
 */
export function exportToExcel(
    data: ExportData[],
    columns: ExportColumn[],
    filename: string = 'export'
): void {
    // Create worksheet data with headers
    const headers = columns.map(col => col.header);
    const rows = data.map(item =>
        columns.map(col => {
            const value = item[col.key];
            if (value === null || value === undefined) return '';
            return value;
        })
    );

    const worksheetData = [headers, ...rows];

    // Create workbook and worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    const colWidths = columns.map(col => ({ wch: col.width || 15 }));
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados');

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // Save file
    saveAs(blob, `${filename}_${formatDateForFile()}.xlsx`);
}

/**
 * Export data to PDF file
 */
export function exportToPDF(
    data: ExportData[],
    columns: ExportColumn[],
    title: string = 'Relatório',
    filename: string = 'relatorio'
): void {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 14, 22);

    // Add timestamp
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128);
    doc.text(`Gerado em: ${formatDateTime(new Date())}`, 14, 30);

    // Add table
    const headers = columns.map(col => col.header);
    const rows = data.map(item =>
        columns.map(col => {
            const value = item[col.key];
            if (value === null || value === undefined) return '';
            return String(value);
        })
    );

    autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 38,
        styles: {
            fontSize: 8,
            cellPadding: 3,
        },
        headStyles: {
            fillColor: [59, 130, 246], // Blue-500
            textColor: [255, 255, 255],
            fontStyle: 'bold',
        },
        alternateRowStyles: {
            fillColor: [249, 250, 251], // Gray-50
        },
        margin: { top: 38 },
    });

    // Add footer with page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128);
        doc.text(
            `Página ${i} de ${pageCount} | Hub de Automação - Centro de Comando`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }

    // Save file
    doc.save(`${filename}_${formatDateForFile()}.pdf`);
}

/**
 * Print report directly
 */
export function printReport(
    data: ExportData[],
    columns: ExportColumn[],
    title: string = 'Relatório'
): void {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 14, 22);

    // Add timestamp
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128);
    doc.text(`Gerado em: ${formatDateTime(new Date())}`, 14, 30);

    // Add table
    const headers = columns.map(col => col.header);
    const rows = data.map(item =>
        columns.map(col => {
            const value = item[col.key];
            if (value === null || value === undefined) return '';
            return String(value);
        })
    );

    autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 38,
        styles: {
            fontSize: 8,
            cellPadding: 3,
        },
        headStyles: {
            fillColor: [59, 130, 246],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
        },
        alternateRowStyles: {
            fillColor: [249, 250, 251],
        },
        margin: { top: 38 },
    });

    // Open print dialog
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
}

// Helper functions
function formatDateForFile(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}${month}${day}_${hours}${minutes}`;
}

function formatDateTime(date: Date): string {
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
