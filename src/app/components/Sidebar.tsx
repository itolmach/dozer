import React, { useState } from 'react';
import { 
  Home, 
  Layout, 
  Truck, 
  BarChart3, 
  User, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal,
  Command
} from 'lucide-react';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, active, isCollapsed, onClick }: NavItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group
        ${active 
          ? 'bg-primary/10 text-primary' 
          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
        }
      `}
    >
      <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
      <span className={`
        font-medium whitespace-nowrap overflow-hidden transition-all duration-300
        ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}
      `}>
        {label}
      </span>
    </button>
  );
};

interface SidebarProps {
  activeView: string;
  onViewChange: (view: any) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'live', icon: Home, label: 'Home' },
    { id: 'jobsite', icon: Layout, label: 'Jobsite' },
    { id: 'assets', icon: Truck, label: 'Assets' },
    { id: 'historical', icon: BarChart3, label: 'Analytics' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div 
      className={`
        relative h-screen bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col
        ${isCollapsed ? 'w-[72px]' : 'w-[260px]'}
      `}
    >
      {/* Header / Logo */}
      <div className="p-4 flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
          <span className="font-bold text-lg text-foreground">T</span>
        </div>
        {!isCollapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="font-bold text-foreground truncate">Tolmachovfamily</span>
            <span className="text-xs text-muted-foreground truncate">Enterprise Site Ops</span>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeView === item.id}
            isCollapsed={isCollapsed}
            onClick={() => onViewChange(item.id)}
          />
        ))}
      </div>

      {/* Footer / Collapse Toggle */}
      <div className="p-3 border-t border-border mt-auto relative">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            absolute -right-3 top-[-16px] w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center
            text-muted-foreground hover:text-foreground shadow-sm z-50 transition-all duration-300
            ${isCollapsed ? 'rotate-180' : 'rotate-0'}
          `}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className={`
          flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground
          ${isCollapsed ? 'justify-center' : ''}
        `}>
          <Command className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Shortcuts</span>}
        </div>
      </div>
    </div>
  );
}
