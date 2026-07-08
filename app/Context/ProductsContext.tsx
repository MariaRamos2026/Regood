import React, { createContext, ReactNode, useContext, useState } from "react";

export interface Product {
  id: string;
  name: string;
  tag?: string | null;
  price: number;
  imageId?: string;
  category: string;
  location: string;
  status: string;
  imagen?: string | null;
}
interface ProductsContextType {
  products: Product[];
  addProduct: (product: Product) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, product]);
  };

  return (
    <ProductsContext.Provider value={{ products, addProduct }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts debe usarse dentro de un ProductsProvider");
  }
  return context;
};
