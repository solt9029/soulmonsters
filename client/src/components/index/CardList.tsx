import { Card, CardImg } from 'reactstrap';
import { Col } from '../../styled/reactstrap';

const pictures = [
  'https://res.cloudinary.com/dsicq6kw4/image/upload/v1753329559/Slide1_x2tnwu.jpg',
  'https://res.cloudinary.com/dsicq6kw4/image/upload/v1753329757/Slide2_c5qdin.jpg',
  'https://res.cloudinary.com/dsicq6kw4/image/upload/v1753329757/Slide3_ccmtrz.jpg',
  'https://res.cloudinary.com/dsicq6kw4/image/upload/v1753329757/Slide4_hiinsi.jpg',
  'https://res.cloudinary.com/dsicq6kw4/image/upload/v1753329758/Slide5_l7gxxb.jpg',
  'https://res.cloudinary.com/dsicq6kw4/image/upload/v1753329758/Slide6_n62lgc.jpg',
  'https://res.cloudinary.com/dsicq6kw4/image/upload/v1753329758/Slide7_bcoywh.jpg',
  'https://res.cloudinary.com/dsicq6kw4/image/upload/v1753329759/Slide8_at8pfg.jpg',
];

export default function CardList() {
  return (
    <>
      {pictures.map((picture) => (
        <Col marginBottom={30} lg={3} md={4} sm={6} xs={6}>
          <Card>
            <CardImg src={picture} />
          </Card>
        </Col>
      ))}
    </>
  );
}
