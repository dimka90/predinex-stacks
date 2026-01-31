interface Props {
    pagination: { currentPage: number; totalPages: number };
    onPageChange: (page: number) => void;
}

export default function Pagination({ pagination, onPageChange }: Props) {
    return (
        <div className="flex justify-center gap-2 mt-8">
            <button 
                disabled={pagination.currentPage === 1}
                onClick={() => onPageChange(pagination.currentPage - 1)}
                className="px-4 py-2 rounded-lg border border-input disabled:opacity-50"
            >
                Previous
            </button>
            <span className="px-4 py-2 text-sm flex items-center">
                Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button 
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => onPageChange(pagination.currentPage + 1)}
                className="px-4 py-2 rounded-lg border border-input disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}
