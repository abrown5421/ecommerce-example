import { motion } from 'framer-motion';
import { useNavigate, useNavigation, useParams } from 'react-router-dom';
import { useGetProductByIdQuery } from '../../app/store/api/productsApi';
import Loader from '../../features/loader/Loader';

const Product = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useGetProductByIdQuery(id!);

  const handleAddToCart = () => {
    navigate('/cart');
  }

  const handleBuyNow = () => {
    navigate('/checkout');
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-screen bg-neutral sup-min-nav relative z-0 p-4 flex flex-col justify-center items-center"
    >
      {isLoading ? (
        <Loader />
      ) : error || !product ? (
        <div className="text-center text-primary mt-10">
          <h2 className="text-2xl font-semibold mb-2">Product Not Found</h2>
          <p className="text-neutral-500">Sorry, we couldn’t find the product you are looking for.</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 items-center">
          <div className="flex justify-center">
            <img
              src={product.product_image}
              alt={product.product_name}
              className="rounded-lg shadow-lg object-contain"
            />
          </div>
          <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-bold text-neutral-900">{product.product_name}</h1>
            <span className="text-sm text-neutral-500 uppercase tracking-wide">{product.product_category}</span>
            <p className="text-neutral-600">{product.product_description}</p>
            <span className="text-2xl font-semibold text-primary">${product.product_price.toFixed(2)}</span>
            <div className="flex flex-row gap-4">
              <button 
                onClick={handleAddToCart}
                className="cursor-pointer flex flex-1 justify-center items-center px-4 py-2 border-2 bg-gray-600 text-primary-contrast rounded-xl hover:bg-neutral hover:border-gray-600 hover:text-gray-600 transition-all"
              >
                Add To Cart
              </button>
              <button 
                onClick={handleAddToCart}
                className="cursor-pointer flex flex-1 justify-center items-center px-4 py-2 border-2 bg-primary text-primary-contrast rounded-xl hover:bg-neutral hover:border-primary hover:text-primary transition-all"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Product;
