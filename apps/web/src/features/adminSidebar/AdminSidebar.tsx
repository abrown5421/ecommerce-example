import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CubeIcon,
  ShoppingCartIcon,
  UserIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline"; 

const sidebarItems = [
  {
    title: "Products",
    options: [
      { name: "Create New", icon: PlusIcon },
      { name: "Edit Existing", icon: PencilIcon },
      { name: "Delete Existing", icon: TrashIcon },
    ],
    icon: CubeIcon, 
  },
  {
    title: "Orders",
    options: [
      { name: "Create New", icon: PlusIcon },
      { name: "Edit Existing", icon: PencilIcon },
      { name: "Delete Existing", icon: TrashIcon },
    ],
    icon: ShoppingCartIcon,
  },
  {
    title: "Users",
    options: [
      { name: "Create New", icon: PlusIcon },
      { name: "Edit Existing", icon: PencilIcon },
      { name: "Delete Existing", icon: TrashIcon },
    ],
    icon: UserIcon,
  },
];

const AdminSidebar: React.FC = () => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (title: string) => {
    setOpenAccordion(openAccordion === title ? null : title);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-neutral3 sup-min-nav relative z-0 p-4 flex flex-2 flex-col"
    >
      {sidebarItems.map((item) => {
        const ParentIcon = item.icon; 
        return (
          <div key={item.title} className="mb-2">
            <button
              className={`w-full text-left px-2 py-2 hover:bg-white focus:outline-none cursor-pointer transition-all flex items-center group ${openAccordion === item.title && "bg-white"}`}
              onClick={() => toggleAccordion(item.title)}
            >
              <ParentIcon className="w-5 h-5 mr-2 text-primary group-hover:text-primary transition-colors" />
              <span className={`${openAccordion === item.title ? "text-primary" : "text-neutral-contrast" } group-hover:text-primary transition-colors text-xl font-bold`}>
                {item.title}
              </span>
            </button>

            <AnimatePresence>
              {openAccordion === item.title && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  {item.options.map((option) => {
                    const OptionIcon = option.icon;
                    return (
                      <button
                        key={option.name}
                        className="w-full text-left px-6 py-3 flex items-center cursor-pointer transition-all group bg-white hover:bg-neutral2"
                      >
                        <OptionIcon className="w-4 h-4 mr-2 text-primary group-hover:text-primary transition-colors" />
                        <span className="text-neutral-contrast group-hover:pl-5 transition-all">
                          {option.name}
                        </span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </motion.div>
  );
};

export default AdminSidebar;
