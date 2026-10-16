function pageWindow(currentPage, totalPages) {
  const start = Math.max(1, currentPage - 2)
  const end = Math.min(totalPages, start + 4)
  const adjustedStart = Math.max(1, end - 4)

  return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index)
}

export function Pagination({ currentPage, onPageChange, totalPages }) {
  if (totalPages <= 1) return null

  const pages = pageWindow(currentPage, totalPages)

  return (
    <nav className="pagination" aria-label="ترقيم الصفحات">
      <button type="button" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        السابق
      </button>
      {pages[0] > 1 ? (
        <>
          <button type="button" onClick={() => onPageChange(1)}>
            1
          </button>
          <span>...</span>
        </>
      ) : null}
      {pages.map((page) => (
        <button
          type="button"
          key={page}
          className={page === currentPage ? 'active' : ''}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      {pages.at(-1) < totalPages ? (
        <>
          <span>...</span>
          <button type="button" onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </button>
        </>
      ) : null}
      <button type="button" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
        التالي
      </button>
    </nav>
  )
}
