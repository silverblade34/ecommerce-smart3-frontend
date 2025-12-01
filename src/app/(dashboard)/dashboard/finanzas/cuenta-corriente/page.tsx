"use client";
import { useState } from "react";
import { Button, Input, Select, SelectItem, Spinner } from "@heroui/react";
import { month, years } from "@/lib/data/default-data";
import { useEstadoCuenta } from "@/hooks/cuenta-corriente/useEstadoCuenta";



const EstadoCuenta = () => {
  const now = new Date();
  const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
  const [mes, setMes] = useState(currentMonth);
  const currentYear = String(now.getFullYear());
  const [anio, setAnio] = useState(currentYear);
  const [showDepositos, setShowDepositos] = useState(false);

const { data, loading, loadingExcel, handleExportToExcel, ruc } = useEstadoCuenta(mes, anio);


  const handleYearChange = (year: string) => setAnio(year);
  const handleMonthChange = (month: string) => setMes(month);

  if (loading) {
    return <div className="flex justify-center"> <Spinner color="secondary" label="Cargando Registros..."></Spinner></div>
  }

  return (
    <div className="p-6 bg-white shadow rounded-md">
    <div className="mb-4 flex justify-center">
  <div className="inline-flex max-w-full">
    <Input
      color="secondary"
      variant="flat"
      value={ruc || "Sin RUC"}
      className="text-center px-2"
      disabled
      style={{
        width: `${(ruc?.length || 8) + 4}ch`, // ancho en función del texto (aproximado)
        textAlign: "center",
      }}
    />
  </div>
</div>

      <div className="mb-4 flex justify-start md:items-center gap-4">
        <Select className="w-32" color="secondary" size="sm" selectedKeys={[anio]} onChange={(e) => handleYearChange(e.target.value)}>
          {years.map((year) => <SelectItem key={year.key}>{year.label}</SelectItem>)}
        </Select>
        <Select selectedKeys={[mes]} onChange={(e) => handleMonthChange(e.target.value)} className="w-32" color="secondary" size="sm">
          {month.map((month) => <SelectItem key={month.key} value={month.key}>{month.label}</SelectItem>)}
        </Select>
      </div>

      <Button className="bg-success text-white ml-auto mb-4" onPress={handleExportToExcel} size="sm" isLoading={loadingExcel}>Exportar Excel</Button>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 p-0.5 gap-2 text-center   border-2 border-primary_sokso rounded-lg">
        <div className="flex flex-col " >
          <span className="font-bold bg-primary_sokso text-white p-0.5 rounded-md  text-xs">TOTAL FACTURA</span>
          <span className="mt-1 ">S/. {data?.resumen?.totalFacturas}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold bg-primary_sokso text-white p-0.5 rounded-md  text-xs">TOTAL NC</span>
          <span className="mt-1 ">S/. {data?.resumen?.totalNotasCredito}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold  bg-primary_sokso text-white p-0.5 rounded-md  text-xs">TOTAL DEPÓSITOS</span>
          <span className="mt-1 ">S/. {data?.resumen?.totalDepositos}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold  bg-primary_sokso text-white p-0.5 rounded-md  text-xs">SALDO</span>
          <span className="mt-1 ">S/. {data?.resumen?.saldoFinal}</span>
        </div>
      </div>

      {data && data?.items?.length > 0 && (
        <>
          <div className="mt-6 overflow-x-auto hidden sm:block">
            <table className="w-full text-sm border border-gray-200" >
              <thead className="bg-primary_sokso text-left text-white rounded-md">
                <tr>
                  <th className="border px-3 py-2 text-xs">Clase de Documento</th>
                  <th className="border px-3 py-2 text-xs">Fecha</th>
                  <th className="border px-3 py-2 text-xs">N° Pedido</th>
                  <th className="border px-3 py-2 text-xs">N° Documento</th>
                  <th className="border px-3 py-2 text-xs">Importe</th>
                  <th className="border px-3 py-2 text-xs">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border px-3 py-2 text-xs">{item.tipo}</td>
                    <td className="border px-3 py-2 text-xs">{item.trandate}</td>
                    <td className="border px-3 py-2 text-xs">{item.textoAuxiliar100_5 || "-"}</td>
                    <td className="border px-3 py-2 text-xs">{item.documento || "-"}</td>
                    <td className="border px-3 py-2 text-xs">S/. {parseFloat(item.importe).toFixed(2)}</td>
                    <td className="border px-3 py-2 text-xs">S/. {parseFloat(item.saldo).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="block sm:hidden mt-4 space-y-3">
            {data.items.map((item, idx) => (
              <div key={idx} className="border rounded-md p-3 shadow-sm bg-white text-sm">
                <div className="mb-1 text-xs"><strong>Clase Doc.:</strong> {item.tipo}</div>
                <div className="mb-1 text-xs"><strong>Fecha:</strong> {item.trandate}</div>
                <div className="mb-1 text-xs"><strong>N° Pedido:</strong> {item.textoAuxiliar100_5 || "-"}</div>
                <div className="mb-1 text-xs"><strong>N° Documento:</strong> {item.documento || "-"}</div>
                <div className="mb-1 text-xs"><strong>Importe:</strong> S/. {parseFloat(item.importe).toFixed(2)}</div>
                <div className="text-xs "><strong>Saldo:</strong> S/. {parseFloat(item.saldo).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {data && data.depositos && (
        <div className="mt-6">
          <div
            className="bg-primary_sokso text-white px-4 py-2 rounded-md mb-2 flex items-center justify-between cursor-pointer"
            onClick={() => setShowDepositos(!showDepositos)}
          >
            <span>Depósitos - Total: S/. {Number(data.depositos.totalDeposito).toFixed(2)}</span>
            <button className="bg-white text-primary_sokso rounded-full w-6 h-6 text-center font-bold">
              {showDepositos ? "−" : "+"}
            </button>
          </div>

          {showDepositos && data.depositos.detalles.length > 0 && (
            <div className="grid gap-2 text-sm">
              {data.depositos.detalles.map((dep, idx) => (
                <div key={idx} className="border rounded-md px-4 py-2 shadow-sm bg-gray-50">
                  <div><strong>Fecha:</strong> {dep.trandate}</div>
                  <div><strong>N° Operación:</strong> {dep.memo}</div>
                  <div><strong>Monto:</strong> S/. {Number(dep.foreigntotal).toFixed(2)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default EstadoCuenta;
