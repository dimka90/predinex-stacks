import Tooltip from './ui/Tooltip';

interface Props {
    pagination: { currentPage: number; totalPages: number };
    onPageChange: (page: number) => void;
}

export default function Pagination({ pagination, onPageChange }: Props) {
    return (
        <div className="flex justify-center gap-2 mt-8">
            <Tooltip content="Previous Page" position="top">
                <button
                    disabled={pagination.currentPage === 1}
                    onClick={() => onPageChange(pagination.currentPage - 1)}
                    className="px-5 py-2.5 rounded-xl border border-border bg-card/40 hover:bg-card/60 hover:border-primary/40 disabled:opacity-30 disabled:pointer-events-none transition-all font-bold text-sm"
                >
                    Previous
                </button>
            </Tooltip>
            <span className="px-4 py-2 text-xs font-black uppercase tracking-widest flex items-center bg-primary/5 rounded-xl border border-primary/10">
                Page {pagination.currentPage} / {pagination.totalPages}
            </span>
            <Tooltip content="Next Page" position="top">
                <button
                    disabled={pagination.currentPage === pagination.totalPages}
                    onClick={() => onPageChange(pagination.currentPage + 1)}
                    className="px-5 py-2.5 rounded-xl border border-border bg-card/40 hover:bg-card/60 hover:border-primary/40 disabled:opacity-30 disabled:pointer-events-none transition-all font-bold text-sm"
                >
                    Next
                </button>
            </Tooltip>
        </div>
    );
}
