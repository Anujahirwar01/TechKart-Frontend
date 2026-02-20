import { FaSearch, FaShoppingBag, FaSignInAlt, FaUser, FaSignOutAlt } from 'react-icons/fa'
import { TbShoppingCart } from 'react-icons/tb'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch } from 'react-redux';
import type { User } from '../types/types'
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import toast from 'react-hot-toast';
import { userNotExist } from '../redux/reducer/userReducer';


interface PropsType {
    user: User | null;
}

const Header = ({ user }: PropsType) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dispatch = useDispatch();
    const logoutHandler = async () => {
        try {
            localStorage.removeItem("demo-admin-session");
            await signOut(auth);
            dispatch(userNotExist());
            toast.success("Logout Successfull")
            setIsOpen(false);
        } catch (err) {
            toast.error("Logout Failed")
        }
    }
    return (
        <nav className='header'>
            <Link onClick={() => setIsOpen(false)} to={"/"} className="header-logo">
                <TbShoppingCart />
                <span>Tech<strong>Kart</strong></span>
            </Link>
            <div className="header-nav">
                <Link onClick={() => setIsOpen(false)} to={"/search"}><FaSearch />
                </Link>
                <Link onClick={() => setIsOpen(false)} to={"/cart"}><FaShoppingBag />
                </Link>
                {
                    user?._id ? (
                        <>
                            <button onClick={() => setIsOpen((prev) => !prev)}>
                                <FaUser />
                            </button>
                            <dialog open={isOpen}>
                                <div>
                                    {
                                        user.role === "admin" && (
                                            <Link onClick={() => setIsOpen(false)} to={"/admin/dashboard"}>Dashboard</Link>
                                        )
                                    }
                                    <Link onClick={() => setIsOpen(false)} to={"/orders"}>Orders</Link>
                                    <button onClick={logoutHandler}>
                                        <FaSignOutAlt /> Logout
                                    </button>
                                </div>
                            </dialog>
                        </>
                    ) : (
                        <Link to={"/login"}><FaSignInAlt /></Link>
                    )
                }
            </div>
        </nav>
    )
}

export default Header
