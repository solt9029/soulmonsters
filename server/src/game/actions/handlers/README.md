# Actions Handlers

## Overview

The `actions/handlers` directory contains the processing logic for game actions. Each handler corresponds to a specific game action and updates the state of database entities.

## Data Manipulation Policy

### GameEntity Operations

**GameEntity itself is manipulated mutably.**

- ✅ `gameEntity.phase = Phase.ENERGY`
- ✅ `gameEntity.gameCards = newGameCards`
- ✅ `gameEntity.gameUsers = newGameUsers`

### Associated Entity Operations

**Associated entities linked to GameEntity (gameCards, gameUsers, etc.) are manipulated immutably.**

#### gameCards Operation Example

```typescript
// ❌ Direct modification
gameEntity.gameCards[0].zone = Zone.SOUL;

// ✅ Immutably create new instance and assign
gameEntity.gameCards = gameEntity.gameCards.map(gameCard =>
  gameCard.id === targetId
    ? new GameCardEntity({
        ...gameCard,
        zone: Zone.SOUL,
        position: newPosition,
      })
    : gameCard,
);
```

#### gameUsers Operation Example

```typescript
// ❌ Direct modification
const gameUser = gameEntity.gameUsers.find(u => u.userId === userId);
gameUser.energy = newEnergy;

// ✅ Immutably create new instance and assign
gameEntity.gameUsers = gameEntity.gameUsers.map(gameUser =>
  gameUser.userId === userId
    ? new GameUserEntity({ ...gameUser, energy: newEnergy })
    : gameUser,
);
```

## Handler Pattern

### Main Handler
- Functions as the entry point
- Calls necessary sub-processes
- Finally saves the entity

### Sub-processes
- Small functions following the single responsibility principle
- Receives GameEntity and returns the updated GameEntity
- Designed as pure functions (no side effects)

## Implementation Example

```typescript
// Main handler example
export async function handleExampleAction(
  manager: EntityManager,
  userId: string,
  gameEntity: GameEntity,
) {
  gameEntity = updateSomeProperty(gameEntity, userId);
  gameEntity = updatePhase(gameEntity);

  await manager.save(GameEntity, gameEntity);
}

// Sub-process example
const updateSomeProperty = (gameEntity: GameEntity, userId: string): GameEntity => {
  // Update associated entities immutably
  gameEntity.gameCards = gameEntity.gameCards.map(card =>
    card.currentUserId === userId
      ? new GameCardEntity({ ...card, someProperty: newValue })
      : card,
  );

  // Update GameEntity itself mutably
  gameEntity.phase = Phase.NEXT;

  return gameEntity;
};
```
