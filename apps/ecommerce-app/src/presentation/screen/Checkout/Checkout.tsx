import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@shopifruta/ui";
import { Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import useCheckoutPresenter from "../../presenter/Checkout.presenter";

export const CheckoutView: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentInvoice,
    showSuccessView,
    handleInputChange,
    isSubmitting,
    handleSubmit,
    formData,
    errors,
    countries,
    countryError,
    loadingCountries,
    taxes,
    subtotal,
    total,
    user,
    items,
  } = useCheckoutPresenter();

  if (showSuccessView && currentInvoice) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-green-50 p-6 border-b border-green-100 flex items-center justify-center flex-col">
            <CheckCircle size={64} className="text-green-500 mb-4" />
            <h1 className="text-2xl font-bold text-center">¡Compra Exitosa!</h1>
            <p className="text-green-700 mt-2">
              Tu compra ha sido procesada correctamente
            </p>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Detalles de la Compra
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Información de Envío
                </h3>
                <p className="font-medium">{currentInvoice.name}</p>
                <p>{currentInvoice.email}</p>
                <p>{currentInvoice.phone}</p>
                <p>{currentInvoice.country}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Información de la Factura
                </h3>
                <p>
                  <span className="font-medium">Factura:</span>{" "}
                  {currentInvoice.invoiceId}
                </p>
                <p>
                  <span className="font-medium">Fecha:</span>{" "}
                  {new Date(currentInvoice.date).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Hora:</span>{" "}
                  {new Date(currentInvoice.date).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="border rounded-md overflow-hidden mb-6">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Producto
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                      Cantidad
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      Precio
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentInvoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3 text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">
                        ${item.price.toLocaleString()}
                        {item.tax > 0 && (
                          <span className="text-xs text-gray-500 ml-1">
                            +{(item.tax * 100).toFixed(0)}%
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        $
                        {(
                          item.price *
                          (1 + item.tax) *
                          item.quantity
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-2 max-w-xs ml-auto">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>${currentInvoice.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Impuestos:</span>
                <span>${currentInvoice.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total:</span>
                <span>${currentInvoice.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button
                className="text-white"
                onClick={() => navigate("/my-invoices")}
              >
                Ver mis facturas
              </Button>
              <p className="mt-4 text-sm text-gray-500">
                Se ha guardado una copia de esta factura en tu dispositivo
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Finalizar Compra</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-6">Información de Envío</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ingresa tu nombre completo"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ingresa tu número de teléfono"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } ${user?.email ? "bg-gray-50" : ""}`}
                  placeholder="Ingresa tu correo electrónico"
                  readOnly={!!user?.email} // Campo de solo lectura si el usuario ya tiene email
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
                {user?.email && (
                  <p className="mt-1 text-xs text-gray-500">
                    Email asociado con tu cuenta
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  País (América)
                </label>
                <input
                  type="text"
                  name="country"
                  id="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.country ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ingresa tu país"
                  list="countries"
                />
                <datalist id="countries">
                  {countries.map((country) => (
                    <option key={country.cca2} value={country.name.common} />
                  ))}
                </datalist>
                {errors.country && (
                  <p className="mt-1 text-xs text-red-500">{errors.country}</p>
                )}
                {loadingCountries && (
                  <p className="mt-1 text-xs text-gray-500">
                    Cargando países...
                  </p>
                )}
                {countryError && (
                  <p className="mt-1 text-xs text-red-500">
                    Error al cargar países. Por favor ingresa un país válido de
                    América.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between mt-8">
                <button
                  type="button"
                  onClick={() => navigate("/cart")}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Volver al carrito
                </button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[150px] bg-primary text-white"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Procesando...
                    </span>
                  ) : (
                    "Completar compra"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="md:w-1/2">
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Resumen de la Orden</h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between items-center py-2 border-b"
                >
                  <div className="flex items-start">
                    <div className="bg-gray-100 w-12 h-12 rounded-md flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-xs text-gray-500">IMG</span>
                    </div>
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">
                    $
                    {(
                      item.product.price *
                      (1 + item.product.tax) *
                      item.quantity
                    ).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Impuestos</span>
                <span>${taxes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-500 mb-1">
                Métodos de pago aceptados:
              </p>
              <div className="flex space-x-2">
                <div className="bg-gray-100 rounded px-2 py-1 text-xs">
                  Visa
                </div>
                <div className="bg-gray-100 rounded px-2 py-1 text-xs">
                  MasterCard
                </div>
                <div className="bg-gray-100 rounded px-2 py-1 text-xs">
                  PayPal
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                * Esta es una tienda de demostración. No se realizarán cargos
                reales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;
