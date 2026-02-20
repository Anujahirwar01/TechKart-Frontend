import { Link } from 'react-router-dom';
import { FaTrash } from "react-icons/fa"
import { server } from '../redux/store';
import type { CartItem } from '../types/types';

type CartItemProps = {
    cartItem: any; incrementHandler: (cartItem: CartItem) => void;
    decrementHandler: (cartItem: CartItem) => void;
    removeHandler: (cartItem: CartItem) => void;
}

const CartItemComponent = ({ cartItem, incrementHandler, decrementHandler, removeHandler }: CartItemProps) => {
    const { productId, photo, name, price, quantity } = cartItem;
    const imageUrl = photo?.startsWith?.('http') ? photo : `${server}/${photo || ''}`;
    return (
        <div className="cart-item">
            <img src={imageUrl} alt={name} />
            <article>
                <Link to={`/product/${productId}`}>{name}</Link>
                <p>₹{price}</p>
            </article>
            <div>
                <button onClick={() => decrementHandler(cartItem)}>-</button>
                <p>{quantity}</p>
                <button onClick={() => incrementHandler(cartItem)}>+</button>
            </div>
            <button onClick={() => removeHandler(cartItem)}>
                <FaTrash />
            </button>
        </div>
    )
}

export default CartItemComponent
