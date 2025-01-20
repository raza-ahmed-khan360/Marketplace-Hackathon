import { NextResponse } from 'next/server';
import { googleOAuthClient } from '../../../../../lib/auth/google';
import { createUser, getUserByEmail } from '../../../../../lib/api/user';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    // Get tokens from Google
    const { tokens } = await googleOAuthClient.getToken(code);
    googleOAuthClient.setCredentials(tokens);

    // Get user info from Google
    const userInfoResponse = await googleOAuthClient.request({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo',
    });

    const userData = userInfoResponse.data;

    // Check if user exists in our database
    const [existingUser] = await getUserByEmail(userData.email);

    if (existingUser) {
      // Update existing user if needed
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}?token=${tokens.access_token}`);
    }

    // Create new user if they don't exist
    const [newUser, error] = await createUser({
      name: userData.name,
      email: userData.email,
      image: userData.picture,
    });

    if (error) {
      throw error;
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}?token=${tokens.access_token}`);
  } catch (error) {
    console.error('Google OAuth Error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 