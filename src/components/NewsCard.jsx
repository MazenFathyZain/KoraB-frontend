import { formatDate, getFeaturedImage, getPostId, wpText } from '../utils/contentFormatters'

export function NewsCard({ onOpen, post }) {
  const id = getPostId(post)
  const image = getFeaturedImage(post)
  const title = wpText(post.title) || post.title || 'خبر بدون عنوان'
  const excerpt = wpText(post.excerpt) || wpText(post.content).slice(0, 180)

  return (
    <article className="news-card">
      <button type="button" onClick={() => onOpen(id)}>
        <div className="news-image">{image ? <img src={image} alt="" loading="lazy" /> : <span>Kora B</span>}</div>
        <div className="news-copy">
          <time>{formatDate(post.date || post.publishedAt)}</time>
          <h3>{title}</h3>
          <p>{excerpt || 'لا يوجد ملخص متاح لهذا الخبر.'}</p>
        </div>
      </button>
    </article>
  )
}
