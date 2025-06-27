import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const Navbar = () => {
  const { darkMode, setDarkMode } = useTheme();

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <header className="sticky top-0 z-50 transition-colors duration-500 bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo or Title */}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-500">
          Admin Dashboard
        </h1>

        {/* Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Dark Mode"
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
        >
          {darkMode ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
