import React, { useEffect } from "react";
import { useCartStore } from "../stores/useCartStore";
import LoadingSpinner from "./LoadingSpinner";
import ProductCard from "./ProductCard";

const PeopleAlsoBought = () => {
  const { recommendations, isLoading, getRecommendationsProduct } =
    useCartStore();

  useEffect(() => {
    getRecommendationsProduct();
  }, [getRecommendationsProduct]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-emerald-400">
        People also bought
      </h3>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg: grid-col-3">
        {recommendations.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default PeopleAlsoBought;
