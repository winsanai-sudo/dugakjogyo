import Link from "next/link";

export default function CompletePage() {
  return (
    <main className="success-wrap">
      <section className="card success-card">
        <div className="success-mark">✓</div>
        <h1>지원이 완료되었습니다</h1>
        <p className="lead">
          대치 두각학원 문풀 선생님 지원서가 정상적으로 접수되었습니다. 검토 후 필요한 경우 연락드리겠습니다.
        </p>
        <Link className="secondary-button" href="/" style={{ marginTop: 24 }}>
          처음 화면으로
        </Link>
      </section>
    </main>
  );
}
