"""
PharmnEx Smart Contract — Participant Registry
─────────────────────────────────────────────
PyTeal / Algorand Smart Contract managing registered supply chain actors:
Supplier, Manufacturer, Wholesaler, Distributor, Customer/Pharmacy.
"""

from pyteal import *

def approval_program():
    # Global state keys
    admin_key = Bytes("admin")
    
    # Operations
    op_register_participant = Bytes("register_participant")
    op_verify_participant = Bytes("verify_participant")
    
    # Scratch slots
    participant_address = Txn.application_args[1]
    participant_role = Txn.application_args[2]

    # Initialization
    on_creation = Seq([
        App.globalPut(admin_key, Txn.sender()),
        Approve()
    ])

    # Register Participant (Admin only)
    is_admin = Txn.sender() == App.globalGet(admin_key)
    
    register_participant = Seq([
        Assert(is_admin),
        Assert(Txn.application_args.length() == Int(3)),
        # Store role in local state of participant address
        App.localPut(Txn.accounts[1], Bytes("role"), participant_role),
        App.localPut(Txn.accounts[1], Bytes("verified"), Int(1)),
        Approve()
    ])

    # Verify status
    verify_participant = Seq([
        Assert(App.localGet(Txn.sender(), Bytes("verified")) == Int(1)),
        Approve()
    ])

    program = Cond(
        [Txn.application_id() == Int(0), on_creation],
        [Txn.on_completion() == OnComplete.OptIn, Approve()],
        [Txn.application_args[0] == op_register_participant, register_participant],
        [Txn.application_args[0] == op_verify_participant, verify_participant],
    )

    return program

def clear_state_program():
    return Approve()

if __name__ == "__main__":
    with open("participant_approval.teal", "w") as f:
        f.write(compileTeal(approval_program(), mode=Mode.Application, version=6))
    with open("participant_clear.teal", "w") as f:
        f.write(compileTeal(clear_state_program(), mode=Mode.Application, version=6))
