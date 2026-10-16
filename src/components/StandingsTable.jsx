import { TeamLogo } from './TeamLogo'

const FORM_LABELS = { W: 'ف', D: 'ت', L: 'خ' }

export function StandingsTable({ rows, compact = false, onOpenClub }) {
  if (!rows.length) {
    return (
      <div className="empty-state">
        <strong>لا يوجد ترتيب بعد</strong>
        <span>الترتيب يظهر بعد انتهاء أول مباراة.</span>
      </div>
    )
  }

  return (
    <div className="table-scroll">
      <table className={`standings-table ${compact ? 'compact' : ''}`}>
        <thead>
          <tr>
            <th>#</th>
            <th className="team-col">الفريق</th>
            <th title="لعب">لعب</th>
            {compact ? null : <th title="فوز">ف</th>}
            {compact ? null : <th title="تعادل">ت</th>}
            {compact ? null : <th title="خسارة">خ</th>}
            {compact ? null : <th title="له">له</th>}
            {compact ? null : <th title="عليه">عليه</th>}
            <th title="فارق الأهداف">+/-</th>
            <th title="النقاط">نقاط</th>
            {compact ? null : <th className="form-col">آخر 5</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.team.id}>
              <td><span className={`rank rank-${row.position}`}>{row.position}</span></td>
              <td className="team-col">
                <button type="button" className="team-link" onClick={() => onOpenClub?.(row.team.id)}>
                  <TeamLogo team={row.team} size="sm" />
                  <span>{row.team.name}</span>
                </button>
              </td>
              <td>{row.played}</td>
              {compact ? null : <td>{row.won}</td>}
              {compact ? null : <td>{row.drawn}</td>}
              {compact ? null : <td>{row.lost}</td>}
              {compact ? null : <td>{row.goalsFor}</td>}
              {compact ? null : <td>{row.goalsAgainst}</td>}
              <td dir="ltr">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
              <td><b className="points">{row.points}</b></td>
              {compact ? null : (
                <td className="form-col">
                  <span className="form-list">
                    {row.form.map((result, index) => (
                      <i key={index} className={`form-${result}`}>{FORM_LABELS[result]}</i>
                    ))}
                  </span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
