import { useState } from 'react';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getDirectoraPorEstrella, sendOrders, validateStock } from '@/server/actions/pedido';
import { useModalStore } from "@/context/cart/modal-store";
import { useRouter } from 'next/navigation';
import useCartStore from '@/context/cart/cart-store';
import { PedidoData } from '@/lib/global';
import useEstrellaStore from '@/context/orders/start-store';
import { usePathname } from 'next/navigation';
import useStockStore from '@/context/stock/stock-store';
import { getStockTallas } from '@/server/actions/articulo';
import { signOut } from 'next-auth/react';


export const useCreatePedido = () => {
    const { setStockTallas, nIdArticulo,
        nIdColor,
        nIdListaPrecio } = useStockStore();
    const { push } = useRouter();
    const { setEstrellaSeleccionada, sTipo, idCliente } = useEstrellaStore();
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);
    const { toggleCart, clearCart } = useCartStore();



    const handleEnviarPedido = async (payload: PedidoData, mostrarCarrito: boolean) => {
        setLoading(true);
        try {
            let finalPayload = payload;

            if (sTipo?.toUpperCase() === "ESTRELLA") {
                const res = await getDirectoraPorEstrella(idCliente || 0);
                const directoraId = res?.nPadreId || 0;
                finalPayload = {
                    ...payload,
                    clienteId: directoraId,
                };
            }

            const responseStock = await validateStock(finalPayload);
            if (responseStock.status === 401) {
                localStorage.clear();
                clearCart();
                signOut({ callbackUrl: "/" });
                return;
            }
            if (responseStock.status == 200) {
                const { itemsCorrectos, itemsIncorrectos } = responseStock.pedido;


                //TODOS CON STOCK
                if (itemsCorrectos.length == payload.detalles.length) {
                    await procesarPedido(finalPayload, mostrarCarrito, [], finalPayload);
                }

                //TODOS LOS ARTÍCULOS NO TIENEN STOCK O NINGUNO TIENE LA CANTIDAD SOLICITADA
                else if (itemsCorrectos.length == 0) {
                    const hayInactivos = itemsIncorrectos.some(
                        (ii: any) => ii.estadoCatalogo?.toUpperCase() === "INACTIVO"
                    );
                    const mensaje = hayInactivos ? (
                        <div>
                            <p className="text-sm text-gray-700">
                                Algunos productos se agotaron hace unos instantes o pertenecen a un catálogo no vigente.
                                Revisa tu carrito.
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-sm text-gray-700">
                                Algunos productos se agotaron hace unos instantes. Revisa tu carrito.
                            </p>
                        </div>
                    );

                    toast.warning(mensaje, { autoClose: 10000 });

                    useCartStore.setState((state) => ({
                        productsCart: state.productsCart.map((p) => {
                            const incorrecto = itemsIncorrectos.find(
                                (ii: any) => ii.sSkuHijo === p.sSkuHijo
                            );

                            if (incorrecto) {
                                if (incorrecto.estadoCatalogo?.toUpperCase() === "INACTIVO") {
                                    return {
                                        ...p,
                                        agotado: true,
                                        stockDisponible: 0,
                                        articuloNoVigente: true,
                                    };
                                }

                                return {
                                    ...p,
                                    agotado: true,
                                    stockDisponible: incorrecto.detalleError?.stockDisponible ?? 0,
                                };
                            }

                            return p;
                        }),
                    }));
                    const stock = await getStockTallas(Number(nIdArticulo), nIdColor ?? "", Number(nIdListaPrecio));
                    if (Array.isArray(stock)) {
                        setStockTallas(stock);
                    }
                }

                //ALGUNOS ARTÍCULOS NO TIENEN LA CANTIDAD SOLICITADA O SIN STOCK
                else {
                    const payloadCorrectos = {
                        ...finalPayload,
                        detalles: finalPayload.detalles.filter((d) =>
                            itemsCorrectos.some((ic: any) => ic.sSkuHijo === d.sSkuHijo)
                        ),
                    };
                    useCartStore.setState((state) => ({
                        productsCart: state.productsCart.map((p) => {
                            const incorrecto = itemsIncorrectos.find(
                                (ii: any) => ii.sSkuHijo === p.sSkuHijo
                            );

                            if (incorrecto) {
                                if (incorrecto.estadoCatalogo?.toUpperCase() === "INACTIVO") {
                                    return {
                                        ...p,
                                        agotado: true,
                                        stockDisponible: 0,
                                        articuloNoVigente: true,
                                    };
                                }

                                return {
                                    ...p,
                                    agotado: true,
                                    stockDisponible: incorrecto.detalleError?.stockDisponible,
                                };
                            }

                            return p;
                        }),
                    }));
                    await procesarPedido(payloadCorrectos, mostrarCarrito, itemsIncorrectos, finalPayload);
                }
            } else {
                toast.error("No se logró validar el stock. Intente más tarde.");
            }
        } catch (error) {
            toast.error("Error al enviar el pedido");
        } finally {
            setLoading(false);
        }
    };

    const procesarPedido = async (payload: PedidoData, mostrarCarrito: boolean, itemsIncorrectos: any[] = [], finalPayload: PedidoData) => {
        try {
            if (itemsIncorrectos.length > 0) {
                useCartStore.setState((state) => ({
                    productsCart: state.productsCart
                        .map((p) => {
                            const incorrecto = itemsIncorrectos.find(
                                (ii: any) => ii.sSkuHijo === p.sSkuHijo
                            );
                            if (incorrecto) {
                                return {
                                    ...p,
                                    agotado: true,
                                    stockDisponible: incorrecto.detalleError?.stockDisponible,
                                };
                            }
                            return p;
                        })
                        .filter(Boolean) as any,
                }));
            }
            const response = await sendOrders(payload);
            if (response.status === 401) {
                localStorage.clear();
                clearCart();
                signOut({ callbackUrl: "/" });
                return;
            }
            if (response.pedido?.status === 201) {
                if (itemsIncorrectos.length == 0) {
                    toast.success(response.pedido.message);
                } else {
                    const hayInactivos = itemsIncorrectos.some(
                        (ii: any) => ii.estadoCatalogo?.toUpperCase() === "INACTIVO"
                    );

                    const mensaje = hayInactivos ? (
                        <div>
                            <p className="text-md font-bold text-black">Pedido enviado con éxito✅</p>
                            <p className="text-sm text-gray-700">
                                Algunos productos se agotaron hace unos instantes o pertenecen a un catálogo no vigente.
                                Revisa tu carrito.
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-md font-bold text-black">Pedido enviado con éxito✅</p>
                            <p className="text-sm text-gray-700">
                                Algunos productos se agotaron hace unos instantes. Revisa tu carrito.
                            </p>
                        </div>
                    );

                    toast.warning(mensaje, { autoClose: 10000 });
                }



                if (itemsIncorrectos.length > 0) {
                    useCartStore.setState((state) => ({
                        productsCart: state.productsCart
                            .map((p) => {
                                const incorrecto = itemsIncorrectos.find(
                                    (ii: any) => ii.sSkuHijo === p.sSkuHijo
                                );
                                if (incorrecto) {
                                    return {
                                        ...p,
                                        agotado: true,
                                        stockDisponible: incorrecto.detalleError?.stockDisponible,
                                    };
                                }
                                return null;
                            })
                            .filter(Boolean) as any,
                    }));
                } else {
                    clearCart();
                }
                if (mostrarCarrito) toggleCart();
                useModalStore.setState({ isDuplicadosOpen: false });
                if (payload.paraEstrella == false) {
                    push("/dashboard/pedidos/estrella");
                }
                setEstrellaSeleccionada(null, null);
                localStorage.removeItem("ecommerceFilters");
                if (pathname === "/articulos") window.location.reload();

            } else if (response.status === 409) {
                toggleCart();
                console.log(finalPayload)
                localStorage.setItem("duplicatePayload", JSON.stringify({ finalPayload }));
                useModalStore.setState({ isDuplicadosOpen: true, duplicateData: response });
            } else if (response.status === 400) {
                toast.warning(response.message || "Stock insuficiente");
            } else if (response.status == 504) {
                toast.error("Ocurrió un inconveniente. Intente más tarde.");
            } else {
                toast.error(response.message || "Error al procesar el pedido");
            }
            const stock = await getStockTallas(Number(nIdArticulo), nIdColor ?? "", Number(nIdListaPrecio));
            if (Array.isArray(stock)) {
                setStockTallas(stock);
            }
        } catch (error: any) {
            toast.error(error.message || "Error al procesar el pedido");
        }
    };

    return { loading, handleEnviarPedido };
};