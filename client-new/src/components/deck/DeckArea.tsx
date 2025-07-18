import { type ChangeEvent, Fragment, useContext } from 'react';
import { FormGroup, Input, Row, Alert } from 'reactstrap';
import {
  useDecksQuery,
  useDeckCardsLazyQuery,
} from '../../graphql/generated/graphql-client';
import Card from './Card';
import Area from '../../styled/Area';
import { useDrop } from 'react-dnd';
import * as ItemTypes from '../../constants/item-types';
import * as AreaTypes from '../../constants/area-types';
import { AppContext } from '../App';
import * as ErrorMessages from '../../constants/error-messages';
import CreateDeckInput from './CreateDeckInput';
import styled from 'styled-components';
import { Container, Col } from '../../styled/reactstrap';

const StyledRow = styled(Row)`
  color: white;
`;

export default function DeckArea() {
  const {
    state: {
      selectedDeckId,
      plusDeckCardError,
      minusDeckCardError,
      createDeckError,
    },
    dispatch,
  } = useContext(AppContext);

  const [fetchDeckCards, deckCardsQueryResult] = useDeckCardsLazyQuery();

  const decksQueryResult = useDecksQuery({
    onCompleted: (data) => {
      if (
        selectedDeckId !== null &&
        data.decks.findIndex((deck) => deck.id === selectedDeckId) >= 0
      ) {
        fetchDeckCards({ variables: { deckId: selectedDeckId } });
      }
    },
  });

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: () => ({ type: AreaTypes.DECK }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleDeckSelectChange = (event: ChangeEvent<HTMLInputElement>) => {
    const deckId = parseInt(event.target.value);
    fetchDeckCards({ variables: { deckId } });
    dispatch({ type: 'SET_SELECTED_DECK_ID', payload: deckId });
  };

  return (
    <Area ref={drop} isActive={canDrop && isOver}>
      <Container marginTop={12}>
        {decksQueryResult.error !== undefined && (
          <Alert color="danger">デッキ情報の取得中にエラーが発生しました</Alert>
        )}
        {createDeckError !== null && (
          <Alert color="danger">デッキ情報の作成中にエラーが発生しました</Alert>
        )}
        <CreateDeckInput />
        <FormGroup row>
          <Col sm={12}>
            <Input
              type="select"
              onChange={handleDeckSelectChange}
              value={selectedDeckId || undefined}
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
          {deckCardsQueryResult.error !== undefined && (
            <Col lg={12}>
              <Alert color="danger">
                デッキのカード情報の取得中にエラーが発生しました
              </Alert>
            </Col>
          )}

          {plusDeckCardError !== null &&
            plusDeckCardError.message === ErrorMessages.MAX_COUNT && (
              <Col lg={12}>
                <Alert color="danger">
                  同名カードはデッキに3枚までしか入れることができません
                </Alert>
              </Col>
            )}

          {plusDeckCardError !== null &&
            plusDeckCardError.message !== ErrorMessages.MAX_COUNT && (
              <Col lg={12}>
                <Alert color="danger">
                  デッキへカードを追加する途中にエラーが発生しました
                </Alert>
              </Col>
            )}

          {minusDeckCardError !== null && (
            <Col lg={12}>
              <Alert color="danger">
                デッキからカードを抜く途中にエラーが発生しました
              </Alert>
            </Col>
          )}

          {deckCardsQueryResult.loading && (
            <Col marginBottom={12} lg={12}>
              デッキのカード情報をロード中です
            </Col>
          )}

          {deckCardsQueryResult.data?.deckCards.map((deckCard) => {
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
    </Area>
  );
}
