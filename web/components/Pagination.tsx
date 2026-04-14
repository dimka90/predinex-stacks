import Tooltip from './ui/Tooltip';

interface Props {
    pagination: { currentPage: number; totalPages: number };
    onPageChange: (page: number) => void;
}

export default function Pagination({ pagination, onPageChange }: Props) {
    return (
        <nav role="navigation" aria-label="Pagination Navigation" className="flex justify-center gap-2 mt-8">
            <Tooltip content="Previous Page" position="top">
                <button
                    disabled={pagination.currentPage === 1}
                    aria-disabled={pagination.currentPage === 1}
                    aria-label="Go to previous page"
                    onClick={() => onPageChange(pagination.currentPage - 1)}
                    className="px-6 py-3 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md hover:bg-white/10 hover:border-primary/40 focus:ring-2 focus:ring-primary/50 disabled:opacity-30 disabled:pointer-events-none transition-all font-black text-xs uppercase tracking-widest active:scale-95 shadow-inner"
                >
                    Prev
                </button>
            </Tooltip>
            <span className="px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] flex items-center bg-primary/10 rounded-xl border border-primary/20 shadow-[0_0_15px_rgba(79,70,229,0.1)]">
                Page {pagination.currentPage} / {pagination.totalPages}
            </span>
            <Tooltip content="Next Page" position="top">
                <button
                    disabled={pagination.currentPage === pagination.totalPages}
                    onClick={() => onPageChange(pagination.currentPage + 1)}
                    className="px-6 py-3 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md hover:bg-white/10 hover:border-primary/40 focus:ring-2 focus:ring-primary/50 disabled:opacity-30 disabled:pointer-events-none transition-all font-black text-xs uppercase tracking-widest active:scale-95 shadow-inner"
                >
                    Next
                </button>
            </Tooltip>
        </nav>
    );
}
