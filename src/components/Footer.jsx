import { useEffect, useState } from 'react';
import { qotd } from '../util/http.js';

export default function Footer() {

    const [initialized, setInitialized] = useState(false);
    const [myQotd, setMyQotd] = useState({character: '', quote: 'Loading'});

    useEffect( () => { 
        async function fetchQotd() {
            const result = await qotd();
            setMyQotd(result);
        }

        if(!initialized) {
            setInitialized(true);
            fetchQotd();
        }

    }, []);


    return(
        <section>
        <div className="footer">
            <img height="40" src={myQotd.character_avatar_url} />
            <p className="character">{myQotd.character}:</p>
            <p className="quote">{myQotd.quote}</p>
        </div>
        </section>
    );
}