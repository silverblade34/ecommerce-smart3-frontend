import dayjs from "dayjs";
export class Formats {
  static toPrice(value: number): string {
    return value.toLocaleString("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // el numero que esta en decimal se convierte a porcentaje
  // ejemplo: 0.25 = 25%
  static toPorcentage(value: number): string {
    return (value * 100).toFixed(2) + "%";
  }

  // la fecha llega como Date y se convierte a string
  static toDate(value?: Date): string {
    if (!value) return "";
    const result = dayjs(value).format("YYYY-MM-DD");
    return result;
  }

  static dateStringToDate(value: string): Date {
    return new Date(value);
  }

  static toDateFriendly(value: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return value.toLocaleDateString("es-PE", options);
  }

  static toDatePlain(value: Date): string {
    if (!value) return "";
    const result = dayjs(value).format("YYYY-MM-DD");
    return result;
  }

  static toTimeOfDate(value: Date): string {
    if (!value) return "";
    const result = dayjs(value).format("HH:mm:ss");
    return result;
  }
}
