import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Users } from 'lucide-react';
import { MovieCard } from '../components/MovieCard';
import { MovieMatch } from '../components/MovieMatch';
import { StreamingSelector } from '../components/StreamingSelector';
import { PrimingQuestions } from '../components/PrimingQuestions';
import { usePartyStore } from '../store/partyStore';
import { useMovieStore } from '../store/movieStore';
import { Button } from '../components/ui/Button';
import { CopyButton } from '../components/ui/CopyButton';

export function Party() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const {
    userId,
    isHost,
    participants,
    partyStatus,
    selectedServices,
    primingAnswers,
    setSelectedServices,
    setPartyStatus,
    addPrimingAnswers,
    joinParty,
    leaveParty,
  } = usePartyStore();

  const {
    movies,
    isLoading,
    error,
    initializeMovies,
    getCurrentMovie,
    approveMovie,
    rejectMovie,
    checkForMatches,
  } = useMovieStore();

  // Generate a shareable URL for the current party
  const joinUrl = `${window.location.origin}/party/${id}?join=true`;

  useEffect(() => {
    if (!id) return;

    const isJoining = searchParams.get('join') === 'true';
    const isHosting = searchParams.get('host') === 'true';

    // Initialize party state
    joinParty(id, isHosting);

    // Cleanup on unmount
    return () => {
      leaveParty();
    };
  }, [id, joinParty, leaveParty, searchParams]);

  const startParty = () => {
    if (!isHost) return;
    setPartyStatus('priming');
  };

  const handlePrimingComplete = async (answers: Record<string, string[]>) => {
    if (!userId) return;

    addPrimingAnswers(userId, answers);
    
    // If all participants have answered, initialize movies
    const allAnswered = Object.keys(primingAnswers).length === participants;
    
    if (allAnswered && isHost) {
      try {
        await initializeMovies(primingAnswers, selectedServices, participants);
        setPartyStatus('voting');
      } catch (error) {
        console.error('Failed to initialize movies:', error);
      }
    }
  };

  const handleVote = (approved: boolean) => {
    if (!userId) return;

    const currentMovie = getCurrentMovie();
    if (!currentMovie) return;

    if (approved) {
      approveMovie(currentMovie.id, userId);
    } else {
      rejectMovie(currentMovie.id, userId);
    }

    const matches = checkForMatches();
    if (matches.length > 0) {
      setPartyStatus('matched');
    }
  };

  const handleContinueMatching = () => {
    setPartyStatus('voting');
  };

  const currentMovie = getCurrentMovie();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      {/* Host Setup Screen */}
      {partyStatus === 'waiting' && isHost && (
        <div className="w-full max-w-2xl space-y-8 rounded-xl bg-gray-900 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Party Setup</h2>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Share with Friends</h3>
            <div className="flex items-center gap-2">
              <div className="flex-1 break-all rounded-lg bg-gray-800 p-3 text-sm text-gray-300">
                {joinUrl}
              </div>
              <CopyButton value={joinUrl} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Select Streaming Services</h3>
            <StreamingSelector
              selected={selectedServices}
              onChange={setSelectedServices}
            />
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-gray-300">
            <Users size={20} />
            <span>{participants} joined</span>
          </div>

          <Button onClick={startParty} className="w-full">
            Start Party
          </Button>
        </div>
      )}

      {/* Guest Waiting Screen */}
      {partyStatus === 'waiting' && !isHost && (
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold">Waiting for host to start...</h2>
          <p className="mt-2 text-gray-300">The party will begin soon!</p>
          <div className="mt-4 flex items-center justify-center gap-2 text-gray-300">
            <Users size={20} />
            <span>{participants} joined</span>
          </div>
        </div>
      )}

      {/* Priming Questions */}
      {partyStatus === 'priming' && (
        <PrimingQuestions onComplete={handlePrimingComplete} />
      )}

      {/* Movie Voting */}
      {partyStatus === 'voting' && currentMovie && (
        <MovieCard movie={currentMovie} onVote={handleVote} />
      )}

      {/* Movie Match */}
      {partyStatus === 'matched' && currentMovie && (
        <MovieMatch movie={currentMovie} onContinue={handleContinueMatching} />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center text-white">
          <p>Loading movies...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}