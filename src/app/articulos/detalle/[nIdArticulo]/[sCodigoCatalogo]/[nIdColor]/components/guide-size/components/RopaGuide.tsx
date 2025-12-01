import { ITemplateRopa } from "../interfaces/responseGuideSize";

/**
 * Talla	Código PE	Ancho de Hombros	Circunferencia de Pecho	Circunferencia de Cintura	Circunferencia de Cadera	Circunferencia de Muslo	Altura de Persona
 */

const headersKeysRopa = [
    { key: "size_value", label: "Talla" },
    { key: "shoulder_width", label: "Hombros" },
    { key: "chest_circumference", label: "Pecho" },
    { key: "waist_circumference", label: "Cintura" },
    { key: "hip_circumference", label: "Cadera" },
    { key: "thigh_circumference", label: "Muslo" },
    { key: "height_person", label: "Altura" },
];

type Props = {
    templateGuide: ITemplateRopa[];
}

export const RopaGuide = ({ templateGuide }: Props) => {
  const filteredHeaders = headersKeysRopa.filter((header) =>
    templateGuide.some((row) => {
      const value = row[header.key as keyof ITemplateRopa];
      return value != null && value !== "";
    })
  );

  return (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full text-center">
            <thead>
              <tr className="bg-primary_sokso">
                {filteredHeaders.map((header) => (
                  <th key={header.key} className="border px-4 py-2 text-white">
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {templateGuide.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {filteredHeaders.map((header) => (
                    <td key={header.key} className="border px-4 py-2">
                      {row[header.key as keyof ITemplateRopa]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  )

}