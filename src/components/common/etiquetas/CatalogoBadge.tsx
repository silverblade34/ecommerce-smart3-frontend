import clsx from "clsx";

interface CatalogoBadgeProps {
    tipo?: string;
    codigo?: string;
    position?: string;
    variant?: "default" | "circle";
}

export default function CatalogoBadge({
    tipo,
    codigo,
    position = "absolute right-3 top-3",
    variant = "default",
}: CatalogoBadgeProps) {
    const upperTipo = tipo?.toUpperCase();

    // Sólo se muestran estos tipos
    if (upperTipo !== "CYBER" && upperTipo !== "PREVENTA" && upperTipo !== "PREMIOS" && upperTipo !== "GRATIS" && upperTipo !== "SHOWROOM" && upperTipo !== "PREVENTA CATALOGO") {
        return null;
    }

    // Color por tipo
    const bgColor =
        upperTipo == "SHOWROOM" ?
            "bg-gray_sokso" :
            upperTipo === "CYBER"
                ? "bg-pink"
                : upperTipo === "PREMIOS"
                    ? "bg-primary_sokso"
                    : upperTipo === "PREVENTA" ?
                        "bg-cyan"
                        : upperTipo === "PREVENTA CATALOGO" ?
                        "bg-vino_sokso"
                        : "bg-yellow";


    const tipoCarrito =
        upperTipo === "CYBER" ? "C"
            : upperTipo === "PREMIOS" || upperTipo == "PREVENTA" ? "P"
                : upperTipo === "SHOWROOM" ? "S" :
                    upperTipo == "PREVENTA CATALOGO" ? "PC" :
                        "G";// CATALOGO GRATUITO 

    // Variante circular 
    if (variant === "circle") {
        return (
            <div
                className={clsx(
                    position,
                    "z-10 h-5 w-5 rounded-full text-white flex items-center justify-center",
                    bgColor
                )}
            >
                <p className="text-xs">{tipoCarrito}</p>
            </div>
        );
    }

    // Texto variante default
    let text = upperTipo;
    if (upperTipo === "GRATIS") {
        text = "Catálogo Gratuito";
    } else if (upperTipo === "PREVENTA") {
        text = "Preventa";
    } else if (upperTipo === "CYBER") {
        text = "Cyber";
    } else if (upperTipo === "PREMIOS") {
        text = "Premios";
    } else if (upperTipo === "PREVENTA CATALOGO") {
        text = "Preventa Catálogo";
    } else if (upperTipo === "SHOWROOM") {
        text = "Showroom";
    }

    return (
        <div
            className={clsx(
                position,
                "z-10 text-white rounded-lg p-1 text-xs",
                bgColor
            )}
        >
            {text}
        </div>
    );
}