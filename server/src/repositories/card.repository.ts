import { CardModel } from 'src/models/card.model';
import { CardEntity } from '../entities/card.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CardRepository {
  constructor(
    @InjectRepository(CardEntity)
    private readonly repository: Repository<CardEntity>,
  ) {}

  async findAll(): Promise<CardModel[]> {
    const entities = await this.repository.find();

    return entities.map(
      entity =>
        new CardModel({
          id: entity.id,
          name: entity.name,
          kind: entity.kind,
          type: entity.type,
          attribute: entity.attribute,
          attack: entity.attack,
          defence: entity.defence,
          cost: entity.cost,
          detail: entity.detail,
          picture: entity.picture,
        }),
    );
  }
}
