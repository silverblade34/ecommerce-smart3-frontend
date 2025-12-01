import { TableColumns } from "@/lib/data/tables-data";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";

import { CaretDown } from "@phosphor-icons/react";
import { useMemo, useState } from "react";

const useTableDetail = (
  initialColumns: {
    initial: TableColumns[];
    visible: string[];
  },
  Header?: () => JSX.Element
) => {
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(initialColumns.visible)
  );
  const headerColumns = useMemo(() => {
    return initialColumns.initial.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns, initialColumns.initial]);

  const topContent = useMemo(() => {
    return (
      <div className="flex items-center justify-between gap-5">
        <Dropdown>
          <DropdownTrigger className="flex">
            <Button
              endContent={<CaretDown className="h-5 w-5" />}
              variant="flat"
              className="capitalize"
            >
              Columnas
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Table Columns"
            closeOnSelect={false}
            selectedKeys={visibleColumns}
            selectionMode="multiple"
            onSelectionChange={(keys) =>
              setVisibleColumns(new Set(keys as unknown as string[]))
            }
          >
            {initialColumns.initial.map((column) => (
              <DropdownItem key={column.uid} className="capitalize">
                {column.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        {Header ? <Header /> : null}
      </div>
    );
  }, [initialColumns.initial, visibleColumns, Header]);

  return {
    topContent,
    headerColumns,
  };
};
export default useTableDetail;
