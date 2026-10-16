import { useEffect, useState } from 'react';

export default function Footer() {

    const [initialized, setInitialized] = useState(false);


    return(
        <section>
        <div className="footer">
            <h2>Footer text</h2>
        </div>
        </section>
    );
}