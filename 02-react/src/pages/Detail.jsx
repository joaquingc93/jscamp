import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import styles from "./Detail.module.css";
import snarkdown from "snarkdown";
import { Link } from "../components/Link.jsx";

function JobSection({ title, content }) {
  if (!content) {
    return null;
  }

  const html = snarkdown(content);
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <article className="prose">
        <div
          className={styles.sectionContent}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </section>
  );
}

function DetailTag({ children }) {
  if (!children) {
    return null;
  }

  return <span className={styles.tag}>{children}</span>;
}

export function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchJob() {
      setLoading(true);
      setError(null);
      setJob(null);

      try {
        const response = await fetch(
          `https://jscamp-api.vercel.app/api/jobs/${jobId}`,
        );
        if (!response.ok) throw new Error("Oferta no encontrada");
        const json = await response.json();

        if (!cancelled) {
          setJob(json);
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchJob();
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <p className={styles.loadingText}>Cargando oferta...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className={styles.error}>
        <h1 className={styles.errorTitle}>Oferta no encontrada</h1>
        <p>Puede que esta oferta haya caducado o que la URL no sea correcta.</p>
        <button
          className={styles.errorButton}
          onClick={() => navigate("/search")}
        >
          Volver a la lista de empleos
        </button>
      </div>
    );
  }

  const technologies = Array.isArray(job.data?.technology)
    ? job.data.technology
    : [];

  const keyFacts = [
    { label: "Empresa", value: job.empresa },
    { label: "Ubicación", value: job.ubicacion },
    { label: "Modalidad", value: job.data?.modalidad },
    { label: "Nivel", value: job.data?.nivel },
  ].filter((fact) => fact.value);

  return (
    <main className={styles.container}>
      <nav className={styles.breadcrumb} aria-label="Ruta de navegación">
        <ol className={styles.breadcrumbList}>
          <li>
            <Link href="/search" className={styles.breadcrumbLink}>
              Empleos
            </Link>
          </li>
          <li className={styles.breadcrumbCurrent} aria-current="page">
            {job.titulo}
          </li>
        </ol>
      </nav>

      <header className={styles.header}>
        {job.data?.nivel && <span className={styles.badge}>{job.data.nivel}</span>}
        <h1 className={styles.title}>{job.titulo}</h1>
        <div className={styles.meta}>
          <p className={styles.company}>
            <span aria-hidden="true">🏢</span> {job.empresa}
          </p>
          <p className={styles.location}>
            <span aria-hidden="true">📍</span> {job.ubicacion}
          </p>
          {job.data?.modalidad && (
            <p>
              <span aria-hidden="true">💼</span> {job.data.modalidad}
            </p>
          )}
        </div>
        {technologies.length > 0 && (
          <div className={styles.tags} aria-label="Tecnologías de la oferta">
            {technologies.map((technology) => (
              <DetailTag key={technology}>{technology}</DetailTag>
            ))}
          </div>
        )}
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar} aria-label="Resumen de la oferta">
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Datos clave</h2>
            <dl className={styles.factList}>
              {keyFacts.map((fact) => (
                <div className={styles.fact} key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
            <button type="button" className={styles.applyButton}>
              Aplicar a esta oferta
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => navigate("/search")}
            >
              Volver al listado
            </button>
          </div>
        </aside>

        <div className={styles.mainColumn}>
          <JobSection
            title="Descripción del puesto"
            content={job.content?.description}
          />
          <JobSection
            title="Responsabilidades"
            content={job.content?.responsibilities}
          />
          <JobSection title="Requisitos" content={job.content?.requirements} />
          <JobSection title="Acerca de la empresa" content={job.content?.about} />
        </div>
      </div>
    </main>
  );
}

export default JobDetail;
