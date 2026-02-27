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

    if (gameModel.gamePendingEffects.length === 0) {
      return gameModel;
    }

    // TODO: 1プレイヤーの効果が複数ある場合には、順番を選択してもらう必要がある
    // TODO: 発動時に対象を選択する必要がある場合の処理も必要そう
    // ターンプレイヤーの効果をチェーンリンク1（orderIndex: 0）として積む
    // ChainResolverはorderIndex降順で処理するため、チェーンリンク2以降（orderIndex高）が先に解決される
    const sortedPendingEffects = [...gameModel.gamePendingEffects].sort((a, b) => {
      const aOrder = a.userId === gameModel.turnUserId ? 0 : 1;
      const bOrder = b.userId === gameModel.turnUserId ? 0 : 1;
      return aOrder - bOrder;
    });

    const gameChainId = uuidv4();
    const gameChainLinks = sortedPendingEffects.map(
      (pendingEffect, index) =>
        new GameChainLinkModel({
          id: uuidv4(),
          gameChainId,
          orderIndex: index,
          userId: pendingEffect.userId,
          gameCardId: pendingEffect.gameCardId,
          status: GameChainLinkStatus.WAITING,
          effect: this.buildEffect(pendingEffect),
        }),
    );

    const gameChain = new GameChainModel({
      id: gameChainId,
      gameId: gameModel.id,
      status: GameChainStatus.RESOLVING,
      gameChainLinks,
    });

    gameModel.gameChains = [...gameModel.gameChains, gameChain];
    gameModel.gamePendingEffects = [];

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
      case EffectType.REITETSUNATOTI_DRAW:
        return { type: EffectType.REITETSUNATOTI_DRAW };
      case EffectType.HAMONTAKI_SPECIAL_SUMMON:
        return { type: EffectType.HAMONTAKI_SPECIAL_SUMMON };
      default:
        throw new Error(`Unsupported effectType: ${gamePendingEffect.effectType}`);
    }
  }
}
