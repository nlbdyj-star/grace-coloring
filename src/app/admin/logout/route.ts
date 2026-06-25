import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect(new URL("/admin/login", "https://grace-coloring-plum.vercel.app"));
  response.cookies.set("admin_session", "", { maxAge: 0, path: "/" });
  return response;
}
