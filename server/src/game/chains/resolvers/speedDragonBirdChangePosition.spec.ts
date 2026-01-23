import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { GameChainLinkModel, GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { BattlePosition, Zone, EffectType } from 'src/graphql/index';
import { resolveSpeedDragonBirdChangePosition } from './speedDragonBirdChangePosition';

describe('resolveSpeedDragonBirdChangePosition', () => {
  it('should change ATTACK position to DEFENCE', () => {
    const targetGameCard = new GameCardModel({
      id: 5,
      currentUserId: 'user2',
      zone: Zone.BATTLE,
      battlePosition: BattlePosition.ATTACK,
    });

    const gameModel = new GameModel({
      gameCards: [targetGameCard],
    });

    const gameChainLink = new GameChainLinkModel({
      id: 1,
      orderIndex: 0,
      userId: 'user1',
      gameCardId: 1,
      status: GameChainLinkStatus.RESOLVING,
      effect: {
        type: EffectType.SPEED_DRAGON_BIRD_CHANGE_POSITION,
        payload: {
          targetGameCard,
        },
      },
    });

    const result = resolveSpeedDragonBirdChangePosition(gameModel, gameChainLink);

    const changedTarget = result.gameCards.find(gc => gc.id === 5);
    expect(changedTarget?.battlePosition).toBe(BattlePosition.DEFENCE);
  });

  it('should change DEFENCE position to ATTACK', () => {
    const targetGameCard = new GameCardModel({
      id: 5,
      currentUserId: 'user2',
      zone: Zone.BATTLE,
      battlePosition: BattlePosition.DEFENCE,
    });

    const gameModel = new GameModel({
      gameCards: [targetGameCard],
    });

    const gameChainLink = new GameChainLinkModel({
      id: 1,
      orderIndex: 0,
      userId: 'user1',
      gameCardId: 1,
      status: GameChainLinkStatus.RESOLVING,
      effect: {
        type: EffectType.SPEED_DRAGON_BIRD_CHANGE_POSITION,
        payload: {
          targetGameCard,
        },
      },
    });

    const result = resolveSpeedDragonBirdChangePosition(gameModel, gameChainLink);

    const changedTarget = result.gameCards.find(gc => gc.id === 5);
    expect(changedTarget?.battlePosition).toBe(BattlePosition.ATTACK);
  });

  it('should return gameModel unchanged when targetGameCard is not provided', () => {
    const gameModel = new GameModel({
      gameCards: [],
    });

    const gameChainLink = new GameChainLinkModel({
      id: 1,
      orderIndex: 0,
      userId: 'user1',
      gameCardId: 1,
      status: GameChainLinkStatus.RESOLVING,
      effect: {
        type: EffectType.SPEED_DRAGON_BIRD_CHANGE_POSITION,
        payload: {},
      },
    });

    const result = resolveSpeedDragonBirdChangePosition(gameModel, gameChainLink);

    expect(result).toBe(gameModel);
  });
});
