
import { useState } from "react";
import toast from "react-hot-toast";
import { SkeletonLoader } from "../components/loader.tsx";
import ProductCard from "../components/product-card.tsx";
import { useCategoriesQuery, useSearchProductsQuery } from "../redux/api/productAPI";
import { addToCartRequest, calculatePrice } from "../redux/reducer/cartReducer";
import type { CustomError } from "../types/api-types";
import type { CartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";


const Search = () => {

  const searchQuery = useSearchParams()[0];
  



  const { data: categoriesResponse, isLoading: loadingCategories, isError, error } = useCategoriesQuery("")

  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState(searchQuery.get("category") || "");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();

  const addToCartHandler = (cartItem: CartItem): string | undefined => {
    if (cartItem.stock === 0) {
      toast.error("Product is out of stock");
      return undefined;
    }
    dispatch(addToCartRequest(cartItem));
    dispatch(calculatePrice());
    toast.success("Added to cart");
    return undefined;
  }


  const { isLoading: productLoading, data: searchedData, isError: productIsError, error: productError } = useSearchProductsQuery({ price: maxPrice, page, category, search, sort })

  const isPrevPage = page > 1;
  const isNextPage = page < 4;

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }
  if (productIsError) {
    const err = productError as CustomError;
    toast.error(err.data.message);
  }

  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>

        <div>
          <h4>Max Price: {maxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={100000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <h4>Category</h4>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">ALL</option>
            {!loadingCategories &&
              categoriesResponse?.categories?.map((i: string) => (
                <option key={i} value={i}>
                  {i.toUpperCase()}
                </option>
              ))}
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {productLoading ? (
          <SkeletonLoader count={10} />
        ) : (
          <div className="search-product-list">
            {searchedData?.products.map((i) => (
              <ProductCard
                key={i._id}
                productId={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                photos={i.photos}
                handler={addToCartHandler}
              />
            ))}
          </div>
        )}

        {searchedData && searchedData.totalPage > 1 && (
          <article>
            <button
              disabled={!isPrevPage}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span>
              {page} of {searchedData.totalPage}
            </span>
            <button
              disabled={!isNextPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </article>
        )}
      </main>
    </div>
  );
}

export default Search
