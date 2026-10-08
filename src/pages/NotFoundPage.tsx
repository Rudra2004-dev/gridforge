import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <>
      <title>Page not found · GridForge</title>
      <section className="page-header">
        <div>
          <p className="page-eyebrow">404</p>
          <h1 className="page-title">Page not found</h1>
          <p className="page-description">That page doesn't exist or has moved.</p>
        </div>
        <Link to="/overview" className="primary-button">
          Back to Overview
        </Link>
      </section>
    </>
  );
}

export default NotFoundPage;