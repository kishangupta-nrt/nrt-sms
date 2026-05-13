import { Spinner } from 'reactstrap';

export default function Loading() {
  return (
    <div className="fallback-spinner app-loader">
      <div className="loading">
        <div className="effect-1 effects" />
        <div className="effect-2 effects" />
        <div className="effect-3 effects" />
      </div>
    </div>
  );
}
