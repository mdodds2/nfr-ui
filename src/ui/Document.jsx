import { Link } from 'react-router-dom';

import JavaImage from '../assets/java.png';
import PDFImage from '../assets/PDF.png';
import SwaggerImage from '../assets/swagger_logo.png';

export default function Document({type, title, location="#"}) {
  return (
    <article className="article-tile">
        {type === 'javadoc' && <img height="75%" src={JavaImage}/> }
        {type === 'pdf' && <img height="75%" src={PDFImage}/> }
        {type === 'swagger' && <img height="75%" src={SwaggerImage}/> }
        <div className="center-container">
            <Link target="_new" className="link-button" to={location}>{title}</Link>     
        </div>
    </article>
  )
}
