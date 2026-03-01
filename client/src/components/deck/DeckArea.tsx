import { type ChangeEvent, Fragment, useContext, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { FormGroup, Input, Row, Alert } from 'reactstrap';
import {
  useDecksQuery,
  useDeckCardsLazyQuery,
} from '../../graphql/generated/graphql-client';
import Card from './Card';
import { useDrop } from 'react-dnd';
import * as ItemTypes from '../../constants/item-types';
import * as AreaTypes from '../../constants/area-types';
import { AppContext } from '../../contexts/AppContext';
import * as ErrorMessages from '../../constants/error-messages';
import CreateDeckInput from './CreateDeckInput';
import styled from 'styled-components';
import { Container, Col } from '../../styled/reactstrap';

const StyledRow = styled(Row)`
  color: white;
`;

export default function DeckArea() {
  const { id } = useParams<{ id?: string }>();
  const history = useHistory();
  const deckId = id ? parseInt(id) : null;

  const {
    state: { plusDeckCardError, minusDeckCardError, createDeckError },
    dispatch,
  } = useContext(AppContext);

  useEffect(() => {
    dispatch({ type: 'SET_SELECTED_DECK_ID', payload: deckId });
  }, [deckId]); // eslint-disable-line react-hooks/exhaustive-deps

  const [fetchDeckCards, deckCardsQueryResult] = useDeckCardsLazyQuery();

  const decksQueryResult = useDecksQuery();

  useEffect(() => {
    if (deckId === null || !decksQueryResult.data) return;
    const deckExists = decksQueryResult.data.decks.some(
      (deck) => deck.id === deckId
    );
    if (deckExists) {
      fetchDeckCards({ variables: { deckId } });
    }
  }, [deckId, decksQueryResult.data]); // eslint-disable-line react-hooks/exhaustive-deps

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: () => ({ type: AreaTypes.DECK }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleDeckSelectChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value === 'default') {
      history.push('/decks');
      return;
    }
    history.push(`/decks/${parseInt(value)}`);
  };

  return drop(
    <div
      style={{
        height: '100%',
        width: '100%',
        backgroundSize: 'cover',
        backgroundColor: canDrop && isOver ? '#444' : '#222',
        border: 'solid 5px #ccc',
        borderRightWidth: '0px',
        overflow: 'auto',
      }}
    >
      <Container marginTop={12}>
        {decksQueryResult.error !== undefined && (
          <Alert color="danger">デッキ情報の取得中にエラーが発生しました</Alert>
        )}

        {createDeckError !== null && (
          <Alert color="danger">デッキ情報の作成中にエラーが発生しました</Alert>
        )}

        {deckCardsQueryResult.error !== undefined && (
          <Alert color="danger">
            デッキのカード情報の取得中にエラーが発生しました
          </Alert>
        )}

        {plusDeckCardError !== null &&
          plusDeckCardError.message === ErrorMessages.MAX_COUNT && (
            <Alert color="danger">
              同名カードはデッキに3枚までしか入れることができません
            </Alert>
          )}

        {plusDeckCardError !== null &&
          plusDeckCardError.message !== ErrorMessages.MAX_COUNT && (
            <Alert color="danger">
              デッキへカードを追加する途中にエラーが発生しました
            </Alert>
          )}

        {minusDeckCardError !== null && (
          <Alert color="danger">
            デッキからカードを抜く途中にエラーが発生しました
          </Alert>
        )}

        <CreateDeckInput />
        <FormGroup row>
          <Col sm={12}>
            <Input
              type="select"
              onChange={handleDeckSelectChange}
              value={deckId || undefined}
            >
              <option value="default">編集するデッキを選択してください</option>
              {decksQueryResult.data?.decks?.map((deck) => (
                <option key={deck.id} value={deck.id}>
                  {deck.name}
                </option>
              ))}
            </Input>
          </Col>
        </FormGroup>
        <StyledRow>
          {deckId !== null &&
            deckCardsQueryResult.data?.deckCards.map((deckCard) => {
              return (
                <Fragment>
                  {[...Array(deckCard.count)].map(() => (
                    <Col
                      marginBottom={12}
                      paddingLeft={6}
                      paddingRight={6}
                      lg={2}
                      md={3}
                      sm={4}
                      xs={6}
                    >
                      <Card
                        id={deckCard.card.id}
                        isInDeck
                        picture={deckCard.card.picture}
                      ></Card>
                    </Col>
                  ))}
                </Fragment>
              );
            })}
        </StyledRow>
      </Container>
    </div>
  );
}
