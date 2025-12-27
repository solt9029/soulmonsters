import { BadRequestException } from '@nestjs/common';
import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { ActionType } from 'src/graphql/index';
import { validateChangeBattlePositionAction } from './changeBattlePosition';

describe('validateChangeBattlePositionAction', () => {
  it('should not throw when valid gameCard is provided', () => {
    const gameCard = new GameCardModel({
      id: 1,
      actionTypes: [ActionType.CHANGE_BATTLE_POSITION],
    });

    const gameModel = new GameModel({
      gameCards: [gameCard],
    });

    const result = validateChangeBattlePositionAction(
      {
        payload: {
          gameCardId: 1,
        },
      } as any,
      gameModel,
    );

    expect(result.gameCard).toBe(gameCard);
  });

  it('should throw BadRequestException when gameCardId is not provided', () => {
    const gameModel = new GameModel({
      gameCards: [],
    });

    expect(() =>
      validateChangeBattlePositionAction(
        {
          payload: {},
        } as any,
        gameModel,
      ),
    ).toThrow(BadRequestException);
  });

  it('should throw BadRequestException when gameCard is not found', () => {
    const gameModel = new GameModel({
      gameCards: [],
    });

    expect(() =>
      validateChangeBattlePositionAction(
        {
          payload: {
            gameCardId: 1,
          },
        } as any,
        gameModel,
      ),
    ).toThrow(BadRequestException);
  });

  it('should throw BadRequestException when gameCard does not have CHANGE_BATTLE_POSITION action type', () => {
    const gameCard = new GameCardModel({
      id: 1,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      gameCards: [gameCard],
    });

    expect(() =>
      validateChangeBattlePositionAction(
        {
          payload: {
            gameCardId: 1,
          },
        } as any,
        gameModel,
      ),
    ).toThrow(BadRequestException);
  });
});
