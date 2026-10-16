export function AppLink({ active, children, onNavigate, to }) {
  return (
    <a
      className={active ? 'active' : ''}
      href={to}
      onClick={(event) => {
        event.preventDefault()
        onNavigate(to)
      }}
    >
      {children}
    </a>
  )
}
