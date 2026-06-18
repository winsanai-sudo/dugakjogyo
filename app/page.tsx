"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { mbtiTypes } from "@/lib/validation";

export default function ApplicantPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "제출 중 문제가 발생했습니다.");
        return;
      }

      router.push("/complete");
    } catch {
      setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="kicker">DUGAK ACADEMY RECRUIT</div>
        <h1>대치 두각학원 문풀 선생님 지원</h1>
        <p className="lead">
          학생의 풀이 과정을 섬세하게 읽고, 정확한 피드백으로 성장을 돕는 선생님을 기다립니다.
        </p>
      </section>

      <form className="card form-card" onSubmit={handleSubmit}>
        {error ? <div className="alert">{error}</div> : null}

        <div className="grid">
          <div className="field">
            <label htmlFor="name">이름</label>
            <input id="name" name="name" placeholder="홍길동" required maxLength={40} />
          </div>

          <div className="field">
            <label htmlFor="phone">전화번호</label>
            <input
              id="phone"
              name="phone"
              placeholder="010-1234-5678"
              inputMode="tel"
              required
              maxLength={20}
            />
          </div>

          <div className="field full">
            <label htmlFor="address">주소</label>
            <textarea id="address" name="address" placeholder="도로명 주소와 상세 주소" required maxLength={220} />
          </div>

          <div className="field">
            <label htmlFor="mbti">MBTI</label>
            <select id="mbti" name="mbti" required defaultValue="">
              <option value="" disabled>
                선택해주세요
              </option>
              {mbtiTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="resume">이력서 파일</label>
            <input id="resume" name="resume" type="file" accept=".pdf,.doc,.docx,.hwp" required />
            <p className="hint">PDF, DOC, DOCX, HWP 파일을 업로드할 수 있습니다. 기본 제한은 10MB입니다.</p>
          </div>

          <div className="field full">
            <label htmlFor="solution">손글씨 풀이 1장</label>
            <input id="solution" name="solution" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.heif" required />
            <p className="hint">
              패드 필기, 노트 사진, 스캔본 모두 가능합니다. PDF, JPG, PNG, WEBP, HEIC 파일을 업로드해주세요.
            </p>
          </div>
        </div>

        <label className="consent">
          <input name="privacyConsent" type="checkbox" value="yes" required />
          <span>지원 검토를 위한 개인정보 수집 및 제출 파일 보관에 동의합니다.</span>
        </label>

        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "제출 중..." : "지원서 제출"}
        </button>
      </form>
    </main>
  );
}
