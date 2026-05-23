import styles from './JobCard.module.css'
import { Link } from 'react-router'

export function JobCard({ job }) {
  const technologies = Array.isArray(job.data?.technology)
    ? job.data.technology
    : job.data?.technology
    ? [job.data.technology]
    : []

  return (
    <Link
      to={`/jobs/${job.id}`}
      className={styles.cardLink}
      aria-label={`Ver detalles de ${job.titulo} en ${job.empresa}`}
    >
      <article className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>{job.titulo}</h3>
          {job.data?.nivel && <span className={styles.badge}>{job.data.nivel}</span>}
        </div>

        <div className={styles.meta}>
          <p className={styles.company}>
            <span className={styles.icon}>🏢</span>
            {job.empresa}
          </p>
          <p className={styles.location}>
            <span className={styles.icon}>📍</span>
            {job.ubicacion}
          </p>
          
        </div>

        {technologies.length > 0 && (
          <div className={styles.tags}>
            {technologies.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className={styles.footer}>
          <span className={styles.salary}>Salario a convenir</span>
          <span className={styles.viewMore}>Ver más →</span>
        </div>
      </article>
    </Link>
  )
}
