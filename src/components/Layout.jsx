
import React, { useState, useContext } from 'react';
import { Menu, Wifi } from 'lucide-react';
import Sidebar from './Sidebar';
import { AppContext } from '../context/AppContext';

const Layout = ({ children, activePage, onNavigate }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { connectionStatus } = useContext(AppContext);

    const getStatusColor = () => {
        switch (connectionStatus) {
            case 'Connected': return 'text-green-500';
            case 'Connecting...': return 'text-yellow-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="flex h-screen bg-[#050710] text-gray-100 overflow-hidden font-sans">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                activePage={activePage}
                onNavigate={onNavigate}
            />

            <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
                {/* Top Bar */}
                <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden mr-4 text-gray-400 hover:text-white"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-lg font-semibold hidden sm:block">Pixel Matrix Controller</h2>
                        <h2 className="text-lg font-semibold sm:hidden">Pixel Matrix</h2>
                    </div>

                    <div className="flex items-center space-x-2 text-sm bg-gray-800 px-3 py-1.5 rounded-full">
                        <Wifi size={16} className={getStatusColor()} />
                        <span className={getStatusColor()}>{connectionStatus}</span>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="max-w-4xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
