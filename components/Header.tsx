import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import PasswordModal from './PasswordModal';

const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const TargetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const BarChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>;
const KeyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>;


function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const baseClasses = "flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200 text-sm font-medium";
  const inactiveClasses = "text-gray-400 hover:bg-gray-700 hover:text-white";
  const activeClasses = "bg-blue-600 text-white shadow-md";

  return (
    <>
      <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700">
        <nav className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <BarChartIcon />
            <span className="text-xl font-bold text-white">SalesTrack</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <NavLink to="/" className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}><HomeIcon /><span className="hidden sm:inline">Dashboard</span></NavLink>
            <NavLink to="/hosts" className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}><UsersIcon /><span className="hidden sm:inline">Manajemen Host</span></NavLink>
            <NavLink to="/targets" className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}><TargetIcon /><span className="hidden sm:inline">Set Target</span></NavLink>
            <NavLink to="/sales" className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}><BarChartIcon /><span className="hidden sm:inline">Input Penjualan</span></NavLink>
            <div className="border-l border-gray-600 ml-2 pl-2 sm:ml-4 sm:pl-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-2 rounded-full transition-colors text-yellow-400 bg-yellow-900/50 hover:bg-yellow-900/80"
                aria-label="Atur Kata Sandi"
                title="Atur Kata Sandi"
              >
                <KeyIcon />
              </button>
            </div>
          </div>
        </nav>
      </header>
      <PasswordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export default Header;
