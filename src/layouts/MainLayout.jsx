import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Navigation from '../components/common/Navigation';

const MainLayout = ({
    handleFileUpload,
    handleReloadSupabase,
    supabaseMaterials,
    userEmail,
    onLogout,
    isLoading
}) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
            {/* Header */}
            <Header
                handleFileUpload={handleFileUpload}
                handleReloadSupabase={handleReloadSupabase}
                supabaseMaterials={supabaseMaterials}
                userEmail={userEmail}
                onLogout={onLogout}
                isLoading={isLoading}
            />

            {/* Navigation */}
            <Navigation />

            {/* Main Content */}
            <main className="flex-1">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Outlet />
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-auto bg-white border-t border-gray-200 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-sm text-gray-600">
                        <p className="mb-1">
                            Developed by <span className="font-semibold text-green-600">Alessia Vittori</span> © 2025
                        </p>
                        <p>
                            <a href="mailto:info@sustaid.net" className="text-green-600 hover:text-green-700 transition-colors">
                                info@sustaid.net
                            </a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
