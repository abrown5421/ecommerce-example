import { motion } from 'framer-motion';
import { useGetUsersQuery } from '../../app/store/api/usersApi';
import Loader from '../../features/loader/Loader';
import { useParams } from 'react-router-dom';
import CollectionViewer from '../../features/collection/CollectionViewer';
import CollectionEditor from '../../features/collection/CollectionEditor';

const AdminUser = () => {
  const { data: users = [], isLoading } = useGetUsersQuery();
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
        featureName='user'
        data={users}
        searchKeys={['firstName', 'lastName', 'email']}
        columns={[
          { key: 'firstName', label: 'First Name' },
          { key: 'lastName', label: 'Last Name' },
          { key: 'email', label: 'Email' },
          { key: 'type', label: 'Role' },
          { key: 'createdAt', label: 'Created', render: (u) => new Date(u.createdAt).toLocaleDateString() },
        ]}
        onEdit={(user) => console.log('Edit', user)}
        onDelete={(user) => console.log('Delete', user)}
      />
    </motion.div>
  );
};

export default AdminUser;
