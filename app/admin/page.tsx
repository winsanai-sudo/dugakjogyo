import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { ApplicationRow, getSupabaseAdmin } from "@/lib/supabaseAdmin";
import AdminDashboard from "./AdminDashboard";
import { logoutAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { data, error } = await getSupabaseAdmin()
    .from("applications")
    .select(
      "id,name,phone,school,birth_year,address,introduction,lesson_types,mbti,resume_path,original_file_name,solution_path,original_solution_file_name,created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("지원자 목록을 불러오지 못했습니다.");
  }

  return (
    <main className="admin-shell">
      <header className="admin-top">
        <div>
          <div className="kicker">DUGAK DASHBOARD</div>
          <h1>지원자 관리</h1>
          <p className="hint">최신 제출순으로 정렬됩니다. 검색과 MBTI 필터를 함께 사용할 수 있습니다.</p>
        </div>
        <form action={logoutAction}>
          <button className="danger-button" type="submit">
            로그아웃
          </button>
        </form>
      </header>
      <AdminDashboard applications={(data ?? []) as ApplicationRow[]} />
    </main>
  );
}
