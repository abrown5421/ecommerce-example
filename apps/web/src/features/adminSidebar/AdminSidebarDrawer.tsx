import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  UserIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { closeDrawer } from "../drawer/drawerSlice";
import { useAppDispatch } from "../../app/store/hooks";

const AdminSidebarDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const links = [
    {
      title: "Products",
      url: "/admin-product",
      icon: <ShoppingBagIcon className="w-6 h-6 mr-3" />,
    },
    {
      title: "Orders",
      url: "/admin-order",
      icon: <ClipboardDocumentListIcon className="w-6 h-6 mr-3" />,
    },
    {
      title: "Users",
      url: "/admin-user",
      icon: <UserIcon className="w-6 h-6 mr-3" />,
    },
  ];

  return (
    <nav className="flex flex-col space-y-3 minus-drawer">
        {links.map((link) => {
            const isActive = location.pathname === link.url;
            return (
            <Link
                onClick={() => dispatch(closeDrawer())}
                key={link.title}
                to={link.url}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 text-lg
                ${isActive ? "border-2 border-primary bg-primary text-white" : "bg-neutral3 text-neutral-contrast border-2 border-transparent hover:text-white hover:bg-transparent hover:border-white"}`}
            >
                {link.icon}
                <span className="font-medium">{link.title}</span>
            </Link>
            );
        })}
    </nav>
  );
};

export default AdminSidebarDrawer;
