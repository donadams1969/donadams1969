def verify_torah_code():
    print("VERIFYING TORAH CODE (GEMATRIA)...")

    # Hebrew Gematria Values
    # Aleph (א) = 1
    # Peh (פ) = 80
    # Samech (ס) = 60

    ALEPH = 1
    PEH = 80
    SAMECH = 60

    word = "אפס" # Efes

    total_gematria = ALEPH + PEH + SAMECH
    print(f"Word: {word} (Efes)")
    print(f"Calculation: {ALEPH} + {PEH} + {SAMECH} = {total_gematria}")

    if total_gematria != 141:
        print("FAIL: Gematria calculation incorrect")
        return False

    # Check Mod 9 / Digital Root
    # 141 -> 1+4+1 = 6
    digital_root = sum(int(d) for d in str(total_gematria))
    print(f"Digital Root of {total_gematria}: {digital_root} (Expected: 6)")

    if digital_root != 6:
        print("FAIL: Digital root is not 6")
        return False

    print("SUCCESS: TORAH CODE VERIFIED.")
    return True

if __name__ == "__main__":
    verify_torah_code()
