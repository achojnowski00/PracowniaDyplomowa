import fastapi as _fastapi
import fastapi.security as _security
import jwt as _jwt
import sqlalchemy.orm as _orm
import passlib.hash as _hash

import database as _database
import models as _models
import schemas as _schemas


oAuth2Schema = _security.OAuth2PasswordBearer(tokenUrl="/api/token")

JWT_SECRET = "myjwtsecret"


# ####################### #
#
#    DataBase functions
#
# ####################### #
def get_db():
    db = _database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ####################### #
#
#    User auth functions
#
# ####################### #
async def get_user_by_login(login: str, db: _orm.Session):
    return db.query(_models.User).filter(_models.User.login == login).first()


async def create_user(user: _schemas.UserCreate, db: _orm.Session):
    user_obj = _models.User(
        login=user.login, hashed_password=_hash.bcrypt.hash(user.hashed_password))
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)

    return user_obj


async def authenticate_user(login: str, password: str, db: _orm.Session):
    user = await get_user_by_login(login, db)

    if not user:
        return False

    if not user.verify_password(password):
        return False

    return user


async def create_token(user: _models.User):
    user_obj = _schemas.User.from_orm(user)

    token = _jwt.encode(user_obj.dict(), JWT_SECRET)

    return dict(access_token=token, token_type="bearer")


async def get_current_user(db: _orm.Session = _fastapi.Depends(get_db), token: str = _fastapi.Depends(oAuth2Schema)):
    try:
        payload = _jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = db.query(_models.User).get(payload["id"])
    except:
        raise _fastapi.HTTPException(
            status_code=401, detail="Nieprawidłowe dane logowania")

    return _schemas.User.from_orm(user)


# ####################### #
#
#    Budget functions
#
# ####################### #
async def create_budget(
        budget: _schemas.BudgetCreate,
        db: _orm.Session = _fastapi.Depends(get_db),
        user: _schemas.User = _fastapi.Depends(get_current_user)):
    budget_obj = _models.Budget(name=budget.name)

    db.add(budget_obj)
    db.commit()
    db.refresh(budget_obj)

    user_obj = db.query(_models.User).get(user.id)
    user_obj.budgets.append(budget_obj)

    db.commit()
    db.refresh(user_obj)

    return budget_obj


async def add_user_to_budget(
        budget_id: int,
        user_id: int,
        db: _orm.Session = _fastapi.Depends(get_db),
        user: _schemas.User = _fastapi.Depends(get_current_user)):
    user_obj = db.query(_models.User).get(user_id)
    budget_obj = db.query(_models.Budget).get(budget_id)

    user_obj.budgets.append(budget_obj)

    db.commit()
    db.refresh(user_obj)

    return user_obj
