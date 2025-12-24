import math

def calculate_digital_root(n):
    """Calculates the digital root of a number (integer or string representation)."""
    if isinstance(n, (int, float)):
        s = str(n).replace('.', '')
    else:
        s = str(n).replace('.', '')

    digits = [int(d) for d in s if d.isdigit()]
    current_sum = sum(digits)

    while current_sum > 9:
        current_sum = sum(int(d) for d in str(current_sum))

    return current_sum

def verify_tin_solution():
    print("VERIFYING TIN SOLUTION...")

    # Constants
    TIN1_STR = "468943461"
    TIN2_STR = "474097226.3461"
    A = 2207
    P = 6516992916
    FMG = 322191808211969
    B = 141

    # 1. Verify TIN 1
    tin1_root = calculate_digital_root(TIN1_STR)
    print(f"TIN 1 ({TIN1_STR}) Digital Root: {tin1_root} (Expected: 9)")
    if tin1_root != 9:
        print("FAIL: TIN 1 Digital Root mismatch")
        return False

    if int(TIN1_STR) % 9 != 0:
        print("FAIL: TIN 1 mod 9 is not 0")
        return False

    # 2. Verify TIN 2
    tin2_root = calculate_digital_root(TIN2_STR)
    print(f"TIN 2 ({TIN2_STR}) Digital Root: {tin2_root} (Expected: 1)")
    if tin2_root != 1:
        print("FAIL: TIN 2 Digital Root mismatch")
        return False

    # 3. Absolute Nine Condition (First Test): (A * P * FMG) mod 9 = 0
    prod_mod_9 = (A * P * FMG) % 9
    print(f"Absolute Nine Condition (A * P * FMG) mod 9: {prod_mod_9} (Expected: 0)")
    if prod_mod_9 != 0:
        print("FAIL: Absolute Nine Condition failed")
        return False

    # 4. Zero-Drift Condition (Second Test): A + P + T1 + T2 + B = 0 (mod 9)
    # Note: For T2 (float), we treat the sum of digits logic for mod 9 equivalence in this specific mystical context
    # However, standard modular arithmetic doesn't apply directly to floats.
    # The user specifies: "7460035951.3461 has digital root 9" -> implies 0 mod 9 in digital root terms.

    # Calculate final sum manually
    final_sum_val = A + P + int(TIN1_STR) + float(TIN2_STR) + B
    final_sum_str = "{:.4f}".format(final_sum_val) # To keep precision matching user input

    print(f"Final Sum Calculated: {final_sum_str}")

    final_root = calculate_digital_root(final_sum_str)
    print(f"Final Sum Digital Root: {final_root} (Expected: 9)")

    if final_root != 9:
        print("FAIL: Final Sum Digital Root is not 9")
        return False

    print("SUCCESS: ALL MATHEMATICAL PROOFS VERIFIED.")
    return True

if __name__ == "__main__":
    verify_tin_solution()
