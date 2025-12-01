import { LIMIT_PRODUCT_CART as LPC } from "@/utils/const";
import { priceFormat } from "@/utils/priceFormat";
import { toast } from "react-toastify";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ProductSelected } from "@/app/types/product.types";

export interface CartState {
  isOpen: boolean;
  productsCart: ProductSelected[];
  createdAt?: number;
  toggleCart: () => void;
  addProductCart: (product: ProductSelected) => void;
  addProductOrder: (product: ProductSelected) => void;
  addOneProductCart: (id: string | number) => void;
  removeOneProductCart: (id: string | number) => void;
  removeProductCart: (id: string | number) => void;
  getTotalPrice: () => {
    totalSugerido: number;
    totalPromotor: number;
    totalDirector: number;
  };
  getTotalQuantity: () => number;
  makeMessageWhatsapp: (url: string) => string | undefined;
  clearCart: () => void;
}

// Verificamos si el carrito ha expirado (12 horas = 43200000 ms)
const checkCartExpiration = () => {
  if (typeof window !== "undefined") {
    const cartData = localStorage.getItem("cart-storage");
    if (cartData) {
      try {
        const parsedData = JSON.parse(cartData);
        const state = parsedData.state;
        if (state && state.createdAt) {
          if (Date.now() - state.createdAt > 43200000) {
            // Si han pasado más de 12 horas, eliminamos el carrito
            localStorage.removeItem("cart-storage");
          }
        }
      } catch (e) {
        console.error(e);
        // Si hay un error al analizar el carrito, lo eliminamos
        localStorage.removeItem("cart-storage");
      }
    }
  }
};

