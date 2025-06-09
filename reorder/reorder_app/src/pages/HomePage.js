import React, { useState, useEffect, useCallback } from "react";
import { API } from "../services/api";
import Spinner from "../components/common/Spinner";
import Message from "../components/common/Message";
import ProductCard from "../components/product/ProductCard";

const HomePage = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = selectedCategory
        ? API.getProductsByCategory(selectedCategory)
        : API.getProducts();
      // Chỉ tải danh mục một lần
      if (categories.length === 0) {
        const categoriesRes = await fetch(API.getCategories());
        if (!categoriesRes.ok) throw new Error("Không thể tải danh mục");
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      }

      const productsRes = await fetch(url);
      if (!productsRes.ok)
        throw new Error(
          "Không thể tải sản phẩm. Vui lòng kiểm tra lại API backend."
        );
      const productsData = await productsRes.json();
      setProducts(productsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, categories.length]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Danh Mục</h2>
            <ul>
              <li className="mb-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left p-2 rounded transition-colors duration-200 ${
                    !selectedCategory
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Tất cả sản phẩm
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.categoryId} className="mb-2">
                  <button
                    onClick={() => setSelectedCategory(cat.categoryId)}
                    className={`w-full text-left p-2 rounded transition-colors duration-200 ${
                      selectedCategory === cat.categoryId
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {cat.categoryName}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="w-full md:w-3/4 lg:w-4/5">
          {loading && <Spinner />}
          {error && <Message text={error} />}
          {!loading &&
            !error &&
            (products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.productId}
                    product={product}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            ) : (
              <Message
                text="Không có sản phẩm nào trong danh mục này."
                type="info"
              />
            ))}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
