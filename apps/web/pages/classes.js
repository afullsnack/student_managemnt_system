import { Calendar, Card, Col, Row } from "ui";
import withLayout from "../components/globalLayout";

function Classes() {
  const onPanelChange = (value, mode) => {
    console.log(value, mode);
  };
  return (
    <Row gutter={16} style={{ width: "100%", height: "100%" }}>
      <Col span={24}>
        <Card title="Your class schedule for the semester">
          <Calendar onPanelChange={onPanelChange} />
        </Card>
      </Col>
    </Row>
  );
}

export default withLayout(Classes);
