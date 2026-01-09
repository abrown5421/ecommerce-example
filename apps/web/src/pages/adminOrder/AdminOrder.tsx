import { motion } from 'framer-motion';
import { useGetOrdersQuery } from '../../app/store/api/ordersApi';
import Loader from '../../features/loader/Loader';
import { useParams } from 'react-router-dom';
import CollectionViewer from '../../features/collection/CollectionViewer';
import CollectionEditor from '../../features/collection/CollectionEditor';

const AdminOrder = () => {
  const { data: orders = [], isLoading } = useGetOrdersQuery();
  const { id } = useParams();
  const isNew = location.pathname.endsWith('/new');
  
  if (isLoading) return <Loader />;

  if (isNew) {
    return <CollectionEditor mode="create" />;
  }

  if (id) {
    return <CollectionEditor mode="edit" id={id} />;
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
        onDelete={(order) => console.log('Delete', order)}
      />
    </motion.div>
  );
};

export default AdminOrder;
