import { create } from 'zustand';
import { socket } from '../lib/socket';

interface PartyState {
  partyId: string | null;
  userId: string | null;
  isHost: boolean;
  participants: string[];
  partyStatus: 'waiting' | 'priming' | 'voting' | 'matched';
  selectedServices: string[];
  primingAnswers: Record<string, Record<string, string[]>>;
  setPartyId: (id: string) => void;
  setUserId: (id: string) => void;
  setIsHost: (isHost: boolean) => void;
  setPartyStatus: (status: PartyState['partyStatus']) => void;
  setSelectedServices: (services: string[]) => void;
  addPrimingAnswers: (userId: string, answers: Record<string, string[]>) => void;
  joinParty: (id: string, asHost?: boolean) => void;
  leaveParty: () => void;
}

const generateUserId = () => Math.random().toString(36).substring(2, 15);

export const usePartyStore = create<PartyState>((set, get) => {
  // Set up socket listeners
  socket.on('partyUpdated', (data) => {
    set({
      participants: data.participants,
      partyStatus: data.status,
      selectedServices: data.selectedServices,
      primingAnswers: data.primingAnswers,
    });
  });

  return {
    partyId: null,
    userId: null,
    isHost: false,
    participants: [],
    partyStatus: 'waiting',
    selectedServices: [],
    primingAnswers: {},

    setPartyId: (id) => set({ partyId: id }),
    setUserId: (id) => set({ userId: id }),
    setIsHost: (isHost) => set({ isHost }),
    
    setPartyStatus: (status) => {
      const { partyId, isHost } = get();
      if (partyId && isHost) {
        socket.emit('updatePartyStatus', { partyId, status });
      }
    },
    
    setSelectedServices: (services) => {
      const { partyId, isHost } = get();
      if (partyId && isHost) {
        socket.emit('updateSelectedServices', { partyId, services });
      }
    },

    addPrimingAnswers: (userId, answers) => {
      const { partyId } = get();
      if (partyId) {
        socket.emit('submitPrimingAnswers', { partyId, userId, answers });
      }
    },

    joinParty: (id, asHost = false) => {
      const userId = generateUserId();
      
      if (!socket.connected) {
        socket.connect();
      }

      socket.emit('joinParty', { partyId: id, userId, isHost: asHost });

      set({
        partyId: id,
        userId,
        isHost: asHost,
      });
    },

    leaveParty: () => {
      const { partyId, userId } = get();
      if (partyId && userId) {
        socket.emit('leaveParty', { partyId, userId });
      }
      
      socket.disconnect();

      set({
        partyId: null,
        userId: null,
        isHost: false,
        participants: [],
        partyStatus: 'waiting',
        selectedServices: [],
        primingAnswers: {},
      });
    },
  };
});