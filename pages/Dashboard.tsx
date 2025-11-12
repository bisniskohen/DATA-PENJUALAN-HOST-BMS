import React, { useMemo, useEffect, useState } from 'react';
import { Host, SaleRecord, MonthlyTarget } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

const TrophyIcon = ({ className = "" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 ${className}`}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.87 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.13 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;

const Dashboard: React.FC = () => {
    const [hosts] = useLocalStorage<Host[]>('hosts', []);
    const [sales] = useLocalStorage<SaleRecord[]>('sales', []);
    const [monthlyTargets] = useLocalStorage<MonthlyTarget[]>('monthlyTargets', []);
    const [isMounted, setIsMounted] = useState(false);
    const [selectedHostId, setSelectedHostId] = useState<string>('');

    useEffect(() => {
        // Trigger animations on component mount
        const timer = setTimeout(() => setIsMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const dashboardData = useMemo(() => {
        const currentMonthTargets = monthlyTargets.filter(t => t.month === currentMonth && t.year === currentYear);

        if (currentMonthTargets.length === 0) return [];

        return currentMonthTargets.map(targetInfo => {
            const host = hosts.find(h => h.id === targetInfo.hostId);
            if (!host) return null;

            const hostSales = sales.filter(sale => {
                const saleDate = new Date(sale.date);
                return sale.hostId === host.id && saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
            });

            const totalOmset = hostSales.reduce((acc, sale) => acc + (sale.finalSales - sale.initialSales), 0);
            const progress = targetInfo.target > 0 ? (totalOmset / targetInfo.target) * 100 : 0;

            return {
                hostId: host.id,
                hostName: host.name,
                totalOmset,
                target: targetInfo.target,
                prize: targetInfo.prize,
                progress: Math.min(progress, 100),
            };
        }).filter(Boolean).sort((a,b) => (b?.progress ?? 0) - (a?.progress ?? 0));
    }, [hosts, sales, monthlyTargets, currentMonth, currentYear]);

    const hostDailySales = useMemo(() => {
        if (!selectedHostId) return [];
        return sales
            .filter(sale => {
                const saleDate = new Date(sale.date);
                return sale.hostId === selectedHostId && saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [selectedHostId, sales, currentMonth, currentYear]);
    
    const monthName = today.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

    return (
        <div className="space-y-8">
            <div>
                <div className="flex items-center text-2xl font-bold text-white mb-6">
                    <CalendarIcon />
                    <h1>Rangkuman Performa - {monthName}</h1>
                </div>
                {dashboardData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dashboardData.map((data) => data && (
                            <div key={data.hostId} className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-5 flex flex-col justify-between transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/20">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-xl font-bold text-white">{data.hostName}</h3>
                                        {data.progress >= 100 && <TrophyIcon className="text-yellow-400" />}
                                    </div>
                                    <div className="text-sm text-gray-400 mb-4">
                                        Hadiah: <span className="font-semibold text-gray-300">{data.prize}</span>
                                    </div>
                                    <div className="mb-1 flex justify-between text-sm">
                                        <span className="text-green-400 font-medium">{formatCurrency(data.totalOmset)}</span>
                                        <span className="text-gray-400">{formatCurrency(data.target)}</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-4 relative overflow-hidden">
                                        <div 
                                            className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-1000 ease-out" 
                                            style={{ width: isMounted ? `${data.progress}%` : '0%' }}
                                        ></div>
                                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white mix-blend-difference">
                                            {data.progress.toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-gray-800 rounded-lg">
                        <p className="text-gray-400">Belum ada target yang ditetapkan untuk bulan ini.</p>
                        <p className="text-gray-500 text-sm mt-2">Silakan ke halaman 'Set Target' untuk memulai.</p>
                    </div>
                )}
            </div>

             <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">Detail Penjualan Harian Host</h2>
                    <div className="mt-4">
                        <label htmlFor="host-select" className="sr-only">Pilih Host</label>
                        <select
                            id="host-select"
                            value={selectedHostId}
                            onChange={(e) => setSelectedHostId(e.target.value)}
                            className="w-full max-w-xs bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">-- Pilih Host untuk Melihat Detail --</option>
                            {hosts.map(host => (
                                <option key={host.id} value={host.id}>{host.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                 <div className="p-4 sm:p-6">
                    {selectedHostId ? (
                         <div className="overflow-x-auto max-h-96">
                             <table className="w-full text-left">
                                <thead className="bg-gray-700/50 sticky top-0">
                                    <tr>
                                        <th className="p-3">Tanggal</th>
                                        <th className="p-3">Akun</th>
                                        <th className="p-3">Sesi</th>
                                        <th className="p-3">Durasi</th>
                                        <th className="p-3 text-right">Omset Sesi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hostDailySales.length > 0 ? hostDailySales.map(sale => (
                                        <tr key={sale.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                            <td className="p-3 whitespace-nowrap">{new Date(sale.date).toLocaleDateString('id-ID', {day: '2-digit', month: 'short'})}</td>
                                            <td className="p-3">{sale.accountName}</td>
                                            <td className="p-3">{sale.session}</td>
                                            <td className="p-3">{sale.duration}</td>
                                            <td className="p-3 text-right font-semibold text-green-400">{formatCurrency(sale.finalSales - sale.initialSales)}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="text-center p-4 text-gray-400">Tidak ada data penjualan untuk host ini di bulan ini.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                         </div>
                    ) : (
                        <p className="text-gray-400 text-center py-4">Silakan pilih host untuk menampilkan data.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;