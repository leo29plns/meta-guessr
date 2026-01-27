import { GameScoreManager } from '@/scripts/classes/DialogManager/GameScoreManager';
import type { Game } from '@/scripts/classes/Game/Game.js';
import type { GameRound } from '@/scripts/classes/GameRound/GameRound.js';
import { GeoMap } from '@/scripts/classes/GeoMap/GeoMap';
import { GuessManager } from '@/scripts/classes/GuessManager/GuessManager.js';

export interface EventRegistry {
  'dialog:next-round': GameScoreManager;
  'round:started': GameRound;
  'round:ended': GameRound;
  'guess:submitted': GuessManager;
  'game:ended': Game;
  'map:moved-pointer': GeoMap;
}
