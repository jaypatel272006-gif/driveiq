import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { CommandMenu } from './components/layout/CommandMenu';
import { AIAdvisorDrawer } from './components/layout/AIAdvisorDrawer';
import { TestDriveModal } from './components/layout/TestDriveModal';
import { ToastContainer } from './components/ui/ToastContainer';

import { ModelDetailPage } from './pages/ModelDetailPage';
import { VariantDetailPage } from './pages/VariantDetailPage';
import { HomePage } from './pages/HomePage';
import { FinderPage } from './pages/FinderPage';
import { CarsPage } from './pages/CarsPage';
import { CarDetailPage } from './pages/CarDetailPage';
import { ComparePage } from './pages/ComparePage';
import { VariantsPage } from './pages/VariantsPage';
import { EVHubPage } from './pages/EVHubPage';
import { UsedCarsPage } from './pages/UsedCarsPage';
import { FinancePage } from './pages/FinancePage';
import { OwnershipPage } from './pages/OwnershipPage';
import { SafetyPage } from './pages/SafetyPage';
import { ResalePage } from './pages/ResalePage';
import { GaragePage } from './pages/GaragePage';
import { AdminPage } from './pages/AdminPage';
import { AdminImagePage } from './pages/AdminImagePage';
import { DatabaseHealthPage } from './pages/DatabaseHealthPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/find-my-car" element={<FinderPage />} />
              <Route path="/cars" element={<CarsPage />} />
              <Route path="/cars/:id" element={<CarDetailPage />} />
              <Route path="/cars/:brandSlug/:modelSlug" element={<ModelDetailPage />} />
              <Route path="/cars/:brandSlug/:modelSlug/:variantSlug" element={<VariantDetailPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/variants" element={<VariantsPage />} />
              <Route path="/ev" element={<EVHubPage />} />
              <Route path="/used" element={<UsedCarsPage />} />
              <Route path="/finance" element={<FinancePage />} />
              <Route path="/ownership" element={<OwnershipPage />} />
              <Route path="/safety" element={<SafetyPage />} />
              <Route path="/resale" element={<ResalePage />} />
              <Route path="/garage" element={<GaragePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/vehicle-images" element={<AdminImagePage />} />
              <Route path="/admin/database-health" element={<DatabaseHealthPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          <Footer />
          <MobileNav />

          {/* Persistent Global Modals & Drawers */}
          <CommandMenu />
          <AIAdvisorDrawer />
          <TestDriveModal />
          <ToastContainer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
