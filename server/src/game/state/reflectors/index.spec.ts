import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { GameStateModel } from 'src/models/game-state.model';
import { CardModel } from 'src/models/card.model';
import { Zone, StateType } from 'src/graphql/index';
import { GameStateReflector } from './index';

describe('GameStateReflector', () => {
  describe('applyPowerDownEffects', () => {
    it('should reduce attack by 700 when EFFECT_NATSUKASHINORUDE_POWER_DOWN state exists', () => {
      const reflector = new GameStateReflector();

      const card = new CardModel({
        id: 1,
        attack: 1000,
      });

      const targetGameCard = new GameCardModel({
        id: 2,
        currentUserId: 'user2',
        zone: Zone.BATTLE,
        card: card,
      });

      const powerDownState = new GameStateModel({
        gameCardId: 1,
        state: {
          type: StateType.EFFECT_NATSUKASHINORUDE_POWER_DOWN,
          data: {
            targetGameCardId: 2,
            value: 700,
          },
        },
      });

      const gameModel = new GameModel({
        gameCards: [targetGameCard],
        gameStates: [powerDownState],
      });

      const result = reflector.reflectStates(gameModel, 'user2');

      expect(result.gameCards[0]?.attack).toBe(300);
    });

    it('should not reduce attack below 0', () => {
      const reflector = new GameStateReflector();

      const card = new CardModel({
        id: 1,
        attack: 500,
      });

      const targetGameCard = new GameCardModel({
        id: 2,
        currentUserId: 'user2',
        zone: Zone.BATTLE,
        card: card,
      });

      const powerDownState = new GameStateModel({
        gameCardId: 1,
        state: {
          type: StateType.EFFECT_NATSUKASHINORUDE_POWER_DOWN,
          data: {
            targetGameCardId: 2,
            value: 700,
          },
        },
      });

      const gameModel = new GameModel({
        gameCards: [targetGameCard],
        gameStates: [powerDownState],
      });

      const result = reflector.reflectStates(gameModel, 'user2');

      expect(result.gameCards[0]?.attack).toBe(0);
    });

    it('should not change attack when no power down state exists', () => {
      const reflector = new GameStateReflector();

      const card = new CardModel({
        id: 1,
        attack: 1000,
      });

      const targetGameCard = new GameCardModel({
        id: 2,
        currentUserId: 'user2',
        zone: Zone.BATTLE,
        card: card,
      });

      const gameModel = new GameModel({
        gameCards: [targetGameCard],
        gameStates: [],
      });

      const result = reflector.reflectStates(gameModel, 'user2');

      expect(result.gameCards[0]?.attack).toBe(1000);
    });
  });
});
