// app/components/common/MobileAdminMenu.tsx
'use client';

import { useState } from 'react';
import { User, Download, Settings, HelpCircle, X, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MobileAdminMenuProps {
  userProfile?: {
    email: string;
    first_name: string;
    login_source: string;
  } | null;
  onDownloadClick: () => void;
}

const MobileAdminMenu: React.FC<MobileAdminMenuProps> = ({ 
  userProfile,
  onDownloadClick 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Get user display info
  const displayName = userProfile?.first_name || userProfile?.email || 'User';
  const isSystemIOUser = userProfile?.login_source === 'systemio';

  // Create conditional menu items based on login source
  const menuItems = [
    {
      icon: <Download className="w-5 h-5" />,
      label: 'Downloads',
      sublabel: 'Get your work',
      onClick: onDownloadClick,
      color: 'text-blue-600'
    },
    // Show Account for all users, Settings only for direct login users
    {
      icon: <User className="w-5 h-5" />,
      label: 'Account',
      sublabel: userProfile?.email || 'User',
      onClick: () => isSystemIOUser ? {} : router.push('/account'), // SystemIO users see email but can't click
      color: 'text-green-600'
    },
    // Only show Settings for direct login users
    ...(isSystemIOUser ? [] : [
      {
        icon: <Settings className="w-5 h-5" />,
        label: 'Settings',
        sublabel: 'Preferences',
        onClick: () => router.push('/settings'),
        color: 'text-gray-600'
      }
    ]),
    {
      icon: <HelpCircle className="w-5 h-5" />,
      label: 'Help',
      sublabel: 'Get support',
      onClick: () => router.push('/help'),
      color: 'text-purple-600'
    }
  ];

  return (
    <>
      {/* Floating Action Button - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        {/* Menu Items - Show when open */}
        {isOpen && (
          <div className="absolute top-16 right-0 mt-2">
            <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden min-w-[200px]">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                >
                  <div className={`mt-0.5 ${item.color}`}>
                    {item.icon}
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium text-gray-800 text-sm">
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.sublabel}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main FAB Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-14 h-14 rounded-full shadow-lg flex items-center justify-center
            transition-all duration-200 transform
            ${isOpen 
              ? 'bg-gray-800 rotate-45 scale-110' 
              : 'bg-teal-600 hover:bg-teal-700 hover:scale-105'
            }
          `}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {/* Backdrop - click to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default MobileAdminMenu;