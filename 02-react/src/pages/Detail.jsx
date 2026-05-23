import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import styles from './Detail.module.css'
import snarkdown from 'snarkdown'

function JobSection({ title, content }) {
  if (!content) {
    return null
  }

  const html = snarkdown(content)
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <article className="prose">
        <div className={styles.sectionContent} dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </section>
  )
}

export function JobDetail() {
  const { jobId } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchJob() {
      setLoading(true)
      setError(null)
      setJob(null)

      try {
        const response = await fetch(`https://jscamp-api.vercel.app/api/jobs/${jobId}`)
        if (!response.ok) throw new Error('Oferta no encontrada')
        const json = await response.json()

        if (!cancelled) {
          setJob(json)
        }
      } catch (err) {
        if (!cancelled) setError(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchJob()
    return () => {
      cancelled = true
    }
  }, [jobId])

  if (loading) {
    return (
      <div className={styles.loading}>
        <p className={styles.loadingText}>Cargando oferta...</p>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className={styles.error}>
        <h1 className={styles.errorTitle}>Oferta no encontrada</h1>
        <p>Puede que esta oferta haya caducado o que la URL no sea correcta.</p>
        <button className={styles.errorButton} onClick={() => navigate('/search')}>
          Volver a la lista de empleos
        </button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumb}>
        <button type="button" className={styles.breadcrumbButton} onClick={() => navigate('/search')}>
          Empleos
        </button>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>{job.titulo}</span>
      </nav>

      <header className={styles.header}>
        <h1 className={styles.title}>{job.titulo}</h1>
        <div className={styles.meta}>
          <p className={styles.company}>{job.empresa}</p>
          <p className={styles.location}>{job.ubicacion}</p>
        </div>
        <button className={styles.applyButton}>Aplicar a esta oferta</button>
      </header>

      <JobSection title="Descripción del puesto" content={job.content?.description} />
      <JobSection title="Responsabilidades" content={job.content?.responsibilities} />
      <JobSection title="Requisitos" content={job.content?.requirements} />
      <JobSection title="Acerca de la empresa" content={job.content?.about} />
    </div>
  )
}