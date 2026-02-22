import { useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import { AppContext } from '../../contexts/AppContext';
import {
  DeckCardsDocument,
  usePlusDeckCardMutation,
  useMinusDeckCardMutation,
} from '../../graphql/generated/graphql-client';

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
  align-items: center;
  justify-content: center;
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
  width: 320px;
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
  padding: 16px;
`;

const CardImageWrapper = styled.div`
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

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(180, 140, 30, 0.35),
    transparent
  );
`;

const Footer = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 16px;
`;

const ActionButton = styled.button<{ $variant: 'add' | 'remove' | 'back' }>`
  flex: 1;
  background: ${({ $variant }) => {
    if ($variant === 'add') return 'rgba(26, 158, 82, 0.1)';
    if ($variant === 'remove') return 'rgba(170, 21, 21, 0.1)';
    return 'rgba(255, 255, 255, 0.04)';
  }};
  border: 1px solid
    ${({ $variant }) => {
      if ($variant === 'add') return 'rgba(61, 219, 128, 0.5)';
      if ($variant === 'remove') return 'rgba(232, 48, 48, 0.5)';
      return 'rgba(255, 255, 255, 0.2)';
    }};
  border-radius: 4px;
  color: ${({ $variant }) => {
    if ($variant === 'add') return '#3ddb80';
    if ($variant === 'remove') return '#e83030';
    return 'rgba(255, 255, 255, 0.45)';
  }};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 7px 12px;
  cursor: pointer;
  font-family: inherit;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    color 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ $variant }) => {
      if ($variant === 'add') return 'rgba(61, 219, 128, 0.2)';
      if ($variant === 'remove') return 'rgba(232, 48, 48, 0.2)';
      return 'rgba(255, 255, 255, 0.1)';
    }};
    border-color: ${({ $variant }) => {
      if ($variant === 'add') return 'rgba(61, 219, 128, 0.85)';
      if ($variant === 'remove') return 'rgba(232, 48, 48, 0.85)';
      return 'rgba(255, 255, 255, 0.4)';
    }};
    box-shadow: ${({ $variant }) => {
      if ($variant === 'add') return '0 0 10px rgba(61, 219, 128, 0.3)';
      if ($variant === 'remove') return '0 0 10px rgba(232, 48, 48, 0.3)';
      return 'none';
    }};
    color: ${({ $variant }) => {
      if ($variant === 'add') return '#6aeea0';
      if ($variant === 'remove') return '#f06060';
      return 'rgba(255, 255, 255, 0.7)';
    }};
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

export default function DeckModal() {
  const {
    state: { deckModal, selectedDeckId },
    dispatch,
  } = useContext(AppContext);

  const refetchDeckCardsQuery = {
    query: DeckCardsDocument,
    variables: { deckId: selectedDeckId },
  };

  const [plusDeckCard, { loading: plusLoading }] = usePlusDeckCardMutation({
    refetchQueries: [refetchDeckCardsQuery],
    awaitRefetchQueries: true,
    onCompleted: () => {
      dispatch({ type: 'RESET_ERROR', payload: 'plusDeckCardError' });
    },
    onError: (error) => {
      dispatch({
        type: 'SET_ERROR',
        payload: { name: 'plusDeckCardError', error },
      });
    },
  });

  const [minusDeckCard, { loading: minusLoading }] = useMinusDeckCardMutation({
    refetchQueries: [refetchDeckCardsQuery],
    awaitRefetchQueries: true,
    onCompleted: () => {
      dispatch({ type: 'RESET_ERROR', payload: 'minusDeckCardError' });
    },
    onError: (error) => {
      dispatch({
        type: 'SET_ERROR',
        payload: { name: 'minusDeckCardError', error },
      });
    },
  });

  const loading = plusLoading || minusLoading;

  const closeModal = () => {
    dispatch({ type: 'SET_DECK_MODAL', payload: deckModal.close() });
  };

  const handleClick = () => {
    if (selectedDeckId !== null) {
      dispatch({ type: 'RESET_ERROR', payload: 'plusDeckCardError' });
      dispatch({ type: 'RESET_ERROR', payload: 'minusDeckCardError' });

      const options = {
        variables: { deckId: selectedDeckId, cardId: deckModal.data.cardId },
      };
      if (deckModal.data.isInDeck) {
        minusDeckCard(options);
      } else {
        plusDeckCard(options);
      }
    }
    closeModal();
  };

  if (!deckModal.isOpen) return null;

  return (
    <Overlay onClick={closeModal}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Card Detail</Title>
          <CloseButton onClick={closeModal}>✕</CloseButton>
        </Header>

        <Body>
          <CardImageWrapper>
            <CardImage alt="card" src={deckModal.data.picture} />
          </CardImageWrapper>
        </Body>

        <Divider />

        <Footer>
          <ActionButton
            $variant={deckModal.data.isInDeck ? 'remove' : 'add'}
            onClick={handleClick}
            disabled={loading}
          >
            {deckModal.data.isInDeck ? 'デッキから抜く' : 'デッキへ追加する'}
          </ActionButton>
          <ActionButton $variant="back" onClick={closeModal}>
            戻る
          </ActionButton>
        </Footer>
      </Dialog>
    </Overlay>
  );
}
