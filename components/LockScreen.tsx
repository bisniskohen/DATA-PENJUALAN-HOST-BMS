import React, { useState } from 'react';
import { useLock } from '../contexts/LockContext';

const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-gray-500 mb-4"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 ml-2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

const LockScreen: React.FC = () => {
  const [attempt, setAttempt] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const { unlock } = useLock();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlock(attempt)) {
      setError('');
    } else {
      setError('Kata sandi salah. Silakan coba lagi.');
      setAttempt('');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500); // Duration of shake animation
    }
  };

  const handleForgotPassword = () => {
    const isConfirmed = window.confirm(
      "Lupa Kata Sandi?\n\nIni akan me-reset aplikasi dan menghapus kata sandi yang telah diatur untuk sesi ini. Semua data yang belum disimpan akan hilang.\n\nApakah Anda yakin ingin melanjutkan?"
    );

    if (isConfirmed) {
      window.location.reload();
    }
  }

  return (
    <div className="flex items-center justify-center pt-16">
       <style>{`
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        .shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
      <div className={`w-full max-w-sm p-8 bg-gray-800 border border-gray-700 rounded-lg shadow-xl text-center ${isShaking ? 'shake' : ''}`}>
        <LockIcon />
        <h1 className="text-2xl font-bold text-white mb-2">Halaman Terkunci</h1>
        <p className="text-gray-400 mb-6">Silakan masukkan kata sandi untuk melanjutkan.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password-attempt" className="sr-only">Kata Sandi</label>
            <input
              id="password-attempt"
              type="password"
              value={attempt}
              onChange={(e) => setAttempt(e.target.value)}
              placeholder="Masukkan kata sandi"
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-center"
              autoFocus
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed"
            disabled={!attempt}
          >
            Buka Kunci <ArrowRightIcon/>
          </button>
        </form>
        <div className="mt-6">
            <button onClick={handleForgotPassword} className="text-xs text-gray-500 hover:text-gray-300 hover:underline">
                Lupa Kata Sandi?
            </button>
        </div>
      </div>
    </div>
  );
};

export default LockScreen;