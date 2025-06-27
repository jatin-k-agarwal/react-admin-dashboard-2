import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiCalendar, FiTrello, FiBarChart2 } from 'react-icons/fi';

const links = [
  { path: '/', name: 'Dashboard', icon: <FiHome /> },
  { path: '/calendar', name: 'Calendar', icon: <FiCalendar /> },
  { path: '/kanban', name: 'Kanban', icon: <FiTrello /> },
  { path: '/charts', name: 'Charts', icon: <FiBarChart2 /> },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-10 tracking-tight text-white">🧭 Admin Panel</h2>

      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const isActive = location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm font-medium 
                ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {link.icon}
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
