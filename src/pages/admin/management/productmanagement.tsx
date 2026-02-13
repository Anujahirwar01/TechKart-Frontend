import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import SkeletonLoader from "../../../components/loader";
import { useDeleteProductsMutation, useProductDetailsQuery, useUpdateProductsMutation } from "../../../redux/api/productAPI";
import type { UserReducerInitialState } from "../../../types/reducer-types";
import { responseToast } from "../../../utils/features";
const server = import.meta.env.VITE_SERVER;


const Productmanagement = () => {

  const { user } = useSelector((state: { user: UserReducerInitialState }) => state.user)

  const params = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useProductDetailsQuery(params.id!);

  const [product, setProduct] = useState({
    _id: "",
    photo: "", category: "", name: "",
    price: 0, stock: 0
  });


  const { photo, name, price, stock, category } = product;


  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
  const [photoUpdate, setPhotoUpdate] = useState<string>(photo);
  const [photoFile, setPhotoFile] = useState<File>();

  const [updateProduct] = useUpdateProductsMutation();
  const [deleteProduct] = useDeleteProductsMutation();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoUpdate(reader.result);
          setPhotoFile(file);
        }
      };
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setProduct({
      _id: product._id,
      name: nameUpdate,
      price: priceUpdate,
      stock: stockUpdate,
      photo: photoUpdate,
      category: categoryUpdate,
    });
    const formData = new FormData();
    formData.set("name", nameUpdate);
    formData.set("price", priceUpdate.toString());
    formData.set("stock", stockUpdate.toString());
    formData.set("category", categoryUpdate);
    if (photoFile) formData.set("photo", photoFile);

    const res = await updateProduct({
      formData,
      userId: user?._id!,
      productId: data?.product._id!,
    })
    responseToast(res, navigate, "/admin/product")
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
        photo: data.product.photo,
      });
    }
  }, [data])

  useEffect(() => {
    setNameUpdate(name);
    setPriceUpdate(price);
    setStockUpdate(stock);
    setCategoryUpdate(category);
    setPhotoUpdate(photo);
  }, [name, price, stock, category, photo])

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
                <img src={photo.startsWith("http") ? photo : `${server}/${photo}`} alt="Product" />
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
                    <label>Photo</label>
                    <input type="file" onChange={changeImageHandler} />
                  </div>

                  {photoUpdate && <img src={photoUpdate} alt="New Image" />}
                  <button type="submit">Update</button>
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
