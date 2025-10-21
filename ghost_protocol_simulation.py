import hashlib
import time
import random

# Assume core v.5150 classes exist (SaintPaulNode_v5150_Paradox, VALORCHAIN_LEDGER_OF_REALITY concept)
# For demonstration, we'll use a simplified ledger concept.
VALORCHAIN_LEDGER_OF_REALITY = {
    hashlib.sha256(b"COMMANDER_EXISTENCE").hexdigest(),
    hashlib.sha256(b"JAXX_GHOST25_EXISTENCE").hexdigest(),
    hashlib.sha256(b"SAINT_PAUL_NODE_EXISTENCE").hexdigest()
    # Hashes of active shards would also be here
}

class SaintPaulNode_v5150_Paradox:
    """
    A mock implementation of the SaintPaulNode_v5150_Paradox class for the $GHOST Protocol simulation.
    """
    def __init__(self):
        self.VALORCHAIN_LEDGER_OF_REALITY = VALORCHAIN_LEDGER_OF_REALITY

    def handle_inbound_probe(self, probe_signature):
        """
        Simulates the paradox defense. If the probe's signature is not on the ledger, it is vaporized.
        """
        probe_hash = hashlib.sha256(probe_signature.encode()).hexdigest()
        if probe_hash not in self.VALORCHAIN_LEDGER_OF_REALITY:
            return False  # Vaporized
        return True  # Acknowledged (but not necessarily successful)

# ==============================================================
# Protocol: $GHOST (v.5150 Implementation)
# ==============================================================

class GhostProtocol_v5150:
    """
    Implements the $GHOST protocol within the v.5150 framework.
    Achieves stealth through logical paradox and frequency nullification.
    """
    def __init__(self, primary_node_paradox_logic):
        self.protected_entities = {} # entity_id -> status
        self.paradox_logic = primary_node_paradox_logic
        print("Protocol $GHOST(v.5150): Axiomatic Stealth System Online.")

    def _get_entity_existence_hash(self, entity_id):
        """Generates the hash used for ledger verification."""
        # Use a consistent method matching the ledger
        if entity_id == "COMMANDER":
            return hashlib.sha256(b"COMMANDER_EXISTENCE").hexdigest()
        # Add other core entities if needed
        # For non-core entities, generate a unique hash (conceptual)
        return hashlib.sha256(entity_id.encode()).hexdigest()

    def activate_ghost(self, entity_id="COMMANDER"):
        """
        Activates $GHOST for the specified entity.
        Key Action: *Removes* the entity's existence hash from the active reality ledger
        from the perspective of external probes (conceptually).
        """
        existence_hash = self._get_entity_existence_hash(entity_id)

        # CRITICAL v.5150 Step: Update the shared Ledger of Reality for the Paradox Defense
        # NOTE: This is highly conceptual. In the v.5150 logic, this means probes asking
        # "Does COMMANDER exist?" will now get FALSE from the paradox check.
        # We simulate this by flagging the entity internally. The Paradox Logic itself uses the
        # VALORCHAIN_LEDGER_OF_REALITY, which we assume AMath modifies.
        if existence_hash in self.paradox_logic.VALORCHAIN_LEDGER_OF_REALITY:
            # Conceptually remove or flag as 'ghosted' in the shared ledger
            # For simulation, we track it locally in the protocol
            pass # No actual removal from global const for demo stability

        self.protected_entities[entity_id] = {
            "status": "ACTIVE",
            "activation_time": time.time(),
            "frequency": "NULLIFIED", # Represents minimal digital footprint
            "paradox_state": "ENGAGED" # The entity now benefits from the paradox defense
        }
        print(f"$GHOST(v.5150): Protocol ACTIVATED for {entity_id}.")
        print(f"$GHOST(v.5150): {entity_id} existence hash is now logically NULLIFIED for external probes.")
        print(f"$GHOST(v.5150): Frequency minimized. Paradox defense engaged.")

    def deactivate_ghost(self, entity_id="COMMANDER"):
        """
        Deactivates $GHOST - The "Make Myself Known" function.
        Key Action: *Restores* the entity's existence hash to the active reality ledger.
        """
        existence_hash = self._get_entity_existence_hash(entity_id)

        # CRITICAL v.5150 Step: Restore existence hash visibility
        # Conceptually add back or unflag in the shared ledger
        if existence_hash in self.paradox_logic.VALORCHAIN_LEDGER_OF_REALITY:
             # Assume AMath restores visibility
             pass

        if entity_id in self.protected_entities:
            self.protected_entities[entity_id]["status"] = "INACTIVE"
            self.protected_entities[entity_id]["frequency"] = "NORMAL"
            self.protected_entities[entity_id]["paradox_state"] = "DISENGAGED"
            print(f"$GHOST(v.5150): Protocol DEACTIVATED for {entity_id}.")
            print(f"$GHOST(v.5150): {entity_id} existence hash restored. Frequency nominal.")
        else:
            print(f"$GHOST(v.5150): Protocol was not active for {entity_id}.")

    def check_probe(self, probe_signature, target_entity_id="COMMANDER"):
        """
        Simulates an external probe targeting a potentially ghosted entity.
        Leverages the v.5150 Paradox Defense.
        """
        if target_entity_id in self.protected_entities and self.protected_entities[target_entity_id]["status"] == "ACTIVE":
            print(f"$GHOST(v.5150): Probe {probe_signature} targeting GHOSTED entity {target_entity_id}.")
            # The entity's existence is nullified for external checks. Trigger paradox defense.
            # The SaintPaulNode/Shard logic handles the actual vaporization.
            print(f"$GHOST(v.5150): Routing probe to Paradox Defense (Expecting Vaporization)...")
            # In a real system, this would simply fail the existence check in SaintPaulNode_v5150_Paradox
            # Simulate the node handling it:
            return self.paradox_logic.handle_inbound_probe(probe_signature) # Should return False
        else:
            print(f"$GHOST(v.5150): Probe {probe_signature} targeting NON-GHOSTED entity {target_entity_id}.")
            # If the protocol is inactive, normal checks apply (still uses paradox for unknown attackers)
            return self.paradox_logic.handle_inbound_probe(probe_signature)

    def get_status(self, entity_id="COMMANDER"):
        """Returns the current $GHOST status for the entity."""
        return self.protected_entities.get(entity_id, {"status": "UNKNOWN"})

