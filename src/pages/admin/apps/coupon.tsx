import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useNewCouponMutation } from "../../../redux/api/paymentAPI";
import type { UserReducerInitialState } from "../../../types/reducer-types";

const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const allNumbers = "1234567890";
const allSymbols = "!@#$%^&*()_+";

const Coupon = () => {
  const { user } = useSelector((state: { user: UserReducerInitialState }) => state.user);
  const navigate = useNavigate();

  const [size, setSize] = useState<number>(8);
  const [prefix, setPrefix] = useState<string>("");
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
  const [includeCharacters, setIncludeCharacters] = useState<boolean>(false);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const [coupon, setCoupon] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  const [newCoupon] = useNewCouponMutation();

  const copyText = async (coupon: string) => {
    await window.navigator.clipboard.writeText(coupon);
    setIsCopied(true);
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!includeNumbers && !includeCharacters && !includeSymbols)
      return alert("Please Select One At Least");

    let result: string = prefix || "";
    const loopLength: number = size - result.length;

    for (let i = 0; i < loopLength; i++) {
      let entireString: string = "";
      if (includeCharacters) entireString += allLetters;
      if (includeNumbers) entireString += allNumbers;
      if (includeSymbols) entireString += allSymbols;

      const randomNum: number = ~~(Math.random() * entireString.length);
      result += entireString[randomNum];
    }

    setCoupon(result);
  };

  const saveCoupon = async () => {
    if (!coupon) {
      return toast.error("Please generate a coupon first");
    }
    if (!amount || amount <= 0) {
      return toast.error("Please enter a valid discount amount");
    }

    try {
      const res = await newCoupon({
        code: coupon,
        amount,
        userId: user?._id!
      });

      if (res.data) {
        toast.success(res.data.message);
        setCoupon("");
        setAmount(0);
        setTimeout(() => navigate("/admin/coupon"), 1000);
      } else if (res.error) {
        const err = res.error as any;
        toast.error(err.data?.message || "Failed to create coupon");
      }
    } catch (error) {
      toast.error("Failed to create coupon");
    }
  };

  useEffect(() => {
    setIsCopied(false);
  }, [coupon]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard-app-container">
        <h1>Coupon</h1>
        <section>
          <form className="coupon-form" onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="Text to include"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              maxLength={size}
            />

            <input
              type="number"
              placeholder="Coupon Length"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              min={8}
              max={25}
            />

            <input
              type="number"
              placeholder="Discount Amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={0}
            />

            <fieldset>
              <legend>Include</legend>

              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={() => setIncludeNumbers((prev) => !prev)}
              />
              <span>Numbers</span>

              <input
                type="checkbox"
                checked={includeCharacters}
                onChange={() => setIncludeCharacters((prev) => !prev)}
              />
              <span>Characters</span>

              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={() => setIncludeSymbols((prev) => !prev)}
              />
              <span>Symbols</span>
            </fieldset>
            <button type="submit">Generate</button>
          </form>

          {coupon && (
            <>
              <code>
                {coupon}{" "}
                <span onClick={() => copyText(coupon)}>
                  {isCopied ? "Copied" : "Copy"}
                </span>{" "}
              </code>
              <button type="button" onClick={saveCoupon} className="save-coupon-btn">
                Save Coupon
              </button>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default Coupon;
