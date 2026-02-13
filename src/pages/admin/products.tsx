import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllProductsQuery } from "../../redux/api/productAPI";
import type { CustomError } from "../../types/api-types";
import type { UserReducerInitialState } from "../../types/reducer-types";


interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const arr: DataType[] = [];

const Products = () => {
  const { user } = useSelector((state: { user: UserReducerInitialState }) => state.user)
  const { data, isError, error, isLoading } = useAllProductsQuery(user?._id!)
  const [rows, setRows] = useState<DataType[]>(arr);
  if (isError) {
    toast.error((error as CustomError).data.message);
  }

  useEffect(() => {
    if (data) setRows(data.products.map((i) => ({
      name: i.name,
      price: i.price,
      stock: i.stock,
      photo: <img src={`${import.meta.env.VITE_SERVER}/${i.photo}`} alt={i.name} />,
      action: <Link to={`/admin/product/${i._id}`}>Manage</Link>
    })))
  }, [data])

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Products",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <div>Loading...</div> : Table}</main>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;
