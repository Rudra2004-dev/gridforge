type ComingSoonPageProps = {
  title: string;
  description: string;
};

function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <>
      <title>{`${title} · GridForge`}</title>

      <section className="page-header">
        <div>
          <p className="page-eyebrow">Workspace / {title}</p>
          <h1 className="page-title">{title}</h1>
          <p className="page-description">{description}</p>
        </div>
      </section>

      <section className="grid-card">
        <div className="grid-empty">Coming soon</div>
      </section>
    </>
  );
}

export default ComingSoonPage;