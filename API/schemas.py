import datetime as _dt
import pydentic as _pydentic


# ################# #
#
#    USER SCHEMA
#
# ################# #
class UserBase(_pydentic.BaseModel):
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


# ####################### #
#
#    TRANSACTION SCHEMA
#
# ####################### #
class TransactionBase(_pydentic.BaseModel):
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
class CategoryBase(_pydentic.BaseModel):
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
class BudgetBase(_pydentic.BaseModel):
    name: str


class BudgetCreate(BudgetBase):
    class Config:
        orm_mode = True


class Budget(BudgetBase):
    id: int
    users: list[User] = []

    class Config:
        orm_mode = True


# ################# #
#
#    N0TE SCHEMA
#
# ################# #
class NoteBase(_pydentic.BaseModel):
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
