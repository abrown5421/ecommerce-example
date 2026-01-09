import React from 'react';
import { motion } from 'framer-motion';

interface CollectionEditorProps  {
    id?: string;
    mode: 'edit' | 'create'
}

const CollectionEditor: React.FC<CollectionEditorProps> = ({id, mode}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-neutral relative z-0 p-4 flex flex-8"
        >
            {mode} {id}
        </motion.div>
    );
};

export default CollectionEditor;
