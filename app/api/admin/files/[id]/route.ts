import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const fileType = request.nextUrl.searchParams.get("type");
  if (fileType !== "resume" && fileType !== "solution") {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  const { id } = await params;
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("applications")
    .select("resume_path,original_file_name,solution_path,original_solution_file_name")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const path = fileType === "resume" ? data.resume_path : data.solution_path;
  const fileName = fileType === "resume" ? data.original_file_name : data.original_solution_file_name;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "resumes";
  const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(path, 60, {
      download: fileName
    });

  if (signedUrlError || !signedUrlData?.signedUrl) {
    return NextResponse.json({ error: "Could not create download link" }, { status: 500 });
  }

  return NextResponse.redirect(signedUrlData.signedUrl);
}
