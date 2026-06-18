"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: formData.get("username"),
          password: formData.get("password")
        })
      });

      if (!response.ok) {
        setError("관리자 계정 정보를 확인해주세요.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-wrap">
      <form className="card login-card stack" onSubmit={handleSubmit}>
        <div>
          <div className="kicker">ADMIN ONLY</div>
          <h1>관리자 로그인</h1>
          <p className="hint">지원자 개인정보 보호를 위해 관리자 인증이 필요합니다.</p>
        </div>

        {error ? <div className="alert">{error}</div> : null}

        <div className="field">
          <label htmlFor="username">아이디</label>
          <input id="username" name="username" autoComplete="username" required />
        </div>

        <div className="field">
          <label htmlFor="password">비밀번호</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>

        <button className="primary-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "확인 중..." : "로그인"}
        </button>
      </form>
    </main>
  );
}
