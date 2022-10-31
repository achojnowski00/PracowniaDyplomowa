import fastapi as _fastapi
import fastapi.security as _security

import sqlalchemy.orm as _orm

import services as _services
import schemas as _schemas
import models as _models

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
@app.post("/api/users/register")
async def create_user(user: _schemas.UserCreate, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    db_user = await _services.get_user_by_login(user.login, db)

    if db_user:
        raise _fastapi.HTTPException(
            status_code=400, detail="Użytkownik o podanym emailu jest już zarejestrowany")

    return await _services.create_user(user, db)


@app.post("/api/users/token")
async def generate_token(form_data: _security.OAuth2PasswordRequestForm = _fastapi.Depends(), db: _orm.Session = _fastapi.Depends(_services.get_db)):
    user = await _services.authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise _fastapi.HTTPException(
            status_code=401, detail="Nieprawidłowe dane logowania")

    return await _services.create_token(user)


@app.get("/api/users/me", response_model=_schemas.UsersOutput)
async def get_user(user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return user


@app.delete("/api/users/delete")
async def delete_user(
    user_id: int,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    user_obj = db.query(_models.User).get(user_id)

    if (user_obj == None):
        raise _fastapi.HTTPException(
            status_code=404, detail="Nie znaleziono użytkownika o podanym ID")

    # delete user from budgets
    for budget in user_obj.budgets:
        budget_obj = db.query(_models.Budget).get(budget.id)
        budget_obj.users.remove(user_obj)

    db.delete(user_obj)
    db.commit()

    return {"messages": "Użytkownik został usunięty"}


@app.put("/api/users/update")
async def update_user(
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    new_user_data: _schemas.UserUpdate = _fastapi.Body(...),
    db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    return await _services.update_user(new_user_data, db)

    # ####################### #
    #
    #    Budget routes
    #
    # ####################### #


@app.post("/api/budgets/create", response_model=_schemas.Budget)
async def create_budget(
        budget: _schemas.BudgetCreate,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.create_budget(budget, db, user)


# wywołanie: http://127.0.0.1:8000/api/add-to-budget?budget_id=2&user_id=2
@app.post("/api/budgets/add-to-budget", response_model=_schemas.Budget)
async def add_user_to_budget(
        budget_id: int,
        user_id: int,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.add_user_to_budget(budget_id, user_id, db)


@app.get("/api/budgets/get-single/{budget_id}", response_model=_schemas.BudgetOutput)
async def get_budget(
        budget_id: int,
        user: _schemas.User = _fastapi.Depends(_services.get_current_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_budget(budget_id, db)


@app.delete("/api/budgets/remove-user/{budget_id}")
async def delete_user_from_budget(
        budget_id: int,
        user_id: int,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.delete_user_from_budget(budget_id, user_id, db)


@app.put("/api/budgets/edit/{budget_id}")
async def edit_budget(
        budget_id: int,
        budget: _schemas.BudgetCreate,
        db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.edit_budget(budget_id, budget, db)


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
@app.post("/api/categories/create", response_model=_schemas.Category)
async def create_category(
        category: _schemas.CategoryCreate,
        db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.create_category(category, db)


@app.get("/api/categories/get-all")
async def get_categories(
        db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_categories("all", db)


@app.get("/api/categories/get-outcomes")
async def get_outcomes(
        db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_categories("outcomes", db)


@app.get("/api/categories/get-incomes")
async def get_incomes(
        db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_categories("incomes", db)


@app.get("/api/categories/get-single/{category_id}", response_model=_schemas.Category)
async def get_category(
        category_id: int,
        db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_category(category_id, db)


@app.put("/api/categories/edit/{category_id}")
async def edit_category(
        category_id: int,
        category: _schemas.CategoryEdit,
        db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.edit_category(category_id, category, db)


@app.delete("/api/categories/delete/{category_id}")
async def delete_category(
        category_id: int,
        db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.delete_category(category_id, db)


# ####################### #
#
#    Notes routes
#
# ####################### #
@app.post("/api/notes/create", response_model=_schemas.Note)
async def create_note(
        note: _schemas.NoteCreate,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.create_note(note, db)


@app.get("/api/notes/get-all")
async def get_notes(
        budget_id: int,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.get_notes(budget_id, db)


@app.get("/api/notes/get-single/{note_id}", response_model=_schemas.Note)
async def get_note(
        note_id: int,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.get_note(note_id, db)


@app.put("/api/notes/edit/{note_id}")
async def edit_note(
        note_id: int,
        note: _schemas.NoteEdit,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.edit_note(note_id, note, db)


@app.delete("/api/notes/delete/{note_id}")
async def delete_note(
        note_id: int,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.delete_note(note_id, db)
