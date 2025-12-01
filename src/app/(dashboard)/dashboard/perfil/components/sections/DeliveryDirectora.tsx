import TitleSection from "@/components/common/ui/TitleSection";
import {
  Button,
  getKeyValue,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { PencilSimple, Trash } from "@phosphor-icons/react";
import React, { useState } from "react";
const rows = [
  {
    key: "1",
    name: "Zona 1",
    role: "S/ 5.00",
    status: "Por pedido",
    actions: (
      <div className="flex space-x-2">
        <Button size="sm" color="primary" variant="bordered">
          <PencilSimple size={20} />
        </Button>
        <Button size="sm" color="danger" variant="bordered">
          <Trash size={20} />
        </Button>
      </div>
    ),
  },
];

const columns = [
  {
    key: "name",
    label: "Zona",
  },
  {
    key: "role",
    label: "Costo",
  },
  {
    key: "status",
    label: "Por",
  },
  {
    key: "actions",
    label: "Acciones",
  },
];

const DeliveryDirectora = () => {
  const [checked, setChecked] = useState(false);
  return (
    <div className="border-b-2 border-secondary2_sokso pb-4">
      <TitleSection text=" Delivery" />
      <div className="py-3">
        <Switch
          size="sm"
          checked={checked}
          onChange={() => setChecked(!checked)}
        >
          {checked ? "Disponible" : "No disponible"}
        </Switch>
      </div>

      {checked && (
        <Table
          aria-label="Example table with dynamic content"
          topContent={
            <div className="flex justify-end">
              <Button className="mt-4  bg-primary_sokso text-white">
                + Agregar
              </Button>
            </div>
          }
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={rows}>
            {(item) => (
              <TableRow key={item.key}>
                {(columnKey) => (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default DeliveryDirectora;
