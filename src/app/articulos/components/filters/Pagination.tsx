"use client";

import React from "react";
import ReactPaginate from "react-paginate";

interface Props {
  pageCount: number;
  setPagina: (pagina: number) => void;
  isLoadingProductos: boolean;
  paginaActual: number;
}

const Pagination: React.FC<Props> = ({
  pageCount,
  isLoadingProductos,
  paginaActual,
  setPagina,
}) => {
  const handlePageChange = (selectedItem: { selected: number }) => {
    setPagina(selectedItem.selected + 1);
  };

  return (
    <>
      {isLoadingProductos ? (
        <div className="flex items-center justify-center space-x-4">
          <div className="h-11 w-11 animate-pulse rounded-lg bg-secondary2_sokso"></div>
          <div className="h-11 w-11 animate-pulse rounded-lg bg-secondary2_sokso"></div>
          <div className="h-11 w-11 animate-pulse rounded-lg bg-secondary2_sokso"></div>
        </div>
      ) : (
        <ReactPaginate
          previousLabel="<"
          nextLabel=">"
          pageCount={pageCount}
          forcePage={paginaActual - 1}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          activeClassName={"active"}
          renderOnZeroPageCount={null}
        />
      )}
    </>
  );
};

export default Pagination;
