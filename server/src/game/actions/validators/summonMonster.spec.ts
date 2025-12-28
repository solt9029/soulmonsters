import { BadRequestException } from '@nestjs/common';
import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { GameUserModel } from 'src/models/game-user.model';
import { CardModel } from 'src/models/card.model';
import { ActionType } from 'src/graphql/index';
import { validateSummonMonsterAction } from './summonMonster';

describe('validateSummonMonsterAction', () => {
  it('should not throw when valid gameCard is provided with sufficient energy', () => {
    const card = new CardModel({
      id: 1,
      cost: 3,
    });

    const gameCard = new GameCardModel({
      id: 1,
      actionTypes: [ActionType.SUMMON_MONSTER],
      card,
    });

    const gameUser = new GameUserModel({
      userId: 'user1',
      energy: 5,
    });

    const gameModel = new GameModel({
      gameCards: [gameCard],
      gameUsers: [gameUser],
    });

    const result = validateSummonMonsterAction(
      {
        payload: {
          gameCardId: 1,
        },
      } as any,
      gameModel,
      'user1',
    );

    expect(result.gameCardId).toBe(1);
    expect(result.cost).toBe(3);
  });

  it('should not throw when card has no cost', () => {
    const card = new CardModel({
      id: 1,
      cost: null,
    });

    const gameCard = new GameCardModel({
      id: 1,
      actionTypes: [ActionType.SUMMON_MONSTER],
      card,
    });

    const gameUser = new GameUserModel({
      userId: 'user1',
      energy: 0,
    });

    const gameModel = new GameModel({
      gameCards: [gameCard],
      gameUsers: [gameUser],
    });

    const result = validateSummonMonsterAction(
      {
        payload: {
          gameCardId: 1,
        },
      } as any,
      gameModel,
      'user1',
    );

    expect(result.gameCardId).toBe(1);
    expect(result.cost).toBe(0);
  });

  it('should throw BadRequestException when energy is insufficient', () => {
    const card = new CardModel({
      id: 1,
      cost: 5,
    });

    const gameCard = new GameCardModel({
      id: 1,
      actionTypes: [ActionType.SUMMON_MONSTER],
      card,
    });

    const gameUser = new GameUserModel({
      userId: 'user1',
      energy: 3,
    });

    const gameModel = new GameModel({
      gameCards: [gameCard],
      gameUsers: [gameUser],
    });

    expect(() =>
      validateSummonMonsterAction(
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

  it('should throw BadRequestException when gameCardId is not provided', () => {
    const gameModel = new GameModel({
      gameCards: [],
      gameUsers: [],
    });

    expect(() =>
      validateSummonMonsterAction(
        {
          payload: {},
        } as any,
        gameModel,
        'user1',
      ),
    ).toThrow(BadRequestException);
  });

  it('should throw BadRequestException when gameCard is not found', () => {
    const gameModel = new GameModel({
      gameCards: [],
      gameUsers: [],
    });

    expect(() =>
      validateSummonMonsterAction(
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

  it('should throw BadRequestException when gameCard does not have SUMMON_MONSTER action type', () => {
    const gameCard = new GameCardModel({
      id: 1,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      gameCards: [gameCard],
      gameUsers: [],
    });

    expect(() =>
      validateSummonMonsterAction(
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
});
