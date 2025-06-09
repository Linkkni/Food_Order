// js/main.js

document.addEventListener("DOMContentLoaded", () => {
  const categoryList = document.getElementById("category-list");
  const productList = document.getElementById("product-list");
  const cartCountSpan = document.getElementById("cart-count");

  // Lấy giỏ hàng từ sessionStorage hoặc tạo mới
  let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

  // Cập nhật số lượng sản phẩm trong giỏ hàng trên giao diện
  const updateCartCount = () => {
    cartCountSpan.textContent = cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  };

  // Tải và hiển thị danh mục
  const loadCategories = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.categories);
      if (!response.ok) throw new Error("Không thể tải danh mục");
      const categories = await response.json();

      categoryList.innerHTML = "<h2>Danh Mục</h2>"; // Reset
      const allProductsLink = document.createElement("a");
      allProductsLink.href = "#";
      allProductsLink.textContent = "Tất cả sản phẩm";
      allProductsLink.onclick = (e) => {
        e.preventDefault();
        loadProducts();
      };
      categoryList.appendChild(allProductsLink);

      categories.forEach((category) => {
        const categoryLink = document.createElement("a");
        categoryLink.href = "#";
        categoryLink.textContent = category.categoryName;
        categoryLink.dataset.categoryId = category.categoryId;
        categoryLink.onclick = (e) => {
          e.preventDefault();
          loadProducts(category.categoryId);
        };
        categoryList.appendChild(categoryLink);
      });
    } catch (error) {
      categoryList.innerHTML = `<p class="error">${error.message}</p>`;
    }
  };

  // Tải và hiển thị sản phẩm
  const loadProducts = async (categoryId = null) => {
    const url = categoryId
      ? API_ENDPOINTS.productsByCategory(categoryId)
      : API_ENDPOINTS.products;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Không thể tải sản phẩm");
      const products = await response.json();

      productList.innerHTML = "<h2>Sản Phẩm</h2>"; // Reset
      if (products.length === 0) {
        productList.innerHTML +=
          "<p>Không có sản phẩm nào trong danh mục này.</p>";
        return;
      }

      products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.innerHTML = `
                    <h3>${product.productName}</h3>
                    <p class="price">${product.unitPrice.toLocaleString(
                      "vi-VN"
                    )} VNĐ</p>
                    <p>${product.quantityPerUnit}</p>
                    <button data-product-id="${
                      product.productId
                    }">Thêm vào giỏ</button>
                `;
        productList.appendChild(productCard);
      });
    } catch (error) {
      productList.innerHTML = `<p class="error">${error.message}</p>`;
    }
  };

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (productId) => {
    const existingItem = cart.find((item) => item.productId === productId);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ productId: productId, quantity: 1 });
    }
    sessionStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Đã thêm sản phẩm vào giỏ hàng!");
  };

  // Lắng nghe sự kiện click trên danh sách sản phẩm
  productList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const productId = parseInt(e.target.dataset.productId);
      addToCart(productId);
    }
  });

  // Tải dữ liệu ban đầu
  loadCategories();
  loadProducts();
  updateCartCount();
});