// Ejecutamos la verificación de expiración
checkCartExpiration();

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      productsCart: [],
      createdAt: Date.now(), // Timestamp para control de expiración

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addProductCart: (product) =>
        set((state) => {
          const existingProduct = state.productsCart.find(
            (item) => item.id === product.id
          );

          if (product.quantity - (existingProduct?.quantity || 0) > LPC) {
            toast.error("No puedes agregar más de 10 productos por talla", {
              style: {
                border: "1px solid  #c8968b ",
              },
            });
            return state;
          }

          let updatedProducts;
          if (existingProduct) {
            if (product.quantity === existingProduct.quantity) {
              toast.warn("Ya tienes este producto en el carrito");
              return state;
            } else {
              updatedProducts = state.productsCart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: product.quantity }
                  : item
              );
            }
          } else {
            updatedProducts = [...state.productsCart, product];
          }

          set({ isOpen: true });
          return { productsCart: updatedProducts };
        }),

      addProductOrder: (product) =>
        set((state) => {
          const existingProduct = state.productsCart.find(
            (item) => item.id === product.id
          );

          if (product.quantity - (existingProduct?.quantity || 0) > LPC) {
            toast.error("No puedes agregar más de 10 productos por talla", {
              style: {
                border: "1px solid  #c8968b ",
              },
            });
            return state;
          }

          let updatedProducts;
          if (existingProduct) {
            updatedProducts = state.productsCart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: product.quantity }
                : item
            );
          } else {
            updatedProducts = [...state.productsCart, product];
          }

          return { productsCart: updatedProducts };
        }),

      addOneProductCart: (id) =>
        set((state) => {
          const existingProduct = state.productsCart.find(
            (item) => item.id === id
          );
          if (!existingProduct) {
            return state;
          }

          if (existingProduct.quantity + 1 > LPC) {
            toast.error("No puedes agregar más de 10 productos por talla", {
              style: {
                border: "1px solid  #c8968b ",
              },
            });
            return state;
          }

          const updatedProducts = state.productsCart.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          );

          return { productsCart: updatedProducts };
        }),

      removeOneProductCart: (id) =>
        set((state) => {
          const updatedProducts = state.productsCart.map((product) =>
            product.id === id && product.quantity > 1
              ? { ...product, quantity: product.quantity - 1 }
              : product
          );

          return { productsCart: updatedProducts };
        }),

      removeProductCart: (id) =>
        set((state) => {
          const updatedProducts = state.productsCart.filter(
            (product) => product.id !== id
          );

          return { productsCart: updatedProducts };
        }),

      getTotalPrice: () => {
        const { productsCart } = get();

        const totalSugerido = productsCart.reduce(
          (acc, item) => acc + item.prices.nPrecioSugerido * item.quantity,
          0
        );

        const totalPromotor = productsCart.reduce(
          (acc, item) => acc + item.prices.nPrecioPromotor * item.quantity,
          0
        );

        const totalDirector = productsCart.reduce(
          (acc, item) => acc + item.prices.nPrecioDirector * item.quantity,
          0
        );

        return {
          totalSugerido,
          totalPromotor,
          totalDirector,
        };
      },

      getTotalQuantity: () => {
        const { productsCart } = get();
        return productsCart.reduce((acc, item) => acc + item.quantity, 0);
      },

      makeMessageWhatsapp: () => {
        const { productsCart, getTotalPrice } = get();

        if (productsCart.length === 0) {
          toast.error("No hay productos en el carrito");
          return undefined;
        }

        let message = "";

        const order = {
          catalogs: [] as {
            date: string;
            name: string;
            products: {
              model: string;
              items: {
                size: number;
                quantity: number;
                color: string;
                price: number;
              }[];
            }[];
          }[],
        };

        productsCart.forEach((product) => {
          const catalog = product.catalog;
          const model = product.model;
          const size = Number(product.sizeName);
          const color = product.color;
          const price = product.prices.nPrecioSugerido;
          const quantity = product.quantity;

          const catalogIndex = order.catalogs.findIndex(
            (c) => c.name === catalog
          );
          if (catalogIndex === -1) {
            order.catalogs.push({
              name: catalog,
              date: product.date,
              products: [
                {
                  model,
                  items: [{ size, quantity, color, price }],
                },
              ],
            });
          } else {
            const productIndex = order.catalogs[
              catalogIndex
            ].products.findIndex((p) => p.model === model);
            if (productIndex === -1) {
              order.catalogs[catalogIndex].products.push({
                model,
                items: [{ size, quantity, color, price }],
              });
            } else {
              order.catalogs[catalogIndex].products[productIndex].items.push({
                size,
                quantity,
                color,
                price,
              });
            }
          }
        });

        order.catalogs.forEach((catalog) => {
          message += "\n";
          message += `Catálogo: *${catalog.name}*\n`;
          catalog.products.forEach((product) => {
            message += `Modelo: ${product.model}\n`;
            product.items.forEach((item) => {
              message += `- Color: ${item.color.toLowerCase()} Talla: ${
                item.size
              } Cantidad: ${item.quantity}  Precio: ${priceFormat(
                item.price * item.quantity
              )}\n`;
            });
          });
          if (new Date(catalog.date) > new Date()) {
            const fecha = new Date(catalog.date).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "long",
            });
            message = message + "Disponible desde el " + fecha + "";
          }
          message += "\n";
        });

        message += `\n*PRECIO TOTAL : ${priceFormat(
          getTotalPrice().totalSugerido
        )}*\n`;

        message += "\n*_por favor confirmar la disponibilidad de mi pedido_*";

        return message;
      },

      clearCart: () => set({ productsCart: [] }),
    }),
    {
      name: "cart-storage", // nombre de la clave en localStorage
      storage: createJSONStorage(() => localStorage),
      version: 1, // Útil para migraciones futuras
      onRehydrateStorage: () => {
        // Función opcional que se ejecuta cuando se rehidrata el estado desde localStorage
        return (state) => {
          if (state) {
            // Verificar expiración cuando se rehidrata el estado
            if (state.createdAt && Date.now() - state.createdAt > 43200000) {
              // Si han pasado más de 12 horas, limpiar el carrito
              state.productsCart = [];
              state.createdAt = Date.now();
            }
          }
        };
      },
    }
  )
);

export default useCartStore;
