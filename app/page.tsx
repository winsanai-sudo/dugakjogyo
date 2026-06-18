"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { mbtiTypes } from "@/lib/validation";

const copy = {
  title: "\ub300\uce58 \ub450\uac01\ud559\uc6d0 \ubb38\ud480 \uc120\uc0dd\ub2d8 \uc9c0\uc6d0",
  eyebrow: "DUGAK ACADEMY RECRUIT",
  brand: "\ub450\uac01",
  badge: "\ubb38\ud480 \uc120\uc0dd\ub2d8 \ucc44\uc6a9",
  lead:
    "\ud480\uc774\ub97c \uc815\ud655\ud788 \uc77d\uace0, \ud559\uc0dd\uc758 \uc0ac\uace0\ub97c \ub354 \ub0a0\uce74\ub86d\uac8c \ub9cc\ub4dc\ub294 \uc120\uc0dd\ub2d8\uc744 \uae30\ub2e4\ub9bd\ub2c8\ub2e4.",
  subLead:
    "\uac04\uacb0\ud55c \uc815\ubcf4\uc640 \uc774\ub825\uc11c, \uc190\uae00\uc528 \ud480\uc774 1\uc7a5\ub9cc \uc81c\ucd9c\ud558\uba74 \uc9c0\uc6d0\uc774 \uc644\ub8cc\ub429\ub2c8\ub2e4.",
  name: "\uc774\ub984",
  namePlaceholder: "\ud64d\uae38\ub3d9",
  phone: "\uc804\ud654\ubc88\ud638",
  school: "\ud559\uad50",
  schoolPlaceholder: "\uc7ac\ud559/\uc878\uc5c5 \ud559\uad50\uba85",
  birthYear: "\uba87\ub144\uc0dd",
  birthYearPlaceholder: "2003",
  address: "\uc8fc\uc18c",
  addressPlaceholder: "\ub3c4\ub85c\uba85 \uc8fc\uc18c\uc640 \uc0c1\uc138 \uc8fc\uc18c",
  introduction: "\uc790\uae30\uc18c\uac1c",
  introductionPlaceholder:
    "\ubb38\ud480 \uc120\uc0dd\ub2d8\uc73c\ub85c\uc11c\uc758 \uac15\uc810, \ud559\uc0dd\uc744 \ub300\ud558\ub294 \ubc29\uc2dd, \uac00\ub2a5\ud55c \uacfc\ubaa9/\uc2dc\uac04\ub300\ub97c \uac04\ub2e8\ud788 \uc801\uc5b4\uc8fc\uc138\uc694.",
  choose: "\uc120\ud0dd\ud574\uc8fc\uc138\uc694",
  resume: "\uc774\ub825\uc11c \ud30c\uc77c",
  resumeHint: "PDF, DOC, DOCX, HWP \ud30c\uc77c\uc744 \uc5c5\ub85c\ub4dc\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4. \uae30\ubcf8 \uc81c\ud55c\uc740 10MB\uc785\ub2c8\ub2e4.",
  solution: "\uc190\uae00\uc528 \ud480\uc774 1\uc7a5",
  solutionHint:
    "\ud328\ub4dc \ud544\uae30, \ub178\ud2b8 \uc0ac\uc9c4, \uc2a4\uce94\ubcf8 \ubaa8\ub450 \uac00\ub2a5\ud569\ub2c8\ub2e4. PDF, JPG, PNG, WEBP, HEIC \ud30c\uc77c\uc744 \uc5c5\ub85c\ub4dc\ud574\uc8fc\uc138\uc694.",
  consent:
    "\uc9c0\uc6d0 \uac80\ud1a0\ub97c \uc704\ud55c \uac1c\uc778\uc815\ubcf4 \uc218\uc9d1 \ubc0f \uc81c\ucd9c \ud30c\uc77c \ubcf4\uad00\uc5d0 \ub3d9\uc758\ud569\ub2c8\ub2e4.",
  submit: "\uc9c0\uc6d0\uc11c \uc81c\ucd9c",
  submitting: "\uc81c\ucd9c \uc911...",
  submitError: "\uc81c\ucd9c \uc911 \ubb38\uc81c\uac00 \ubc1c\uc0dd\ud588\uc2b5\ub2c8\ub2e4.",
  networkError: "\ub124\ud2b8\uc6cc\ud06c \uc624\ub958\uac00 \ubc1c\uc0dd\ud588\uc2b5\ub2c8\ub2e4. \uc7a0\uc2dc \ud6c4 \ub2e4\uc2dc \uc2dc\ub3c4\ud574\uc8fc\uc138\uc694."
};

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
        setError(result.error ?? copy.submitError);
        return;
      }

      router.push("/complete");
    } catch {
      setError(copy.networkError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="brand-row">
          <div className="brand-mark" aria-hidden="true">
            D
          </div>
          <div>
            <div className="brand-name">{copy.brand}</div>
            <div className="kicker">{copy.eyebrow}</div>
          </div>
        </div>

        <div className="hero-layout">
          <div className="hero-copy">
            <span className="hero-badge">{copy.badge}</span>
            <h1>{copy.title}</h1>
            <p className="lead">{copy.lead}</p>
            <p className="sub-lead">{copy.subLead}</p>
          </div>
          <div className="hero-panel" aria-hidden="true">
            <div className="panel-label">DUGAK STANDARD</div>
            <div className="panel-score">01</div>
            <div className="panel-line" />
            <div className="panel-caption">Precision Feedback · Student Growth</div>
          </div>
        </div>
      </section>

      <form className="card form-card" onSubmit={handleSubmit}>
        {error ? <div className="alert">{error}</div> : null}

        <div className="form-header">
          <div>
            <div className="section-label">APPLICATION</div>
            <h2>{copy.badge}</h2>
          </div>
          <span className="required-note">All fields required</span>
        </div>

        <div className="grid">
          <div className="field">
            <label htmlFor="name">{copy.name}</label>
            <input id="name" name="name" placeholder={copy.namePlaceholder} required maxLength={40} />
          </div>

          <div className="field">
            <label htmlFor="phone">{copy.phone}</label>
            <input
              id="phone"
              name="phone"
              placeholder="010-1234-5678"
              inputMode="tel"
              required
              maxLength={20}
            />
          </div>

          <div className="field">
            <label htmlFor="school">{copy.school}</label>
            <input id="school" name="school" placeholder={copy.schoolPlaceholder} required maxLength={80} />
          </div>

          <div className="field">
            <label htmlFor="birthYear">{copy.birthYear}</label>
            <input
              id="birthYear"
              name="birthYear"
              placeholder={copy.birthYearPlaceholder}
              inputMode="numeric"
              required
              minLength={4}
              maxLength={4}
            />
          </div>

          <div className="field full">
            <label htmlFor="address">{copy.address}</label>
            <textarea id="address" name="address" placeholder={copy.addressPlaceholder} required maxLength={220} />
          </div>

          <div className="field full">
            <label htmlFor="introduction">{copy.introduction}</label>
            <textarea
              id="introduction"
              name="introduction"
              placeholder={copy.introductionPlaceholder}
              required
              maxLength={900}
            />
            <p className="hint">900\uc790 \uc774\ub0b4\ub85c \uc791\uc131\ud574\uc8fc\uc138\uc694.</p>
          </div>

          <div className="field">
            <label htmlFor="mbti">MBTI</label>
            <select id="mbti" name="mbti" required defaultValue="">
              <option value="" disabled>
                {copy.choose}
              </option>
              {mbtiTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="resume">{copy.resume}</label>
            <input id="resume" name="resume" type="file" accept=".pdf,.doc,.docx,.hwp" required />
            <p className="hint">{copy.resumeHint}</p>
          </div>

          <div className="field full">
            <label htmlFor="solution">{copy.solution}</label>
            <input id="solution" name="solution" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.heif" required />
            <p className="hint">{copy.solutionHint}</p>
          </div>
        </div>

        <label className="consent">
          <input name="privacyConsent" type="checkbox" value="yes" required />
          <span>{copy.consent}</span>
        </label>

        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? copy.submitting : copy.submit}
        </button>
      </form>
    </main>
  );
}
