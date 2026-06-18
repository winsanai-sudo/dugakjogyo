# 대치 두각학원 문풀 선생님 지원 웹앱

지원자는 외부에서 지원서를 제출하고, 관리자는 로그인 후 지원자 목록, 이력서, 손글씨 풀이 1장을 확인하는 Next.js + Supabase 웹앱입니다.

## 프로젝트 구조

- `app/page.tsx`: 공개 지원자 입력 페이지
- `app/api/applications/route.ts`: 지원서 검증, 이력서/손글씨 풀이 업로드, DB 저장 API
- `app/complete/page.tsx`: 제출 완료 화면
- `app/admin/page.tsx`: 관리자 대시보드
- `app/admin/login/page.tsx`: 관리자 로그인 화면
- `app/api/admin/files/[id]/route.ts`: 관리자 인증 후 제출 파일 다운로드 링크 발급
- `lib/auth.ts`: 관리자 세션 쿠키 생성 및 검증
- `lib/supabaseAdmin.ts`: Supabase service role 서버 클라이언트
- `lib/validation.ts`: 전화번호, MBTI, 파일 확장자 검증
- `supabase/schema.sql`: Supabase 테이블, 인덱스, Storage 버킷 생성 SQL
- `render.yaml`: Render Web Service 배포 설정

## 지원자 업로드 파일

- 이력서: PDF, DOC, DOCX, HWP
- 손글씨 풀이 1장: PDF, JPG, PNG, WEBP, HEIC, HEIF
- 기본 파일 크기 제한: 파일당 10MB

## 환경변수

`.env.example`을 참고해 `.env.local`을 만듭니다.

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=resumes
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-this-strong-password
ADMIN_SESSION_SECRET=replace-with-at-least-32-random-characters
MAX_UPLOAD_MB=10
```

`SUPABASE_SERVICE_ROLE_KEY`는 서버에서만 사용해야 하며 브라우저에 노출하면 안 됩니다.

## Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트를 만듭니다.
2. Project Settings > API에서 `Project URL`과 `service_role key`를 확인합니다.
3. SQL Editor에서 `supabase/schema.sql` 내용을 실행합니다.
4. Storage에 `resumes` 버킷이 private으로 생성되었는지 확인합니다.

이미 이전 버전의 테이블을 만든 경우에도 `schema.sql`을 다시 실행하면 손글씨 풀이용 컬럼이 추가됩니다.

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

이미 3000번 포트를 쓰고 있다면 다음처럼 다른 포트를 지정할 수 있습니다.

```bash
npm run dev -- -p 3100
```

관리자 페이지는 `http://localhost:3000/admin`입니다. 로그인 계정은 환경변수 `ADMIN_USERNAME`, `ADMIN_PASSWORD`로 설정합니다.

## GitHub + Render 배포

이 앱은 지원서 제출 API와 관리자 페이지가 있으므로 Render에서는 `Static Site`가 아니라 `Web Service`로 배포합니다.

1. GitHub에 새 저장소를 만듭니다.
2. 이 프로젝트를 GitHub 저장소에 push합니다.
3. [Render](https://render.com)에서 New > Web Service를 선택합니다.
4. GitHub 저장소를 연결합니다.
5. Runtime은 `Node`, Build Command는 `npm install && npm run build`, Start Command는 `npm start`로 설정합니다.
6. Environment Variables에 `.env.example`의 값을 production 값으로 등록합니다.
7. Deploy를 누릅니다.
8. 배포가 끝나면 Render가 `https://서비스이름.onrender.com` 형태의 외부 접속 주소를 제공합니다.
9. 배포 주소의 `/admin`에 접속해 관리자 로그인을 확인합니다.

`render.yaml`이 포함되어 있어서 Render Blueprint로 배포할 수도 있습니다. 이 경우 Render가 기본 빌드/시작 명령과 환경변수 목록을 자동으로 읽습니다.

## 외부 접속 주소

Render 배포 전에는 외부 접속 주소가 없습니다. 배포 후 주소는 보통 다음 형태입니다.

```text
https://dugak-teacher-application.onrender.com
```

실제 주소는 Render 서비스 이름에 따라 달라집니다. 개인 도메인을 연결하면 `https://apply.example.com` 같은 주소도 사용할 수 있습니다.

## 운영 보안 체크리스트

- `ADMIN_PASSWORD`는 충분히 긴 임의 문자열로 설정합니다.
- `ADMIN_SESSION_SECRET`은 32자 이상 랜덤 문자열로 설정합니다.
- Supabase Storage 버킷은 반드시 private 상태로 둡니다.
- Supabase RLS는 켜둡니다. 앱 서버는 service role key로만 데이터에 접근합니다.
- Render 환경변수에 `SUPABASE_SERVICE_ROLE_KEY`를 등록하되, `NEXT_PUBLIC_` 접두사를 붙이지 않습니다.
- 제출 파일 제한은 기본 10MB이며 `MAX_UPLOAD_MB`로 조정할 수 있습니다.
