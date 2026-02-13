import { toast } from "react-hot-toast"
import { useDispatch } from "react-redux"
import { Link } from "react-router"
import { SkeletonLoader } from "../components/loader"
import ProductCard from "../components/product-card"
import { useLatestProductsQuery } from "../redux/api/productAPI"
import { addToCartRequest, calculatePrice } from "../redux/reducer/cartReducer"
import type { CartItem } from "../types/types"

const Home = () => {

  const { data, isLoading, isError } = useLatestProductsQuery("");
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
  if (isError) {
    toast.error("NOT FETCHING PRODUCTS. Please try again.");
  }
  return (
    <div className="home">
      <section></section>
      <h1>Latest Products
        <Link to={"/search"} className="findmore">
          More</Link>
      </h1>
      <main>
        {isLoading ? <SkeletonLoader width="80vw" /> :
          data?.products.map((i) => (
            <ProductCard key={i._id} productId={i._id} name={i.name} price={i.price} stock={i.stock} handler={addToCartHandler}
              photo={i.photo} />

          ))
        }
      </main>
    </div>
  )
}

export default Home
