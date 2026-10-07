import React from "react";
import { Button } from "@shopifruta/ui";
import { ShoppingCart, ChartBar, User } from "lucide-react";
import useLoginPresenter from "../../presenter/Login.presenter";

const Login: React.FC = () => {
  const { handleLogin, loading, selectedRole, setSelectedRole } =
    useLoginPresenter();
  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">ShopiFruta</h1>
          <p className="mt-2 text-gray-600">
            Inicia sesión para acceder a la tienda
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-6 text-center">
            Selecciona un rol para continuar
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedRole === "client"
                  ? "bg-blue-50 border-blue-200 shadow-md"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedRole("client")}
            >
              <div className="flex justify-center mb-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <ShoppingCart size={24} className="text-blue-600" />
                </div>
              </div>
              <h3 className="font-medium text-center mb-1">Cliente</h3>
              <ul className="text-xs text-gray-500 space-y-1 mt-2">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-1">✓</span> Explorar
                  productos
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-1">✓</span> Realizar compras
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-1">✓</span> Ver mis facturas
                </li>
              </ul>
            </div>

            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedRole === "admin"
                  ? "bg-purple-50 border-purple-200 shadow-md"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedRole("admin")}
            >
              <div className="flex justify-center mb-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <ChartBar size={24} className="text-purple-600" />
                </div>
              </div>
              <h3 className="font-medium text-center mb-1">Administrador</h3>
              <ul className="text-xs text-gray-500 space-y-1 mt-2">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-1">✓</span> Ver todas las
                  ventas
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-1">✓</span> Administrar
                  facturas
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-1">✓</span> Ver
                  estadísticas
                </li>
              </ul>
            </div>
          </div>

          <Button
            onClick={handleLogin}
            className="w-full mt-4 text-white"
            disabled={loading || !selectedRole}
          >
            {loading ? (
              <span className="flex items-center">
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                Iniciando sesión...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <User size={16} className="mr-2" />
                {selectedRole
                  ? `Iniciar como ${selectedRole === "client" ? "Cliente" : "Administrador"}`
                  : "Selecciona un rol"}
              </span>
            )}
          </Button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Aplicación de demostración</p>
          <p>No se requiere contraseña para ingresar</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
