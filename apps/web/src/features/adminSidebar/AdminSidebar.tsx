import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UserIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const links = [
    {
      title: "Users",
      url: "/admin-user",
      icon: <UserIcon className="w-6 h-6 text-primary mr-3" />,
    },
    {
      title: "Products",
      url: "/admin-product",
      icon: <ShoppingBagIcon className="w-6 h-6 text-primary mr-3" />,
    },
    {
      title: "Orders",
      url: "/admin-order",
      icon: <ClipboardDocumentListIcon className="w-6 h-6 text-primary mr-3" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-neutral-700 text-white min-h-screen p-4 flex flex-2 flex-col shadow-[2px_0_4px_rgba(0,0,0,0.1)] relative z-100"
    >
      <nav className="flex flex-col space-y-3">
        {links.map((link) => {
          const isActive = location.pathname === link.url;
          return (
            <Link
              key={link.title}
              to={link.url}
              className={`flex items-center p-3 rounded-lg transition-colors duration-200 text-lg
                ${isActive ? "border-2 border-white text-white" : "bg-neutral3 text-neutral-contrast border-2 border-transparent hover:text-white hover:bg-transparent hover:border-white"}`}
            >
              {link.icon}
              <span className="font-medium">{link.title}</span>
            </Link>
          );
        })}
      </nav>
    </motion.div>
  );
};

export default AdminSidebar;
