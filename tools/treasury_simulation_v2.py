import argparse

def calculate_tsv(vault_values):
    """Calculates the Total System Value (TSV) from a dictionary of vault values."""
    return sum(vault_values.values())

def calculate_effective_tsv(tsv, omega_supremacy):
    """Calculates the effective TSV with the Supremacy Lock adjustment."""
    return tsv * (1 + (omega_supremacy / 100))

def main():
    """
    Main function to run the VALORAIPLUS Treasury Valuation Simulation.
    """
    parser = argparse.ArgumentParser(
        description="VALORAIPLUS Treasury Valuation Simulation Tool v2",
        formatter_class=argparse.RawTextHelpFormatter
    )

    parser.add_argument('--q-gillgold', type=float, default=50000000, help='Notional quantity of GILLGOLD')
    parser.add_argument('--p-gold', type=float, default=2300, help='Synthetic price of gold')
    parser.add_argument('--k-trust', type=float, default=0.9, help='Trust factor for GILLGOLD (0-1)')

    parser.add_argument('--q-gillbtc', type=float, default=100000000, help='Notional quantity of GILLBTC')
    parser.add_argument('--p-btc', type=float, default=60000, help='Synthetic price of BTC')
    parser.add_argument('--k-corridor', type=float, default=0.95, help='Corridor factor for GILLBTC (0-1)')

    parser.add_argument('--omega', type=float, default=15, help='Supremacy Lock adjustment percentage (Ω_supremacy)')

    # You can add more arguments here for other vault components
    # For now, we'll use the base scenario values for the other vaults

    args = parser.parse_args()

    vaults = {
        "V_genesis": 5000000,
        "V_saint_paul": 2500000,
        "V_op25": 1000000,
        "V_quantummax": 10000000,
        "V_donny_jaxx": 10000000,
        "V_eden": 2000000,
        "V_salem": 3000000,
        "V_zion": 5000000,
    }

    vaults["V_gillgold"] = args.q_gillgold * args.p_gold * args.k_trust
    vaults["V_gillbtc"] = args.q_gillbtc * args.p_btc * args.k_corridor

    raw_tsv = calculate_tsv(vaults)
    effective_tsv = calculate_effective_tsv(raw_tsv, args.omega)

    print("📊 VALORAIPLUS Treasury Valuation Snapshot (v5152-E)")
    print("-" * 50)
    for vault, value in vaults.items():
        print(f"- {vault:<15} = ${value:,.2f}")
    print("-" * 50)
    print(f"**Raw TSV:**")
    print(f"TSV = Σ V_* = **${raw_tsv:,.2f}**")
    print("\n**Supremacy Lock Adjustment:**")
    print(f"Ω_supremacy = {args.omega}%")
    print(f"TSV_effective = TSV × (1 + Ω_supremacy) = **${effective_tsv:,.2f}**")


if __name__ == "__main__":
    main()
