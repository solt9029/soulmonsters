import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { GameStateModel } from 'src/models/game-state.model';
import { CardModel } from 'src/models/card.model';
import { Zone, StateType, ActionType } from 'src/graphql/index';
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

  describe('actionTypes preservation', () => {
    it('should preserve actionTypes through reflectStates', () => {
      const reflector = new GameStateReflector();

      const card = new CardModel({
        id: 1,
        name: 'Test Card',
        attack: 1000,
        defence: 500,
      });

      const gameCard = new GameCardModel({
        id: 2,
        currentUserId: 'user1',
        zone: Zone.BATTLE,
        card: card,
        actionTypes: [ActionType.ATTACK, ActionType.CHANGE_BATTLE_POSITION],
      });

      const gameModel = new GameModel({
        gameCards: [gameCard],
        gameStates: [],
      });

      const result = reflector.reflectStates(gameModel, 'user1');

      expect(result.gameCards[0]?.actionTypes).toEqual([
        ActionType.ATTACK,
        ActionType.CHANGE_BATTLE_POSITION,
      ]);
    });

    it('should preserve actionTypes even when filtered by userId', () => {
      const reflector = new GameStateReflector();

      const card = new CardModel({
        id: 1,
        name: 'Test Card',
        attack: 1000,
      });

      const gameCard = new GameCardModel({
        id: 2,
        currentUserId: 'user1',
        zone: Zone.DECK,
        card: card,
        actionTypes: [ActionType.PUT_SOUL],
      });

      const gameModel = new GameModel({
        gameCards: [gameCard],
        gameStates: [],
      });

      const result = reflector.reflectStates(gameModel, 'user2');

      expect(result.gameCards[0]?.actionTypes).toEqual([ActionType.PUT_SOUL]);
    });
  });
});
