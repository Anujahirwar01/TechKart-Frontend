import { useFileHandler } from "6pp";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import SkeletonLoader from "../../../components/loader";
import { useDeleteProductsMutation, useProductDetailsQuery, useUpdateProductsMutation } from "../../../redux/api/productAPI";
import type { UserReducerInitialState } from "../../../types/reducer-types";
import { responseToast } from "../../../utils/features";


const Productmanagement = () => {

  const { user } = useSelector((state: { user: UserReducerInitialState }) => state.user)

  const params = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useProductDetailsQuery(params.id!);

  const [product, setProduct] = useState({
    _id: "",
    photos: [] as { url: string; public_id: string }[], category: "", name: "",
    price: 0, stock: 0, description: ""
  });


  const { photos, name, price, stock, category, description } = product;

  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [descriptionUpdate, setDescriptionUpdate] = useState<string>(description);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
  const [photoUpdate, setPhotoUpdate] = useState<string>(photos[0]?.url || "");

  const [updateProduct] = useUpdateProductsMutation();
  const [deleteProduct] = useDeleteProductsMutation();


  const photosFile = useFileHandler("multiple", 10, 5)

  const submitHandler = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      setProduct({
        _id: product._id,
        name: nameUpdate,
        price: priceUpdate,
        stock: stockUpdate,
        photos: photoUpdate ? [{ url: photoUpdate, public_id: "" }] : photos,
        category: categoryUpdate,
        description: descriptionUpdate
      });
      const formData = new FormData();
      formData.set("name", nameUpdate);
      formData.set("price", priceUpdate.toString());
      formData.set("stock", stockUpdate.toString());
      formData.set("category", categoryUpdate);
      formData.set("description", descriptionUpdate);

      if (photosFile.file && photosFile.file.length > 0) {
        console.log("added new photos");
        photosFile.file.forEach((file: File) => {
          formData.append("photos", file);
        })
      }

      const res = await updateProduct({
        formData,
        userId: user?._id!,
        productId: data?.product._id!,
      })
      responseToast(res, navigate, "/admin/product")
    } catch (err) {
      console.error(err);
    } finally {
      setBtnLoading(false);
    }
  };

  const deleteHandler = async () => {

    const res = await deleteProduct({
      userId: user?._id!,
      productId: data?.product._id!,
    })
    responseToast(res, navigate, "/admin/product")
  };

  useEffect(() => {
    if (data) {
      setProduct({
        _id: data.product._id,

        name: data.product.name,
        price: data.product.price,
        stock: data.product.stock,
        category: data.product.category,
        photos: data.product.photos,
        description: data.product.description || ""
      });
    }
  }, [data])

  useEffect(() => {
    setNameUpdate(name);
    setPriceUpdate(price);
    setStockUpdate(stock);
    setCategoryUpdate(category);
    setDescriptionUpdate(description);
    setPhotoUpdate(photos[0]?.url || "");
  }, [name, price, stock, category, photos])

  if (isError) return <Navigate to={"/404"} />

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {
          isLoading ? <SkeletonLoader /> : (
            <>
              <section>
                <strong>ID - {product._id}</strong>
                <img src={photos[0]?.url || ""} alt="Product" />
                <p>{name}</p>
                {stock > 0 ? (
                  <span className="green">{stock} Available</span>
                ) : (
                  <span className="red"> Not Available</span>
                )}
                <h3>₹{price}</h3>
              </section>
              <article>
                <button className="product-delete-btn" onClick={deleteHandler}>
                  <FaTrash />
                </button>
                <form onSubmit={submitHandler}>
                  <h2>Manage</h2>
                  <div>
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder="Name"
                      value={nameUpdate}
                      onChange={(e) => setNameUpdate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Description</label>
                    <textarea
                      required
                      placeholder="Description"
                      value={descriptionUpdate}
                      onChange={(e) => setDescriptionUpdate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Price</label>
                    <input
                      type="number"
                      placeholder="Price"
                      value={priceUpdate}
                      onChange={(e) => setPriceUpdate(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label>Stock</label>
                    <input
                      type="number"
                      placeholder="Stock"
                      value={stockUpdate}
                      onChange={(e) => setStockUpdate(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label>Category</label>
                    <input
                      type="text"
                      placeholder="eg. laptop, camera etc"
                      value={categoryUpdate}
                      onChange={(e) => setCategoryUpdate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Photos</label>
                    <input type="file" onChange={photosFile.changeHandler} />
                  </div>

                  {
                    photosFile.error && <p>{photosFile.error}</p>
                  }

                  {
                    photosFile.preview && 
                    <div style={{ display: "flex", gap: "1rem",overflowX: "auto", padding: "1rem 0" }}>
                       {photosFile.preview.map((img, i) => {
                        return <img
                        style={{ width: "8rem", height: "8rem", objectFit: "cover" }}
                         key={i} src={img} alt="New Image" />
                      })}
                    </div>
                  }


                  <button disabled={btnLoading} type="submit">Update</button>
                </form>
              </article>
            </>
          )
        }
      </main>
    </div>
  );
};

export default Productmanagement;
