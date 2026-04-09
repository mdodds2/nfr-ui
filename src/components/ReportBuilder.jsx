import { useContext, useEffect, useState } from 'react';

import Category from '../ui/Category.jsx';

import useCategories from '../hooks/useCategories.js';
import { getSubCategories } from '../util/http.js';
import { DisplayContext } from '../store/display-context.jsx';
import Menu from '../ui/Menu.jsx';
import MenuItem from '../ui/MenuItem.jsx';


function ReportBuilder() {
  const displayContext = useContext(DisplayContext);
  const {categories, isLoading, error} = useCategories();
  const [category, setCategory ] = useState();
  const [subCategory, setSubCategory]  = useState();

  function handleHome() {
    displayContext.setCategoryId(null);
    displayContext.setSubCategoryId(null);
    displayContext.setSubCategories(null);

    setCategory(null);
    setSubCategory(null);
  }

  function handleCategory(id) {
    if(displayContext.categoryId === id) {
      displayContext.setCategoryId();
      setCategory();
      return;
    }

    displayContext.setCategoryId(id);
    const cat = categories.filter( c => c.id == id);
    setCategory(cat[0]);
    setSubCategory(null);
  }

  function handleSubCategory(id) {
    if(displayContext.subCategoryId === id) {
      displayContext.setSubCategoryId();
      setSubCategory();
      return;
    }

    displayContext.setSubCategoryId(id);
    const subCat = displayContext.subCategories.filter( c => c.id == id);
    setSubCategory(subCat[0]);
  }
 
  useEffect( () => {
      async function fetchSubCategoryData() {
          const subCategoriesResp = await getSubCategories(displayContext.categoryId);
          displayContext.setSubCategories(subCategoriesResp);
      }

      if(displayContext.categoryId) {
        fetchSubCategoryData();
      }

  }, [displayContext.categoryId]);
  

  return (
      <div className="main-page">
      <aside id="sidebar">
        <Menu>
          <MenuItem id="home" parent="home" text="Home" handleClick={handleHome} />
          {categories && categories.map(cat =>  
            <MenuItem key={cat.id} id={cat.id} parent={cat.id} text={cat.name} handleClick={ () => handleCategory(cat.id)}>
              { cat.subCategories && cat.subCategories.map(subCat =>
                <MenuItem key={subCat.id} id={subCat.id} parent={cat.id} text={subCat.name} handleClick={ () => handleSubCategory(subCat.id)}/>
              )}
            </MenuItem>
          )}
        </Menu>
      </aside>

      <main>

        <section>
          <article>
            <h1>What are Quality Attributes ?</h1>
            <br />
            <p>Quality attributes (also called non-functional requirements, quality characteristics, or the "-ilities") describe how well an information system or application performs its functions, rather than what it does (the functional requirements). They are critical for information systems (IS) and applications because these systems often handle large volumes of data, serve many concurrent users, integrate with other enterprise systems, and must operate reliably in business or mission-critical contexts.</p>
            <br/>
            <p>The most widely accepted international framework for quality attributes in software and ICT products—including information systems and applications—is ISO/IEC 25010:2023 (part of the SQuaRE series). It defines a product quality model with nine top-level quality characteristics (each with sub-characteristics) that apply directly to information systems, enterprise applications, web/mobile apps, data-intensive systems, and related ICT components.</p>
            <br/>
          </article>

          <article>
            <p>ISO/IEC 25010:2023 (second edition, published November 2023) is part of the SQuaRE (Systems and software Quality Requirements and Evaluation) series. It defines a product quality model for ICT (information and communication technology) products and software products, including subsystems, firmware, hardware elements, data, and related components of information systems. </p>
            <br/>
            <p>The standard provides a reference framework of nine top-level quality characteristics, each broken down into subcharacteristics. These enable stakeholders (developers, acquirers, quality assurance teams, evaluators, etc.) to specify, measure, and evaluate product quality throughout the lifecycle. It supports activities such as requirements elicitation, design, testing, quality assurance, and acceptance. </p>
            <br/>
            <p>This edition revises the 2011 version: it moves quality-in-use and overview content to separate standards (ISO/IEC 25019 and ISO/IEC 25002), extends the scope to broader ICT products, refines names/definitions for clarity, and updates subcharacteristics to reflect modern ICT needs.</p>
          </article>

          <article>
            <br/>
            <p>Use the menu on the left to discover more about the various characteristics and sub-characteristics defined by the ISO/IEC 25010:2023 standard.</p>
          </article>
          <br/>

          { category && <article className="word-box"> 
            <h2>Characteristic: {category.name}</h2>
            <p>{category.description}</p>
          </article> }
          <br/>

          { subCategory && <article className="word-box">
              <h2>Sub-Characteristic:  {subCategory.name}</h2>
              <p>{subCategory.description}</p>
          </article> }

    
        </section>

      </main>
      </div>
  );
}

export default ReportBuilder;