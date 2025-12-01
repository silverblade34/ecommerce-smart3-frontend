interface SizeProduct {
  sTalla: string;
}

export const sizeOrder = (arr: SizeProduct[]): SizeProduct[] => {
  const arr_order = [
    1,
    1.5,
    2,
    2.5,
    3,
    3.5,
    4,
    4.5,
    5,
    5.5,
    6,
    6.5,
    7,
    7.5,
    8,
    8.5,
    9,
    9.5,
    10,
    10.5,
    11,
    11.5,
    12,
    12.5,
    13,
    13.5,
    14,
    16,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    26.5,
    27,
    27.5,
    28,
    28.5,
    29,
    29.5,
    30,
    30.5,
    31,
    31.5,
    32,
    32.5,
    33,
    33.5,
    34,
    34.5,
    35,
    35.5,
    36,
    37,
    38,
    38.5,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    "XS",
    "S",
    "S/M",
    "M",
    "M/L",
    "L",
    "XL",
    "2XL",
    "32B",
    "34B",
    "34C",
    "36B",
    "36C",
    "38C",
    "40C",
    "UNC",
  ];

  // Crear un mapa para facilitar la búsqueda del índice de cada talla
  const orderMap = new Map(
    arr_order.map((size, index) => [size.toString(), index])
  );

  // Ordenar el array basado en el índice en arr_order
  return arr.sort((a, b) => {
    const indexA = orderMap.get(a.sTalla) ?? Number.MAX_SAFE_INTEGER;
    const indexB = orderMap.get(b.sTalla) ?? Number.MAX_SAFE_INTEGER;
    return indexA - indexB;
  });
};
