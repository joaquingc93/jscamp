import { Link as RouterLink, useLocation } from "react-router";

export function Link({ href, children, ...restOfProps }) {
  return (
    <RouterLink to={href} {...restOfProps}>
      {children}
    </RouterLink>
  );
}

export function NavLink({
  href,
  children,
  className,
  activeClassName,
  activeWhen,
  ...restOfProps
}) {
  const { pathname } = useLocation();
  const isActive = activeWhen ? activeWhen(pathname) : pathname === href;
  const resolvedClassName = [className, isActive && activeClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      href={href}
      className={resolvedClassName || undefined}
      aria-current={isActive ? "page" : undefined}
      {...restOfProps}
    >
      {children}
    </Link>
  );
}
