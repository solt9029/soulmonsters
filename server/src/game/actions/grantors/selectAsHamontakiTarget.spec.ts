import { grantSelectAsHamontakiTargetAction } from './selectAsHamontakiTarget';
import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { GameChainModel, GameChainStatus } from 'src/models/game-chain.model';
import { GameChainLinkModel, GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { CardModel } from 'src/models/card.model';
import { Zone, ActionType, EffectType, Kind } from 'src/graphql';

describe('grantSelectAsHamontakiTargetAction', () => {
  it('should grant SELECT_AS_HAMONTAKI_TARGET action to monster cards in morgue when resolving HAMONTAKI_SPECIAL_SUMMON chain link', () => {
    const userId = 'user1';
    const gameChainId = 'chain-uuid-1';
    const gameChainLink = new GameChainLinkModel({
      id: 'link-uuid-1',
      gameChainId,
      orderIndex: 0,
      userId,
      gameCardId: 1,
      status: GameChainLinkStatus.RESOLVING,
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

    const monsterCard = new CardModel({
      id: 1,
      kind: Kind.MONSTER,
    });

    const morgueMonster = new GameCardModel({
      id: 1,
      currentUserId: userId,
      zone: Zone.MORGUE,
      card: monsterCard,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      gameChains: [gameChain],
      gameCards: [morgueMonster],
    });

    const result = grantSelectAsHamontakiTargetAction(gameModel, userId);

    expect(result.gameCards[0]?.actionTypes).toContain(ActionType.SELECT_AS_HAMONTAKI_TARGET);
  });

  it('should not grant action when no resolving game chain exists', () => {
    const userId = 'user1';
    const monsterCard = new CardModel({
      id: 1,
      kind: Kind.MONSTER,
    });

    const morgueMonster = new GameCardModel({
      id: 1,
      currentUserId: userId,
      zone: Zone.MORGUE,
      card: monsterCard,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      gameChains: [],
      gameCards: [morgueMonster],
    });

    const result = grantSelectAsHamontakiTargetAction(gameModel, userId);

    expect(result.gameCards[0]?.actionTypes).not.toContain(ActionType.SELECT_AS_HAMONTAKI_TARGET);
  });

  it('should not grant action when targetGameCardId is already set', () => {
    const userId = 'user1';
    const gameChainId = 'chain-uuid-1';
    const gameChainLink = new GameChainLinkModel({
      id: 'link-uuid-1',
      gameChainId,
      orderIndex: 0,
      userId,
      gameCardId: 1,
      status: GameChainLinkStatus.RESOLVING,
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

    const monsterCard = new CardModel({
      id: 1,
      kind: Kind.MONSTER,
    });

    const morgueMonster = new GameCardModel({
      id: 1,
      currentUserId: userId,
      zone: Zone.MORGUE,
      card: monsterCard,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      gameChains: [gameChain],
      gameCards: [morgueMonster],
    });

    const result = grantSelectAsHamontakiTargetAction(gameModel, userId);

    expect(result.gameCards[0]?.actionTypes).not.toContain(ActionType.SELECT_AS_HAMONTAKI_TARGET);
  });

  it('should not grant action to cards in other zones', () => {
    const userId = 'user1';
    const gameChainId = 'chain-uuid-1';
    const gameChainLink = new GameChainLinkModel({
      id: 'link-uuid-1',
      gameChainId,
      orderIndex: 0,
      userId,
      gameCardId: 1,
      status: GameChainLinkStatus.RESOLVING,
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

    const monsterCard = new CardModel({
      id: 1,
      kind: Kind.MONSTER,
    });

    const handMonster = new GameCardModel({
      id: 1,
      currentUserId: userId,
      zone: Zone.HAND,
      card: monsterCard,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      gameChains: [gameChain],
      gameCards: [handMonster],
    });

    const result = grantSelectAsHamontakiTargetAction(gameModel, userId);

    expect(result.gameCards[0]?.actionTypes).not.toContain(ActionType.SELECT_AS_HAMONTAKI_TARGET);
  });

  it('should not grant action to other user cards', () => {
    const userId = 'user1';
    const otherUserId = 'user2';
    const gameChainId = 'chain-uuid-1';
    const gameChainLink = new GameChainLinkModel({
      id: 'link-uuid-1',
      gameChainId,
      orderIndex: 0,
      userId,
      gameCardId: 1,
      status: GameChainLinkStatus.RESOLVING,
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

    const monsterCard = new CardModel({
      id: 1,
      kind: Kind.MONSTER,
    });

    const otherUserMonster = new GameCardModel({
      id: 1,
      currentUserId: otherUserId,
      zone: Zone.MORGUE,
      card: monsterCard,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      gameChains: [gameChain],
      gameCards: [otherUserMonster],
    });

    const result = grantSelectAsHamontakiTargetAction(gameModel, userId);

    expect(result.gameCards[0]?.actionTypes).not.toContain(ActionType.SELECT_AS_HAMONTAKI_TARGET);
  });
});
