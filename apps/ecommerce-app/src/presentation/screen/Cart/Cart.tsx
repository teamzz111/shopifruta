import React from "react";
import { Button } from "@shopifruta/ui";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useCartPresenter from "../../presenter/Cart.presenter";

export const CartView: React.FC = () => {
  const { removeFromCart, total, items, updateQuantity, subtotal, taxes } =
    useCartPresenter();

  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center p-8 border rounded-lg shadow-sm">
          <div className="flex justify-center mb-4">
            <ShoppingBag size={64} className="text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
          <p className="mb-6 text-gray-600">
            Parece que aún no has añadido productos a tu carrito de compras.
          </p>
          <Link to="/">
            <Button>
              <ArrowLeft size={16} className="mr-2" />
              Volver a la tienda
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Carrito de Compras
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items list */}
        <div className="lg:w-2/3">
          <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-semibold text-lg">Productos en tu carrito</h2>
            </div>
            <div className="divide-y">
              {items.map((item) => {
                const priceWithTax =
                  item.product.price * (1 + item.product.tax);
                const itemSubtotal = priceWithTax * item.quantity;

                return (
                  <div key={item.product.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start">
                      {/* Imagen del producto */}
                      <div className="h-20 w-20 bg-gray-100 rounded-md flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-gray-400 text-xs">Imagen</span>
                      </div>

                      {/* Información del producto */}
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium text-lg">
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {item.product.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              ${priceWithTax.toLocaleString()}
                            </p>
                            {item.product.tax > 0 && (
                              <p className="text-xs text-gray-500">
                                Incluye {(item.product.tax * 100).toFixed(0)}%
                                de impuestos
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Controles de cantidad y subtotal */}
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center border rounded-md">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              className="p-2 hover:bg-gray-100 rounded-l-md"
                              disabled={item.quantity <= 1}
                            >
                              <Minus
                                size={16}
                                className={
                                  item.quantity <= 1 ? "text-gray-300" : ""
                                }
                              />
                            </button>
                            <span className="w-10 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  Math.min(
                                    item.product.stock,
                                    item.quantity + 1
                                  )
                                )
                              }
                              className="p-2 hover:bg-gray-100 rounded-r-md"
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus
                                size={16}
                                className={
                                  item.quantity >= item.product.stock
                                    ? "text-gray-300"
                                    : ""
                                }
                              />
                            </button>
                          </div>

                          <div className="flex items-center">
                            <p className="font-medium mr-4">
                              ${itemSubtotal.toLocaleString()}
                            </p>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-red-500 hover:text-red-700 transition-colors p-1"
                              title="Eliminar"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4">
            <Link
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
            >
              <ArrowLeft size={16} className="mr-1" />
              Continuar comprando
            </Link>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:w-1/3">
          <div className="bg-white border rounded-lg p-6 sticky top-24 shadow-sm">
            <h2 className="text-lg font-bold mb-4 pb-2 border-b">
              Resumen de la orden
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Impuestos</span>
                <span>${taxes.toLocaleString()}</span>
              </div>
              <div className="border-t pt-3 mt-3 font-bold flex justify-between text-lg">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>

            <Button
              onClick={() => navigate("/checkout")}
              className="w-full text-white"
            >
              <ShoppingCart size={18} className="mr-2" />
              Proceder al pago
            </Button>

            <p className="mt-4 text-xs text-gray-500 text-center">
              Los impuestos son calculados según la tasa correspondiente a cada
              producto
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartView;
