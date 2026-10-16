import { useEffect, useMemo, useState } from 'react'
import { getFeaturedImage, getPostId, wpText } from '../utils/contentFormatters'

export function FeaturedCarousel({ onOpenArticle, posts }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const slides = useMemo(() => posts.filter(Boolean), [posts])
  const safeActiveIndex = slides.length ? activeIndex % slides.length : 0
  const activePost = slides[safeActiveIndex] || slides[0]

  useEffect(() => {
    if (slides.length <= 1) return undefined

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, 5000)

    return () => window.clearInterval(intervalId)
  }, [slides.length])

  if (!activePost) return null

  const image = getFeaturedImage(activePost)
  const title = wpText(activePost.title)
  const excerpt = wpText(activePost.excerpt) || wpText(activePost.content).slice(0, 180)

  return (
    <section className="featured-carousel">
      <button type="button" className="featured-slide" onClick={() => onOpenArticle(getPostId(activePost))}>
        <div className="featured-slide-image">
          {image ? <img src={image} alt="" /> : <span>Kora B</span>}
        </div>
        <div className="featured-slide-copy">
          <p className="eyebrow">أهم الأخبار</p>
          <h1>{title}</h1>
          <p>{excerpt || 'اضغط لقراءة تفاصيل الخبر.'}</p>
        </div>
      </button>

      {slides.length > 1 ? (
        <div className="featured-dots" aria-label="أخبار الكاروسيل">
          {slides.map((post, index) => (
            <button
              type="button"
              key={getPostId(post)}
              className={index === safeActiveIndex ? 'active' : ''}
              onClick={() => setActiveIndex(index)}
              aria-label={`عرض الخبر ${index + 1}`}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}
