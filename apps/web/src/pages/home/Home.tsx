import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGetProductsQuery } from '../../app/store/api/productsApi';
import Loader from '../../features/loader/Loader';

const PRODUCTS_PER_PAGE = 20;

const Home = () => {
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
          <h2 className="text-2xl font-semibold mb-2">Product Not Found</h2>
          <p className="text-neutral-500">Sorry, we couldn’t find the product you are looking for.</p>
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
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />

            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full md:w-48 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedProducts.map(product => (
              <div
                key={product._id}
                className="border rounded-md overflow-hidden shadow hover:shadow-lg transition-shadow duration-200"
              >
                <img
                  src={product.product_image}
                  alt={product.product_name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-2">
                  <h3 className="font-semibold text-lg">{product.product_name}</h3>
                  <p className="text-yellow-500 font-bold mb-1">${product.product_price.toFixed(2)}</p>
                  <p className="text-neutral-700 text-sm mb-1">{product.product_description}</p>
                  <p className="text-neutral-500 text-xs">{product.product_category}</p>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex mt-6 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-yellow-500 text-white' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
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
