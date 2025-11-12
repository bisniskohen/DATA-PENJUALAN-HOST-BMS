import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HostManagement from './pages/HostManagement';
import SalesReport from './pages/SalesReport';
import TargetSetting from './pages/TargetSetting';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8 container mx-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/hosts" element={<HostManagement />} />
          <Route path="/targets" element={<TargetSetting />} />
          <Route path="/sales" element={<SalesReport />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
