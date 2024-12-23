import React, { useState } from 'react';
import { Player } from '../../types/Challenge';

interface PlayerSelectionProps {
  players: Player[];
  maxPicks: number;
  onSubmit: (selectedPlayers: Player[]) => void;
}

export function PlayerSelection({ players, maxPicks, onSubmit }: PlayerSelectionProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  const handlePlayerToggle = (player: Player) => {
    if (selectedPlayers.find(p => p.id === player.id)) {
      setSelectedPlayers(selectedPlayers.filter(p => p.id !== player.id));
    } else if (selectedPlayers.length < maxPicks) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const handleSubmit = () => {
    if (selectedPlayers.length === maxPicks) {
      onSubmit(selectedPlayers);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {players.map((player) => (
          <button
            key={player.id}
            onClick={() => handlePlayerToggle(player)}
            className={`p-4 rounded-lg border ${
              selectedPlayers.find(p => p.id === player.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${selectedPlayers.length >= maxPicks ? 'disabled:opacity-50' : ''}`}
            disabled={selectedPlayers.length >= maxPicks && !selectedPlayers.find(p => p.id === player.id)}
          >
            <div className="text-left">
              <h3 className="font-medium">{player.name}</h3>
              <p className="text-sm text-gray-500">{player.team}</p>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={selectedPlayers.length !== maxPicks}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit Picks ({selectedPlayers.length}/{maxPicks})
      </button>
    </div>
  );
}