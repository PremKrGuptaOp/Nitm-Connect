import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import ProfileCard from '../components/specific/ProfileCard';

const DashboardPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [matchNotification, setMatchNotification] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get('http://localhost:5000/api/users', config);
        setProfiles(data);
      } catch (err) {
        setError('Failed to fetch profiles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfiles();
    }
  }, [user]);

  const handleAction = async (targetUserId, action) => {
    setProfiles(currentProfiles => currentProfiles.filter(p => p._id !== targetUserId));

    if (action === 'like') {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.post(`http://localhost:5000/api/users/like/${targetUserId}`, {}, config);
        
        if (data.match) {
          const matchedUser = profiles.find(p => p._id === targetUserId);
          setMatchNotification(`It's a Match with ${matchedUser?.name || 'a new user'}!`);
          setTimeout(() => setMatchNotification(null), 5000);
        }
      } catch (err) {
        console.error("Failed to 'like' user:", err);
      }
    }
  };

  if (loading) {
    return <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">Loading profiles...</div>;
  }
  
  if (error) {
    return <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">{error}</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8 relative">
       {matchNotification && (
        <div className="absolute top-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg animate-bounce">
          {matchNotification}
        </div>
      )}
       <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-center">Discover New People</h1>
        <Link to="/chat" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Go to Chats
        </Link>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {profiles.map(profile => (
          <ProfileCard key={profile._id} profile={profile} onAction={handleAction} />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;