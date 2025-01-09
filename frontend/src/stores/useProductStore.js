import toast from "react-hot-toast";
import { create } from "zustand";
import axios from "../lib/axios";

export const useProductStore = create((set, get) => ({
  products: [],
  isLoading: false,
  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ isLoading: true });
    try {
      const response = await axios.post("/products", productData);

      set((prevState) => ({
        products: [...prevState.products, response.data],
        isLoading: false,
      }));
    } catch (error) {
      toast.error(error.response.data.error || "An error occurred");
      set({ isLoading: false });
    }
  },
  fetchAllProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get("/products");
      set({ products: response.data.products, isLoading: false });
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
      set({ error: "Failed to fetch products", isLoading: false });
    }
  },
  deleteProduct: async (deleteId) => {
    set({ isLoading: true });
    try {
      await axios.delete(`/products/${deleteId}`);
      set((prevProduct) => ({
        products: prevProduct.products.filter(
          (product) => product._id !== deleteId
        ),
        isLoading: false,
      }));
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    }
  },
  toggleFeaturedProduct: async (productId) => {
    set({ isLoading: true });
    try {
      const response = await axios.patch(`/products/${productId}`);

      set((prevProducts) => ({
        products: prevProducts.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: response.data.isFeatured }
            : product
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response.data.message || "An error occurred");
    }
  },
  fetchProductByCategory: async (category) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`/products/category/${category}`);
      set({ products: response.data.products, isLoading: false });
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
      set({ isLoading: false });
    }
  },
  fetchFeaturedProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`/products/featured`);
      set({ products: response.data, isLoading: false });
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
      set({ error: "Failed to fetch products:0", isLoading: false });
    }
  },
}));
