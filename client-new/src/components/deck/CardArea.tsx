import { Row, Alert } from 'reactstrap';
import Card from './Card';
import { useCardsQuery } from '../../graphql/generated/graphql-client';
import Area from '../../styled/Area';
import * as AreaTypes from '../../constants/area-types';
import * as ItemTypes from '../../constants/item-types';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';
import { Container, Col } from '../../styled/reactstrap';

const StyledRow = styled(Row)`
  color: white;
`;

export default function CardArea() {
  const { data, error, loading } = useCardsQuery();

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.DECK_CARD,
    drop: () => ({ type: AreaTypes.CARD }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <Area ref={drop} isActive={canDrop && isOver} isRight>
      <Container marginTop={12}>
        <StyledRow>
          {loading && (
            <Col marginBottom={12} lg={12}>
              カード情報をロード中です
            </Col>
          )}
          {error !== undefined && (
            <Col marginBottom={12} lg={12}>
              <Alert color="danger">
                カード情報の取得中にエラーが発生しました
              </Alert>
            </Col>
          )}
          {data?.cards.map((card) => (
            <Col
              marginBottom={12}
              paddingLeft={6}
              paddingRight={6}
              lg={2}
              md={3}
              sm={4}
              xs={6}
            >
              <Card id={card.id} picture={card.picture}></Card>
            </Col>
          ))}
        </StyledRow>
      </Container>
    </Area>
  );
}
