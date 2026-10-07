import React, { useState } from "react";
import { Eye, Calendar, FileText } from "lucide-react";
import { Modal, Button } from "@shopifruta/ui";
import { Link } from "react-router-dom";
import { useUserInvoicesPresenter } from "../../presenter/UserInvoice.presenter";

const UserInvoices: React.FC = () => {
  const {
    invoices,
    selectedInvoice,
    loading,
    error,
    selectInvoice,
    clearSelectedInvoice,
  } = useUserInvoicesPresenter();
  const [showModal, setShowModal] = useState(false);

  const handleViewInvoice = (invoiceId: string) => {
    selectInvoice(invoiceId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    clearSelectedInvoice();
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
        <span>Cargando facturas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h2 className="text-red-800 font-semibold text-lg">Error</h2>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mis Facturas</h1>
        <Link to="/">
          <Button variant="outline">Volver a la tienda</Button>
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-medium mb-2">No tienes facturas</h2>
          <p className="text-gray-500 mb-6">
            Cuando realices compras, tus facturas aparecerán aquí.
          </p>
          <Link to="/">
            <Button>Ir a comprar</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nº Factura
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.invoiceId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="text-gray-400 mr-2" size={16} />
                      <span className="text-sm font-medium text-gray-900">
                        {invoice.invoiceId}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(invoice.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-gray-900">
                      ${invoice.total.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewInvoice(invoice.invoiceId)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye size={16} className="mr-1" />
                        Ver
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Invoice detail modal */}
      {selectedInvoice && (
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={`Factura ${selectedInvoice.invoiceId}`}
          className="max-w-3xl"
        >
          <div className="space-y-6">
            {/* Customer info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Información del Cliente
                </h3>
                <p className="font-medium">{selectedInvoice.name}</p>
                <p>{selectedInvoice.email}</p>
                <p>{selectedInvoice.phone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Detalles de la Factura
                </h3>
                <p>
                  <span className="font-medium">Fecha:</span>{" "}
                  {formatDate(selectedInvoice.date)}
                </p>
                <p>
                  <span className="font-medium">País:</span>{" "}
                  {selectedInvoice.country}
                </p>
                <p>
                  <span className="font-medium">ID:</span>{" "}
                  {selectedInvoice.invoiceId}
                </p>
              </div>
            </div>

            {/* Items table */}
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedInvoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900">
                          {item.quantity}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="text-sm text-gray-900">
                          ${item.price.toLocaleString()}
                          {item.tax > 0 && (
                            <span className="text-xs text-gray-500 ml-1">
                              +{(item.tax * 100).toFixed(0)}%
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-gray-900">
                          $
                          {(
                            item.price *
                            (1 + item.tax) *
                            item.quantity
                          ).toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between px-4">
                <span className="text-gray-600">Subtotal</span>
                <span>${selectedInvoice.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between px-4">
                <span className="text-gray-600">Impuestos</span>
                <span>${selectedInvoice.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between px-4 pt-2 border-t font-bold text-lg">
                <span>Total</span>
                <span>${selectedInvoice.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserInvoices;
