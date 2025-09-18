const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const Message = require('./models/Message');

// Route Files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require('./routes/matchRoutes');
const messageRoutes = require('./routes/messageRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server from the Express app
const server = http.createServer(app);

// Attach Socket.IO to the HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Remember to change this to your Vercel URL for production
    methods: ["GET", "POST"]
  }
});

// Main Test Route
app.get('/', (req, res) => {
  res.send('NITM Connect API is running...');
});

// Mount All Routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

// Socket.IO Real-Time Logic
io.on('connection', (socket) => {
  console.log('🔌 A user connected:', socket.id);

  socket.on('joinRoom', (matchId) => {
    socket.join(matchId);
    console.log(`User ${socket.id} joined room ${matchId}`);
  });

  socket.on('sendMessage', async ({ matchId, senderId, content }) => {
    const message = await Message.create({ matchId, senderId, content });
    const populatedMessage = await Message.findById(message._id).populate('senderId', 'name profilePhotoUrl');
    
    // Broadcast the new message to everyone in the specific room
    io.to(matchId).emit('receiveMessage', populatedMessage);
  });

  socket.on('disconnect', () => {
    console.log('🔥 A user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});