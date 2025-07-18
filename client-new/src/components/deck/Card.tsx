import { useContext } from 'react';
import { Card as RCard, CardImg } from 'reactstrap';
import { useDrag, type DragSourceMonitor } from 'react-dnd';
import * as ItemTypes from '../../constants/item-types';
import {
  usePlusDeckCardMutation,
  useMinusDeckCardMutation,
  DeckCardsDocument,
} from '../../graphql/generated/graphql-client';
import * as AreaTypes from '../../constants/area-types';
import { AppContext } from '../App';

interface Props {
  id: number;
  picture: string;
  isInDeck?: boolean;
}

export default function Card({ id, picture, isInDeck }: Props) {
  const {
    state: { selectedDeckId, deckModal },
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

  const handleClick = () => {
    dispatch({
      type: 'SET_DECK_MODAL',
      payload: deckModal.open({
        isInDeck: isInDeck === true,
        picture,
        cardId: id,
      }),
    });
  };

  const type = isInDeck ? ItemTypes.DECK_CARD : ItemTypes.CARD;

  const drag = useDrag({
    item: { id, type },
    end: (item: { id: string } | undefined, monitor: DragSourceMonitor) => {
      const dropResult = monitor.getDropResult();
      if (!item || !dropResult || !selectedDeckId) {
        return;
      }
      const options = { variables: { deckId: selectedDeckId, cardId: id } };
      if (dropResult.type === AreaTypes.DECK) {
        plusDeckCard(options);
      } else if (dropResult.type === AreaTypes.CARD) {
        minusDeckCard(options);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <RCard onClick={handleClick} innerRef={drag[1]}>
      <CardImg src={picture} />
    </RCard>
  );
}
