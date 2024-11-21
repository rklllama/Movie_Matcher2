import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/Logo';

export function Home() {
  const navigate = useNavigate();

  const createParty = () => {
    const partyId = Math.random().toString(36).substring(2, 8);
    navigate(`/party/${partyId}?host=true`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        <Logo className="mx-auto h-24 w-24 text-red-500" />
        <h1 className="mt-6 text-4xl font-bold">
          <span className="text-red-500">Movie</span>
          <span className="text-red-500/50">Matcher</span>
        </h1>
        <p className="mt-3 text-xl text-gray-300">Find the perfect movie for your group!</p>
        <div className="mt-8">
          <Button onClick={createParty} size="lg" className="w-full min-w-[200px]">
            Start a Movie Party
          </Button>
        </div>
      </div>
    </div>
  );
}