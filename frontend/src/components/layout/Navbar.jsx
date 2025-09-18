import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">NITM Connect</Link>
        <div className="flex items-center space-x-4">
          {/* This line correctly shows the Admin link only for admin users */}
          {user && user.role === 'admin' && (
            <Link to="/admin" className="hover:text-yellow-400 font-bold">Admin</Link>
          )}
          <Link to="/" className="hover:text-blue-400">Dashboard</Link>
          <Link to="/chat" className="hover:text-blue-400">Chat</Link>
          <Link to="/profile" className="hover:text-blue-400">Profile</Link>
          <button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

