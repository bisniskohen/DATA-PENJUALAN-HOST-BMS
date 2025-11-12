// Declare global variables from CDN scripts to satisfy TypeScript
declare const XLSX: any;
declare const jspdf: any;

interface SheetData {
    sheetName: string;
    data: any[];
}

/**
 * Exports data to an Excel file with multiple sheets.
 * @param fileName The name of the file (without extension).
 * @param sheets An array of sheet objects, each with a sheetName and data.
 */
export const exportToExcel = (fileName: string, sheets: SheetData[]) => {
    try {
        const wb = XLSX.utils.book_new();
        sheets.forEach(sheet => {
            const ws = XLSX.utils.json_to_sheet(sheet.data);
            XLSX.utils.book_append_sheet(wb, ws, sheet.sheetName);
        });
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    } catch (error) {
        console.error("Error exporting to Excel:", error);
        alert("Gagal mengekspor ke Excel. Silakan periksa konsol untuk detailnya.");
    }
};

/**
 * Exports data to a PDF file.
 * @param title The title of the document.
 * @param headers An array of header rows.
 * @param body An array of data rows.
 * @param fileName The name of the file to save (without extension).
 */
export const exportToPdf = (title: string, headers: string[][], body: any[][], fileName:string) => {
    try {
        const { jsPDF } = jspdf;
        // eslint-disable-next-line new-cap
        const doc = new jsPDF();

        doc.text(title, 14, 15);
        
        // @ts-ignore
        doc.autoTable({
            head: headers,
            body: body,
            startY: 20,
            theme: 'grid',
            styles: {
                fontSize: 8
            },
            headStyles: {
                fillColor: [31, 41, 55] // bg-gray-800
            }
        });

        doc.save(`${fileName}.pdf`);
    } catch (error) {
        console.error("Error exporting to PDF:", error);
        alert("Gagal mengekspor ke PDF. Silakan periksa konsol untuk detailnya.");
    }
};