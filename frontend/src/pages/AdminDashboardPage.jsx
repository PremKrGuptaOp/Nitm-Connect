import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const AdminDashboardPage = () => {
  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchUsers = async () => {
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    const { data } = await axios.get('http://localhost:5000/api/admin/users', config);
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBan = async (userId) => {
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    await axios.put(`http://localhost:5000/api/admin/users/${userId}/ban`, {}, config);
    fetchUsers(); // Refresh the list
  };
  
  const handleVerify = async (userId) => {
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    await axios.put(`http://localhost:5000/api/admin/users/${userId}/verify`, {}, config);
    fetchUsers(); // Refresh the list
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <div className="overflow-x-auto bg-gray-800 rounded-lg">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="p-4">{u.name}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">
                  {u.isBanned && <span className="bg-red-500 text-xs px-2 py-1 rounded-full">Banned</span>}
                  {u.emailVerified && <span className="bg-green-500 text-xs px-2 py-1 rounded-full ml-2">Verified</span>}
                </td>
                <td className="p-4 space-x-2">
                  <button onClick={() => handleBan(u._id)} className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm">{u.isBanned ? 'Unban' : 'Ban'}</button>
                  {!u.emailVerified && <button onClick={() => handleVerify(u._id)} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">Verify</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboardPage;