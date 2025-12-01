import { Button } from "@heroui/react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    let pages: (number | string)[] = [];

    if (totalPages <= 3) {
        pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
        if (currentPage > 3) {
            pages.push(1, "...");
        }

        if (currentPage === totalPages) {
            pages.push(totalPages - 1, totalPages);
        } else {
            pages.push(currentPage, currentPage + 1);
        }

        if (currentPage + 1 < totalPages) {
            pages.push("...", totalPages);
        }
    }

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            {currentPage > 1 && (
                <Button
                    isIconOnly
                    size="sm"
                    onPress={() => onPageChange(currentPage - 1)}
                >
                    {"<"}
                </Button>
            )}

            {pages.map((page, index) =>
                typeof page === "number" ? (
                    <Button

                        color="primary"
                        key={index}
                        size="sm"
                        variant={page === currentPage ? "solid" : "light"}
                        className={
                            page === currentPage
                                ? "bg-primary text-white"
                                : "bg-white text-primary border border-gray-300"
                        }
                        onPress={() => onPageChange(page)}
                    >
                        {page}
                    </Button>
                ) : (
                    <span key={index} className="px-2 text-gray-500">
                        {page}
                    </span>
                )
            )}

            {currentPage < totalPages && (
                <Button
                    isIconOnly
                    size="sm"
                    onPress={() => onPageChange(currentPage + 1)}
                >
                    {">"}
                </Button>
            )}
        </div>
    );
};

export default Pagination;
