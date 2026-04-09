import { useState } from 'react';

import CategoriesSub from './CategoriesSub.jsx';
import MainNavigation from './MainNavigation.jsx';
import Footer from './Footer.jsx';
import useCategories from '../hooks/useCategories.js';

function ReportBuilder() {
  const categories = null;
  //const { categories, isLoading, error} = useCategories();
  const [categoryId, setCategoryId] = useState();
  const [showHome, setShowHome] = useState(true);

  function handleCategory(id) {
    setCategoryId(id);
    setShowHome(false);
  }

  return (
    <>
    <div className="main-content">

      <MainNavigation />

      <main className="preview-area">
        <section>
          <article>
            <h1>What are Quality Attributes ?</h1>
            <br />
            <p>Quality attributes (often called non-functional requirements or "ilities") are measurable, non-behavioral characteristics that determine a system's, 
              product's, or service's performance, user experience, and overall success. They define how well a system functions rather than what it does, including 
              security, usability, reliability, scalability, and maintainability.</p>
            <br />
            <p>Click on any of the following links to discover more.</p>
            <br/>
          </article>

          <article className="category-box">
              {isLoading && <p>Loading categories...</p>}
              {categories && categories.map((category) =>
                <button className="tile-button" key={category.id} onClick={() => handleCategory(category.id)}>{category.name}</button>
              )}

          </article>

          <article>
            {!showHome && categoryId && <CategoriesSub categoryId={categoryId} />}
          </article>
        </section>

      </main>
    </div>
    <Footer />
    </>
    

  );
}

export default ReportBuilder;