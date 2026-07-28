import { NextResponse } from 'next/server';
import {
  VerifyRequest,
  VerifyResponse,
  decideVisibility,
  ReceiptV1,
} from '@/lib/protocol/verify-contract';

function simpleHash(input: string): string {
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }

  return `0x${Math.abs(hash).toString(16)}`;
}

export async function POST(request: Request) {
  const body = (await request.json()) as VerifyRequest;

  const decision = decideVisibility(body.signal);

  const receipt: ReceiptV1 = {
    receiptVersion: 'v1',
    signalId: body.signal.id,
    decision,
    receiptHash: simpleHash(JSON.stringify({ signal: body.signal, decision })),
    createdAt: new Date().toISOString(),
  };

  const response: VerifyResponse = {
    signal: body.signal,
    decision,
    receipt,
  };

  return NextResponse.json(response);
}
