import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";

const NotFound = (prop) => {
  const { image } = prop;
  const { push } = useHistory();

  const handleClickAdd = () => {
    push("/audit-request");
  };
  return (
    <Row>
      <Col>
        <Card>
          <Card.Body>
            <div className="text-center">
              <img src={image} alt="notfound" className="p-5" height="200px" />
              <h3>You have already submitted your documents</h3>
              <Row className="text-center">
                <Col md={2} className="mt-3 mx-auto">
                  <div className="text-center">
                    <Button
                      className="login-btn green-bg"
                      size="large"
                      color="primary"
                      variant="contained"
                      fullWidth
                      onClick={() => handleClickAdd()}
                    >
                      Back
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default NotFound;
