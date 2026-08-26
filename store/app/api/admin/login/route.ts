import { NextRequest, NextResponse } from 'next/server';

const ADMIN_COOKIE = 'drip_admin_session';
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const sessionToken = process.env.ADMIN_SESSION_TOKEN || 'drip-admin-secret-2025';

    if (!password || password !== adminPassword) {
      // Small delay to prevent brute-force
      await new Promise(r => setTimeout(r, 500));
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });

    // Set httpOnly cookie — cannot be read by JavaScript on client
    response.cookies.set(ADMIN_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
