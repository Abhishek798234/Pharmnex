"""
PharmnEx Smart Contract — Custody Transfer & Handshake
────────────────────────────────────────────────────
PyTeal Smart Contract handling cryptographic custody transfers between
Manufacturer ➔ Wholesaler ➔ Distributor ➔ Customer.
"""

from pyteal import *

def custody_approval_program():
    admin_key = Bytes("admin")
    op_transfer_custody = Bytes("transfer_custody")
    op_accept_custody = Bytes("accept_custody")

    batch_id = Txn.application_args[1]
    next_holder = Txn.accounts[1]

    on_creation = Seq([
        App.globalPut(admin_key, Txn.sender()),
        Approve()
    ])

    transfer_custody = Seq([
        Assert(Txn.application_args.length() >= Int(2)),
        App.globalPut(Concat(Bytes("pending_custodian_"), batch_id), next_holder),
        App.globalPut(Concat(Bytes("transfer_ts_"), batch_id), Global.latest_timestamp()),
        Approve()
    ])

    accept_custody = Seq([
        Assert(App.globalGet(Concat(Bytes("pending_custodian_"), batch_id)) == Txn.sender()),
        App.globalPut(Concat(Bytes("active_custodian_"), batch_id), Txn.sender()),
        App.globalPut(Concat(Bytes("pending_custodian_"), batch_id), Bytes("")),
        Approve()
    ])

    program = Cond(
        [Txn.application_id() == Int(0), on_creation],
        [Txn.application_args[0] == op_transfer_custody, transfer_custody],
        [Txn.application_args[0] == op_accept_custody, accept_custody],
    )

    return program

def clear_state_program():
    return Approve()

if __name__ == "__main__":
    with open("custody_approval.teal", "w") as f:
        f.write(compileTeal(custody_approval_program(), mode=Mode.Application, version=6))
    with open("custody_clear.teal", "w") as f:
        f.write(compileTeal(clear_state_program(), mode=Mode.Application, version=6))
