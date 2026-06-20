import { NextResponse } from "next/server";
import crypto from "crypto";
import { getMaxUploadBytes } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import {
  getFileExtension,
  isAllowedResumeFile,
  isAllowedSolutionFile,
  isValidLessonType,
  isValidKoreanPhone,
  mbtiTypes
} from "@/lib/validation";

export const runtime = "nodejs";

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = readText(formData, "name");
    const phone = readText(formData, "phone");
    const school = readText(formData, "school");
    const birthYear = readText(formData, "birthYear");
    const address = readText(formData, "address");
    const introduction = readText(formData, "introduction");
    const lessonTypes = formData.getAll("lessonTypes").filter((value): value is string => typeof value === "string");
    const mbti = readText(formData, "mbti").toUpperCase();
    const privacyConsent = readText(formData, "privacyConsent");
    const resume = formData.get("resume");
    const solution = formData.get("solution");

    if (!name || !phone || !school || !birthYear || !address || !introduction || !mbti) {
      return NextResponse.json({ error: "필수 항목을 모두 입력해주세요." }, { status: 400 });
    }

    if (!isValidKoreanPhone(phone)) {
      return NextResponse.json({ error: "전화번호 형식을 확인해주세요." }, { status: 400 });
    }

    if (!/^(19|20)\d{2}$/.test(birthYear)) {
      return NextResponse.json({ error: "몇년생은 4자리 출생연도로 입력해주세요." }, { status: 400 });
    }

    if (introduction.length > 900) {
      return NextResponse.json({ error: "자기소개는 900자 이내로 입력해주세요." }, { status: 400 });
    }

    if (lessonTypes.length === 0 || lessonTypes.some((lessonType) => !isValidLessonType(lessonType))) {
      return NextResponse.json({ error: "가능한 문풀 종류를 선택해주세요." }, { status: 400 });
    }

    if (!mbtiTypes.includes(mbti as (typeof mbtiTypes)[number])) {
      return NextResponse.json({ error: "MBTI를 선택해주세요." }, { status: 400 });
    }

    if (privacyConsent !== "yes") {
      return NextResponse.json({ error: "개인정보 수집 동의가 필요합니다." }, { status: 400 });
    }

    if (!(resume instanceof File) || resume.size === 0) {
      return NextResponse.json({ error: "이력서 파일을 업로드해주세요." }, { status: 400 });
    }

    const maxUploadBytes = getMaxUploadBytes();
    if (resume.size > maxUploadBytes) {
      return NextResponse.json(
        { error: `파일 크기는 ${Math.floor(maxUploadBytes / 1024 / 1024)}MB 이하로 업로드해주세요.` },
        { status: 400 }
      );
    }

    if (!isAllowedResumeFile(resume.name)) {
      return NextResponse.json({ error: "PDF, DOC, DOCX, HWP 파일만 업로드할 수 있습니다." }, { status: 400 });
    }

    if (!(solution instanceof File) || solution.size === 0) {
      return NextResponse.json({ error: "손글씨 풀이 1장을 업로드해주세요." }, { status: 400 });
    }

    if (solution.size > maxUploadBytes) {
      return NextResponse.json(
        { error: `손글씨 풀이 파일은 ${Math.floor(maxUploadBytes / 1024 / 1024)}MB 이하로 업로드해주세요.` },
        { status: 400 }
      );
    }

    if (!isAllowedSolutionFile(solution.name)) {
      return NextResponse.json(
        { error: "손글씨 풀이는 PDF, JPG, PNG, WEBP, HEIC 파일만 업로드할 수 있습니다." },
        { status: 400 }
      );
    }

    const dateFolder = new Date().toISOString().slice(0, 10);
    const resumeStoragePath = `${dateFolder}/resume-${crypto.randomUUID()}${getFileExtension(resume.name)}`;
    const solutionStoragePath = `${dateFolder}/solution-${crypto.randomUUID()}${getFileExtension(solution.name)}`;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "resumes";
    const resumeBuffer = Buffer.from(await resume.arrayBuffer());
    const solutionBuffer = Buffer.from(await solution.arrayBuffer());
    const supabaseAdmin = getSupabaseAdmin();

    const { error: uploadError } = await supabaseAdmin.storage.from(bucket).upload(resumeStoragePath, resumeBuffer, {
      contentType: resume.type || "application/octet-stream",
      upsert: false
    });

    if (uploadError) {
      return NextResponse.json({ error: "파일 업로드에 실패했습니다. 다시 시도해주세요." }, { status: 500 });
    }

    const { error: solutionUploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(solutionStoragePath, solutionBuffer, {
        contentType: solution.type || "application/octet-stream",
        upsert: false
      });

    if (solutionUploadError) {
      await supabaseAdmin.storage.from(bucket).remove([resumeStoragePath]);
      return NextResponse.json({ error: "손글씨 풀이 파일 업로드에 실패했습니다. 다시 시도해주세요." }, { status: 500 });
    }

    const { error: insertError } = await supabaseAdmin.from("applications").insert({
      name,
      phone,
      school,
      birth_year: birthYear,
      address,
      introduction,
      lesson_types: lessonTypes,
      mbti,
      resume_path: resumeStoragePath,
      original_file_name: resume.name,
      solution_path: solutionStoragePath,
      original_solution_file_name: solution.name
    });

    if (insertError) {
      await supabaseAdmin.storage.from(bucket).remove([resumeStoragePath, solutionStoragePath]);
      return NextResponse.json({ error: "지원서 저장에 실패했습니다. 다시 시도해주세요." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "제출 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
