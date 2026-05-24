import { DevJobsAvatar } from "./DevJobsAvatar.jsx";
import styles from "./Header.module.css";
import { Link, NavLink } from "./Link.jsx";

export function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brandLink} aria-label="Ir al inicio">
        <h1 className={styles.title}>
          <svg
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          DevJobs
        </h1>
      </Link>
      <nav className={styles.nav}>
        <NavLink
          href="/search"
          className={styles.navLink}
          activeClassName={styles.navLinkActive}
          activeWhen={(pathname) =>
            pathname.startsWith("/search") || pathname.startsWith("/jobs")
          }
        >
          Empleos
        </NavLink>
      </nav>

      <div className={styles.avatars}>
        <DevJobsAvatar service="google" username="google.com" size="32" />
        <DevJobsAvatar service="google" username="netflix.com" size="32" />
        <DevJobsAvatar service="google" username="vercel.com" size="32" />
      </div>
    </header>
  );
}
