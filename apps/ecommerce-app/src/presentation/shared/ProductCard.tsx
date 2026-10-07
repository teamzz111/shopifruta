import { memo, useCallback, useMemo, useRef } from "react";
import { Product } from "../../core/domain/entities/Product";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@shopifruta/ui";
import { ImageIcon, ShoppingCartIcon } from "lucide-react";

const ProductCard = memo(
  ({
    product,
    onAddToCart,
  }: {
    product: Product;
    onAddToCart: (id: number) => void;
  }) => {
    const productRef = useRef(product);

    if (
      product.stock !== productRef.current.stock ||
      product.price !== productRef.current.price
    ) {
      productRef.current = product;
    }

    const { id, name, category, stock, price, tax } = productRef.current;

    const stockVariant = useMemo(() => {
      if (stock > 20) return "success";
      if (stock > 5) return "warning";
      if (stock > 0) return "destructive";
      return "outline";
    }, [stock]);

    const stockLabel = useMemo(() => {
      if (stock > 20) return "En stock";
      if (stock > 5) return "Stock bajo";
      if (stock > 0) return "Últimas unidades";
      return "Agotado";
    }, [stock]);

    const handleAddToCart = useCallback(() => {
      onAddToCart(id);
    }, [id, onAddToCart]);

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{name}</CardTitle>
            <Badge variant={stockVariant}>{stockLabel}</Badge>
          </div>
          <CardDescription className="text-gray-600">
            {category}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="h-40 bg-gray-100 rounded-md mb-4 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-gray-400">
              <ImageIcon size={48} className="mb-2" />
              <span className="text-sm text-center">Imagen no disponible</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-500 text-start">Precio:</p>
              <p className="text-2xl font-bold text-start">
                ${price.toLocaleString()}
              </p>
              {tax > 0 && (
                <p className="text-[8px] text-gray-500 text-start">
                  + {(tax * 100).toFixed(0)}% de impuestos
                </p>
              )}
            </div>
            <div className={`text-right`}>
              <p className="text-sm text-gray-500">Disponibles:</p>
              <p className="text-lg font-medium">{stock}</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className={`pt-2 ${tax == 0 ? "mt-3" : ""}`}>
          <Button
            className="w-full relative overflow-hidden group text-white"
            onClick={handleAddToCart}
            disabled={stock <= 0}
            variant={stock <= 0 ? "outline" : "default"}
          >
            {stock <= 0 ? (
              "Agotado"
            ) : (
              <span className="flex items-center justify-center">
                <ShoppingCartIcon
                  size={18}
                  className="mr-2 group-hover:animate-bounce"
                />
                Añadir al carrito
              </span>
            )}
            {stock > 0 && (
              <span className="absolute inset-0 w-full h-full bg-white/10 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100 origin-left"></span>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.product.id === nextProps.product.id &&
      prevProps.product.stock === nextProps.product.stock &&
      prevProps.product.price === nextProps.product.price &&
      prevProps.onAddToCart === nextProps.onAddToCart
    );
  }
);

export default ProductCard;
