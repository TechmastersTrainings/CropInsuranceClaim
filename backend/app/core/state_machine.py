from typing import Dict, List, Tuple, Any
from backend.app.models.user import UserRole
from backend.app.models.claim import ClaimStatus


# Directed graph of legal claim lifecycle transitions (compliant with PMFBY & Section 14)
ALLOWED_TRANSITIONS: Dict[str, List[str]] = {
    "Draft": ["Submitted"],
    "Submitted": ["Evidence Validation", "Evidence Verification", "Assessment Pending", "Under Review", "Approved", "Rejected"],
    "Evidence Validation": ["Assessment Pending", "Under Review", "Field Survey Assigned", "Additional Evidence Requested", "Approved", "Rejected"],
    "Evidence Verification": ["Assessment Pending", "Under Review", "Field Survey Assigned", "Additional Evidence Requested", "Approved", "Rejected"],
    "Assessment Pending": ["Under Review", "Field Survey Assigned", "Additional Evidence Requested", "Approved", "Rejected"],
    "Under Review": ["Approved", "Rejected", "Additional Evidence Requested", "Field Survey Assigned", "Settlement Pending", "Settlement In Progress"],
    "Additional Evidence Requested": ["Evidence Validation", "Evidence Verification", "Under Review", "Rejected"],
    "Field Survey Assigned": ["Survey Completed", "Rejected"],
    "Survey Completed": ["Approved", "Rejected", "Under Review"],
    "Approved": ["Settlement Pending", "Settlement In Progress", "Closed"],
    "Rejected": ["Closed", "Under Review"],  # Under Review on formal appeal
    "Settlement Pending": ["Settled", "Rejected"],
    "Settlement In Progress": ["Settled", "Rejected"],
    "Settled": ["Closed"],
    "Closed": []  # Terminal archive state
}

# Role permissions per destination state
ROLE_PERMISSIONS: Dict[str, List[UserRole]] = {
    "Submitted": [UserRole.FARMER, UserRole.ADMIN],
    "Evidence Validation": [UserRole.INSURER, UserRole.ADMIN, UserRole.FARMER],
    "Evidence Verification": [UserRole.INSURER, UserRole.ADMIN, UserRole.FARMER],
    "Assessment Pending": [UserRole.INSURER, UserRole.ADMIN],
    "Under Review": [UserRole.INSURER, UserRole.ADMIN],
    "Additional Evidence Requested": [UserRole.INSURER, UserRole.ADMIN],
    "Field Survey Assigned": [UserRole.INSURER, UserRole.ADMIN],
    "Survey Completed": [UserRole.INSURER, UserRole.ADMIN],
    "Approved": [UserRole.INSURER, UserRole.ADMIN],
    "Rejected": [UserRole.INSURER, UserRole.ADMIN],
    "Settlement Pending": [UserRole.INSURER, UserRole.ADMIN],
    "Settlement In Progress": [UserRole.INSURER, UserRole.ADMIN],
    "Settled": [UserRole.INSURER, UserRole.ADMIN],
    "Closed": [UserRole.INSURER, UserRole.ADMIN, UserRole.AUDITOR]
}


class ClaimStateMachine:
    """Enforces mathematical and governance invariants of the 10-state Claim Lifecycle."""

    @classmethod
    def is_valid_transition(
        cls,
        current_state: str,
        target_state: str,
        actor_role: UserRole
    ) -> Tuple[bool, str]:
        """Validates state graph adjacency and role authority."""
        # 1. Check graph adjacency
        valid_next_states = ALLOWED_TRANSITIONS.get(current_state, [])
        if target_state not in valid_next_states:
            return False, f"Illegal state transition from '{current_state}' to '{target_state}'. Allowed next states: {valid_next_states}"

        # 2. Check role authorization
        permitted_roles = ROLE_PERMISSIONS.get(target_state, [UserRole.ADMIN])
        if actor_role not in permitted_roles and actor_role != UserRole.ADMIN:
            return False, f"Actor role '{actor_role.value}' is unauthorized to transition claim to '{target_state}'. Required roles: {[r.value for r in permitted_roles]}"

        return True, "Transition authorized"

    @classmethod
    def get_allowed_transitions(cls, current_state: str, actor_role: UserRole) -> List[str]:
        """Returns the list of valid destination states authorized for the specified actor role."""
        candidates = ALLOWED_TRANSITIONS.get(current_state, [])
        return [
            s for s in candidates
            if actor_role in ROLE_PERMISSIONS.get(s, [UserRole.ADMIN]) or actor_role == UserRole.ADMIN
        ]

    @classmethod
    def get_full_graph(cls) -> Dict[str, Any]:
        """Returns serializable graph structure for frontend lifecycle visualization."""
        return {
            "transitions": ALLOWED_TRANSITIONS,
            "roles": {k: [r.value for r in v] for k, v in ROLE_PERMISSIONS.items()}
        }
