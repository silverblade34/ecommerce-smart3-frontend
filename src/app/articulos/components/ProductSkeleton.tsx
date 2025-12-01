import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="grid-type  w-full border border-line p-4 ">
      <div className=" block cursor-pointer">
        <div className="product-infor mt-4 lg:mb-7">
          <div className="product-sold pb-2 sm:pb-4">
            <div className="progress relative h-1.5 w-full animate-pulse overflow-hidden rounded-full bg-secondary2/40"></div>
          </div>
          <div className="product-name text-title mt-2 h-6 animate-pulse rounded-md bg-secondary2/40 duration-300"></div>
          <div className="color-item relative mt-2 h-8 w-8 animate-pulse rounded-full bg-secondary2/40"></div>
          <div className="list-color-image flex flex-wrap items-center gap-3 duration-500 max-md:hidden">
            <div className="color-item relative h-12 w-12 animate-pulse rounded-xl bg-secondary2/40"></div>
          </div>
          <div className="product-price-block relative z-[1] mt-1 flex flex-wrap items-center gap-2 duration-300">
            <div className="product-price text-title h-6 w-20 animate-pulse rounded-md bg-secondary2/40"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
