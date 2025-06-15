import React, { useContext } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ListGroup,
  ListGroupItem,
  Card,
  CardImg,
} from 'reactstrap';
import { AppContext } from '../App';
import { Row, Col } from '../../styled/reactstrap';
import GameActionButton from './GameActionButton';
import { BACK_SIDE_CARD } from '../../constants/pictures';
import ZoneNames from '../../constants/zone-names';

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

  return (
    <Modal isOpen={gameCardListModal.isOpen} toggle={closeModal}>
      <ModalHeader toggle={closeModal}>
        {gameCardListModal.data[0] && ZoneNames[gameCardListModal.data[0].zone]}
        詳細情報（{gameCardListModal.data.length}枚）
      </ModalHeader>
      <ModalBody>
        <ListGroup>
          {gameCardListModal.data.map((gameCard) => (
            <ListGroupItem>
              <Row>
                <Col lg={3} xs={3}>
                  <Card>
                    <CardImg src={gameCard.card?.picture || BACK_SIDE_CARD} />
                  </Card>
                </Col>
                <Col lg={9} xs={9}>
                  <h5>{gameCard.name}</h5>
                  {gameCard.actionTypes.map((type) => (
                    <GameActionButton type={type} gameCard={gameCard} />
                  ))}
                </Col>
              </Row>
            </ListGroupItem>
          ))}
        </ListGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={closeModal}>
          戻る
        </Button>
      </ModalFooter>
    </Modal>
  );
}
