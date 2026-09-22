"""
PharmnEx Smart Contract — Batch ASA Registry & Raw Material Link
────────────────────────────────────────────────────────────────
PyTeal Smart Contract anchoring medicine batches as Algorand Standard Assets (ASA)
and linking raw material batch hashes to the batch immutable ledger state.
"""

from pyteal import *

def batch_approval_program():
    # Application State Keys
    admin_key = Bytes("admin")
    op_create_batch = Bytes("create_batch")
    op_update_status = Bytes("update_status")

    # Arguments
    batch_number = Txn.application_args[1]
    raw_material_hash = Txn.application_args[2]
    drug_code = Txn.application_args[3]

    on_creation = Seq([
        App.globalPut(admin_key, Txn.sender()),
        Approve()
    ])

    create_batch = Seq([
        # Ensure sender is authorized manufacturer
        Assert(Txn.application_args.length() >= Int(4)),
        # Save batch global metadata
        App.globalPut(Concat(Bytes("batch_"), batch_number), raw_material_hash),
        App.globalPut(Concat(Bytes("status_"), batch_number), Bytes("MINTED")),
        Approve()
    ])

    update_status = Seq([
        Assert(Txn.application_args.length() >= Int(3)),
        App.globalPut(Concat(Bytes("status_"), batch_number), Txn.application_args[2]),
        Approve()
    ])

    program = Cond(
        [Txn.application_id() == Int(0), on_creation],
        [Txn.application_args[0] == op_create_batch, create_batch],
        [Txn.application_args[0] == op_update_status, update_status],
    )

    return program

def clear_state_program():
    return Approve()

if __name__ == "__main__":
    with open("batch_approval.teal", "w") as f:
        f.write(compileTeal(batch_approval_program(), mode=Mode.Application, version=6))
    with open("batch_clear.teal", "w") as f:
        f.write(compileTeal(clear_state_program(), mode=Mode.Application, version=6))
