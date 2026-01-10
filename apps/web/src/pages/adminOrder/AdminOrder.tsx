import { motion } from 'framer-motion';
import { useDeleteOrderMutation, useGetOrdersQuery } from '../../app/store/api/ordersApi';
import Loader from '../../features/loader/Loader';
import { useParams } from 'react-router-dom';
import CollectionViewer from '../../features/collection/CollectionViewer';
import CollectionEditor from '../../features/collection/CollectionEditor';
import { IOrder } from '../../types/order.types';
import { openModal } from '../../features/modal/modalSlice';
import { useAppDispatch } from '../../app/store/hooks';

const AdminOrder = () => {
  const dispatch = useAppDispatch();
  const { data: orders = [], isLoading } = useGetOrdersQuery();
  const [deleteOrder] = useDeleteOrderMutation();
  const { id } = useParams();
  const isNew = location.pathname.endsWith('/new');
  
  if (isLoading) return <Loader />;

  const handleDelete = (item: IOrder) => {
    dispatch(
      openModal({
        modalContent: 'confirm',
        title: 'Delete Order',
        message: 'This action is permanent and cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        confirmAction: async () => {
          try {
            await deleteOrder(item._id).unwrap();
          } catch (err) {
            console.error('Delete failed', err);
          }
        },
      })
    );
  };

  if (isNew) {
    return <CollectionEditor mode="create" featureType="order" />;
  }

  if (id) {
    return <CollectionEditor mode="edit" id={id} featureType="order" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-neutral relative z-0 p-4 flex flex-8"
    >
      <CollectionViewer
        featureName='order'
        data={orders}
        searchKeys={['order_user_id', 'order_user_id', 'order_status']}
        columns={[
          { key: '_id', label: 'Order ID' },
          { key: 'order_user_id', label: 'User ID' },
          { key: 'order_item_count', label: 'Items' },
          { key: 'order_item_total', label: 'Total', render: (o) => `$${o.order_item_total.toFixed(2)}` },
          { key: 'order_status', label: 'Status' },
          { key: 'createdAt', label: 'Created', render: (o) => new Date(o.createdAt).toLocaleDateString() },
        ]}
        onEdit={(order) => console.log('Edit', order)}
        onDelete={(order) => handleDelete(order)}
      />
    </motion.div>
  );
};

export default AdminOrder;
