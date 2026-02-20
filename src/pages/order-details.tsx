import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useOrderDetailsQuery } from "../redux/api/orderAPI";
import type { CustomError } from "../types/api-types";
import { FaBox, FaMapMarkerAlt, FaReceipt, FaTruck, FaCheckCircle, FaClock } from "react-icons/fa";

const statusIcon = (status: string) => {
  if (status === "delivered") return <FaCheckCircle className="status-icon delivered" />;
  if (status === "shipped") return <FaTruck className="status-icon shipped" />;
  return <FaClock className="status-icon processing" />;
};

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isError, error, isLoading } = useOrderDetailsQuery(id!);

  useEffect(() => {
    if (isError) {
      const err = error as CustomError;
      toast.error(err?.data?.message || "Failed to fetch order details");
    }
  }, [isError, error]);

  if (isLoading) return <div className="order-details-loading">Loading order...</div>;
  if (!data?.order) return <div className="order-details-loading">Order not found.</div>;

  const order = data.order;
  const { orderItems, shippingInfo, subtotal, tax, shippingCharges, discount, total, status, user } = order;

  return (
    <div className="order-details-page">
      <div className="order-details-header">
        <div>
          <Link to="/orders" className="back-link">← Back to Orders</Link>
          <h1>Order Details</h1>
          <p className="order-id">Order ID: <span>{order._id}</span></p>
        </div>
        <div className={`order-status-badge status-${status}`}>
          {statusIcon(status)}
          <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </div>
      </div>

      <div className="order-details-grid">
        {/* Order Items */}
        <section className="order-card order-items-card">
          <h2><FaBox /> Order Items</h2>
          <div className="order-items-list">
            {orderItems.map((item) => (
              <div key={item._id} className="order-item">
                <img src={item.photo} alt={item.name} />
                <div className="order-item-info">
                  <p className="order-item-name">{item.name}</p>
                  <p className="order-item-meta">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                </div>
                <p className="order-item-total">₹{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="order-details-right">
          {/* Shipping Info */}
          <section className="order-card">
            <h2><FaMapMarkerAlt /> Shipping Address</h2>
            <div className="order-info-grid">
              <span>Customer</span><strong>{user.name}</strong>
              <span>Address</span><strong>{shippingInfo.address}</strong>
              <span>City</span><strong>{shippingInfo.city}</strong>
              <span>State</span><strong>{shippingInfo.state}</strong>
              <span>Country</span><strong>{shippingInfo.country}</strong>
              <span>PIN Code</span><strong>{shippingInfo.pinCode}</strong>
            </div>
          </section>

          {/* Price Breakdown */}
          <section className="order-card">
            <h2><FaReceipt /> Price Breakdown</h2>
            <div className="order-price-list">
              <div><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div><span>Shipping</span><span>₹{shippingCharges.toLocaleString()}</span></div>
              <div><span>Tax</span><span>₹{tax.toLocaleString()}</span></div>
              {discount > 0 && <div className="discount-row"><span>Discount</span><span>- ₹{discount.toLocaleString()}</span></div>}
              <div className="total-row"><span>Total</span><strong>₹{total.toLocaleString()}</strong></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
