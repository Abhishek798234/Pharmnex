from datetime import datetime
from pydantic import BaseModel, EmailStr, field_validator
from app.models.participant import ParticipantRole


class ParticipantCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: ParticipantRole
    organization: str | None = None
    phone: str | None = None

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v


class ParticipantLogin(BaseModel):
    email: EmailStr
    password: str


class ParticipantResponse(BaseModel):
    id: int
    role: ParticipantRole
    name: str
    email: str
    organization: str | None
    phone: str | None
    algorand_address: str | None
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: ParticipantResponse


class ParticipantUpdate(BaseModel):
    name: str | None = None
    organization: str | None = None
    phone: str | None = None
    algorand_address: str | None = None
    is_active: bool | None = None
