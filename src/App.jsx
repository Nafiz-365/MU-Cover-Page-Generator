import React from 'react';
import { CoverPageProvider } from './context/CoverPageContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/form/Sidebar';
import PreviewArea from './components/preview/PreviewArea';
import MobileTabBar from './components/layout/MobileTabBar';
import Toast from './components/ui/Toast';

export default function App() {
  return (
    <CoverPageProvider>
      <div className="min-h-screen flex flex-col pt-22 sm:pt-24 lg:pt-32 pb-12 px-3.5 sm:px-6 lg:px-8">
        <Header />

        <MobileTabBar />

        <main className="flex-1 flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-7xl mx-auto w-full items-start justify-center">
          <Sidebar />
          <PreviewArea />
        </main>

        <Footer />
        <Toast />
      </div>
    </CoverPageProvider>
  );
}
