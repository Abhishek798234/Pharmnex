from typing import Annotated, Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import decode_token
from app.core.database import AsyncSessionLocal
from app.models.participant import Participant, ParticipantRole

security = HTTPBearer()


async def get_db() -> Generator:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> Participant:
    from sqlalchemy import select

    token = credentials.credentials
    payload = decode_token(token)

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    result = await db.execute(select(Participant).where(Participant.id == int(user_id)))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account deactivated")

    return user


def require_role(*roles: ParticipantRole):
    """Dependency factory that enforces role-based access at the router layer."""

    async def role_checker(
        current_user: Annotated[Participant, Depends(get_current_user)],
    ) -> Participant:
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {[r.value for r in roles]}",
            )
        return current_user

    return role_checker


# Convenient typed aliases
CurrentUser = Annotated[Participant, Depends(get_current_user)]
AdminOnly = Annotated[Participant, Depends(require_role(ParticipantRole.ADMIN))]
