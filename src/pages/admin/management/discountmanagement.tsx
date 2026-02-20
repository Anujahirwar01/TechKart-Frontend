import axios from "axios";
import { type FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { SkeletonLoader } from "../../../components/loader";
import { type RootState, server } from "../../../redux/store";
import type { SingleDiscountResponse } from "../../../types/api-types";

const DiscountManagement = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewDiscount = id === "new";

  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(!isNewDiscount);
  const [code, setCode] = useState("");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (!isNewDiscount && id && user?._id) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const { data } = await axios.get<SingleDiscountResponse>(
            `${server}/api/v1/payment/coupon/${id}?id=${user._id}`,
            {
              withCredentials: true,
            }
          );
          if (data.coupon) {
            setCode(data.coupon.code);
            setAmount(data.coupon.amount);
          }
        } catch (error) {
          console.log(error);
          toast.error("Error fetching coupon");
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [id, user?._id, isNewDiscount]);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    // submit handler
    e.preventDefault();

    if (!code || !amount) {
      toast.error("Please provide all required fields");
      return;
    }

    setBtnLoading(true);

    try {
      let response;
      if (isNewDiscount) {
        response = await axios.post(
          `${server}/api/v1/payment/coupon/new`,
          {
            code,
            amount,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
      } else {
        response = await axios.put(
          `${server}/api/v1/payment/coupon/${id}?id=${user?._id}`,
          {
            code,
            amount,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
      }

      const { data } = response;

      if (data.success) {
        setAmount(0);
        setCode("");
        toast.success(data.message);
        navigate("/admin/coupon");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error saving coupon");
    } finally {
      setBtnLoading(false);
    }
  };

  const deleteHandler = async () => {
    setBtnLoading(true);

    try {
      const { data } = await axios.delete(
        `${server}/api/v1/payment/coupon/${id}?id=${user?._id}`,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/admin/coupon");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error deleting coupon");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <SkeletonLoader count={20} />
        ) : (
          <>
            <article>
              {!isNewDiscount && (
                <button className="product-delete-btn" onClick={deleteHandler}>
                  <FaTrash />
                </button>
              )}
              <form onSubmit={submitHandler}>
                <h2>{isNewDiscount ? "Create New Coupon" : "Manage Coupon"}</h2>
                <div>
                  <label>Code</label>
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label>Amount</label>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    required
                  />
                </div>

                <button disabled={btnLoading} type="submit">
                  {isNewDiscount ? "Create" : "Update"}
                </button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default DiscountManagement;