import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'
import type { Column } from 'react-table'
import TableHOC from '../components/admin/TableHOC'
import { useAllOrdersQuery } from '../redux/api/orderAPI'
import type { CustomError } from '../types/api-types'
import type { UserReducerInitialState } from '../types/reducer-types'

type DataType = {
  _id: string;
  amount: number;
  quantity: number;
  status: ReactElement;
  discount: number;
  action: ReactElement
}

const column: Column<DataType>[] = [
  { Header: "ID", accessor: "_id" },
  { Header: "Quantity", accessor: "quantity" },
  { Header: "Discount", accessor: "discount" },
  { Header: "Amount", accessor: "amount" },
  { Header: "Status", accessor: "status" },
  { Header: "Action", accessor: "action" }
]

const Orders = () => {

  const { user } = useSelector((state: { user: UserReducerInitialState }) => state.user);
  const { isError, error, data } = useAllOrdersQuery(user?._id!);
  const [rows, setRows] = useState<DataType[]>([]);

  // ✅ FIXED: Move toast.error inside useEffect
  useEffect(() => {
    if (isError) {
      const err = error as CustomError;
      toast.error(err.data?.message || "Failed to fetch orders");
    }
  }, [isError, error]);

  useEffect(() => {
    if (data?.orders) {
      setRows(data.orders.map((order: any) => ({
        _id: order._id,
        amount: order.total,
        discount: order.discount,
        quantity: order.orderItems.length,
        status: order.status === "processing" ?
          <span className="red">{order.status}</span> :
          order.status === "shipped" ?
            <span className="green">{order.status}</span> :
            <span className="purple">{order.status}</span>,
        // ✅ FIXED: Changed to user order detail link instead of admin
        action: <Link to={`/order/${order._id}`}>View</Link>,
      })));
    }
  }, [data]);

  const Table = TableHOC<DataType>(column, rows, "dashboard-product-box", "Orders", rows.length > 6)()

  return (
    <div className="container">
      <h1 className='heading'>My Orders</h1>
      {Table}
    </div>
  )
}

export default Orders