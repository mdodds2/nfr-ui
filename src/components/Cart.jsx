import { useContext } from "react";
import CartContext from "../store/cart-context.jsx";

export default function Cart({ handleShowCart }) {

    const cartContext = useContext(CartContext);

    function handleRemoveRequirement(reqtId) {
        cartContext.removeItem(reqtId);
    }

    return (
        <div>
            <h1>Cart Items ({cartContext.items.length})</h1>
            <table>
                <thead>
                    <tr>
                        <th>Quality Attribute</th>
                        <th>Identifier</th>
                        <th>Characteristic</th>
                        <th>Sub-Characteristic</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {cartContext.items && cartContext.items.map(item =>
                        <tr key={item.requirement.id}>
                            <td>{item.requirement.title}</td>
                            <td>{item.requirement.identifier}</td>
                            <td>{item.category.name}</td>
                            <td>{item.subCategory.name}</td>
                            <td><div className="link-button-red" onClick={() => handleRemoveRequirement(item.requirement.id)}>Remove</div></td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="center-container">
                <p className="link-button-green-mlblue" onClick={() => handleShowCart(false)}>Close</p>
            </div>
        </div>
    )
}
