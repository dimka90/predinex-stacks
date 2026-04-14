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
        <div className={`flex items-center gap-1.5 p-1.5 bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-inner w-fit ${className}`}>
            {tabs.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        onKeyDown={(e) => {
                            const currentIndex = tabs.findIndex(t => t.id === activeTab);
                            if (e.key === 'ArrowRight') {
                                const nextIndex = (currentIndex + 1) % tabs.length;
                                onChange(tabs[nextIndex].id);
                            } else if (e.key === 'ArrowLeft') {
                                const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                                onChange(tabs[prevIndex].id);
                            }
                        }}
                        className={`
              flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 active:scale-95
              ${isActive
                                ? 'bg-primary text-white shadow-[0_5px_20px_rgba(79,70,229,0.4)] scale-[1.02] border border-white/10'
                                : 'text-muted-foreground/60 hover:text-white hover:bg-white/5 border border-transparent'
                            }
            `}
                    >
                        {tab.icon && <span className={`w-4 h-4 ${isActive ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : ''}`}>{tab.icon}</span>}
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
