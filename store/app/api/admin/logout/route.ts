import { NextResponse } from 'next/server';

const ADMIN_COOKIE = 'drip_admin_session';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(ADMIN_COOKIE);
  return response;
}
