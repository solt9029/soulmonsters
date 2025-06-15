import React, { useContext } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardImg,
} from 'reactstrap';
import { AppContext } from '../App';
import { Row, Col } from '../../styled/reactstrap';
import GameActionButton from './GameActionButton';

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

  return (
    <Modal isOpen={gameCardModal.isOpen} toggle={closeModal}>
      <ModalHeader toggle={closeModal}>カード詳細情報</ModalHeader>
      <ModalBody>
        <Row>
          <Col lg={6} xs={6}>
            <Card>
              <CardImg src={gameCardModal.data?.card?.picture} />
            </Card>
          </Col>
          <Col lg={6} xs={6}>
            {gameCardModal.data?.actionTypes.map((value) => (
              <GameActionButton type={value} gameCard={gameCardModal?.data} />
            ))}
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={closeModal}>
          戻る
        </Button>
      </ModalFooter>
    </Modal>
  );
}
