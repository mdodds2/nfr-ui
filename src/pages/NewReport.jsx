import { useContext, useEffect } from 'react';
import CartContext from "../store/cart-context.jsx";
import ReportForm from "../components/ReportForm.jsx";

export default function NewReport() {

    const { clearCart } = useContext(CartContext);

    useEffect(() => { clearCart(); }, []);

    return (
        <main>
            <section>
                <ReportForm mode="new" />
            </section>
        </main>
    );
}
