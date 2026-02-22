import { useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import { AppContext } from '../../contexts/AppContext';
import GameActionButton from './GameActionButton';
import { BACK_SIDE_CARD } from '../../constants/pictures';
import ZoneNames from '../../constants/zone-names';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-10px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  z-index: 1050;
  animation: ${fadeIn} 0.2s ease;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 24px;
`;

const Dialog = styled.div`
  background: linear-gradient(
    145deg,
    rgba(5, 8, 20, 0.97) 0%,
    rgba(12, 18, 42, 0.95) 100%
  );
  border: 1px solid rgba(180, 140, 30, 0.55);
  border-radius: 8px;
  backdrop-filter: blur(20px);
  width: 420px;
  max-width: 90vw;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04) inset,
    0 8px 40px rgba(0, 0, 0, 0.8),
    0 0 20px rgba(180, 140, 30, 0.1);
  position: relative;
  overflow: hidden;
  animation: ${slideIn} 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(220, 170, 40, 0.6),
      transparent
    );
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(180, 140, 30, 0.2);
  flex-shrink: 0;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const Title = styled.span`
  color: #d4bc7a;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 2.5px;
  text-transform: uppercase;
`;

const Count = styled.span`
  color: rgba(180, 140, 30, 0.6);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1px;
  font-family: 'Courier New', monospace;
`;

const CloseButton = styled.button`
  background: none;
  border: 1px solid rgba(180, 140, 30, 0.3);
  border-radius: 4px;
  color: rgba(212, 188, 122, 0.6);
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  padding: 0;
  line-height: 1;
  transition:
    border-color 0.2s,
    color 0.2s,
    box-shadow 0.2s;

  &:hover {
    border-color: rgba(180, 140, 30, 0.7);
    color: #d4bc7a;
    box-shadow: 0 0 6px rgba(180, 140, 30, 0.3);
  }
`;

const Body = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.04);
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(180, 140, 30, 0.4);
    border-radius: 2px;
  }
`;

const CardItem = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 10px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(180, 140, 30, 0.15);
  border-radius: 6px;
  transition: border-color 0.2s;

  &:hover {
    border-color: rgba(180, 140, 30, 0.35);
  }
`;

const CardImageWrapper = styled.div`
  width: 56px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(180, 140, 30, 0.3);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
`;

const CardImage = styled.img`
  width: 100%;
  display: block;
`;

const CardDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

const CardName = styled.div`
  color: #f2c84b;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.3px;
`;

const ActionArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export default function GameCardListModal() {
  const {
    state: { gameCardListModal },
    dispatch,
  } = useContext(AppContext);

  const closeModal = () => {
    dispatch({
      type: 'SET_GAME_CARD_LIST_MODAL',
      payload: gameCardListModal.close(),
    });
  };

  if (!gameCardListModal.isOpen) return null;

  const zoneName =
    gameCardListModal.data[0] && ZoneNames[gameCardListModal.data[0].zone];

  return (
    <Overlay onClick={closeModal}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Header>
          <TitleGroup>
            <Title>{zoneName}</Title>
            <Count>{gameCardListModal.data.length} CARDS</Count>
          </TitleGroup>
          <CloseButton onClick={closeModal}>✕</CloseButton>
        </Header>

        <Body>
          {gameCardListModal.data.map((gameCard) => (
            <CardItem key={gameCard.id}>
              <CardImageWrapper>
                <CardImage src={gameCard.card?.picture || BACK_SIDE_CARD} />
              </CardImageWrapper>
              <CardDetail>
                {gameCard.name && <CardName>{gameCard.name}</CardName>}
                {gameCard.actionTypes.length > 0 && (
                  <ActionArea>
                    {gameCard.actionTypes.map((type) => (
                      <GameActionButton
                        key={type}
                        type={type}
                        gameCard={gameCard}
                      />
                    ))}
                  </ActionArea>
                )}
              </CardDetail>
            </CardItem>
          ))}
        </Body>
      </Dialog>
    </Overlay>
  );
}
