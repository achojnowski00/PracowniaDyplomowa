import datetime as _dt
import pydentic as _pydentic


class _UserBase(_pydentic.BaseModel):
    login: str


class UserCreate(_UserBase):
    password: str

    class Config:
        orm_mode = True


class User(_UserBase):
    id: int
    name: str

    class Config:
        orm_mode = True
