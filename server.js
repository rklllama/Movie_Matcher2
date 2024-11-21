import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const parties = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('joinParty', ({ partyId, userId, isHost }) => {
    socket.join(partyId);
    
    if (!parties.has(partyId)) {
      parties.set(partyId, {
        participants: new Set(),
        status: 'waiting',
        selectedServices: [],
        primingAnswers: {},
      });
    }

    const party = parties.get(partyId);
    party.participants.add(userId);

    if (isHost) {
      party.hostId = userId;
    }

    io.to(partyId).emit('partyUpdated', {
      participants: Array.from(party.participants),
      status: party.status,
      selectedServices: party.selectedServices,
      primingAnswers: party.primingAnswers,
    });
  });

  socket.on('leaveParty', ({ partyId, userId }) => {
    const party = parties.get(partyId);
    if (party) {
      party.participants.delete(userId);
      if (party.participants.size === 0) {
        parties.delete(partyId);
      } else {
        io.to(partyId).emit('partyUpdated', {
          participants: Array.from(party.participants),
          status: party.status,
          selectedServices: party.selectedServices,
          primingAnswers: party.primingAnswers,
        });
      }
    }
    socket.leave(partyId);
  });

  socket.on('updatePartyStatus', ({ partyId, status }) => {
    const party = parties.get(partyId);
    if (party) {
      party.status = status;
      io.to(partyId).emit('partyUpdated', {
        participants: Array.from(party.participants),
        status: party.status,
        selectedServices: party.selectedServices,
        primingAnswers: party.primingAnswers,
      });
    }
  });

  socket.on('updateSelectedServices', ({ partyId, services }) => {
    const party = parties.get(partyId);
    if (party) {
      party.selectedServices = services;
      io.to(partyId).emit('partyUpdated', {
        participants: Array.from(party.participants),
        status: party.status,
        selectedServices: party.selectedServices,
        primingAnswers: party.primingAnswers,
      });
    }
  });

  socket.on('submitPrimingAnswers', ({ partyId, userId, answers }) => {
    const party = parties.get(partyId);
    if (party) {
      party.primingAnswers[userId] = answers;
      io.to(partyId).emit('partyUpdated', {
        participants: Array.from(party.participants),
        status: party.status,
        selectedServices: party.selectedServices,
        primingAnswers: party.primingAnswers,
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});