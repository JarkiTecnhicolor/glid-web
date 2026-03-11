import Link from 'next/link'
import type { Doctor } from '@/types/api'

interface Props {
  doctor: Doctor
}

export function DoctorCard({ doctor }: Props) {
  const fullName = [doctor.lastName, doctor.firstName, doctor.middleName].filter(Boolean).join(' ')
  const initials = (doctor.firstName?.[0] ?? '') + (doctor.lastName?.[0] ?? '')

  return (
    <Link
      href={`/likari/${doctor.id}`}
      className="group flex gap-5 rounded-2xl bg-white border border-border p-5 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        boxShadow: '0 2px 12px rgba(0,60,30,0.07)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 28px rgba(0,60,30,0.13)'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 2px 12px rgba(0,60,30,0.07)'
      }}
    >
      {/* Avatar */}
      <div className="shrink-0">
        {doctor.photo ? (
          <img
            src={doctor.photo}
            alt={fullName}
            className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover"
          />
        ) : (
          <div
            className="w-24 h-24 md:w-28 md:h-28 rounded-2xl flex items-center justify-center text-3xl font-bold"
            style={{ background: 'oklch(0.920 0.042 151)', color: 'oklch(0.225 0.068 151)' }}
          >
            {initials}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
        <div>
          <div className="flex items-start gap-2 flex-wrap">
            <h3 className="font-semibold text-foreground text-base md:text-lg group-hover:text-primary transition-colors">
              {fullName}
            </h3>
            {doctor.isOnline && (
              <span
                className="inline-flex items-center gap-1 text-xs rounded-full px-2.5 py-0.5 font-medium shrink-0"
                style={{ background: 'oklch(0.920 0.042 151)', color: 'oklch(0.225 0.068 151)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-glid-green inline-block" />
                Онлайн
              </span>
            )}
          </div>

          {doctor.speciality && (
            <p className="mt-0.5 text-sm text-muted-foreground">{doctor.speciality}</p>
          )}

          <div className="mt-2.5 flex flex-wrap gap-3">
            {doctor.experience !== undefined && (
              <span className="inline-flex items-center gap-1.5 text-sm text-foreground/70 bg-muted rounded-lg px-2.5 py-1">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                {doctor.experience} р. досвіду
              </span>
            )}
            {doctor.facilityName && (
              <span className="inline-flex items-center gap-1.5 text-sm text-foreground/70 bg-muted rounded-lg px-2.5 py-1 max-w-[200px] truncate">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
                {doctor.facilityName}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 mt-1">
          {/* Rating */}
          <div className="flex items-center gap-1.5">
            {doctor.rating != null ? (
              <>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill={i < Math.round(doctor.rating!) ? 'oklch(0.548 0.128 151)' : 'none'}
                      stroke="oklch(0.548 0.128 151)"
                      strokeWidth="2"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-semibold text-foreground">{doctor.rating.toFixed(1)}</span>
                {doctor.reviewCount !== undefined && (
                  <span className="text-xs text-muted-foreground">({doctor.reviewCount})</span>
                )}
              </>
            ) : (
              <span className="text-xs text-muted-foreground">Немає відгуків</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {doctor.price !== undefined && (
              <span className="text-sm font-semibold text-foreground">від {doctor.price} грн</span>
            )}
            <span
              className="hidden sm:inline-flex items-center rounded-xl px-4 py-1.5 text-sm font-semibold text-white transition-all group-hover:opacity-90"
              style={{ background: 'oklch(0.548 0.128 151)' }}
            >
              Записатись
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
