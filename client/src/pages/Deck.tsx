import DeckArea from '../components/deck/DeckArea';
import CardArea from '../components/deck/CardArea';
import AreaWrapper from '../styled/AreaWrapper';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DeckModal from '../components/deck/DeckModal';

export default function Deck() {
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <AreaWrapper>
          <DeckArea />
          <CardArea />
        </AreaWrapper>
      </DndProvider>
      <DeckModal />
    </>
  );
}
