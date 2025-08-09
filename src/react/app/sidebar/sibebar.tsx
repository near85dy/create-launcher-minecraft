import { useState } from "react";
import { FaUser, FaHome, FaBars, FaCog } from "react-icons/fa";

export default function Sidebar() {
    const [active, setActive] = useState("home");
  
    const menuItems = [
      { id: "profile", icon: <FaUser size={20} /> },
      { id: "home", icon: <FaHome size={20} /> },
      { id: "menu", icon: <FaBars size={20} /> },
      { id: "settings", icon: <FaCog size={20} /> },
    ];
  
    return (
      <div className="flex flex-col items-center bg-gray-900 py-4 w-16 min-h-screen">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-center my-2 rounded-full cursor-pointer transition-all duration-200 ${
              active === item.id
                ? "bg-gray-800 w-12 h-12"
                : "hover:bg-gray-800 w-12 h-12"
            }`}
            onClick={() => setActive(item.id)}
          >
            <div
              className={`${
                active === item.id ? "text-orange-400" : "text-gray-400"
              }`}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>
    );
  }