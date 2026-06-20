"use client";

import { useMemo, useState } from "react";
import type { ApplicationRow } from "@/lib/supabaseAdmin";
import { mbtiTypes } from "@/lib/validation";

type Props = {
  applications: ApplicationRow[];
};

const text = {
  search: "\uac80\uc0c9",
  searchPlaceholder: "\uc774\ub984, \uc804\ud654\ubc88\ud638, \ud559\uad50, MBTI \uac80\uc0c9",
  mbtiFilter: "MBTI \ud544\ud130",
  allMbti: "\uc804\uccb4 MBTI",
  name: "\uc774\ub984",
  phone: "\uc804\ud654\ubc88\ud638",
  school: "\ud559\uad50",
  birthYear: "\uba87\ub144\uc0dd",
  address: "\uc8fc\uc18c",
  introduction: "\uc790\uae30\uc18c\uac1c",
  lessonTypes: "\ubb38\ud480 \uc885\ub958",
  submittedAt: "\uc81c\ucd9c\uc77c\uc2dc",
  resume: "\uc774\ub825\uc11c",
  solution: "\uc190\uae00\uc528 \ud480\uc774",
  download: "\ub2e4\uc6b4\ub85c\ub4dc",
  empty: "\ud45c\uc2dc\ud560 \uc9c0\uc6d0\uc790\uac00 \uc5c6\uc2b5\ub2c8\ub2e4."
};

const lessonTypeLabels: Record<string, string> = {
  probability_statistics: "\ud655\ub960\uacfc\ud1b5\uacc4 · \uc624\ud6c4 1:30",
  calculus1: "\ubbf8\uc801\ubd841 · \uc800\ub141 6:30"
};

function formatLessonTypes(values?: string[] | null) {
  if (!values?.length) {
    return "-";
  }

  return values.map((value) => lessonTypeLabels[value] ?? value).join("\n");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul"
  }).format(new Date(value));
}

export default function AdminDashboard({ applications }: Props) {
  const [query, setQuery] = useState("");
  const [mbti, setMbti] = useState("");

  const filteredApplications = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesQuery =
        !trimmedQuery ||
        application.name.toLowerCase().includes(trimmedQuery) ||
        application.phone.toLowerCase().includes(trimmedQuery) ||
        application.school.toLowerCase().includes(trimmedQuery) ||
        formatLessonTypes(application.lesson_types).toLowerCase().includes(trimmedQuery) ||
        application.mbti.toLowerCase().includes(trimmedQuery);
      const matchesMbti = !mbti || application.mbti === mbti;
      return matchesQuery && matchesMbti;
    });
  }, [applications, mbti, query]);

  return (
    <>
      <section className="card toolbar">
        <input
          aria-label={text.search}
          placeholder={text.searchPlaceholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select aria-label={text.mbtiFilter} value={mbti} onChange={(event) => setMbti(event.target.value)}>
          <option value="">{text.allMbti}</option>
          {mbtiTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </section>

      <section className="card table-card">
        <table>
          <thead>
            <tr>
              <th>{text.name}</th>
              <th>{text.phone}</th>
              <th>{text.school}</th>
              <th>{text.birthYear}</th>
              <th>{text.address}</th>
              <th>{text.introduction}</th>
              <th>{text.lessonTypes}</th>
              <th>MBTI</th>
              <th>{text.submittedAt}</th>
              <th>{text.resume}</th>
              <th>{text.solution}</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((application) => (
              <tr key={application.id}>
                <td>{application.name}</td>
                <td>{application.phone}</td>
                <td>{application.school}</td>
                <td>{application.birth_year}</td>
                <td>{application.address}</td>
                <td className="long-text">{application.introduction}</td>
                <td className="lesson-cell">{formatLessonTypes(application.lesson_types)}</td>
                <td>{application.mbti}</td>
                <td>{formatDate(application.created_at)}</td>
                <td>
                  <div className="file-cell">
                    <span className="muted">{application.original_file_name}</span>
                    <a className="secondary-button" href={`/api/admin/files/${application.id}?type=resume`}>
                      {text.download}
                    </a>
                  </div>
                </td>
                <td>
                  <div className="file-cell">
                    <span className="muted">{application.original_solution_file_name}</span>
                    <a className="secondary-button" href={`/api/admin/files/${application.id}?type=solution`}>
                      {text.download}
                    </a>
                  </div>
                </td>
              </tr>
            ))}
            {filteredApplications.length === 0 ? (
              <tr>
                <td colSpan={11} className="muted">
                  {text.empty}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </>
  );
}
