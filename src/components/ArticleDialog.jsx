import { formatDate, getFeaturedImage, wpText } from '../utils/contentFormatters'

export function ArticleDialog({ article, loading, onClose }) {
  if (!article && !loading) return null

  const image = getFeaturedImage(article)

  return (
    <div className="dialog-backdrop" onMouseDown={onClose} role="presentation">
      <article className="article-dialog" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <button type="button" className="close-button" onClick={onClose} aria-label="إغلاق">
          ×
        </button>
        {loading ? (
          <div className="loader">جاري تحميل الخبر...</div>
        ) : (
          <>
            {image ? <img src={image} alt="" /> : null}
            <time>{formatDate(article.date || article.publishedAt)}</time>
            <h2>{wpText(article.title)}</h2>
            <p>{wpText(article.content) || wpText(article.excerpt)}</p>
          </>
        )}
      </article>
    </div>
  )
}
