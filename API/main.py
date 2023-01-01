import datetime as _datetime
import fastapi as _fastapi
from fastapi.middleware.cors import CORSMiddleware
import fastapi.security as _security

from typing import List
import sqlalchemy.orm as _orm

import services as _services
import schemas as _schemas
import models as _models

app = _fastapi.FastAPI(
    title="Zarzadzanie budzetem domowym API",
    description="API stworzone na potrzeby pracy inżynierskiej",
    version="1.0.0",
    contact={
            "name": "me by email",
            "email": "155624@student.uwm.edu.pl"
    }
)

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ####################### #
#
#    Base route
#
# ####################### #
@app.get("/api")
async def root():
    return {"message": "Api is working"}


# ####################### #
#
#    User auth routes
#
# ####################### #
@app.post("/api/users/register", tags=["user"])
async def create_user(
    user: _schemas.UserCreate,
    db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    db_user = await _services.get_user_by_login(user.login, db)

    if db_user:
        raise _fastapi.HTTPException(
            status_code=400, detail="Użytkownik o podanym loginie jest już zarejestrowany")

    # return await _services.create_user(user, db)
    user_data = await _services.create_user(user, db)

    return await _services.create_token(user_data)


@app.post("/api/users/token", tags=["user"])
async def generate_token(form_data: _security.OAuth2PasswordRequestForm = _fastapi.Depends(), db: _orm.Session = _fastapi.Depends(_services.get_db)):
    user = await _services.authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise _fastapi.HTTPException(
            status_code=401, detail="Nieprawidłowe dane logowania")

    return await _services.create_token(user)


@app.get("/api/users/me", response_model=_schemas.UsersOutput, tags=["user"])
async def get_user(user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return user


@app.delete("/api/users/delete", tags=["user"])
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


@app.put("/api/users/update", tags=["user"])
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
@app.post("/api/budgets/create", response_model=_schemas.Budget, tags=["budget"])
async def create_budget(
        budget: _schemas.BudgetCreate,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.create_budget(budget, db, user)


# wywołanie: http://127.0.0.1:8000/api/add-to-budget?budget_id=2&user_id=2
@app.post("/api/budgets/add-to-budget", response_model=_schemas.Budget, tags=["budget"])
async def add_user_to_budget(
        budget_id: int,
        user_id: int,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.add_user_to_budget(budget_id, user_id, db)


@app.get("/api/budgets/get-single/{budget_id}", response_model=_schemas.BudgetOutput, tags=["budget"])
async def get_budget(
        budget_id: int,
        user: _schemas.User = _fastapi.Depends(_services.get_current_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_budget(budget_id, db)


@app.get("/api/budgets/get-users/{budget_id}", response_model=List[_schemas.User], tags=["budget"])
async def get_users_from_budget(
        budget_id: int,
        user: _schemas.User = _fastapi.Depends(_services.get_current_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_users_from_budget(budget_id, db)

@app.get("/api/budgets/get-all", response_model=List[_schemas.Budget], tags=["budget"])
async def get_all_budgets(
        user: _schemas.User = _fastapi.Depends(_services.get_current_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_all_budgets(user, db)

@app.delete("/api/budgets/remove-user/{budget_id}", tags=["budget"])
async def delete_user_from_budget(
        budget_id: int,
        user_id: int,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.delete_user_from_budget(budget_id, user_id, db)


@app.put("/api/budgets/edit/{budget_id}", tags=["budget"])
async def edit_budget(
        budget_id: int,
        budget: _schemas.BudgetCreate,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.edit_budget(budget_id, budget, db)


# ####################### #
#
#    Transactions routes
#
# ####################### #
@app.post("/api/transaction/create", response_model=_schemas.TransactionDisplay, tags=["transaction"])
async def create_transaction(
        transaction: _schemas.TransactionCreate,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.create_transaction(transaction, db, user)


@app.get("/api/transaction/get-single/{transaction_id}", response_model=_schemas.TransactionDisplay, tags=["transaction"])
async def get_transaction(
        transaction_id: int,
        user: _schemas.User = _fastapi.Depends(_services.get_current_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_transaction(transaction_id, db)


@app.get("/api/transaction/get-all/{budget_id}", response_model=List[_schemas.TransactionDisplay], tags=["transaction"])
async def get_transactions_of_budget(
        budget_id: int,
        user: _schemas.User = _fastapi.Depends(_services.get_current_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_transactions(budget_id, db)


@app.get("/api/transaction/get-all/{budget_id}/{category_id}", response_model=List[_schemas.TransactionDisplay], tags=["transaction"])
async def get_transactions_with_specific_category(
        budget_id: int,
        category_id: int,
        user: _schemas.User = _fastapi.Depends(_services.get_current_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_transactions_by_category(budget_id, category_id, db)


@app.put("/api/transaction/edit/{transaction_id}", tags=["transaction"])
async def edit_transaction(
        transaction_id: int,
        transaction: _schemas.TransactionUpdate,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.edit_transaction(transaction_id, transaction, db)


@app.delete("/api/transaction/delete/{transaction_id}", tags=["transaction"])
async def delete_transaction(
        transaction_id: int,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.delete_transaction(transaction_id, db)


# ####################### #
#
#    Cattegories routes
#
# ####################### #
@app.post("/api/categories/create", response_model=_schemas.Category, tags=["category"])
async def create_category(
        category: _schemas.CategoryCreate,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.create_category(category, db)


@app.get("/api/categories/get-all", tags=["category"])
async def get_categories(
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.get_categories("all", db)


@app.get("/api/categories/get-outcomes", tags=["category"])
async def get_outcomes(
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.get_categories("outcomes", db)


@app.get("/api/categories/get-incomes", tags=["category"])
async def get_incomes(
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.get_categories("incomes", db)


@app.get("/api/categories/get-single/{category_id}", response_model=_schemas.Category, tags=["category"])
async def get_category(
        category_id: int,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.get_category(category_id, db)


@app.put("/api/categories/edit/{category_id}", tags=["category"])
async def edit_category(
        category_id: int,
        category: _schemas.CategoryEdit,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.edit_category(category_id, category, db)


@app.delete("/api/categories/delete/{category_id}", tags=["category"])
async def delete_category(
        category_id: int,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.delete_category(category_id, db)


# ####################### #
#
#    Notes routes
#
# ####################### #
@app.post("/api/notes/create", response_model=_schemas.Note, tags=["notes"])
async def create_note(
        note: _schemas.NoteCreate,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.create_note(note, db)


@app.get("/api/notes/get-all", tags=["notes"])
async def get_notes(
        budget_id: int,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.get_notes(budget_id, db)


@app.get("/api/notes/get-single/{note_id}", response_model=_schemas.Note, tags=["notes"])
async def get_note(
        note_id: int,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.get_note(note_id, db)


@app.put("/api/notes/edit/{note_id}", tags=["notes"])
async def edit_note(
        note_id: int,
        note: _schemas.NoteEdit,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.edit_note(note_id, note, db)


@app.delete("/api/notes/delete/{note_id}", tags=["notes"])
async def delete_note(
        note_id: int,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return await _services.delete_note(note_id, db)
