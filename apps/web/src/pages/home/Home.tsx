import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../../app/store/api/productsApi';
import Loader from '../../features/loader/Loader';

const PRODUCTS_PER_PAGE = 20;

const Home = () => {
  const navigate = useNavigate();
  const { data: products, isLoading, error } = useGetProductsQuery();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => {
    if (!products) return [];
    const cats = Array.from(new Set(products.map(p => p.product_category)));
    return ['All', ...cats]; 
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(product => {
      const matchesSearch = product.product_name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || product.product_category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleAddToCart = () => {
    navigate('/cart');
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-neutral sup-min-nav relative z-0 p-4 flex flex-col justify-start items-center"
    >
      {isLoading ? (
        <Loader />
      ) : error || !products ? (
        <div className="text-center text-red-500 mt-10 font-primary">
          <h2 className="text-2xl font-semibold mb-2">Products Not Found</h2>
          <p className="text-neutral-500">Sorry, we couldn’t find the products you were looking for.</p>
        </div>
      ) : (
        <>
          <div className="w-full mb-6 flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full md:w-48 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          {paginatedProducts.length === 0 ? (
            <div className="text-center flex grow justify-center items-center text-neutral-500 font-semibold text-lg">
              No products match your criteria
            </div>
          ) : (
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedProducts.map(product => (
                <div
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="rounded-md overflow-hidden shadow-xl flex flex-col h-full cursor-pointer"
                >
                  <img
                    src={product.product_image}
                    alt={product.product_name}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-2 flex flex-col flex-1">
                    <h3 className="font-semibold text-lg">
                      {product.product_name}
                    </h3>

                    <p className="text-primary font-bold mb-1">
                      ${product.product_price.toFixed(2)}
                    </p>

                    <p className="text-secondary text-sm mb-1">
                      {product.product_description}
                    </p>

                    <p className="text-neutral-400 text-xs mb-5">
                      {product.product_category}
                    </p>
                    <hr className="mt-auto mb-2 border-t border-gray-300" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/cart');
                      }}
                      className="btn-secondary"
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex mt-6 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-gray"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`btn-neutral ${currentPage === i + 1 ? 'bg-primary text-white' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn-gray"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default Home;
