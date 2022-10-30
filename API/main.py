import fastapi as _fastapi
import fastapi.security as _security

import sqlalchemy.orm as _orm

import services as _services
import schemas as _schemas

app = _fastapi.FastAPI()


# ####################### #
#
#    Base route
#
# ####################### #
@app.get("/")
def hello():
    return {"messages": "All endpoints you can find in /docs"}


# ####################### #
#
#    User auth routes
#
# ####################### #
@app.post("/api/users")
async def create_user(user: _schemas.UserCreate, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    db_user = await _services.get_user_by_login(user.login, db)

    if db_user:
        raise _fastapi.HTTPException(
            status_code=400, detail="Użytkownik o podanym emailu jest już zarejestrowany")

    return await _services.create_user(user, db)


@app.post("/api/token")
async def generate_token(form_data: _security.OAuth2PasswordRequestForm = _fastapi.Depends(), db: _orm.Session = _fastapi.Depends(_services.get_db)):
    user = await _services.authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise _fastapi.HTTPException(
            status_code=401, detail="Nieprawidłowe dane logowania")

    return await _services.create_token(user)


@app.get("/api/users/me", response_model=_schemas.User)
async def get_user(user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return user


# ####################### #
#
#    Budget routes
#
# ####################### #
@app.post("/api/budgets", response_model=_schemas.Budget)
async def create_budget(
        budget: _schemas.BudgetCreate,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.create_budget(budget, db, user)


# TODO - dodać, żeby budzet id i user id były pobierane z linku (jeśli jest to potrzebne)
@app.post("/api/budgets-add", response_model=_schemas.Budget)
async def add_user_to_budget(
        budget_id: int,
        user_id: int,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.add_user_to_budget(budget_id, user_id, db, user)


# TODO - edytowanie nazwy budżetu

# TODO - opuszczanie budzetu / usuwanie użytkownika z budżetu

# ####################### #
#
#    Transactions routes
#
# ####################### #


# ####################### #
#
#    Cattegories routes
#
# ####################### #


# ####################### #
#
#    Notes routes
#
# ####################### #
