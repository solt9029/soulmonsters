import { EntityRepository, Repository } from 'typeorm';
import { GameCardEntity } from '../entities/game.card.entity';

@EntityRepository(GameCardEntity)
export class GameCardRepository extends Repository<GameCardEntity> {}
