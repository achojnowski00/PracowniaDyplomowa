import fastapi as _fastapi
import fastapi.security as _security
import jwt as _jwt
import sqlalchemy.orm as _orm
import passlib.hash as _hash

import database as _database
import models as _models
import schemas as _schemas


oAuth2Schema = _security.OAuth2PasswordBearer(tokenUrl="/api/users/token")

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

    return _schemas.UsersOutput.from_orm(user)


async def update_user(
    new_user_data: _schemas.UserUpdate = _fastapi.Body(...),
    db: _orm.Session = _fastapi.Depends(get_db)
):
    user_obj = db.query(_models.User).get(new_user_data.id)

    if (user_obj == None):
        raise _fastapi.HTTPException(
            status_code=404, detail="Nie prawidłowe ID użytkownika, nieznaleziono użytkownika")

    if (new_user_data.login):
        user_obj.login = new_user_data.login

    if (new_user_data.name):
        user_obj.name = new_user_data.name

    db.commit()
    db.refresh(user_obj)

    # return user_obj
    return {"message": "Pomyślnie zaktualizowano użytkownika"}


# ####################### #
#
#    Budget functions
#
# ####################### #
async def create_budget(
    budget: _schemas.BudgetCreate,
    db: _orm.Session = _fastapi.Depends(get_db),
    user: _schemas.User = _fastapi.Depends(get_current_user)
):
    budget_obj = _models.Budget(name=budget.name)

    user_obj = db.query(_models.User).get(user.id)
    # user_obj.budgets.append(budget_obj)
    budget_obj.users.append(user_obj)

    db.add(budget_obj)
    db.commit()
    db.refresh(budget_obj)

    return budget_obj


async def add_user_to_budget(
    budget_id: int,
    user_id: int,
    db: _orm.Session = _fastapi.Depends(get_db)
):
    user_obj = db.query(_models.User).get(user_id)
    budget_obj = db.query(_models.Budget).get(budget_id)

    # sprzwdzenie czy pobrano budżet, jeśli równa się None
    # to znaczy, że nie ma takiego budżetu
    if (budget_obj == None):
        raise _fastapi.HTTPException(
            status_code=404, detail="Nie prawidłowe ID budżetu")

    # Sprawdzenie czy pobrano użytkownika, jeśli równa się None
    # to znaczy, że nie ma takiego użytkownika
    if (user_obj == None):
        raise _fastapi.HTTPException(
            status_code=404, detail="Nie prawidłowe ID użytkownika")

    # sprawdzenie czy użytkownik jest już w budżecie
    if (user_obj in budget_obj.users):
        raise _fastapi.HTTPException(
            status_code=404, detail="Użytkownik już jest w budżecie")

    user_obj.budgets.append(budget_obj)

    db.commit()
    db.refresh(user_obj)

    return user_obj


async def get_budget(
    budget_id: int,
    db: _orm.Session = _fastapi.Depends(get_db)
):
    budget = db.query(_models.Budget).filter(
        _models.Budget.id == budget_id).first()

    if (budget == None):
        raise _fastapi.HTTPException(
            status_code=404, detail="Nie prawidłowe ID budżetu, nieznaleziono budżetu")

    return budget


async def delete_user_from_budget(
    budget_id: int,
    user_id: int,
    db: _orm.Session = _fastapi.Depends(get_db)
):
    user_obj = db.query(_models.User).get(user_id)
    budget_obj = db.query(_models.Budget).get(budget_id)

    # sprzwdzenie czy pobrano budżet, jeśli równa się None
    # to znaczy, że nie ma takiego budżetu
    if (budget_obj == None):
        raise _fastapi.HTTPException(
            status_code=404, detail="Nie prawidłowe ID budżetu")

    # Sprawdzenie czy pobrano użytkownika, jeśli równa się None
    # to znaczy, że nie ma takiego użytkownika
    if (user_obj == None):
        raise _fastapi.HTTPException(
            status_code=404, detail="Nie prawidłowe ID użytkownika")

    # sprawdzenie czy użytkownik jest już w budżecie
    if (user_obj not in budget_obj.users):
        raise _fastapi.HTTPException(
            status_code=404, detail="Użytkownik nie jest w budżecie")

    user_obj.budgets.remove(budget_obj)

    db.commit()
    db.refresh(user_obj)

    return user_obj


async def edit_budget(
    budget_id: int,
    budget: _schemas.BudgetCreate,
    db: _orm.Session = _fastapi.Depends(get_db)
):
    budget_obj = db.query(_models.Budget).get(budget_id)

    if (budget_obj == None):
        raise _fastapi.HTTPException(
            status_code=404, detail="Nie prawidłowe ID budżetu, nieznaleziono budżetu")

    budget_obj.name = budget.name

    db.commit()
    db.refresh(budget_obj)

    return budget_obj
