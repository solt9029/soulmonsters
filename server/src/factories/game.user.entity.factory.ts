import { GameUserEntity } from 'src/entities/game.user.entity';
import { auth } from 'firebase-admin';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameUserEntityFactory {
  addUser(
    gameUserEntity: GameUserEntity,
    { uid, displayName, photoURL }: auth.UserRecord,
  ): GameUserEntity {
    gameUserEntity.user = { id: uid, displayName, photoURL };
    return gameUserEntity;
  }
}
