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


class TransactionCreate(TransactionBase):
    budget_id: int
    category_id: int
    # who_created_id: int

    class Config:
        orm_mode = True


class TransactionUpdate(_pydantic.BaseModel):
    isOutcome: Optional[bool] = None
    title: Optional[str] = None
    description: Optional[str] = None
    amount: Optional[float] = None
    category_id: Optional[int] = None

    class Config:
        orm_mode = True


class Transaction(TransactionBase):
    id: int
    date: _dt.datetime
    who_created: User

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


class CategoryCreate(CategoryBase):
    pass


class CategoryEdit(_pydantic.BaseModel):
    name: Optional[str] = None
    isOutcome: Optional[bool] = None


class Category(CategoryBase):
    id: int
    transactions: list[Transaction] = []

    class Config:
        orm_mode = True


class CategorySmall(CategoryEdit):
    id: int

    class Config:
        orm_mode = True


class TransactionDisplay(Transaction):
    category: CategorySmall

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


class NoteCreate(NoteBase):
    budget_id: int

    class Config:
        orm_mode = True


class Note(NoteBase):
    id: int
    budget_id: int
    date: _dt.datetime

    class Config:
        orm_mode = True


class NoteEdit(_pydantic.BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

    class Config:
        orm_mode = True


class BudgetOutput(Budget):
    # transactions: list[TransactionDisplay] = []
    users: list[User] = []
    notes: list[Note] = []

    class Config:
        orm_mode = True
