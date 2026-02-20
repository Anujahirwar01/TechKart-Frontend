import { useFetchData } from "6pp";
import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { SkeletonLoader } from "../../components/loader";
import { server } from "../../redux/store";
import type { RootState } from "../../redux/store";
import type { AllDiscountResponse } from "../../types/api-types";


interface DataType {
    code: string;
    amount: number;
    _id: string;
    action: ReactElement;
}

const columns: Column<DataType>[] = [
    {
        Header: "Id",
        accessor: "_id",
    },

    {
        Header: "Code",
        accessor: "code",
    },
    {
        Header: "Amount",
        accessor: "amount",
    },
    {
        Header: "Action",
        accessor: "action",
    },
];

const Discount = () => {
    const { user } = useSelector((state: RootState) => state.user);

    const {
        data,
        loading: isLoading,
        error,
    } = useFetchData<AllDiscountResponse>({
        url: `${server}/api/v1/payment/coupon/all?id=${user?._id}`,
        key: "discount-codes",
        dependencyProps: [user?._id || ""],
    });

    const [rows, setRows] = useState<DataType[]>([]);

    const Table = TableHOC<DataType>(
        columns,
        rows,
        "dashboard-product-box",
        "Products",
        rows.length > 6
    )();

    if (error) toast.error(error);

    useEffect(() => {
        if (data?.coupons)
            setRows(
                data.coupons.map((i) => ({
                    _id: i._id,
                    code: i.code,
                    amount: i.amount,
                    action: <Link to={`/admin/discount/${i._id}`}>Manage</Link>,
                }))
            );
    }, [data]);

    return (
        <div className="admin-container">
            <AdminSidebar />
            <main>{isLoading ? <SkeletonLoader count={20} /> : Table}</main>
            <Link to="/admin/app/coupon" className="create-product-btn">
                <FaPlus />
            </Link>
        </div>
    );
};

export default Discount;