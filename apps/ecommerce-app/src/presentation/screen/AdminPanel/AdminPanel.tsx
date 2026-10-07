import React from "react";
import {
  Loader2,
  Eye,
  Calendar,
  DollarSign,
  Package,
  Users,
} from "lucide-react";
import { useAdminPresenter } from "../../presenter/Admin.presenter";
import { Button, Modal } from "@shopifruta/ui";

const AdminDashboard: React.FC = () => {
  const {
    invoices,
    selectedInvoice,
    loading,
    error,
    stats,
    handleViewInvoice,
    setShowModal,
    showModal,
    clearSelectedInvoice,
  } = useAdminPresenter();

  const handleCloseModal = () => {
    setShowModal(false);
    clearSelectedInvoice();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-2" />
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
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Ventas Totales</p>
              <p className="text-2xl font-bold">
                ${stats.totalSales.toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Facturas</p>
              <p className="text-2xl font-bold text-start">
                {stats.totalInvoices}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1 text-start">
                Productos Vendidos
              </p>
              <p className="text-2xl font-bold text-start">
                {stats.totalProducts}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Clientes</p>
              <p className="text-2xl font-bold text-start">
                {stats.totalCustomers}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Facturas Recientes</h2>
        </div>

        {invoices.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No hay facturas disponibles</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Factura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.invoiceId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-start">
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.invoiceId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-start">
                      <div className="text-sm text-gray-900">
                        {invoice.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {invoice.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-start">
                      <div className="text-sm text-gray-900">
                        {formatDate(invoice.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-start">
                      <div className="text-sm font-medium text-gray-900">
                        ${invoice.total.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        onClick={() => handleViewInvoice(invoice.invoiceId)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye size={16} className="mr-1" />
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedInvoice && (
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={`Factura ${selectedInvoice.invoiceId}`}
          className="max-w-3xl"
        >
          <div className="space-y-6">
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

export default AdminDashboard;
