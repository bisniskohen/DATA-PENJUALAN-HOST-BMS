import React, { useState, useMemo, useCallback } from 'react';
import { Host, MonthlyTarget } from '../types';
import Card from '../components/Card';
import ExportButtons from '../components/ExportButtons';
import { exportToExcel, exportToPdf } from '../utils/exportUtils';
import { useAppContext } from '../contexts/AppContext';

const TargetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>;


const TargetSetting: React.FC = () => {
    const { state, setState } = useAppContext();
    const { hosts, monthlyTargets } = state;
    
    const [hostId, setHostId] = useState('');
    const [target, setTarget] = useState('');
    const [prize, setPrize] = useState('');
    const [error, setError] = useState('');

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const monthName = today.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

    const handleNumericChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/\D/g, '');
      setter(rawValue);
    };

    const formatInputValue = (value: string) => {
        if (!value) return '';
        return new Intl.NumberFormat('id-ID').format(Number(value));
    };


    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!hostId || !target || !prize) {
            setError('Semua field harus diisi.');
            return;
        }

        const newTarget: MonthlyTarget = {
            id: `${hostId}-${currentYear}-${currentMonth}`,
            hostId,
            year: currentYear,
            month: currentMonth,
            target: parseFloat(target),
            prize,
        };
        
        setState(prev => ({...prev, monthlyTargets: [...prev.monthlyTargets.filter(t => t.id !== newTarget.id), newTarget]}));

        setHostId('');
        setTarget('');
        setPrize('');
        setError('');

    }, [hostId, target, prize, setState, currentYear, currentMonth]);

    const handleDeleteTarget = (id: string) => {
        setState(prev => ({...prev, monthlyTargets: prev.monthlyTargets.filter(t => t.id !== id)}));
    };
    
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };

    const currentMonthTargets = useMemo(() => {
        return monthlyTargets
            .filter(t => t.month === currentMonth && t.year === currentYear)
            .map(t => ({...t, hostName: hosts.find(h => h.id === t.hostId)?.name || 'N/A' }));
    }, [monthlyTargets, hosts, currentMonth, currentYear]);

    const handlePdfExport = () => {
        const title = `Target Aktif - ${monthName}`;
        const headers = [['Nama Host', 'Target Omset', 'Hadiah']];
        const data = currentMonthTargets.map(t => [t.hostName, formatCurrency(t.target), t.prize]);
        exportToPdf(title, headers, data, `target-aktif-${monthName}`);
    };
    
    const handleExcelExport = () => {
        const dataForExcel = currentMonthTargets.map(t => ({
            'Nama Host': t.hostName,
            'Target Omset': t.target,
            'Hadiah': t.prize
        }));
        exportToExcel(`target-aktif-${monthName}`, [{ sheetName: 'Target Aktif', data: dataForExcel }]);
    };

    return (
        <div className="space-y-8">
            <Card title={`Atur Target Bulanan - ${monthName}`}>
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="host" className="block text-sm font-medium text-gray-300 mb-1">Pilih Host</label>
                            <select id="host" value={hostId} onChange={e => setHostId(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500">
                                <option value="" disabled>-- Pilih Host --</option>
                                {hosts.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="monthlyTarget" className="block text-sm font-medium text-gray-300 mb-1">Target Omset</label>
                            <input id="monthlyTarget" type="text" inputMode="numeric" value={formatInputValue(target)} onChange={handleNumericChange(setTarget)} placeholder="cth: 50.000.000" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"/>
                        </div>
                        <div>
                            <label htmlFor="prize" className="block text-sm font-medium text-gray-300 mb-1">Hadiah</label>
                            <input id="prize" type="text" value={prize} onChange={e => setPrize(e.target.value)} placeholder="cth: iPhone 15 Pro" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"/>
                        </div>
                    </div>
                    {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                    <div className="flex justify-end pt-2">
                        <button type="submit" className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-transform transform hover:scale-105">
                            <TargetIcon /> Set Target
                        </button>
                    </div>
                 </form>
            </Card>

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">{`Target Aktif - ${monthName}`}</h2>
                    <ExportButtons
                        onPdfExport={handlePdfExport}
                        onExcelExport={handleExcelExport}
                        isDisabled={currentMonthTargets.length === 0}
                    />
                </div>
                <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-700/50">
                    <tr>
                        <th className="p-3">Nama Host</th>
                        <th className="p-3 text-right">Target Omset</th>
                        <th className="p-3">Hadiah</th>
                        <th className="p-3 text-right">Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentMonthTargets.length > 0 ? currentMonthTargets.map(t => (
                        <tr key={t.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="p-3 font-medium">{t.hostName}</td>
                        <td className="p-3 text-right font-semibold text-green-400">{formatCurrency(t.target)}</td>
                        <td className="p-3">{t.prize}</td>
                        <td className="p-3 text-right">
                            <button onClick={() => handleDeleteTarget(t.id)} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors" aria-label={`Delete target for ${t.hostName}`}>
                            <TrashIcon />
                            </button>
                        </td>
                        </tr>
                    )) : (
                        <tr>
                        <td colSpan={4} className="text-center p-4 text-gray-400">Belum ada target yang diatur untuk bulan ini.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
            </Card>
        </div>
    );
};

export default TargetSetting;