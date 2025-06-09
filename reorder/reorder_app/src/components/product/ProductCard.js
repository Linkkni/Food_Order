import React from "react";
import { ShoppingCart } from "lucide-react";

const ProductCard = ({ product, onAddToCart }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
    <div className="p-4 flex-grow">
      <h3 className="font-bold text-lg text-gray-800">{product.productName}</h3>
      <p className="text-gray-500 text-sm mb-2">{product.quantityPerUnit}</p>
      <p className="text-xl font-semibold text-blue-600 my-2">
        {product.unitPrice.toLocaleString("vi-VN")} VNĐ
      </p>
    </div>
    <button
      onClick={() => onAddToCart(product)}
      className="w-full bg-blue-500 text-white font-bold py-3 px-4 hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center"
    >
      <ShoppingCart size={18} className="mr-2" /> Thêm vào giỏ
    </button>
  </div>
);

export default ProductCard;
