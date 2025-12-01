import { ITemplateCalzado } from "../interfaces/responseGuideSize";

const headersKeysCalzado = [
  { key: "size", label: "Talla" },
  { key: "equivalent_size", label: "Talla Perú" },
  { key: "eu_size", label: "EU" },
  { key: "usa_size", label: "USA" },
  { key: "br_size", label: "BR" },
  { key: "cm_size", label: "Medida de pie" },
];

type Props = {
  templateGuide: ITemplateCalzado[];
};

// Sistema de medidas por defecto
// USA,EU,BR,PE

export const CalzadoGuide = ({ templateGuide }: Props) => {
  // Filtrar columnas donde TODOS los valores están completos (cambio de .some() a .every())
  const filteredHeaders = headersKeysCalzado.filter((header) =>
    templateGuide.every((row) => {
      const value = row[header.key as keyof ITemplateCalzado];
      return value != null && value !== "";
    })
  );

  const sistemaPorDefecto = templateGuide.length > 0 ? templateGuide[0] : null;
  const codigoSistemaPorDefecto = sistemaPorDefecto?.size.split(" ").pop();

  const mapperFinalHeader = filteredHeaders.filter(
    (header) => header.label !== codigoSistemaPorDefecto
  );

  // Si el sistema de medida es PE, no mostrar la columna PE ni la equivalente
  const mappperFinalHeader =
    codigoSistemaPorDefecto === "PE"
      ? mapperFinalHeader.filter((header) => header.label !== "Equivalente")
      : mapperFinalHeader;

  return (
    <div className="w-full overflow-x-auto">
      <table className="table-auto border-collapse border border-gray-300 w-full text-center">
        <thead>
          <tr className="bg-primary_sokso">
            {mappperFinalHeader.map((header) => (
              <th
                key={header.key}
                className="border px-4 py-2 text-white text-nowrap"
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {templateGuide.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {mappperFinalHeader.map((header) => (
                <td key={header.key} className="border px-4 py-2">
                  {row[header.key as keyof ITemplateCalzado]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
