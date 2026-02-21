import { ReactNode } from 'react';

interface Tab {
    id: string;
    label: string;
    icon?: ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (id: string) => void;
    className?: string;
}

/**
 * Tabs - Navigation switcher component
 * @param tabs List of tab objects (id, label, icon)
 * @param activeTab ID of the currently active tab
 * @param onChange Callback when a tab is clicked
 * @param className Additional CSS classes
 */
export default function Tabs({
    tabs,
    activeTab,
    onChange,
    className = ''
}: TabsProps) {
    return (
        <div className={`flex items-center gap-1 p-1 bg-muted/30 rounded-xl border border-border w-fit ${className}`}>
            {tabs.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all
              ${isActive
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }
            `}
                    >
                        {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
