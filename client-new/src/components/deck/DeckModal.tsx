import React, { useContext } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AppContext } from '../App';
import {
  DeckCardsDocument,
  usePlusDeckCardMutation,
  useMinusDeckCardMutation,
} from '../../graphql/generated/graphql-client';
import styled from 'styled-components';

const Img = styled.img`
  width: 100%;
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

  const [plusDeckCard] = usePlusDeckCardMutation({
    refetchQueries: [refetchDeckCardsQuery],
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

  const [minusDeckCard] = useMinusDeckCardMutation({
    refetchQueries: [refetchDeckCardsQuery],
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

  const closeModal = () => {
    dispatch({ type: 'SET_DECK_MODAL', payload: deckModal.close() });
  };

  const handleClick = () => {
    if (selectedDeckId !== null) {
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

  return (
    <Modal isOpen={deckModal.isOpen} toggle={closeModal}>
      <ModalHeader toggle={closeModal}>カード詳細情報</ModalHeader>
      <ModalBody>
        <Img alt="modal" src={deckModal.data.picture} />
      </ModalBody>
      <ModalFooter>
        {deckModal.data.isInDeck ? (
          <Button onClick={handleClick} color="danger">
            このカードをデッキから抜く
          </Button>
        ) : (
          <Button onClick={handleClick} color="success">
            このカードをデッキへ追加する
          </Button>
        )}
        <Button color="secondary" onClick={closeModal}>
          戻る
        </Button>
      </ModalFooter>
    </Modal>
  );
}
