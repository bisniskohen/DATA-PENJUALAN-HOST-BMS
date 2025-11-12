import React, { useState } from 'react';
import { useLock } from '../contexts/LockContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { isPasswordSet, setPassword, checkPassword, clearPassword } = useLock();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isPasswordSet && !checkPassword(currentPassword)) {
        setError('Kata sandi saat ini salah.');
        return;
    }

    if (!newPassword) {
        setError('Kata sandi baru tidak boleh kosong.');
        return;
    }
    
    if (newPassword.length < 4) {
        setError('Kata sandi baru minimal harus 4 karakter.');
        return;
    }

    if (newPassword !== confirmPassword) {
        setError('Konfirmasi kata sandi tidak cocok.');
        return;
    }
    
    setPassword(newPassword);
    setSuccess(`Kata sandi berhasil ${isPasswordSet ? 'diubah' : 'diatur'}.`);
    
    // Reset fields and close modal after a delay
    setTimeout(() => {
        handleClose();
    }, 1500);
  };
  
  const handleDeletePassword = () => {
    setError('');
    setSuccess('');

    if (!checkPassword(currentPassword)) {
        setError('Kata sandi saat ini salah untuk menghapus.');
        return;
    }
    
    if (clearPassword(currentPassword)) {
        setSuccess('Kata sandi telah berhasil dihapus.');
        setTimeout(() => {
            handleClose();
        }, 1500);
    } else {
        // This case should theoretically not be reached if checkPassword passed
        setError('Gagal menghapus kata sandi.');
    }
  }


  const handleClose = () => {
    // Reset state on close
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={handleClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-700" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSave} className="space-y-4">
            <h3 className="text-xl font-bold mb-4">{isPasswordSet ? 'Ubah Kata Sandi' : 'Atur Kata Sandi Baru'}</h3>
            
            {isPasswordSet && (
                <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">Kata Sandi Saat Ini</label>
                    <input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500" required/>
                </div>
            )}

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">Kata Sandi Baru</label>
              <input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500" required/>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">Konfirmasi Kata Sandi Baru</label>
              <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500" required/>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}
            {success && <p className="text-green-400 text-sm">{success}</p>}
            
            <div className="flex justify-between items-center gap-2 pt-4">
              <div>
                {isPasswordSet && (
                    <button type="button" onClick={handleDeletePassword} className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-md text-sm">
                        Hapus Kata Sandi
                    </button>
                )}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={handleClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md">Batal</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Simpan</button>
              </div>
            </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;