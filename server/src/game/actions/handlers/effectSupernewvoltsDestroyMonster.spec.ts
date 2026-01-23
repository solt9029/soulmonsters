import { GameModel } from 'src/models/game.model';
import { GameUserModel } from 'src/models/game-user.model';
import { GameCardModel } from 'src/models/game-card.model';
import { CardModel } from 'src/models/card.model';
import { Zone, Phase, GameChainStatus, GameChainLinkStatus, EffectType } from 'src/graphql/index';
import { handleEffectSupernewvoltsDestroyMonster, EffectSupernewvoltsDestroyMonsterActionPayload } from './effectSupernewvoltsDestroyMonster';

describe('handleEffectSupernewvoltsDestroyMonster', () => {
  it('should create GameChain with GameChainLink containing correct effect payload', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const supernewvoltsCard = new CardModel({ id: 1 });
    const targetCard = new CardModel({ id: 2 });

    const supernewvoltsGameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      card: supernewvoltsCard,
    });

    const targetGameCard = new GameCardModel({
      id: 2,
      currentUserId: 'user2',
      zone: Zone.BATTLE,
      card: targetCard,
    });

    const gameModel = new GameModel({
      id: 'game1',
      phase: Phase.SOMETHING,
      turnUserId: 'user1',
      gameUsers: [gameUser],
      gameCards: [supernewvoltsGameCard, targetGameCard],
      gameChains: [],
    });

    const payload: EffectSupernewvoltsDestroyMonsterActionPayload = {
      gameCard: supernewvoltsGameCard,
      targetGameCard: targetGameCard,
    };

    const result = handleEffectSupernewvoltsDestroyMonster('user1', payload, gameModel);

    expect(result.gameChains).toHaveLength(1);

    const gameChain = result.gameChains[0];
    expect(gameChain?.gameId).toBe('game1');
    expect(gameChain?.status).toBe(GameChainStatus.RESOLVING);
    expect(gameChain?.gameChainLinks).toHaveLength(1);

    const gameChainLink = gameChain?.gameChainLinks[0];
    expect(gameChainLink?.orderIndex).toBe(0);
    expect(gameChainLink?.userId).toBe('user1');
    expect(gameChainLink?.gameCardId).toBe(1);
    expect(gameChainLink?.status).toBe(GameChainLinkStatus.WAITING);
    expect(gameChainLink?.effect.type).toBe(EffectType.SUPERNEWVOLTS_DESTROY_MONSTER);
    expect(gameChainLink?.effect.payload).toEqual(payload);
  });

  it('should preserve existing GameChains when adding new chain', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const supernewvoltsCard = new CardModel({ id: 1 });
    const targetCard = new CardModel({ id: 2 });

    const supernewvoltsGameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      card: supernewvoltsCard,
    });

    const targetGameCard = new GameCardModel({
      id: 2,
      currentUserId: 'user2',
      zone: Zone.BATTLE,
      card: targetCard,
    });

    // Create a game model with an existing game chain
    const existingGameChain = {
      id: 'existing-chain',
      gameId: 'game1',
      status: GameChainStatus.RESOLVED,
      gameChainLinks: [],
    };

    const gameModel = new GameModel({
      id: 'game1',
      phase: Phase.SOMETHING,
      turnUserId: 'user1',
      gameUsers: [gameUser],
      gameCards: [supernewvoltsGameCard, targetGameCard],
      gameChains: [existingGameChain],
    });

    const payload: EffectSupernewvoltsDestroyMonsterActionPayload = {
      gameCard: supernewvoltsGameCard,
      targetGameCard: targetGameCard,
    };

    const result = handleEffectSupernewvoltsDestroyMonster('user1', payload, gameModel);

    expect(result.gameChains).toHaveLength(2);
    expect(result.gameChains[0]).toEqual(existingGameChain);
    expect(result.gameChains[1]?.status).toBe(GameChainStatus.RESOLVING);
  });
});