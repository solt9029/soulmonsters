import { GameModel } from 'src/models/game.model';
import { GameChainModel, GameChainStatus } from 'src/models/game-chain.model';
import { GameChainLinkModel, GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { GameCardModel } from 'src/models/game-card.model';
import { CardModel } from 'src/models/card.model';
import { EffectType, Zone, BattlePosition, Kind, Type } from 'src/graphql/index';
import { resolveHamontakiSpecialSummon } from './hamontakiSpecialSummon';

describe('resolveHamontakiSpecialSummon', () => {
  it('should do nothing when targetGameCardId is undefined and eligible target exists in morgue', () => {
    const gameChainId = 'chain-uuid-1';
    const gameChainLink = new GameChainLinkModel({
      id: 'link-uuid-1',
      gameChainId,
      orderIndex: 0,
      userId: 'user1',
      gameCardId: 1,
      status: GameChainLinkStatus.WAITING,
      effect: {
        type: EffectType.HAMONTAKI_SPECIAL_SUMMON,
        targetGameCardId: undefined,
      },
    });

    const gameChain = new GameChainModel({
      id: gameChainId,
      gameId: 1,
      status: GameChainStatus.RESOLVING,
      gameChainLinks: [gameChainLink],
    });

    const rectangleMonster = new CardModel({
      id: 1,
      kind: Kind.MONSTER,
      type: Type.RECTANGLE,
    });

    const gameCard = new GameCardModel({
      id: 1,
      zone: Zone.MORGUE,
      currentUserId: 'user1',
      card: rectangleMonster,
    });

    const gameModel = new GameModel({
      id: 1,
      gameChains: [gameChain],
      gameCards: [gameCard],
    });

    const result = resolveHamontakiSpecialSummon(gameModel, gameChainLink);

    expect(result.gameCards[0]?.zone).toBe(Zone.MORGUE);
    const updatedChain = result.gameChains[0];
    const updatedLink = updatedChain?.gameChainLinks[0];
    expect(updatedLink?.status).toBe(GameChainLinkStatus.WAITING);
  });

  it('should move target game card to battle zone and mark chain link as resolved when targetGameCardId is set', () => {
    const gameChainId = 'chain-uuid-1';
    const gameChainLink = new GameChainLinkModel({
      id: 'link-uuid-1',
      gameChainId,
      orderIndex: 0,
      userId: 'user1',
      gameCardId: 1,
      status: GameChainLinkStatus.WAITING,
      effect: {
        type: EffectType.HAMONTAKI_SPECIAL_SUMMON,
        targetGameCardId: 2,
      },
    });

    const gameChain = new GameChainModel({
      id: gameChainId,
      gameId: 1,
      status: GameChainStatus.RESOLVING,
      gameChainLinks: [gameChainLink],
    });

    const rectangleMonster = new CardModel({
      id: 1,
      kind: Kind.MONSTER,
      type: Type.RECTANGLE,
    });

    const gameCards = [
      new GameCardModel({
        id: 1,
        zone: Zone.BATTLE,
        currentUserId: 'user1',
        battlePosition: BattlePosition.ATTACK,
      }),
      new GameCardModel({
        id: 2,
        zone: Zone.MORGUE,
        currentUserId: 'user1',
        card: rectangleMonster,
      }),
    ];

    const gameModel = new GameModel({
      id: 1,
      gameChains: [gameChain],
      gameCards,
    });

    const result = resolveHamontakiSpecialSummon(gameModel, gameChainLink);

    expect(result.gameCards[1]?.zone).toBe(Zone.BATTLE);
    expect(result.gameCards[1]?.battlePosition).toBe(BattlePosition.ATTACK);
    const updatedChain = result.gameChains[0];
    const updatedLink = updatedChain?.gameChainLinks[0];
    expect(updatedLink?.status).toBe(GameChainLinkStatus.RESOLVED);
  });

  it('should mark chain link as resolved when no eligible target exists in morgue', () => {
    const gameChainId = 'chain-uuid-1';
    const gameChainLink = new GameChainLinkModel({
      id: 'link-uuid-1',
      gameChainId,
      orderIndex: 0,
      userId: 'user1',
      gameCardId: 1,
      status: GameChainLinkStatus.WAITING,
      effect: {
        type: EffectType.HAMONTAKI_SPECIAL_SUMMON,
        targetGameCardId: undefined,
      },
    });

    const gameChain = new GameChainModel({
      id: gameChainId,
      gameId: 1,
      status: GameChainStatus.RESOLVING,
      gameChainLinks: [gameChainLink],
    });

    const nonRectangleMonster = new CardModel({
      id: 1,
      kind: Kind.MONSTER,
      type: Type.CIRCLE,
    });

    const gameCard = new GameCardModel({
      id: 1,
      zone: Zone.MORGUE,
      currentUserId: 'user1',
      card: nonRectangleMonster,
    });

    const gameModel = new GameModel({
      id: 1,
      gameChains: [gameChain],
      gameCards: [gameCard],
    });

    const result = resolveHamontakiSpecialSummon(gameModel, gameChainLink);

    expect(result.gameCards[0]?.zone).toBe(Zone.MORGUE);
    const updatedChain = result.gameChains[0];
    const updatedLink = updatedChain?.gameChainLinks[0];
    expect(updatedLink?.status).toBe(GameChainLinkStatus.RESOLVED);
  });
});
