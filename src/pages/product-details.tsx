import { type CarouselButtonType, MyntraCarousel, Slider, useRating } from "6pp";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import {
  FaArrowLeftLong,
  FaArrowRightLong,
  FaRegStar,
  FaStar,
} from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { SkeletonLoader } from "../components/loader";
import RatingsComponent from "../components/ratings";
import {
  useAllReviewsOfProductsQuery,
  useDeleteReviewMutation,
  useNewReviewMutation,
  useProductDetailsQuery,
} from "../redux/api/productAPI";
import { addToCartRequest } from "../redux/reducer/cartReducer";
import type { RootState } from "../redux/store";
import type { CartItem, Review } from "../types/types";
import { responseToast } from "../utils/features";

const ProductDetails = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.user);

  const { isLoading, isError, data } = useProductDetailsQuery(params.id!);
  const reviewsResponse = useAllReviewsOfProductsQuery(params.id!);
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const [reviewComment, setReviewComment] = useState("");
  const reviewDialogRef = useRef<HTMLDialogElement>(null);
  const [reviewSubmitLoading, setReviewSubmitLoading] = useState(false);

  const [createReview] = useNewReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const decrement = () => setQuantity((prev) => prev - 1);
  const increment = () => {
    if (data?.product?.stock === quantity)
      return toast.error(`${data?.product?.stock} available only`);
    setQuantity((prev) => prev + 1);
  };

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");

    dispatch(addToCartRequest(cartItem));
    toast.success("Added to cart");
  };

  if (isError) return <Navigate to="/404" />;

  const showDialog = () => {
    reviewDialogRef.current?.showModal();
  };

  const {
    Ratings: RatingsEditable,
    rating,
    setRating,
  } = useRating({
    IconFilled: <FaStar />,
    IconOutline: <FaRegStar />,
    value: 0,
    selectable: true,
    styles: {
      fontSize: "1.75rem",
      color: "coral",
      justifyContent: "flex-start",
    },
  });

  const reviewCloseHandler = () => {
    reviewDialogRef.current?.close();
    setRating(0);
    setReviewComment("");
  };

  const submitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to review");
      return;
    }

    if (!rating) {
      toast.error("Please select a rating");
      return;
    }
    if (!reviewComment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setReviewSubmitLoading(true);

    const res = await createReview({
      comment: reviewComment,
      rating,
      userId: user._id,
      productId: params.id!,
    });

    setReviewSubmitLoading(false);
    responseToast(res, null, "");

    if (res.data?.success) {
      reviewCloseHandler();
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    const res = await deleteReview({ reviewId, userId: user?._id });
    responseToast(res, null, "");
  };

  return (
    <div className="product-details">
      {isLoading ? (
        <ProductLoader />
      ) : (
        <>
          <main>
            <section className="pd-images">
              <Slider
                showThumbnails
                showNav={false}
                onClick={() => setCarouselOpen(true)}
                images={data?.product?.photos.map((i) => i.url) || []}
              />
              {carouselOpen && (
                <MyntraCarousel
                  NextButton={NextButton}
                  PrevButton={PrevButton}
                  setIsOpen={setCarouselOpen}
                  images={data?.product?.photos.map((i) => i.url) || []}
                />
              )}
            </section>
            <section className="pd-info">
              <span className="pd-category">{data?.product?.category}</span>
              <h1>{data?.product?.name}</h1>
              <div className="pd-rating-row">
                <RatingsComponent value={data?.product?.ratings || 0} />
                <span className="pd-review-count">({data?.product?.numOfReviews} reviews)</span>
              </div>
              <div className="pd-price">₹{data?.product?.price?.toLocaleString("en-IN")}</div>
              <p className="pd-description">{data?.product?.description}</p>
              <div className="pd-stock">
                <span className={data?.product?.stock! > 0 ? "in-stock" : "out-stock"}>
                  {data?.product?.stock! > 0 ? `✔ In Stock (${data?.product?.stock} left)` : "✘ Out of Stock"}
                </span>
              </div>
              <article>
                <div className="qty-control">
                  <button onClick={decrement}>−</button>
                  <span>{quantity}</span>
                  <button onClick={increment}>+</button>
                </div>
                <button
                  className="add-to-cart-btn"
                  onClick={() =>
                    addToCartHandler({
                      productId: data?.product?._id!,
                      name: data?.product?.name!,
                      price: data?.product?.price!,
                      stock: data?.product?.stock!,
                      quantity,
                      photo: data?.product?.photos[0].url || "",
                    })
                  }
                >
                  Add To Cart
                </button>
              </article>
            </section>
          </main>
        </>
      )}

      <dialog ref={reviewDialogRef} className="review-dialog">
        <button className="review-dialog-close" onClick={reviewCloseHandler}>✕</button>
        <h2>Write a Review</h2>
        <form onSubmit={submitReview}>
          <label>Your Rating</label>
          <RatingsEditable />
          <label>Your Comment</label>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Share your experience with this product..."
          ></textarea>
          <button disabled={reviewSubmitLoading} type="submit">
            {reviewSubmitLoading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </dialog>

      <section className="reviews-section">
        <div className="reviews-header">
          <h2>Customer Reviews</h2>
          {!reviewsResponse.isLoading && user && (
            <button className="write-review-btn" onClick={showDialog}>
              <FiEdit /> Write a Review
            </button>
          )}
        </div>
        <div className="reviews-grid">
          {reviewsResponse.isLoading ? (
            <>
              <SkeletonLoader width="45rem" count={5} />
              <SkeletonLoader width="45rem" count={5} />
              <SkeletonLoader width="45rem" count={5} />
            </>
          ) : reviewsResponse.data?.reviews && reviewsResponse.data.reviews.length > 0 ? (
            reviewsResponse.data.reviews.map((review: Review) => (
              <ReviewCard
                handleDeleteReview={handleDeleteReview}
                userId={user?._id}
                key={review._id}
                review={review}
              />
            ))
          ) : (
            <div className="no-reviews">
              <p>No reviews yet.</p>
              {user ? (
                <button className="write-review-btn" onClick={showDialog}><FiEdit /> Be the first to review!</button>
              ) : (
                <p>Login to write the first review.</p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const ReviewCard = ({
  review,
  userId,
  handleDeleteReview,
}: {
  userId?: string;
  review: Review;
  handleDeleteReview: (reviewId: string) => void;
}) => (
  <div className="review">
    <RatingsComponent value={review.rating} />
    <p>{review.comment}</p>
    <div>
      <img src={review.user.photo} alt="User" />
      <small>{review.user.name}</small>
    </div>
    {userId === review.user._id && (
      <button onClick={() => handleDeleteReview(review._id)}>
        <FaTrash />
      </button>
    )}
  </div>
);

const ProductLoader = () => {
  return (
    <div
      style={{
        display: "flex",
        gap: "2rem",
        border: "1px solid #f1f1f1",
        height: "80vh",
      }}
    >
      <section style={{ width: "100%", height: "100%" }}>
        <SkeletonLoader
          width="100%"
          count={1}
        />
      </section>
      <section
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "4rem",
          padding: "2rem",
        }}
      >
        <SkeletonLoader width="40%" count={3} />
        <SkeletonLoader width="50%" count={4} />
        <SkeletonLoader width="100%" count={2} />
        <SkeletonLoader width="100%" count={10} />
      </section>
    </div>
  );
};

const NextButton: CarouselButtonType = ({ onClick }) => (
  <button onClick={onClick} className="carousel-btn">
    <FaArrowRightLong />
  </button>
);
const PrevButton: CarouselButtonType = ({ onClick }) => (
  <button onClick={onClick} className="carousel-btn">
    <FaArrowLeftLong />
  </button>
);

export default ProductDetails;