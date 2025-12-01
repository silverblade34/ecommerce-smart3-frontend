const pasosMedicion = [
  {
    titulo: "Paso 1:",
    descripcion:
      "Párate en el papel con los talones pegados a la pared y marca con un lápiz hasta donde llegue tu dedo más largo.",
    imagen: "/images/guia-talla/paso_1.png",
  },
  {
    titulo: "Paso 2:",
    descripcion:
      "Usa una cinta métrica o regla para medir desde el borde hasta la marca del lápiz.",
    imagen: "/images/guia-talla/paso_2.png",
  },
  {
    titulo: "Paso 3:",
    descripcion:
      "Ubica tu talla en el cuadro según la medida de tu pie en centímetros (cm).",
    imagen: null, // no muestra imagen
  },
];

export const GuiaMedidaPie = () => {
  return (
    <section className="my-4">
      <div className="flex justify-center">
        <h3 className="text-center text-primary_sokso font-bold text-3xl uppercase">
          ¿Cómo medir tu pie?
        </h3>
      </div>

      <div className="mt-6 flex flex-col justify-start gap-2">
        {pasosMedicion.map((step, index) => {
          return (
            <div
              key={index}
              className={`flex flex-col gap-4 
              ${step.imagen ? "md:flex-row md:items-center md:gap-6" : ""}`}
            >
              {/* Texto */}
              <div className={step.imagen ? "md:w-1/2" : "w-full"}>
                <p className="uppercase text-primary_sokso font-semibold text-lg">
                  {step.titulo}
                </p>
                <p className="text-gray-600 text-lg">{step.descripcion}</p>
              </div>

              {/* Imagen solo si existe */}
              {step.imagen && (
                <div className="md:w-1/2 flex justify-center items-center">
                  <img
                    className="w-full max-w-60 h-auto"
                    src={step.imagen}
                    alt={step.titulo}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
