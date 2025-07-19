import { GameCardEntity } from '../entities/game.card.entity';
import { Injectable } from '@nestjs/common';
import { Zone } from 'src/graphql';

function isVisibleForAll(zone: Zone) {
  return zone === Zone.BATTLE || zone === Zone.SOUL || zone === Zone.MORGUE;
}

function isVisibleForCurrentUser(zone: Zone) {
  return zone === Zone.HAND;
}

@Injectable()
export class GameCardEntityFactory {
  // ⭐️ ゲーム参照時に使われる
  // カードの情報をGameCardEntityにそのまま埋め込む
  // カードが置かれているゾーンなどによっては相手が見えない情報もあるので、そういうのを後から filterByUserId でフィルタリングするための下準備
  addInfo(gameCardEntity: GameCardEntity) {
    gameCardEntity.name = gameCardEntity.card.name;
    gameCardEntity.kind = gameCardEntity.card.kind;
    gameCardEntity.type = gameCardEntity.card.type;
    gameCardEntity.attribute = gameCardEntity.card.attribute;
    gameCardEntity.attack = gameCardEntity.card.attack;
    gameCardEntity.defence = gameCardEntity.card.defence;
    gameCardEntity.cost = gameCardEntity.card.cost;
    gameCardEntity.detail = gameCardEntity.card.detail;
    return gameCardEntity;
  }

  // ⭐️ ゲーム参照時に使われる
  // 自分が見えない, 相手が見えないなどの情報をフィルタリングする
  // 例: 相手の手札は見えない
  filterByUserId(gameCardEntity: GameCardEntity, userId: string): GameCardEntity {
    if (
      isVisibleForAll(gameCardEntity.zone) ||
      (gameCardEntity.currentUserId === userId && isVisibleForCurrentUser(gameCardEntity.zone))
    ) {
      return gameCardEntity;
    }

    const filteredGameCardEntity = new GameCardEntity();
    filteredGameCardEntity.id = gameCardEntity.id;
    filteredGameCardEntity.currentUserId = gameCardEntity.currentUserId;
    filteredGameCardEntity.originalUserId = gameCardEntity.originalUserId;
    filteredGameCardEntity.zone = gameCardEntity.zone;
    filteredGameCardEntity.position = gameCardEntity.position;

    return filteredGameCardEntity;
  }
}
