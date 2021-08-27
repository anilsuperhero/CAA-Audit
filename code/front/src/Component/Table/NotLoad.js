import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import Button from "@material-ui/core/Button";

const NotFound = (prop) => {
  const { show } = prop;
  const handleClickAdd = () => {
    prop.handleFormClick({}, true);
  };
  return (
    <Row>
      <Col lg="12">
        <Card>
          <Card.Body>
            <div className="text-center">
              <div className="p-5">&nbsp;</div>
              <Row className="text-center">
                <Col md={2} className="mt-3 mx-auto">
                  <div className="text-center">
                    {show && (
                      <Button
                        className="login-btn green-bg"
                        size="large"
                        color="primary"
                        variant="contained"
                        fullWidth
                        onClick={() => handleClickAdd()}
                      >
                        Add documents
                      </Button>
                    )}
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
