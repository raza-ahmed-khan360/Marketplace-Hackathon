import { NextRequest, NextResponse } from 'next/server';
import { WebhookEvent } from '@clerk/clerk-sdk-node';
import { Webhook } from 'svix';

const handler = async (event: WebhookEvent) => {
  const { type, data } = event;

  if (type === 'user.created' || type === 'user.updated') {
    const user = data;
    // Process the user data as needed
  }
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headers = Object.fromEntries(req.headers.entries());

    const svix = new Webhook(process.env.CLERK_WEBHOOK_SECRET as string);
    const event = svix.verify(body, headers) as WebhookEvent;

    await handler(event);

    return NextResponse.json({ message: 'Success' });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }
}
