
import { Col, Table, Row, Container } from "react-bootstrap";
import { default as Logo } from "../assets/logo.png"
import "../App.css";

function Home() {

  return (
    <Container fluid className='box-center home'>
      <Row>
        <Col md={12} >
          <Row>
            <Col md={{ span: 8, offset: 2 }} className='my-2'>
              <img className='logo' src={Logo} alt="logo" />
            </Col>
          </Row>
          <Row className='mx-2 mt-1 mb-5'>
            <h2 className='formText'> Home </h2>
          </Row>
          <Table responsive variant="primary" bordered striped>
            <thead>
              <tr>
                <th>#</th>
                {Array.from({ length: 12 }).map((_, index) => (
                  <th key={index}>Table heading</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                {Array.from({ length: 12 }).map((_, index) => (
                  <td key={index}>Table cell {index}</td>
                ))}
              </tr>
              <tr>
                <td>2</td>
                {Array.from({ length: 12 }).map((_, index) => (
                  <td key={index}>Table cell {index}</td>
                ))}
              </tr>
              <tr>
                <td>3</td>
                {Array.from({ length: 12 }).map((_, index) => (
                  <td key={index}>Table cell {index}</td>
                ))}
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;