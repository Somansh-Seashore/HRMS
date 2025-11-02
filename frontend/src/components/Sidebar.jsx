import {
  Home,
  Users,
  Clock,
  Calendar,
  CheckSquare,
  TrendingUp,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/" },
    { name: "Employee Directory", icon: Users, path: "/employees" },
    { name: "Attendance", icon: Clock, path: "/attendance" },
    { name: "Leave Management", icon: Calendar, path: "/leave" },
    { name: "Onboarding", icon: CheckSquare, path: "/onboarding" },
    { name: "Performance", icon: TrendingUp, path: "/performance" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`bg-gray-200 text-black w-56 sm:w-64 min-h-screen p-3 sm:p-4 flex flex-col fixed md:relative z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 shadow-lg md:shadow-none`}
      >
        {/* Mobile close button */}
        <button
          onClick={closeSidebar}
          className="md:hidden self-end mb-4 p-2 rounded-md hover:bg-gray-300 text-gray-600 hover:text-gray-800"
        >
          <X size={20} />
        </button>

        <ul className="flex-1 flex flex-col text-center space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                onClick={closeSidebar}
                className="flex items-center justify-center m-2 p-3 rounded-lg hover:bg-blue-400 transition-colors duration-200 text-gray-800 hover:text-white"
              >
                <item.icon size={20} className="mr-3" />
                <span className="text-sm md:text-base font-medium">
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
