import { useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import { AppContext } from '../../contexts/AppContext';
import GameActionButton from './GameActionButton';

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
  width: 380px;
  max-width: 90vw;
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
`;

const Title = styled.span`
  color: #d4bc7a;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 2.5px;
  text-transform: uppercase;
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
  display: flex;
  gap: 16px;
  padding: 16px;
`;

const CardImageWrapper = styled.div`
  width: 110px;
  flex-shrink: 0;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(180, 140, 30, 0.4);
  box-shadow:
    0 0 12px rgba(0, 0, 0, 0.6),
    0 0 8px rgba(180, 140, 30, 0.1);
`;

const CardImage = styled.img`
  width: 100%;
  display: block;
`;

const CardInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`;

const CardName = styled.div`
  color: #f2c84b;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.4px;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const Tag = styled.span`
  color: rgba(91, 200, 255, 0.9);
  background: rgba(91, 200, 255, 0.08);
  border: 1px solid rgba(91, 200, 255, 0.25);
  border-radius: 3px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 2px 6px;
`;

const Stats = styled.div`
  display: flex;
  gap: 14px;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StatLabel = styled.span`
  color: rgba(180, 140, 30, 0.65);
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const StatValue = styled.span`
  color: #e8e0c8;
  font-size: 14px;
  font-weight: 700;
  font-family: 'Courier New', 'Consolas', monospace;
`;

const Detail = styled.p`
  color: rgba(232, 224, 200, 0.65);
  font-size: 11px;
  line-height: 1.6;
  margin: 0;
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(180, 140, 30, 0.35),
    transparent
  );
`;

const ActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 12px 16px;
`;

export default function GameCardModal() {
  const {
    state: { gameCardModal },
    dispatch,
  } = useContext(AppContext);

  const closeModal = () => {
    dispatch({
      type: 'SET_GAME_CARD_MODAL',
      payload: gameCardModal.close(),
    });
  };

  if (!gameCardModal.isOpen) return null;

  const data = gameCardModal.data;
  const tags = [data?.kind, data?.type, data?.attribute].filter(Boolean);
  const hasStats =
    data?.attack != null || data?.defence != null || data?.cost != null;
  const hasActions = (data?.actionTypes.length ?? 0) > 0;

  return (
    <Overlay onClick={closeModal}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Card Detail</Title>
          <CloseButton onClick={closeModal}>✕</CloseButton>
        </Header>

        <Body>
          {data?.card?.picture && (
            <CardImageWrapper>
              <CardImage src={data.card.picture} />
            </CardImageWrapper>
          )}

          <CardInfo>
            {data?.name && <CardName>{data.name}</CardName>}

            {tags.length > 0 && (
              <Tags>
                {tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </Tags>
            )}

            {hasStats && (
              <Stats>
                {data?.attack != null && (
                  <Stat>
                    <StatLabel>ATK</StatLabel>
                    <StatValue>{data.attack}</StatValue>
                  </Stat>
                )}
                {data?.defence != null && (
                  <Stat>
                    <StatLabel>DEF</StatLabel>
                    <StatValue>{data.defence}</StatValue>
                  </Stat>
                )}
                {data?.cost != null && (
                  <Stat>
                    <StatLabel>COST</StatLabel>
                    <StatValue>{data.cost}</StatValue>
                  </Stat>
                )}
              </Stats>
            )}

            {data?.detail && <Detail>{data.detail}</Detail>}
          </CardInfo>
        </Body>

        {hasActions && (
          <>
            <Divider />
            <ActionButtons>
              {data?.actionTypes.map((value) => (
                <GameActionButton key={value} type={value} gameCard={data} />
              ))}
            </ActionButtons>
          </>
        )}
      </Dialog>
    </Overlay>
  );
}
