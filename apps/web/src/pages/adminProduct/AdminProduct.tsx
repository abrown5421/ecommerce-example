import { motion } from 'framer-motion';
import { useDeleteProductMutation, useGetProductsQuery } from '../../app/store/api/productsApi';
import Loader from '../../features/loader/Loader';
import CollectionEditor from '../../features/collection/CollectionEditor';
import { useAppDispatch } from '../../app/store/hooks';
import { openModal } from '../../features/modal/modalSlice';
import { IProduct } from '../../types/product.types';
import { useParams } from 'react-router-dom';
import CollectionViewer from '../../features/collection/CollectionViewer';

const AdminProduct = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const isNew = location.pathname.endsWith('/new');
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

  if (isNew) {
    return <CollectionEditor mode="create" featureType="product" />;
  }

  if (id) {
    return <CollectionEditor mode="edit" id={id} featureType="product" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-neutral relative z-0 p-4 flex flex-8 sup-min-nav "
    >
      <CollectionViewer
        featureName='product'
        data={products}
        searchKeys={['product_name', 'product_category']}
        columns={[
          { key: 'product_name', label: 'Name' },
          { key: 'product_category', label: 'Category', hideOnSmall: true },
          { key: 'product_price', label: 'Price', render: (p) => `$${p.product_price.toFixed(2)}` },
          { key: 'createdAt', label: 'Created', render: (p) => new Date(p.createdAt).toLocaleDateString(), hideOnSmall: true },
        ]}
        onEdit={(product) => console.log('Edit', product)}
      onDelete={handleDelete}
      />
    </motion.div>
  );
};

export default AdminProduct;
