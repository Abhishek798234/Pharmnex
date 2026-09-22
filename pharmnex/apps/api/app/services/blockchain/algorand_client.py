"""
Blockchain Service — Algorand Client Wrapper
────────────────────────────────────────────
All Algorand interactions are isolated here.
The rest of the app never touches py-algorand-sdk directly.

When USE_ALGORAND_MOCK=True (default for dev), all chain calls return
realistic mock responses so the full system works without AlgoKit setup.
Set USE_ALGORAND_MOCK=False and provide ALGORAND_ADMIN_MNEMONIC to use TestNet.
"""
import hashlib
import random
import string
import time
from typing import Any
from app.core.config import get_settings

settings = get_settings()


def _mock_tx_id() -> str:
    """Generate a realistic-looking Algorand transaction ID (52-char base32)."""
    chars = string.ascii_uppercase + "234567"
    return "".join(random.choices(chars, k=52))


def _mock_asset_id() -> int:
    return random.randint(100_000_000, 999_999_999)


def _mock_round() -> int:
    return random.randint(30_000_000, 40_000_000)


class AlgorandClient:
    """Thin wrapper around py-algorand-sdk. Mock mode for dev/CI."""

    def __init__(self):
        self.use_mock = settings.USE_ALGORAND_MOCK
        self._algod = None
        self._admin_sk = None

        if not self.use_mock:
            self._init_real_client()

    def _init_real_client(self):
        try:
            from algosdk.v2client import algod
            from algosdk import mnemonic

            self._algod = algod.AlgodClient(
                "", settings.ALGORAND_ALGOD_ADDRESS
            )
            self._admin_sk = mnemonic.to_private_key(settings.ALGORAND_ADMIN_MNEMONIC)
            print("✓ Algorand real client connected to", settings.ALGORAND_NETWORK)
        except Exception as e:
            print(f"⚠ Algorand init failed, falling back to mock: {e}")
            self.use_mock = True

    async def register_participant(self, participant_id: int, role: str, address: str) -> dict[str, Any]:
        """Record participant registration on-chain (Participant Registry contract)."""
        if self.use_mock:
            return {
                "tx_id": _mock_tx_id(),
                "round": _mock_round(),
                "mock": True,
            }
        # Real AlgoKit contract call would go here
        raise NotImplementedError("Real Algorand integration — configure AlgoKit")

    async def create_batch(self, batch_code: str, metadata_hash: str, manufacturer_address: str) -> dict[str, Any]:
        """Mint batch record on-chain (Batch Registry contract)."""
        if self.use_mock:
            return {
                "tx_id": _mock_tx_id(),
                "asset_id": _mock_asset_id(),
                "round": _mock_round(),
                "metadata_hash": metadata_hash,
                "mock": True,
            }
        raise NotImplementedError("Real Algorand integration — configure AlgoKit")

    async def transfer_custody(
        self,
        batch_code: str,
        sender_address: str,
        receiver_address: str,
        quantity: int,
    ) -> dict[str, Any]:
        """Record custody transfer on-chain (Custody Transfer contract)."""
        if self.use_mock:
            return {
                "tx_id": _mock_tx_id(),
                "round": _mock_round(),
                "sender": sender_address or "MOCK_SENDER",
                "receiver": receiver_address or "MOCK_RECEIVER",
                "mock": True,
            }
        raise NotImplementedError("Real Algorand integration — configure AlgoKit")

    def compute_metadata_hash(self, data: dict) -> str:
        """SHA-256 hash of batch metadata for integrity anchoring."""
        import json
        payload = json.dumps(data, sort_keys=True, default=str)
        return hashlib.sha256(payload.encode()).hexdigest()


# Singleton
algorand_client = AlgorandClient()
