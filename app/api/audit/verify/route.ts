import { NextResponse } from 'next/server';
import { ReplayEngine, AuditEvent } from '@/lib/engine/replay';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { events } = body as { events: AuditEvent[] };

    if (!events || !Array.isArray(events)) {
      return NextResponse.json({ error: 'Invalid payload: expected array of events' }, { status: 400 });
    }

    const engine = new ReplayEngine();
    const isValid = engine.reconstruct(events);

    if (isValid) {
      return NextResponse.json({
        status: 'VERIFIED',
        eventCount: events.length,
        history: engine.getDecisionHistory()
      });
    } else {
      return NextResponse.json({
        status: 'INVALID_CHAIN',
        error: 'Chain linkage validation failed'
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
