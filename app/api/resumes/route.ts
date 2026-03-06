import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function serviceHeaders() {
  return {
    "Content-Type": "application/json",
    "apikey": SERVICE_KEY,
    "Authorization": `Bearer ${SERVICE_KEY}`,
  };
}

// GET /api/resumes?user_id=xxx  — load all resumes for a user
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id");
  if (!userId) return NextResponse.json({ error: "Missing user_id" }, { status: 400 });

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/saved_resumes?user_id=eq.${userId}&order=saved_at.desc`,
    { headers: serviceHeaders() }
  );
  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: data }, { status: res.status });
  return NextResponse.json(data);
}

// POST /api/resumes  — save a resume
export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/saved_resumes`,
    {
      method: "POST",
      headers: { ...serviceHeaders(), "Prefer": "return=minimal" },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const data = await res.text();
    return NextResponse.json({ error: data }, { status: res.status });
  }
  return NextResponse.json({ ok: true });
}

// DELETE /api/resumes?id=xxx  — delete a resume
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/saved_resumes?id=eq.${id}`,
    { method: "DELETE", headers: serviceHeaders() }
  );
  if (!res.ok) {
    const data = await res.text();
    return NextResponse.json({ error: data }, { status: res.status });
  }
  return NextResponse.json({ ok: true });
}
