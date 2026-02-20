import { FaExpandAlt, FaPlus } from "react-icons/fa";
import { server } from "../redux/store";
import type { CartItem } from "../types/types";
import { Link } from "react-router-dom";

type ProductsProps = {
    productId: string;
    name: string;
    price: number;
    photos: {
        url: string;
        public_id: string;
    }[];
    stock: number;
    handler: (cartItem: CartItem) => string | undefined;
}



const ProdectCard = ({ productId, name, price, photos, stock, handler }: ProductsProps) => {
    // Check if photo URL is from Cloudinary or local server
    const imageUrl = photos?.[0]?.url?.startsWith('http') ? photos[0].url : `${server}/${photos?.[0]?.url}`;

    return <div className="product-card">
        <img src={imageUrl} alt={name} />
        <p>{name}</p >
        <span>₹{price}</span>
        <div >
            <button onClick={() => handler({ productId, name, price, photo: imageUrl, stock, quantity: 1 })}><FaPlus /></button>
            <Link to={`/product/${productId}`}>
            <FaExpandAlt/>
            </Link>
        </div>
    </div>;
}

export default ProdectCard;