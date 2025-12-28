import { BadRequestException } from '@nestjs/common';
import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { GameUserModel } from 'src/models/game-user.model';
import { ActionType, Zone } from 'src/graphql/index';
import { validateEffectNatsukashinorudePowerDownAction } from './effectNatsukashinorudePowerDown';

describe('validateEffectNatsukashinorudePowerDownAction', () => {
  it('should not throw when valid gameCard and target are provided', () => {
    const gameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      actionTypes: [ActionType.EFFECT_NATSUKASHINORUDE_POWER_DOWN],
    });

    const targetGameCard = new GameCardModel({
      id: 2,
      currentUserId: 'user2',
      zone: Zone.BATTLE,
    });

    const gameUser = new GameUserModel({
      userId: 'user1',
      energy: 5,
    });

    const gameModel = new GameModel({
      gameCards: [gameCard, targetGameCard],
      gameUsers: [gameUser],
    });

    const result = validateEffectNatsukashinorudePowerDownAction(
      {
        payload: {
          gameCardId: 1,
          targetGameCardIds: [2],
        },
      } as any,
      gameModel,
      'user1',
    );

    expect(result.gameCard).toBe(gameCard);
    expect(result.targetGameCard).toBe(targetGameCard);
  });

  it('should throw BadRequestException when gameCardId is not provided', () => {
    const gameModel = new GameModel({
      gameCards: [],
    });

    expect(() =>
      validateEffectNatsukashinorudePowerDownAction(
        {
          payload: {
            targetGameCardIds: [2],
          },
        } as any,
        gameModel,
        'user1',
      ),
    ).toThrow(BadRequestException);
  });

  it('should throw BadRequestException when targetGameCardIds is not provided', () => {
    const gameModel = new GameModel({
      gameCards: [],
    });

    expect(() =>
      validateEffectNatsukashinorudePowerDownAction(
        {
          payload: {
            gameCardId: 1,
          },
        } as any,
        gameModel,
        'user1',
      ),
    ).toThrow(BadRequestException);
  });

  it('should throw BadRequestException when targetGameCardIds length is not 1', () => {
    const gameModel = new GameModel({
      gameCards: [],
    });

    expect(() =>
      validateEffectNatsukashinorudePowerDownAction(
        {
          payload: {
            gameCardId: 1,
            targetGameCardIds: [2, 3],
          },
        } as any,
        gameModel,
        'user1',
      ),
    ).toThrow(BadRequestException);
  });

  it('should throw BadRequestException when gameCard is not found', () => {
    const gameModel = new GameModel({
      gameCards: [],
    });

    expect(() =>
      validateEffectNatsukashinorudePowerDownAction(
        {
          payload: {
            gameCardId: 1,
            targetGameCardIds: [2],
          },
        } as any,
        gameModel,
        'user1',
      ),
    ).toThrow(BadRequestException);
  });

  it('should throw BadRequestException when gameCard does not have EFFECT_NATSUKASHINORUDE_POWER_DOWN action type', () => {
    const gameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      gameCards: [gameCard],
    });

    expect(() =>
      validateEffectNatsukashinorudePowerDownAction(
        {
          payload: {
            gameCardId: 1,
            targetGameCardIds: [2],
          },
        } as any,
        gameModel,
        'user1',
      ),
    ).toThrow(BadRequestException);
  });

  it('should throw BadRequestException when target gameCard is not found', () => {
    const gameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      actionTypes: [ActionType.EFFECT_NATSUKASHINORUDE_POWER_DOWN],
    });

    const gameModel = new GameModel({
      gameCards: [gameCard],
    });

    expect(() =>
      validateEffectNatsukashinorudePowerDownAction(
        {
          payload: {
            gameCardId: 1,
            targetGameCardIds: [2],
          },
        } as any,
        gameModel,
        'user1',
      ),
    ).toThrow(BadRequestException);
  });

  it('should throw BadRequestException when target gameCard is not in BATTLE zone', () => {
    const gameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      actionTypes: [ActionType.EFFECT_NATSUKASHINORUDE_POWER_DOWN],
    });

    const targetGameCard = new GameCardModel({
      id: 2,
      currentUserId: 'user2',
      zone: Zone.HAND,
    });

    const gameModel = new GameModel({
      gameCards: [gameCard, targetGameCard],
    });

    expect(() =>
      validateEffectNatsukashinorudePowerDownAction(
        {
          payload: {
            gameCardId: 1,
            targetGameCardIds: [2],
          },
        } as any,
        gameModel,
        'user1',
      ),
    ).toThrow(BadRequestException);
  });

  it('should throw BadRequestException when target gameCard belongs to the same user', () => {
    const gameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      actionTypes: [ActionType.EFFECT_NATSUKASHINORUDE_POWER_DOWN],
    });

    const targetGameCard = new GameCardModel({
      id: 2,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
    });

    const gameModel = new GameModel({
      gameCards: [gameCard, targetGameCard],
    });

    expect(() =>
      validateEffectNatsukashinorudePowerDownAction(
        {
          payload: {
            gameCardId: 1,
            targetGameCardIds: [2],
          },
        } as any,
        gameModel,
        'user1',
      ),
    ).toThrow(BadRequestException);
  });
});
