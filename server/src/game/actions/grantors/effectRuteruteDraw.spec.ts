import { GameModel } from '../../../models/game.model';
import { GameStateEntity } from '../../../entities/game-state.entity';
import { GameCardEntity } from '../../../entities/game-card.entity';
import { GameUserEntity } from '../../../entities/game-user.entity';
import { CardEntity } from '../../../entities/card.entity';
import { Zone, StateType, ActionType, Phase } from '../../../graphql/index';
import { grantEffectRuteRuteDrawAction } from './effectRuteruteDraw';

describe('grantEffectRuteRuteDrawAction', () => {
  it('should grant action when ruterute card is in battle zone and effect not used', () => {
    const gameUser = new GameUserEntity();
    gameUser.id = 1;
    gameUser.userId = 'user1';

    const card = new CardEntity();
    card.id = 1;

    const ruteruteCard = new GameCardEntity();
    ruteruteCard.id = 1;
    ruteruteCard.currentUserId = 'user1';
    ruteruteCard.zone = Zone.BATTLE;
    ruteruteCard.card = card;
    ruteruteCard.actionTypes = [];

    const gameEntity = new GameModel();
    gameEntity.phase = Phase.SOMETHING;
    gameEntity.turnUserId = 'user1';
    gameEntity.gameUsers = [gameUser];
    gameEntity.gameCards = [ruteruteCard];
    gameEntity.gameStates = [];

    grantEffectRuteRuteDrawAction(gameEntity, 'user1');

    expect(gameEntity.gameCards[0]?.actionTypes).toContain(ActionType.EFFECT_RUTERUTE_DRAW);
  });

  it('should not grant action when effect already used for specific card', () => {
    const gameUser = new GameUserEntity();
    gameUser.id = 1;
    gameUser.userId = 'user1';

    const card = new CardEntity();
    card.id = 1;

    const ruteruteCard = new GameCardEntity();
    ruteruteCard.id = 1;
    ruteruteCard.currentUserId = 'user1';
    ruteruteCard.zone = Zone.BATTLE;
    ruteruteCard.card = card;
    ruteruteCard.actionTypes = [];

    const existingState = new GameStateEntity();
    existingState.gameCard = ruteruteCard;
    existingState.state = { type: StateType.EFFECT_RUTERUTE_DRAW_COUNT, data: { value: 1 } };

    const gameEntity = new GameModel();
    gameEntity.phase = Phase.SOMETHING;
    gameEntity.turnUserId = 'user1';
    gameEntity.gameUsers = [gameUser];
    gameEntity.gameCards = [ruteruteCard];
    gameEntity.gameStates = [existingState];

    grantEffectRuteRuteDrawAction(gameEntity, 'user1');

    expect(gameEntity.gameCards[0]?.actionTypes).not.toContain(ActionType.EFFECT_RUTERUTE_DRAW);
  });
});
