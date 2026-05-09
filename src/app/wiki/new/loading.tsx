export default function Loading() {
  return (
    <div
      style={{ maxWidth: '800px', margin: '0 auto', padding: '5rem 1.5rem', textAlign: 'center' }}
    >
      <div
        style={{
          color: 'var(--text-muted)',
          fontSize: '1.2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
        }}
      >
        <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
        문서 작성 페이지를 불러오는 중...
      </div>
    </div>
  )
}
