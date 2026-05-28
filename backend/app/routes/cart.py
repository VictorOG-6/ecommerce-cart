from fastapi import APIRouter, status, HTTPException
from sqlmodel import select
from app.models import CartItemsRead, CartItemsCreate, CartItems, CartItemsUpdate
from app.database import SessionDep
from uuid import UUID  # ✅ Add this import

router = APIRouter(prefix="/cart", tags=["Cart"])

@router.post("/items", response_model=CartItemsRead, status_code=status.HTTP_202_ACCEPTED)
def add_item_to_cart(item: CartItemsCreate, session: SessionDep):
    new_item = CartItems(**item.model_dump())

    session.add(new_item)
    session.commit()
    session.refresh(new_item)
    return new_item

@router.get("/items", response_model=list[CartItemsRead])
def get_cart_items(session: SessionDep):
    statement = select(CartItems)
    items = session.exec(statement).all()
    return items

@router.put("/items/{id}", response_model=CartItemsRead, status_code=status.HTTP_202_ACCEPTED)
def update_cart_item(id: str, item_update: CartItemsUpdate, session: SessionDep):  # ✅ Keep as str
    try:
        item_uuid = UUID(id)  # ✅ Convert string to UUID
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid UUID format")
    
    updated_item = session.exec(select(CartItems).where(CartItems.id == item_uuid)).first()  # ✅ Use UUID
    if not updated_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart Items not found")
    
    items_data = item_update.model_dump(exclude_unset=True)
    updated_item.sqlmodel_update(items_data)

    session.add(updated_item)
    session.commit()
    session.refresh(updated_item)
    return updated_item

@router.delete("/items/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cart_item(id: str, session: SessionDep):  # ✅ Keep as str
    try:
        item_uuid = UUID(id)  # ✅ Convert string to UUID
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid UUID format")
    
    item = session.exec(select(CartItems).where(CartItems.id == item_uuid)).first()  # ✅ Use UUID
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart Item not found")
    session.delete(item)
    session.commit()
    return None