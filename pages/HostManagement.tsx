import React, { useState, useCallback } from 'react';
import { Host } from '../types';
import Card from '../components/Card';
import ExportButtons from '../components/ExportButtons';
import { exportToExcel, exportToPdf } from '../utils/exportUtils';
import { useAppContext } from '../contexts/AppContext';

// Icons
const UserPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};


const HostManagement: React.FC = () => {
  const { state, setState } = useAppContext();
  const { hosts } = state;

  const [name, setName] = useState('');
  const [accounts, setAccounts] = useState('');
  const [error, setError] = useState('');
  
  // State for edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHost, setEditingHost] = useState<Host | null>(null);
  const [editName, setEditName] = useState('');
  const [editAccounts, setEditAccounts] = useState('');

  const handleAddHost = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !accounts) {
        setError('Nama host dan akun harus diisi.');
        return;
    }
    const newHost: Host = {
      id: Date.now().toString(),
      name,
      accounts: accounts.split(',').map(acc => acc.trim()).filter(Boolean),
    };
    setState(prev => ({...prev, hosts: [...prev.hosts, newHost]}));
    setName('');
    setAccounts('');
    setError('');
  }, [name, accounts, setState]);

  const handleDeleteHost = useCallback((id: string) => {
      setState(prev => ({...prev, hosts: prev.hosts.filter(host => host.id !== id)}));
  }, [setState]);

  const openEditModal = (host: Host) => {
    setEditingHost(host);
    setEditName(host.name);
    setEditAccounts(host.accounts.join(', '));
    setIsModalOpen(true);
  };

  const handleEditHost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHost) return;
    
    const updatedHosts = hosts.map(h => 
      h.id === editingHost.id 
      ? { ...h, name: editName, accounts: editAccounts.split(',').map(acc => acc.trim()).filter(Boolean) } 
      : h
    );

    setState(prev => ({...prev, hosts: updatedHosts}));
    
    setIsModalOpen(false);
    setEditingHost(null);
  };

  const handlePdfExport = () => {
    const title = 'Daftar Host Aktif';
    const headers = [['Nama Host', 'Akun yang Dipegang']];
    const data = hosts.map(h => [h.name, h.accounts.join(', ')]);
    exportToPdf(title, headers, data, 'daftar-host');
  };

  const handleExcelExport = () => {
    const dataForExcel = hosts.map(h => ({
      'Nama Host': h.name,
      'Akun yang Dipegang': h.accounts.join(', ')
    }));
    exportToExcel('daftar-host', [{ sheetName: 'Host', data: dataForExcel }]);
  };

  return (
    <div className="space-y-8">
      <Card title="Tambah Host Baru">
        <form onSubmit={handleAddHost} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="hostName" className="block text-sm font-medium text-gray-300 mb-1">Nama Host</label>
              <input
                id="hostName" type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="cth: John Doe"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="accounts" className="block text-sm font-medium text-gray-300 mb-1">Akun yang Dipegang</label>
              <input
                id="accounts" type="text" value={accounts} onChange={(e) => setAccounts(e.target.value)}
                placeholder="Pisahkan dengan koma, cth: toko_keren, toko_baju"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex justify-end">
            <button type="submit" className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-transform transform hover:scale-105">
              <UserPlusIcon /> Tambah Host
            </button>
          </div>
        </form>
      </Card>

      <Card>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Daftar Host Aktif</h2>
            <ExportButtons
                onPdfExport={handlePdfExport}
                onExcelExport={handleExcelExport}
                isDisabled={hosts.length === 0}
            />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="p-3">Nama Host</th>
                <th className="p-3">Akun</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {hosts.length > 0 ? hosts.map(host => (
                <tr key={host.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="p-3 font-medium">{host.name}</td>
                  <td className="p-3">{host.accounts.join(', ')}</td>
                  <td className="p-3 text-right space-x-2">
                     <button onClick={() => openEditModal(host)} className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded-full transition-colors" aria-label={`Edit ${host.name}`}> <EditIcon /> </button>
                    <button onClick={() => handleDeleteHost(host.id)} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors" aria-label={`Delete ${host.name}`}> <TrashIcon /> </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="text-center p-4 text-gray-400">Belum ada data host.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleEditHost} className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Edit Host</h3>
            <div>
              <label htmlFor="editHostName" className="block text-sm font-medium text-gray-300 mb-1">Nama Host</label>
              <input id="editHostName" type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label htmlFor="editAccounts" className="block text-sm font-medium text-gray-300 mb-1">Akun yang Dipegang</label>
              <input id="editAccounts" type="text" value={editAccounts} onChange={(e) => setEditAccounts(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md">Batal</button>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Simpan Perubahan</button>
            </div>
        </form>
      </Modal>

    </div>
  );
};

export default HostManagement;