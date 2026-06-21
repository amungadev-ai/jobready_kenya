import { NextResponse } from 'next/server';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, frequency } = body;

    // Validate email is present
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate frequency if provided
    const validFrequencies = ['daily', 'weekly'];
    if (frequency && !validFrequencies.includes(frequency)) {
      return NextResponse.json(
        { error: 'Frequency must be "daily" or "weekly"' },
        { status: 400 }
      );
    }

    // Stub: log and return success (actual email sending is deferred)
    console.log(`[Newsletter] New subscription: ${email}, frequency: ${frequency ?? 'weekly'}`);

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to the newsletter',
    });
  } catch (error) {
    console.error('Subscribe API error:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}
