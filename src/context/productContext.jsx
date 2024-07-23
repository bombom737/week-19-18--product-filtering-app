import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [searchInput, setSearchInput] = useState('');
  const [products, setProducts] = useState([]);
  const [productsToDisplay, setProductsToDisplay] = useState([]);
  const [toggleLowToHighSort, setToggleLowToHighSort] = useState(false);
  const [toggleHighToLowSort, setToggleHighToLowSort] = useState(false);
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
  const lowToHighBtnRef = useRef(null);
  const highToLowBtnRef = useRef(null);

  const formatString = (string) => {
    return string.split('-').map(word => 
      word === 'womens' ? "Women's" : word === 'mens' ? "Men's" : 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  useEffect(() => {
    const fetchData = async () => {
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

  const search = (event) => {
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

  const toggleSortOptions = () => {
    setSortOptionsVisibility(!sortOptionsVisible);
    if (filterOptionsVisible) {
      setFilterOptionsVisibility(false);
    }
  }

  const toggleFilterOptions = () => {
    setFilterOptionsVisibility(!filterOptionsVisible);
    if (sortOptionsVisible) {
      setSortOptionsVisibility(false);
    }
  }

  const toggleCategoriesOption = () => {
    setCategoriesVisible(!categoriesVisible);
    if (brandsVisible) {
      setBrandsVisible(false);
    }
  }

  const toggleBrandsOption = () => {
    setBrandsVisible(!brandsVisible);
    if (categoriesVisible) {
      setCategoriesVisible(false);
    }
  }

  const filterCategory = (event) => {
    const { value, checked } = event.target;
    setSelectedCategories(prev =>
      checked ? [...prev, value] : prev.filter(category => category !== value)
    );
  }

  const filterBrand = (event) => {
    const { value, checked } = event.target;
    setSelectedBrands(prev =>
      checked ? [...prev, value] : prev.filter(brand => brand !== value)
    );
  }

  useEffect(() => {
    const filteredProducts = products.filter(product => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(formatString(product.category));
      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      return categoryMatch && brandMatch;
    });
    setProductsToDisplay(filteredProducts);
  }, [selectedCategories, selectedBrands, products]);

  const toggleLowToHigh = () => {
    if (toggleLowToHighSort) {
      lowToHighBtnRef.current.style.filter = "brightness(1.0)"
      setProductsToDisplay(productsRef.current);
    } else {
      const sortedProducts = [...productsToDisplay].sort((a, b) => a.price - b.price);
      lowToHighBtnRef.current.style.filter = "brightness(1.2)"
      highToLowBtnRef.current.style.filter = "brightness(1.0)"
      setProductsToDisplay(sortedProducts);
    }
    setToggleLowToHighSort(!toggleLowToHighSort);
    setToggleHighToLowSort(false);
  }

  const toggleHighToLow = () => {
    if (toggleHighToLowSort) {
      highToLowBtnRef.current.style.filter = "brightness(1.0)"
      setProductsToDisplay(productsRef.current);
    } else {
      const sortedProducts = [...productsToDisplay].sort((a, b) => b.price - a.price);
      highToLowBtnRef.current.style.filter = "brightness(1.2)"
      lowToHighBtnRef.current.style.filter = "brightness(1.0)"
      setProductsToDisplay(sortedProducts);
    }
    setToggleHighToLowSort(!toggleHighToLowSort);
    setToggleLowToHighSort(false);
  }

  const value = useMemo(() => ({
    searchInput, setSearchInput, products, setProducts, productsToDisplay, setProductsToDisplay, 
    toggleLowToHighSort, setToggleLowToHighSort, toggleHighToLowSort, setToggleHighToLowSort,
    sortOptionsVisible, setSortOptionsVisibility, filterOptionsVisible, setFilterOptionsVisibility,
    categories, setCategories, categoriesVisible, setCategoriesVisible, brands, setBrands,
    brandsVisible, setBrandsVisible, selectedCategories, setSelectedCategories, selectedBrands, setSelectedBrands,
    productsRef, searchTimeoutRef, lowToHighBtnRef, highToLowBtnRef, formatString, search, toggleSortOptions,
    toggleFilterOptions, toggleCategoriesOption, toggleBrandsOption, filterCategory, filterBrand, toggleLowToHigh, toggleHighToLow
  }), [
    searchInput, products, productsToDisplay, toggleLowToHighSort, toggleHighToLowSort, sortOptionsVisible,
    filterOptionsVisible, categories, categoriesVisible, brands, brandsVisible, selectedCategories, selectedBrands
  ]);

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);
