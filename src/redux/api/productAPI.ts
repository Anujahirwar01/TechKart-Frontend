import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { AllProductsResponse, AllReviewsResponse, CategoriesResponse, DeleteProductRequest, DeleteReviewRequest, MessageResponse, NewReviewRequest, ProductResponse, SearchProductsRequest, SearchProductsResponse, UpdateProductRequest } from "../../types/api-types";

export const productAPI = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
    }),
    tagTypes: ["latest-product", "all-product", "categories", "search-product", "new-product", "reviews"],
    endpoints: (builder) => ({
        latestProducts: builder.query<AllProductsResponse, string>({
            query: () => "latest",
            providesTags: ["latest-product"]
        }),
        allProducts: builder.query<AllProductsResponse, string>({
            query: (id) => `admin-products?id=${id}`,
            providesTags: ["all-product"]
        }),
        categories: builder.query<CategoriesResponse, string>({
            query: () => `categories`,
            providesTags: ["categories"]
        }),
        searchProducts: builder.query<SearchProductsResponse, SearchProductsRequest>({
            query: (id) => `all?price=${id.price}&page=${id.page}&category=${id.category}&search=${id.search}&sort=${id.sort}`,
            providesTags: ["search-product"]
        }),

        productDetails: builder.query<ProductResponse, string>({
            query: (id) => id,
            providesTags: ["latest-product"]
        }),

        newProducts: builder.mutation<MessageResponse, { formData: FormData, id: string }>({
            query: ({ formData, id }) => ({
                url: `new?id=${id}`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["new-product", "all-product"]
        }),

        updateProducts: builder.mutation<MessageResponse, UpdateProductRequest>({
            query: ({ formData, userId, productId }) => ({
                url: `${productId}?id=${userId}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["all-product", "latest-product"]
        }),
        deleteProducts: builder.mutation<MessageResponse, DeleteProductRequest>({
            query: ({ userId, productId }) => ({
                url: `${productId}?id=${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["all-product", "latest-product"]
        }),

        allReviewsOfProducts: builder.query<AllReviewsResponse, string>({
            query: (id) => `reviews/${id}`,
            providesTags: ["reviews"]
        }),

        newReview: builder.mutation<MessageResponse, NewReviewRequest>({
            query: ({ comment, rating, userId, productId }) => ({
                url: `review/new?id=${userId}`,
                method: "POST",
                body: { comment, rating, productId },
            }),
            invalidatesTags: ["reviews", "latest-product"]
        }),

        deleteReview: builder.mutation<MessageResponse, DeleteReviewRequest>({
            query: ({ reviewId, userId }) => ({
                url: `review/${reviewId}?id=${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["reviews", "latest-product"]
        }),

    }),
});



export const { useLatestProductsQuery, useAllProductsQuery,
    useCategoriesQuery, useSearchProductsQuery,
    useNewProductsMutation,
    useProductDetailsQuery,
    useUpdateProductsMutation,
    useDeleteProductsMutation,
    useAllReviewsOfProductsQuery,
    useNewReviewMutation,
    useDeleteReviewMutation
} = productAPI;
