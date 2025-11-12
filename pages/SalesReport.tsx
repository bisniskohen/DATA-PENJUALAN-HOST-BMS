import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { SaleRecord, Host, MonthlyTarget } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import Card from '../components/Card';

const DollarSignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;

const SalesReport: React.FC = () => {
  const [hosts] = useLocalStorage<Host[]>('hosts', []);
  const [sales, setSales] = useLocalStorage<SaleRecord[]>('sales', []);
  const [monthlyTargets] = useLocalStorage<MonthlyTarget[]>('monthlyTargets', []);

  const [hostId, setHostId] = useState('');
  const [accountName, setAccountName] = useState('');
  const [initialSales, setInitialSales] = useState('');
  const [finalSales, setFinalSales] = useState('');
  const [session, setSession] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  
  const [hostAccounts, setHostAccounts] = useState<string[]>([]);

  useEffect(() => {
    if (hostId) {
      const selectedHost = hosts.find(h => h.id === hostId);
      setHostAccounts(selectedHost ? selectedHost.accounts : []);
      setAccountName(''); // Reset account name when host changes
    } else {
      setHostAccounts([]);
    }
  }, [hostId, hosts]);


  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  }

  const handleNumericChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/\D/g, ''); // Remove all non-digit characters
      setter(rawValue);
  };

  const formatInputValue = (value: string) => {
      if (!value) return '';
      return new Intl.NumberFormat('id-ID').format(Number(value));
  };


  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!hostId || !accountName || !initialSales || !finalSales || !session || !duration || !date) {
      setError('Semua field harus diisi.');
      return;
    }

    const newSale: SaleRecord = {
      id: Date.now().toString(),
      hostId,
      accountName,
      initialSales: parseFloat(initialSales),
      finalSales: parseFloat(finalSales),
      session,
      duration,
      date,
    };

    setSales(prevSales => [newSale, ...prevSales].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

    // Reset form
    setHostId('');
    setAccountName('');
    setInitialSales('');
    setFinalSales('');
    setSession('');
    setDuration('');
    setError('');

  }, [hostId, accountName, initialSales, finalSales, session, duration, date, setSales]);

  const monthlyReport = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    return hosts.map(host => {
      const hostSales = sales.filter(sale => {
        const saleDate = new Date(sale.date);
        return sale.hostId === host.id && saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
      });
      
      const currentTarget = monthlyTargets.find(t => t.hostId === host.id && t.month === currentMonth && t.year === currentYear);

      const totalOmset = hostSales.reduce((acc, sale) => acc + (sale.finalSales - sale.initialSales), 0);
      const targetAmount = currentTarget?.target ?? 0;
      const progress = targetAmount > 0 ? (totalOmset / targetAmount) * 100 : 0;

      return {
        ...host,
        totalOmset,
        monthlyTarget: targetAmount,
        progress: Math.min(progress, 100)
      };
    }).filter(report => report.monthlyTarget > 0); // Only show hosts with a set target for the month
  }, [hosts, sales, monthlyTargets]);

  return (
    <div className="space-y-8">
      <Card title="Input Penjualan Harian">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="host" className="block text-sm font-medium text-gray-300 mb-1">Pilih Host</label>
              <select id="host" value={hostId} onChange={e => setHostId(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500">
                <option value="" disabled>-- Pilih Host --</option>
                {hosts.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
             <div>
              <label htmlFor="accountName" className="block text-sm font-medium text-gray-300 mb-1">Nama Akun</label>
              <select id="accountName" value={accountName} onChange={e => setAccountName(e.target.value)} disabled={!hostId} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 disabled:bg-gray-800 disabled:cursor-not-allowed">
                <option value="" disabled>-- Pilih Akun --</option>
                {hostAccounts.map(acc => <option key={acc} value={acc}>{acc}</option>)}
              </select>
            </div>
             <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Tanggal</label>
              <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"/>
            </div>
             <div>
              <label htmlFor="initialSales" className="block text-sm font-medium text-gray-300 mb-1">Omset Awal</label>
              <input id="initialSales" type="text" inputMode="numeric" value={formatInputValue(initialSales)} onChange={handleNumericChange(setInitialSales)} placeholder="cth: 1.000.000" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"/>
            </div>
             <div>
              <label htmlFor="finalSales" className="block text-sm font-medium text-gray-300 mb-1">Omset Akhir</label>
              <input id="finalSales" type="text" inputMode="numeric" value={formatInputValue(finalSales)} onChange={handleNumericChange(setFinalSales)} placeholder="cth: 2.500.000" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"/>
            </div>
             <div>
              <label htmlFor="session" className="block text-sm font-medium text-gray-300 mb-1">Sesi Live</label>
              <select id="session" value={session} onChange={e => setSession(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500">
                <option value="" disabled>-- Pilih Sesi --</option>
                <option value="Pagi">Pagi</option>
                <option value="Siang">Siang</option>
                <option value="Sore">Sore</option>
                <option value="Malam">Malam</option>
              </select>
            </div>
             <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">Durasi Live</label>
              <input id="duration" type="text" value={duration} onChange={e => setDuration(e.target.value)} placeholder="cth: 2 jam 30 menit" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>
           {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          <div className="flex justify-end pt-2">
            <button type="submit" className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-transform transform hover:scale-105">
                <DollarSignIcon /> Simpan Penjualan
            </button>
          </div>
        </form>
      </Card>
      
      <Card title="Riwayat Penjualan Terbaru">
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left">
            <thead className="bg-gray-700/50 sticky top-0">
              <tr>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Host</th>
                <th className="p-3">Akun</th>
                <th className="p-3">Sesi</th>
                <th className="p-3 text-right">Omset Sesi</th>
              </tr>
            </thead>
            <tbody>
              {sales.length > 0 ? sales.slice(0, 20).map(sale => { // Show recent 20
                  const host = hosts.find(h => h.id === sale.hostId);
                  const sessionOmset = sale.finalSales - sale.initialSales;
                  return (
                      <tr key={sale.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="p-3 whitespace-nowrap">{new Date(sale.date).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})}</td>
                        <td className="p-3 font-medium">{host?.name || 'N/A'}</td>
                        <td className="p-3">{sale.accountName}</td>
                        <td className="p-3">{sale.session}</td>
                        <td className="p-3 text-right font-semibold text-green-400">{formatCurrency(sessionOmset)}</td>
                      </tr>
                  )
              }) : (
                 <tr>
                    <td colSpan={5} className="text-center p-4 text-gray-400">Belum ada data penjualan.</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SalesReport;