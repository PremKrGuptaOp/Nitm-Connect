import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import AuthContext from '../context/AuthContext';

const socket = io('http://localhost:5000');

const ChatPage = () => {
  const { matchId } = useParams();
  const { user } = useContext(AuthContext);
  
  const [matches, setMatches] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeMatch, setActiveMatch] = useState(null);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMatches = async () => {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/matches', config);
      setMatches(data);
    };
    fetchMatches();
  }, [user.token]);
  
  useEffect(() => {
    if (matchId) {
      socket.emit('joinRoom', matchId);

      const fetchMessages = async () => {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`http://localhost:5000/api/messages/${matchId}`, config);
        setMessages(data);
        const currentMatch = matches.find(m => m._id === matchId);
        if(currentMatch) setActiveMatch(currentMatch);
      };
      fetchMessages();

      socket.on('receiveMessage', (message) => {
        if (message.matchId === matchId) {
          setMessages((prev) => [...prev, message]);
        }
      });
      
      return () => {
        socket.off('receiveMessage');
      };
    }
  }, [matchId, user.token, matches]);

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      socket.emit('sendMessage', {
        matchId,
        senderId: user._id,
        content: newMessage,
      });
      setNewMessage('');
    }
  };
  
  const getOtherUser = (match) => {
    return match.users.find(u => u._id !== user._id);
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-1/4 bg-gray-800 p-4 border-r border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Matches</h2>
        <ul>
          {matches.map((match) => (
            <li key={match._id} className="mb-2">
              <Link to={`/chat/${match._id}`} className={`block p-2 rounded-lg ${matchId === match._id ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
                {getOtherUser(match)?.name || 'User'}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 flex flex-col">
        {matchId && activeMatch ? (
          <>
            <div className="p-4 border-b border-gray-700 bg-gray-800">
              <h2 className="text-xl font-bold">Chat with {getOtherUser(activeMatch)?.name}</h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((msg) => (
                <div key={msg._id} className={`flex mb-4 ${msg.senderId._id === user._id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-lg px-4 py-2 ${msg.senderId._id === user._id ? 'bg-blue-600' : 'bg-gray-700'}`}>
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 bg-gray-800 border-t border-gray-700">
              <div className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-gray-700 rounded-l-lg p-2 focus:outline-none"
                  placeholder="Type a message..."
                />
                <button type="submit" className="bg-blue-600 rounded-r-lg px-4">Send</button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">Select a match to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;