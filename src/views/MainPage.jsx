import React, { useState, useEffect, useRef } from 'react';
import Products from '../components/Products';
import './MainPage.css';

export default function MainPage() {
  const [searchInput, setSearchInput] = useState('');
  const [products, setProducts] = useState([]);
  const [productsToDisplay, setProductsToDisplay] = useState([]);
  const [sortOptionsVisible, setSortOptionsVisibility] = useState(false);
  const [filterOptionsVisible, setFilterOptionsVisibility] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesVisible, setCategoriesVisible] = useState(false);
  const [brands, setBrands] = useState([]);
  const [brandsVisible, setBrandsVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const productsRef = useRef([]);
  const searchTimeoutRef = useRef(null);

  //format the category strings to have capital letters and spaces insead of dashes (-)
  function formatString(string) {
    return string.split('-').map(word => word === 'womens' ? word = "Women's" : word === 'mens' ? word = "Men's" : word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  
  //Fetch the products, populate arrays of categories and brands for later use in the filter function
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://dummyjson.com/products?limit=0');
        const jsonData = await response.json();
        setProducts(jsonData.products);
        productsRef.current = jsonData.products;
        setProductsToDisplay(jsonData.products);
        const categorySet = new Set();
        const brandSet = new Set();

        jsonData.products.forEach(product => {
          categorySet.add(formatString(product.category));
          brandSet.add(product.brand);
        });

        setCategories(Array.from(categorySet));
        setBrands(Array.from(brandSet));
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

    //Search product function with debounce
    function search(event) {
      const input = event.target.value;
      setSearchInput(input);
  
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
  
      searchTimeoutRef.current = setTimeout(() => {
        if (input === '') {
          setProductsToDisplay(productsRef.current);
        } else {
          const matchingProducts = productsRef.current.filter(product =>
            product.title.toLowerCase().includes(input.toLowerCase())
          );
          setProductsToDisplay(matchingProducts);
        }
      }, 250);
    }

  //Toggle visibility of the sorting options div
  function toggleSortOptions() {
    setSortOptionsVisibility(!sortOptionsVisible);
    if (filterOptionsVisible) {
        setFilterOptionsVisibility(false);
    }
  }

  //Toggle visibility of the filtering options div
  function toggleFilterOptions() {
    setFilterOptionsVisibility(!filterOptionsVisible);
    if (sortOptionsVisible) {
        setSortOptionsVisibility(false);
    }
  }

  //Same logic for these two, responsible for categories and brands
  function toggleCategoriesOption(){
    setCategoriesVisible(!categoriesVisible);
    if (brandsVisible) {
      setBrandsVisible(false);
    }
  }

  function toggleBrandsOption(){
    setBrandsVisible(!brandsVisible);
    if (categoriesVisible) {
      setCategoriesVisible(false);
    }
  }

  //Track which categories to filter by
  const filterCategory = (event) => {
    const { value, checked } = event.target;
    setSelectedCategories(prev =>
      checked ? [...prev, value] : prev.filter(category => category !== value)
    );
  }

  //Track which brands to filter by
  const filterBrand = (event) => {
    const { value, checked } = event.target;
    setSelectedBrands(prev =>
      checked ? [...prev, value] : prev.filter(brand => brand !== value)
    );
  }
  
  //useEffect to display products based on the filters set by user
  useEffect(() => {
    const filteredProducts = products.filter(product => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(formatString(product.category));
      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      return categoryMatch && brandMatch;
    });
    setProductsToDisplay(filteredProducts);
  }, [selectedCategories, selectedBrands, products]);
  
  //Sort products in acsending or descending order based on user input
  function sortProducts(order) {
    const sortedProducts = [...productsToDisplay].sort((a, b) => {
      if (order === 'asc') {
        return a.price - b.price;
      } else {
        return b.price - a.price; 
      }
    });

    setProductsToDisplay(sortedProducts);
    setSortOptionsVisibility(false);
  }

  return (
    <div className="main-container">
      <div className='wrapper'>
        <div className="top-bar">
          <input type="text" placeholder="Search product:" className="search-input" value={searchInput} onChange={search}/>
          <button className="sort-button" onClick={toggleSortOptions}>Sort</button>
          <button className="filter-button" onClick={toggleFilterOptions}>Filter</button>
          {sortOptionsVisible && (
            <div className="sort-options">
              <button onClick={() => sortProducts('asc')}>Price: Low to High</button>
              <button onClick={() => sortProducts('desc')}>Price: High to Low</button>
              <button onClick={toggleSortOptions}>Close</button>
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
              <button onClick={toggleFilterOptions}>Close</button>
            </div>
          )}
        </div>
      </div>
      <Products products={productsToDisplay} />
    </div>
  );
}
