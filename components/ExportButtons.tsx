import React from 'react';

const FileDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><path d="M12 17V3"/><path d="m6 11 6 6 6-6"/><path d="M19 21H5"/></svg>;

interface ExportButtonsProps {
    onPdfExport: () => void;
    onExcelExport: () => void;
    isDisabled?: boolean;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ onPdfExport, onExcelExport, isDisabled = false }) => {
    return (
        <div className="flex gap-2">
            <button
                onClick={onPdfExport}
                disabled={isDisabled}
                className="flex items-center text-sm bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-3 rounded-md transition-colors"
                title={isDisabled ? 'Tidak ada data untuk diekspor' : 'Ekspor ke PDF'}
            >
                <FileDownIcon /> PDF
            </button>
            <button
                onClick={onExcelExport}
                disabled={isDisabled}
                className="flex items-center text-sm bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-3 rounded-md transition-colors"
                title={isDisabled ? 'Tidak ada data untuk diekspor' : 'Ekspor ke Excel'}
            >
                <FileDownIcon /> Excel
            </button>
        </div>
    );
};

export default ExportButtons;
