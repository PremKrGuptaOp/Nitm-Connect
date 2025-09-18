import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const ProfilePage = () => {
  const { user, login } = useContext(AuthContext); // Use 'login' to update context
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    bio: '',
    interests: '', // We'll handle interests as a comma-separated string for simplicity
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        age: user.age || '',
        gender: user.gender || '',
        bio: user.bio || '',
        interests: user.interests?.join(', ') || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const updatedData = {
        ...formData,
        interests: formData.interests.split(',').map(item => item.trim()),
      };

      const { data } = await axios.put('http://localhost:5000/api/users/profile', updatedData, config);
      
      // Update the global state with the new user data from the backend
      login(data);

      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      setMessage('Failed to update profile.');
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Edit Your Profile</h1>
        {message && <p className="bg-green-500 p-2 rounded mb-4">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-lg">
          {/* Name, Age, Gender, Bio, Interests input fields */}
          {/* Example for Name: */}
          <div>
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded mt-1" />
          </div>
          <div>
            <label>Age</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded mt-1" />
          </div>
          <div>
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded mt-1">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label>Bio</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded mt-1 h-24"></textarea>
          </div>
          <div>
            <label>Interests (comma separated)</label>
            <input type="text" name="interests" value={formData.interests} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded mt-1" placeholder="e.g., coding, music, gaming" />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-bold">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;