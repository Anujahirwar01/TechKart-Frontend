import { FaPlus } from "react-icons/fa";
import { server } from "../redux/store";
import type { CartItem } from "../types/types";

type ProductsProps = {
    productId: string;
    name: string;
    price: number;
    photo: string;
    stock: number;
    handler: (cartItem: CartItem) => string | undefined;
}



const ProdectCard = ({productId, name, price, photo, stock, handler}: ProductsProps) => {
    // Check if photo is a full URL or just a filename
    const imageUrl = photo.startsWith('http') ? photo : `${server}/${photo}`;
    
    return <div className="product-card">
        <img src={imageUrl} alt={name} />
        <p>{name}</p >
        <span>₹{price}</span>
        <div >
            <button onClick={() => handler({productId, name, price, photo: imageUrl, stock, quantity: 1})}><FaPlus/></button>
        </div>
    </div>;
}

export default ProdectCard;