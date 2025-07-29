import { GameActionDispatchInput } from '../../../graphql/index';
import { GameEntity } from '../../../entities/game.entity';

export function validateEffectRuteruteDrawAction(data: GameActionDispatchInput, game: GameEntity, userId: string) {
  // TODO: dataにあるgameCardIdのgameCardが、grantorによってEFFECT_RUTERUTE_DRAWのactionTypeを持っているか確認する
}
