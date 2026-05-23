
import { JobCard } from './JobCard'
import styles from './JobListing.module.css'

export function JobListing({ jobs }) {
  return (
    <>
      <h2 className={styles.title}>Resultados de búsqueda</h2>

      <div className={styles.jobsListings}>
        {
          jobs.map(job=>
            <JobCard key={job.id} job={job} />
          )
        }

      </div>
    </>
  )
}
