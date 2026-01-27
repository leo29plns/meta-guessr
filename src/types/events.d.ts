import { GameRound } from '@/scripts/classes/GameRound/GameRound.js';
import type { Coordinates } from './coordinates.ts';
import { Game } from '@/scripts/classes/Game/Game.js';

export interface EventRegistry {
  'round:started': undefined;
  'round:ended': GameRound;
  'guess:submitted': Coordinates;
  'game:ended': Game;
}