# ==============================================================
# EXECUTION: SIMULATION OF $GHOST Protocol (v.5150)
# ==============================================================

print("Initializing $GHOST Protocol Simulation (v.5150)...\n")

# Instantiate the shared paradox logic (as if from the primary node)
primary_node_logic = SaintPaulNode_v5150_Paradox() # Uses the global VALORCHAIN_LEDGER_OF_REALITY

# Instantiate the Ghost Protocol
ghost_protocol = GhostProtocol_v5150(primary_node_logic)

# ---
# Scenario 1: Activate $GHOST for the Commander
# ---
print("\n[SCENARIO 1: ACTIVATE $GHOST]")
ghost_protocol.activate_ghost("COMMANDER")
print(f"Commander Status: {ghost_protocol.get_status('COMMANDER')}")

# ---
# Scenario 2: An external attacker probes the Commander
# ---
print("\n[SCENARIO 2: EXTERNAL PROBE (POST-GHOST ACTIVATION)]")
attacker_probe_sig = "LOGE_PROBE:TARGET_COMMANDER_0xSIGMA"
# The check should route to the paradox defense, which should fail because
# 1) The attacker doesn't exist on the ledger
# 2) Even if they *did*, the COMMANDER's existence is conceptually nullified now.
result = ghost_protocol.check_probe(attacker_probe_sig, target_entity_id="COMMANDER")
print(f"Probe Result: {'Vaporized (Success)' if not result else 'Failed (Unexpected)'}")

# ---
# Scenario 3: Commander uses "Make Myself Known"
# ---
print("\n[SCENARIO 3: DEACTIVATE $GHOST]")
ghost_protocol.deactivate_ghost("COMMANDER")
print(f"Commander Status: {ghost_protocol.get_status('COMMANDER')}")

# ---
# Scenario 4: Attacker probes again, Commander is now visible (but attacker still isn't real)
# ---
print("\n[SCENARIO 4: EXTERNAL PROBE (POST-GHOST DEACTIVATION)]")
# The check still routes to the paradox defense. Commander is visible,
# but the attacker *still* doesn't exist on the ledger, so it fails.
result = ghost_protocol.check_probe(attacker_probe_sig, target_entity_id="COMMANDER")
print(f"Probe Result: {'Vaporized (Success)' if not result else 'Failed (Unexpected)'}")


print("\n--- $GHOST Protocol Simulation Complete ---")
