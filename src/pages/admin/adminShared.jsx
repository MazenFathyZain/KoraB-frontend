import { TeamLogo } from '../../components/TeamLogo'
import { clubName } from './adminUtils'

export function TeamBadge({ team }) {
  return (
    <span className="team-chip">
      <TeamLogo team={team} size="sm" />
      <span>{clubName(team)}</span>
    </span>
  )
}

export function AdminDataRow({ image, meta, onDelete, onEdit, title, children }) {
  return (
    <article className="admin-row">
      <div className="admin-row-main">
        {image !== undefined ? <span className="admin-thumb">{image ? <img src={image} alt="" loading="lazy" /> : title?.[0]}</span> : null}
        <div>
          <strong>{title}</strong>
          {meta ? <small>{meta}</small> : null}
        </div>
      </div>
      <div className="row-actions">
        {children}
        {onEdit ? <button type="button" onClick={onEdit}>تعديل</button> : null}
        {onDelete ? <button type="button" className="danger" onClick={onDelete}>حذف</button> : null}
      </div>
    </article>
  )
}

export function MessageBox({ message }) {
  if (!message) return null
  const isError = message.startsWith('تعذر') || message.startsWith('لا ')
  return <div className={isError ? 'form-error' : 'admin-message'}>{message}</div>
}
