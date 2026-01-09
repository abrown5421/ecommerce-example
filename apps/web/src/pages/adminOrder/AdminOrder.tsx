import { motion } from 'framer-motion';

const AdminOrder = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-neutral relative z-0 p-4 flex flex-8"
    >
      AdminOrder
    </motion.div>
  );
};

export default AdminOrder;
