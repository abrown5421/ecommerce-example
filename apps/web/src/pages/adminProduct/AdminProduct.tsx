import { motion } from 'framer-motion';
import { useDeleteProductMutation, useGetProductsQuery } from '../../app/store/api/productsApi';
import Loader from '../../features/loader/Loader';
import CollectionEditor from '../../features/collectionEditor/CollectionEditor';
import { useAppDispatch } from '../../app/store/hooks';
import { openModal } from '../../features/modal/modalSlice';
import { IProduct } from '../../types/product.types';

const AdminProduct = () => {
  const dispatch = useAppDispatch();
  const { data: products = [], isLoading } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  if (isLoading) return <Loader />;
  
  const handleDelete = (item: IProduct) => {
    dispatch(
      openModal({
        modalContent: 'confirm',
        title: 'Delete Product',
        message: 'This action is permanent and cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        confirmAction: async () => {
          try {
            await deleteProduct(item._id).unwrap();
          } catch (err) {
            console.error('Delete failed', err);
          }
        },
      })
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-neutral relative z-0 p-4 flex flex-8"
    >
      <CollectionEditor
        data={products}
        searchKeys={['product_name', 'product_category']}
        columns={[
          { key: 'product_name', label: 'Name' },
          { key: 'product_category', label: 'Category' },
          { key: 'product_price', label: 'Price', render: (p) => `$${p.product_price.toFixed(2)}` },
          { key: 'createdAt', label: 'Created', render: (p) => new Date(p.createdAt).toLocaleDateString() },
        ]}
        onEdit={(product) => console.log('Edit', product)}
      onDelete={handleDelete}
      />
    </motion.div>
  );
};

export default AdminProduct;
