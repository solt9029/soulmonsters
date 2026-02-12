import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { GameModel } from 'src/models/game.model';
import { GameChainModel, GameChainStatus } from 'src/models/game-chain.model';
import { GameChainLinkModel, GameChainLinkStatus, Effect } from 'src/models/game-chain-link.model';
import { GamePendingEffectModel } from 'src/models/game-pending-effect.model';
import { EffectType } from 'src/graphql/index';

@Injectable()
export class ChainBuilder {
  buildChain(gameModel: GameModel): GameModel {
    const hasResolvingChain = gameModel.gameChains.some(c => c.status === GameChainStatus.RESOLVING);

    if (hasResolvingChain) {
      return gameModel;
    }

    // memo: 一旦仮実装なので、gamePendingEffectsの最初の1件しか処理しない
    if (gameModel.gamePendingEffects[0] === undefined) {
      return gameModel;
    }

    const gamePendingEffect = gameModel.gamePendingEffects[0];
    const effect = this.buildEffect(gamePendingEffect);

    const gameChainId = uuidv4();
    const gameChain = new GameChainModel({
      id: gameChainId,
      gameId: gameModel.id,
      status: GameChainStatus.RESOLVING,
      gameChainLinks: [
        new GameChainLinkModel({
          id: uuidv4(),
          gameChainId,
          orderIndex: 0,
          userId: gamePendingEffect.userId,
          gameCardId: gamePendingEffect.gameCardId,
          status: GameChainLinkStatus.WAITING,
          effect,
        }),
      ],
    });

    gameModel.gameChains = [...gameModel.gameChains, gameChain];
    gameModel.gamePendingEffects = gameModel.gamePendingEffects.filter(
      pendingEffect => pendingEffect.id !== gamePendingEffect.id,
    );

    return gameModel;
  }

  private buildEffect(gamePendingEffect: GamePendingEffectModel): Effect {
    switch (gamePendingEffect.effectType) {
      case EffectType.SHIMASHIMAJUNIOR_ENERGY_TRANSFER:
        return { type: EffectType.SHIMASHIMAJUNIOR_ENERGY_TRANSFER };
      case EffectType.SHINKASHITABAKUBOMDAN_DAMAGE:
        return { type: EffectType.SHINKASHITABAKUBOMDAN_DAMAGE };
      case EffectType.AIKAWARAZUYOKUWAKARANAIHANA_DAMAGE:
        return { type: EffectType.AIKAWARAZUYOKUWAKARANAIHANA_DAMAGE };
      case EffectType.NISEKISANCHOU_ENERGY_INCREASE:
        return { type: EffectType.NISEKISANCHOU_ENERGY_INCREASE };
      case EffectType.SAIFUKKATSUSHITATAKIBEE_DAMAGE:
        return { type: EffectType.SAIFUKKATSUSHITATAKIBEE_DAMAGE };
      default:
        throw new Error(`Unsupported effectType: ${gamePendingEffect.effectType}`);
    }
  }
}
