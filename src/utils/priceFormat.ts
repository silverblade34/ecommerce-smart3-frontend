export const priceFormat = (price: number | string) => {
  const formatter = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  });

  if (Number.isInteger(Number(price))) {
    return formatter.format(Number(price)).replace(/\.00/g, '');
  } else {
    return formatter.format(Number(price));
  }
};
