import { TableColumns } from "@/lib/data/tables-data";
import { Spinner, Table, TableBody, TableColumn, TableHeader } from "@heroui/react";

type Props<T> = {
  loading: boolean;
  data: T[];
  topContent?: JSX.Element;
  headerColumns?: TableColumns[];
  bottomContent?: JSX.Element;
  children: (item: T) => JSX.Element;
  selectionMode?: "single" | "multiple";
  label?: string;
  emptyText?: string;
};

const TableTemplate = <T,>({
  loading,
  data,
  topContent,
  headerColumns,
  children,
  bottomContent,
  label,
  emptyText,
  selectionMode = "single",
}: Props<T>) => {
  return (
    <Table
      isHeaderSticky
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[600px]",
        th: "bg-default-100 text-default-800 text-xs",
        td: "py-3"}}
      aria-label={label}
      topContent={topContent}
      bottomContent={bottomContent}
      selectionMode={selectionMode}
      isStriped
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={data}
        isLoading={loading}
        loadingContent={
          <div className="flex justify-center items-center h-32">
            <Spinner 
              size="lg" 
              aria-label="Cargando datos..." 
              className="text-primary-500" 
            />
          </div>
        }
        emptyContent={
          <div className="flex flex-col items-center justify-center space-y-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <p className="text-center">{emptyText}</p>
          </div>
        }
      >
        {children}
      </TableBody>
    </Table>
  );
};
export default TableTemplate;
