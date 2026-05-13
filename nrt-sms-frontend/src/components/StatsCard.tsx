import { Card, CardBody } from 'reactstrap';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
}

export default function StatsCard({ title, value, icon, color = 'primary' }: StatsCardProps) {
  return (
    <Card className={`card-statistics`}>
      <CardBody className="statistics-body">
        <div className="d-flex align-items-center">
          <div className={`avatar bg-light-${color} rounded p-50 me-1`}>
            <div className="avatar-content">
              <i className={`fas fa-${icon} text-${color}`} style={{ fontSize: '1.5rem' }} />
            </div>
          </div>
          <div className="ms-1">
            <h3 className="mb-0">{value}</h3>
            <span className="text-muted">{title}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
