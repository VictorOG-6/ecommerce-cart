from sqlmodel import SQLModel, Field
from typing import Optional
from pydantic import field_serializer
from uuid import UUID, uuid4
from datetime import datetime

class CartItemsBase(SQLModel):
    name: str
    price: int
    quantity: int

class CartItems(CartItemsBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CartItemsCreate(CartItemsBase):
    pass

class CartItemsRead(CartItemsBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

class CartItemsUpdate(SQLModel):
    name: Optional[str] = None
    price: Optional[int] = None
    quantity: Optional[int] = None