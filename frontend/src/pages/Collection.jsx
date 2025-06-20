import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import dropdownIcon from '../assets/dropdown_icon.png';
import './Collection.css';
import ProductItem from '../components/ProductItem'; // Assuming ProductItem is your component for individual products

const Collection = () => {
  const { products, search, setSearch } = useContext(ShopContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showFilters, setShowFilters] = useState(!isMobile);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [sortOption, setSortOption] = useState('relevant');

  const categories = {
    Men: ['Hoodies', 'T-Shirts', 'Varsityjacket', 'Bottomwear'],
    Women: ['Hoodies', 'T-Shirts', 'Tops', 'Bottomwear', 'Sweaters'],
    Accessories: ['Photocards', 'LightSticks', 'Key-Chains', 'Plushies'],
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setShowFilters(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let currentFiltered = [...products];

    // Apply search filter first
    if (search && search.trim() !== '') {
      const searchTerm = search.toLowerCase().trim();
      currentFiltered = currentFiltered.filter(product => {
        return (
          (typeof product.name === 'string' && product.name.toLowerCase().includes(searchTerm)) ||
          (typeof product.description === 'string' && product.description.toLowerCase().includes(searchTerm)) ||
          (typeof product.category === 'string' && product.category.toLowerCase().includes(searchTerm)) ||
          (typeof product.subCategory === 'string' && product.subCategory.toLowerCase().includes(searchTerm))
        );
      });
    }

    // Apply subcategory filters
    if (selectedSubcategories.length > 0) {
      currentFiltered = currentFiltered.filter((product) => {
        const productCategorySub = (typeof product.category === 'string' && typeof product.subCategory === 'string') 
                                   ? `${product.category}|${product.subCategory}` 
                                   : null;
        return productCategorySub && selectedSubcategories.includes(productCategorySub);
      });
    }

    // Apply sorting
    if (sortOption === 'lowToHigh') {
      currentFiltered.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'highToLow') {
      currentFiltered.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'relevant') {
      // Simple random shuffle for "relevant"
      currentFiltered = [...currentFiltered].sort(() => Math.random() - 0.5);
    }

    setFilteredProducts(currentFiltered);
  }, [search, selectedSubcategories, sortOption, products]);

  const toggleFilters = () => {
    if (isMobile) setShowFilters((prev) => !prev);
  };

  const handleSubcategoryChange = (e) => {
    const value = e.target.value;
    setSelectedSubcategories((prev) =>
      e.target.checked ? [...prev, value] : prev.filter((sub) => sub !== value)
    );
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="collection-container">
      {/* Removed the top search bar completely - this was done in Navbar.jsx */}

      <div className="collection-layout">
        {/* Filter Section */}
        <div className="filter-section">
          <div className="filter-header" onClick={toggleFilters}>
            <p className="filter-title">FILTERS</p>
            {isMobile && (
              <img
                src={dropdownIcon}
                alt="Toggle"
                className={`dropdown-icon ${showFilters ? 'rotated' : ''}`}
              />
            )}
          </div>

          {showFilters && (
            <div className="filter-box">
              {Object.entries(categories).map(([categoryName, subCats]) => (
                <div key={categoryName} className="category-section">
                  <p className="category-heading">{categoryName}</p>
                  <div className="subcategory-list">
                    {subCats.map((subCat, index) => {
                      const combinedKey = `${categoryName}|${subCat}`;
                      return (
                        <label key={index} className="subcategory-item">
                          <input
                            type="checkbox"
                            value={combinedKey}
                            onChange={handleSubcategoryChange}
                            checked={selectedSubcategories.includes(combinedKey)}
                          />
                          <span>{subCat}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Products Section */}
        <div className="products-section">
          <div className="products-header">
            <div className="all-collections-wrapper">
              <p className="all-collections-title">ALL COLLECTIONS</p>
              <hr className="all-collections-line" />
            </div>
            <div className="sort-dropdown">
              <select value={sortOption} onChange={handleSortChange}>
                <option value="relevant">Sort By: Relevant</option>
                <option value="lowToHigh">Sort By: Low to High</option>
                <option value="highToLow">Sort By: High to Low</option>
              </select>
            </div>
          </div>

          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item, index) => (
                <ProductItem
                  key={index} // index key is okay here but ideally use unique ID
                  name={item.name}
                  id={item._id}
                  price={item.price}
                  image={item.image[0]}
                />
              ))
            ) : (
              <p className="no-products-message">No products match your filters.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;




