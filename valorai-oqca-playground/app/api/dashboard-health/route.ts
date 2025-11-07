import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const healthApiUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/health`;

  try {
    const response = await fetch(healthApiUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.VALOR_AUTH_TOKEN_SECRET}`,
        'X-Valor-Seed': `${process.env.VALOR_SEED_SECRET}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Failed to fetch health status: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
