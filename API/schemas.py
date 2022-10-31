import datetime as _dt
import pydantic as _pydantic
from typing import Optional


# ################# #
#
#    USER SCHEMA
#
# ################# #
class UserBase(_pydantic.BaseModel):
    login: str


class UserCreate(UserBase):
    hashed_password: str

    class Config:
        orm_mode = True


class User(UserBase):
    id: int
    name: str

    class Config:
        orm_mode = True


class UserUpdate(_pydantic.BaseModel):
    id: Optional[int] = None
    login: Optional[str] = None
    name: Optional[str] = None

    class Config:
        orm_mode = True


# ####################### #
#
#    TRANSACTION SCHEMA
#
# ####################### #
class TransactionBase(_pydantic.BaseModel):
    isOutcome: bool
    title: str
    description: str
    amount: float
    date: _dt.datetime


class Transaction(TransactionBase):
    id: int
    category_id: int

    class Config:
        orm_mode = True


# ###################### #
#
#    CATEGORY SCHEMA
#
# ###################### #
class CategoryBase(_pydantic.BaseModel):
    name: str
    isOutcome: bool


class Category(CategoryBase):
    id: int
    transactions: list[Transaction] = []

    class Config:
        orm_mode = True


# #################### #
#
#    BUDGET SCHEMA
#
# #################### #
class BudgetBase(_pydantic.BaseModel):
    name: str


class BudgetCreate(BudgetBase):
    class Config:
        orm_mode = True


class Budget(BudgetBase):
    id: int

    class Config:
        orm_mode = True


class UsersOutput(User):
    budgets: list[Budget] = []

    class Config:
        orm_mode = True


class BudgetOutput(Budget):
    transactions: list[Transaction] = []
    users: list[User] = []

    class Config:
        orm_mode = True


class user_has_budget_create(_pydantic.BaseModel):
    user_id: int


# ################# #
#
#    N0TE SCHEMA
#
# ################# #
class NoteBase(_pydantic.BaseModel):
    title: str
    description: str
    date: _dt.datetime


class NoteCreate(NoteBase):
    class Config:
        orm_mode = True


class Note(NoteBase):
    id: int
    budget_id: int

    class Config:
        orm_mode = True
