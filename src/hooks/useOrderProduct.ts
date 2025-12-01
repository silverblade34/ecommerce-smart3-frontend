import { ProductSelected } from "@/app/types/product.types";
import useCartStore from "@/context/cart/cart-store";
import useStockStore from "@/context/stock/stock-store";
import { DetalleProducto, Talla } from "@/lib/interfaces/articulo";
import { useEffect, useState } from "react";

export const useOrderProduct = (
  product: DetalleProducto,
  tallaSeleccionada: number | null
) => {
  const [item, setItem] = useState<ProductSelected | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [tallaVariant, setTallaVariant] = useState<Talla | undefined>(
    undefined
  );
const { stockTallas } = useStockStore();
  const {
    productsCart,
    addProductCart,
    makeMessageWhatsapp,
    addProductOrder,
    clearCart,
  } = useCartStore();

  useEffect(() => {
    const talla = stockTallas?.find(
      (talla) => talla.nIdTalla == tallaSeleccionada
    );

    if (!talla) return;

    setTallaVariant(talla);
    const initialQuantity = talla.nStockDisponible === 0 ? 0 : 1;

    const productInCart = productsCart.find(
      (item) => item.id === product.nIdArticulo
    );

    if (productInCart) {
      setQuantity(productInCart.quantity);
      setItem(productInCart);
    } else {
      const newItem: ProductSelected = {
        id: talla.sItemName,
        catalog: product.catalogo.sCodigoCatalogo,
        size: talla.nIdTalla,
        sizeName: talla.sTalla,
        model: product.modelo.sDescripcion,
        brand: product.marca.sNombreMarca,
        name: product.sDescripcion,
        color: product.colorSeleccionado.sDenominacion,
        colorName: product.colorSeleccionado.sColorEcommerce,
        prices: product.precios,
        quantity: initialQuantity,
        date: product.catalogo.dFechaHoraInicio,
        image:
          product.imagenes?.[0]?.sNombreArchivo ||
          "/images/imagen-no-disponible.jpg",
        maxQuantity: talla.nStockDisponible,
        sNivelPrecioId: product.sNivelPrecioId,
        sSkuHijo: talla.sItemName,
        sTipoCatalogo: product.catalogo.sTipoCatalogo
      };
      setItem(newItem);
      setQuantity(initialQuantity);
    }
  }, [productsCart, tallaSeleccionada, product]);

  const handleIncreaseQuantity = () => {
     console.log(tallaVariant)
    if (!tallaVariant) return;
    // console.log("entro")
    if (item && quantity < tallaVariant.nStockDisponible) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      setItem({ ...item, quantity: newQuantity });
    }
  };

  const handleDecreaseQuantity = () => {
    if (item && quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      setItem({ ...item, quantity: newQuantity });
    }
  };

  const handleAddToCart = () => {   
    if (item && item.quantity > 0) {
      addProductCart(item);
    }
  };

  const handleAddToOrder = () => {
    if (item && item.quantity > 0) {
      addProductOrder(item);
    }
  };




  return {
    item,
    quantity,
    // updateProductStocks,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleAddToCart,
    makeMessageWhatsapp,
    handleAddToOrder,
    clearCart,
    tallaVariant,
  };
};
