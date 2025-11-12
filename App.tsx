import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HostManagement from './pages/HostManagement';
import SalesReport from './pages/SalesReport';
import TargetSetting from './pages/TargetSetting';
import Dashboard from './pages/Dashboard';
import { LockProvider } from './contexts/LockContext';
import ProtectedPage from './components/ProtectedPage';
import { AppProvider } from './contexts/AppContext';

function App() {
  return (
    <AppProvider>
      <LockProvider>
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
          <Header />
          <main className="p-4 sm:p-6 lg:p-8 container mx-auto">
            <Routes>
              <Route path="/" element={<ProtectedPage><Dashboard /></ProtectedPage>} />
              <Route path="/hosts" element={<ProtectedPage><HostManagement /></ProtectedPage>} />
              <Route path="/targets" element={<ProtectedPage><TargetSetting /></ProtectedPage>} />
              <Route path="/sales" element={<SalesReport />} />
            </Routes>
          </main>
        </div>
      </LockProvider>
    </AppProvider>
  );
}

export default App;