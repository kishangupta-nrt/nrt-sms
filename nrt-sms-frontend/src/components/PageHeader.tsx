import { Row, Col } from 'reactstrap';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <Row className="align-items-center mb-2">
      <Col md="7" className="d-flex align-items-center">
        <h2 className="content-header-title float-left mb-0 text-primary border-end-0">
          {title}
        </h2>
        {subtitle && <div className="ms-1 p-0 mb-0">{subtitle}</div>}
      </Col>
      <Col md="5" className="py-1 py-md-0 d-flex justify-content-md-end justify-content-start">
        {children}
      </Col>
    </Row>
  );
}
