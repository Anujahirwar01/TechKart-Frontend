import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { TbShoppingCart } from 'react-icons/tb';
import { MdAdminPanelSettings } from 'react-icons/md';
import toast from 'react-hot-toast';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { useLoginMutation, getUser, getDemoAdminUser } from '../redux/api/userAPI';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { MessageResponse } from '../types/api-types';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks';
import { userExist } from '../redux/reducer/userReducer';


const Login = () => {
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");
  const [demoLoading, setDemoLoading] = useState(false);
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const demoAdminHandler = async () => {
    setDemoLoading(true);
    try {
      const data = await getDemoAdminUser();
      dispatch(userExist(data.user));
      localStorage.setItem("demo-admin-session", "true");
      toast.success("Logged in as Demo Admin!");
      navigate("/admin/dashboard");
    } catch {
      toast.error("Demo login failed.");
    } finally {
      setDemoLoading(false);
    }
  };
  const loginHandler = async () => {
    try {
      if (!gender || !date) {
        toast.error("All fields are required");
        return;
      }

      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      const res = await login({
        name: user.displayName!,
        email: user.email!,
        photo: user.photoURL!,
        gender,
        dob: date,
        _id: user.uid,
        role: "user",
      })

      if (res.data) {
        toast.success(res.data.message);
        const userData = await getUser(user.uid);
        dispatch(userExist(userData.user));
        navigate('/');
      } else {
        const error = res.error as FetchBaseQueryError;
        const message = error.data as MessageResponse;
        toast.error(message.message);
      }

    } catch (err) {
      toast.error("Login failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="login">
      <aside className="login-brand">
        <div className="login-brand-content">
          <div className="login-logo">
            <TbShoppingCart />
            <span>Tech<strong>Kart</strong></span>
          </div>
          <h2>Shop smarter.<br />Game harder.</h2>
          <p>Discover the best deals on tech, gaming gear, and more — all in one place.</p>
          <ul>
            <li>✦ Free delivery on orders over $200</li>
            <li>✦ 100% secure payments</li>
            <li>✦ 24/7 customer support</li>
          </ul>
        </div>
      </aside>

      <main>
        <div className="login-form">
          <h1>Welcome back</h1>
          <p className="login-sub">Sign in to continue to TechKart</p>

          <div className="login-field">
            <label>Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="login-field">
            <label>Date of Birth</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <button className="login-google-btn" onClick={loginHandler}>
            <FcGoogle />
            <span>Continue with Google</span>
          </button>

          <div className="login-divider"><span>or</span></div>

          <button className="login-demo-btn" onClick={demoAdminHandler} disabled={demoLoading}>
            <MdAdminPanelSettings />
            <span>{demoLoading ? "Logging in..." : "Try Demo Admin"}</span>
          </button>

          <p className="login-hint">Already signed in once? Just select your details above.</p>
        </div>
      </main>
    </div>
  );
}

export default Login
