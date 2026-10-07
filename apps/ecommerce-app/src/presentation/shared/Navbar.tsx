import React, { useState, useEffect, useCallback } from "react";
import {
  ShoppingCartIcon,
  User,
  LogOut,
  Settings,
  Menu,
  X,
  FileText,
} from "lucide-react";
import { Button, Badge } from "@shopifruta/ui";
import { useCartStore } from "../../stores/useCartStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { Link, useNavigate, useLocation } from "react-router-dom";

export const Navbar: React.FC = () => {
  const { items } = useCartStore();
  const itemCount = React.useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const { user, isAuthenticated, login, logout } = useAuthStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const handleToggleUserMenu = useCallback(() => {
    setIsUserMenuOpen((prev) => !prev);
  }, []);

  const handleToggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleNavigation = useCallback(
    (path: string) => {
      navigate(path);
      setIsMobileMenuOpen(false);
    },
    [navigate]
  );

  const handleRoleToggle = useCallback(() => {
    if (user?.role === "client") {
      logout();
      login({
        id: "admin-123",
        name: "Administrador",
        role: "admin",
        email: "admin@example.com",
      });
    } else {
      logout();
      login({
        id: "client-456",
        name: "Cliente",
        role: "client",
        email: "cliente@example.com",
      });
    }
    setIsUserMenuOpen(false);
  }, [user?.role, logout, login]);

  const handleLogout = useCallback(() => {
    logout();
    setIsUserMenuOpen(false);
  }, [logout]);

  const handleCartClick = useCallback(() => {
    navigate("/cart");
  }, [navigate]);

  useEffect(() => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isClient = user?.role === "client";
  const isAdmin = user?.role === "admin";

  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              ShopiFruta
            </span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`transition-colors ${
                isActive("/")
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Productos
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`transition-colors ${
                  isActive("/admin")
                    ? "text-blue-600 font-medium"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Administración
              </Link>
            )}

            {isClient && (
              <Link
                to="/my-invoices"
                className={`transition-colors ${
                  isActive("/my-invoices")
                    ? "text-blue-600 font-medium"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <span className="flex items-center">
                  <FileText size={16} className="mr-1" />
                  Mis Facturas
                </span>
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {isClient && (
              <Button
                variant="ghost"
                className="relative p-2"
                onClick={handleCartClick}
                aria-label="Carrito de compras"
              >
                <ShoppingCartIcon size={22} />
                {itemCount > 0 && (
                  <Badge
                    variant="primary"
                    className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full p-0"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            )}

            <div className="relative">
              <Button
                variant="outline"
                className="flex items-center space-x-2"
                onClick={handleToggleUserMenu}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
              >
                <User size={16} />
                <span className="hidden sm:inline">
                  {isAuthenticated ? user?.name : "Cuenta"}
                </span>
              </Button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border"
                  role="menu"
                  aria-orientation="vertical"
                >
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-gray-500 capitalize">{user?.role}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          {user?.email}
                        </p>
                      </div>

                      {isClient && (
                        <Link
                          to="/my-invoices"
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FileText size={16} className="mr-2" />
                          Mis Facturas
                        </Link>
                      )}

                      <button
                        onClick={handleRoleToggle}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        role="menuitem"
                      >
                        <Settings size={16} className="mr-2" />
                        Cambiar a {isClient ? "Admin" : "Cliente"}
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        role="menuitem"
                      >
                        <LogOut size={16} className="mr-2" />
                        Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          login({
                            id: "client-456",
                            name: "Cliente",
                            role: "client",
                            email: "cliente@example.com",
                          });
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Iniciar como Cliente
                      </button>
                      <button
                        onClick={() => {
                          login({
                            id: "admin-123",
                            name: "Administrador",
                            role: "admin",
                            email: "admin@example.com",
                          });
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Iniciar como Admin
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              className="md:hidden p-2"
              onClick={handleToggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t" role="navigation">
          <div className="container mx-auto px-4 py-2">
            <div className="space-y-1">
              <button
                onClick={() => handleNavigation("/")}
                className={`w-full text-left py-2 px-3 rounded-md ${
                  isActive("/")
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Productos
              </button>

              {isAdmin && (
                <button
                  onClick={() => handleNavigation("/admin")}
                  className={`w-full text-left py-2 px-3 rounded-md ${
                    isActive("/admin")
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Administración
                </button>
              )}

              {isClient && (
                <>
                  <button
                    onClick={() => handleNavigation("/my-invoices")}
                    className={`w-full text-left py-2 px-3 rounded-md flex items-center ${
                      isActive("/my-invoices")
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <FileText size={16} className="mr-2" />
                    Mis Facturas
                  </button>

                  <button
                    onClick={() => handleNavigation("/cart")}
                    className={`w-full text-left py-2 px-3 rounded-md flex items-center justify-between ${
                      isActive("/cart")
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center">
                      <ShoppingCartIcon size={16} className="mr-2" />
                      Carrito
                    </span>
                    {itemCount > 0 && (
                      <Badge variant="primary">{itemCount}</Badge>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
