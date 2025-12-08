
import React from 'react';
import {
    Home, Settings, Wifi, Grid3X3, Type, Palette, Layers, FileText, Info, X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, activePage, onNavigate }) => {
    const menuItems = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'connection', label: 'Connection', icon: Wifi },
        { id: 'settings', label: 'Matrix Settings', icon: Settings },
        { id: 'simulator', label: 'Simulator', icon: Grid3X3 },
        { id: 'text', label: 'Text Only', icon: Type },
        { id: 'design', label: 'Design Only', icon: Palette },
        { id: 'combo', label: 'Text + Design', icon: Layers },
        { id: 'logs', label: 'Logs / Debug', icon: FileText },
        { id: 'about', label: 'About', icon: Info },
    ];

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
        fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 transform transition-transform duration-300 ease-in-out border-r border-gray-800
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:block
      `}>
                <div className="p-4 flex justify-between items-center border-b border-gray-800">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Pixel Matrix
                    </h1>
                    <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-2 overflow-y-auto h-[calc(100%-64px)]">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activePage === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onNavigate(item.id);
                                    if (window.innerWidth < 768) onClose();
                                }}
                                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-colors
                  ${isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
                `}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
