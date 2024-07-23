import React from 'react';
import Products from '../components/Products';
import { useProductContext } from '../context/productContext';
import './MainPage.css';

export default function MainPage() {
  const {
    searchInput, productsToDisplay, sortOptionsVisible, toggleSortOptions,
    filterOptionsVisible, toggleFilterOptions, categoriesVisible, toggleCategoriesOption,
    brandsVisible, toggleBrandsOption, categories, brands, filterCategory, filterBrand,
    search, lowToHighBtnRef, highToLowBtnRef, toggleLowToHigh, toggleHighToLow
  } = useProductContext();

  return (
    <div className="main-container">
      <div className='wrapper'>
        <div className="top-bar">
          <input type="text" placeholder="Search product:" className="search-input" value={searchInput} onChange={search}/>
          <button className="sort-button" onClick={toggleSortOptions}>Sort</button>
          <button className="filter-button" onClick={toggleFilterOptions}>Filter</button>
          {sortOptionsVisible && (
            <div className="sort-options">
              <button id='low-to-high-button' ref={lowToHighBtnRef} onClick={toggleLowToHigh}>Price: Low to High</button>
              <button id='high-to-low-button' ref={highToLowBtnRef} onClick={toggleHighToLow}>Price: High to Low</button>
            </div>
          )}
          {filterOptionsVisible && (
            <div className="filter-options">
              <button className='categories-button' onClick={toggleCategoriesOption}>Categories</button>
              {categoriesVisible && (
                <div className="category-list">
                  {categories.map((category, index) => (
                    <div key={index}>
                      <input type="checkbox" value={category} onChange={filterCategory}/>
                      {category}
                    </div>
                  ))}
                </div>
              )}
              <button className='brands-button' onClick={toggleBrandsOption}>Brands</button>
              {brandsVisible && (
                <div className="brand-list">
                  {brands.map((brand, index) => (
                    <div key={index}>
                      <input type="checkbox" value={brand} onChange={filterBrand}/>
                      {brand}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Products products={productsToDisplay} />
    </div>
  );
}
