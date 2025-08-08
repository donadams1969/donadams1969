HIGH_RISK = {"IR", "KP", "SY", "RU"}  # example only

def velocity(user_id: int, minutes: int) -> int:
    # TODO: query recent transfers; return count
    return 0

def sanctions_hit(beneficiary) -> bool:
    # TODO: integrate with provider; stub false
    return False

def risk_score(ctx) -> int | str:
    score = 0
    if ctx['amount'] > ctx['tenant_limits']['high_value']:
        score += 40
    if ctx.get('counterparty_country') in HIGH_RISK:
        score += 30
    if velocity(ctx.get('user_id', 0), 24*60) > 3:
        score += 20
    if ctx.get('created_via_agent'):
        score += 10
    if sanctions_hit(ctx.get('beneficiary')):
        return "BLOCK"
    return score
