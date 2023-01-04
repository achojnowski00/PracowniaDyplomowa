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
    user: _schemas.User = _fastapi.Depends(get_current_user),
    db: _orm.Session = _fastapi.Depends(get_db)
):
    budget = db.query(_models.Budget).filter(
        _models.Budget.id == budget_id).first()

    if (budget == None):
        raise _fastapi.HTTPException(
            status_code=404, detail="Nie prawidłowe ID budżetu, nieznaleziono budżetu")
        
    if(user.id not in [user.id for user in budget.users]):
        raise _fastapi.HTTPException(
            status_code=404, detail="Nie masz dostępu do tego budżetu")

    return budget


async def get_users_from_budget(
    budget_id: int,
    db: _orm.Session = _fastapi.Depends(get_db)
):
    budget = db.query(_models.Budget).filter(
        _models.Budget.id == budget_id).first()

    if (budget == None):
        raise _fastapi.HTTPException(
            status_code=404, detail="Nie prawidłowe ID budżetu, nieznaleziono budżetu")

    return budget.users


async def get_all_budgets(
    user: _schemas.User = _fastapi.Depends(get_current_user),
    db: _orm.Session = _fastapi.Depends(get_db)
):
    get_budgets = db.query(_models.Budget).filter(
        _models.Budget.users.any(_models.User.id == user.id)).all()

    return get_budgets

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


# ####################### #
#
#    Cattegory functions
#
# ####################### #
async def create_category(
    category: _schemas.CategoryCreate,
    db: _orm.Session = _fastapi.Depends(get_db)
):
    category_obj = _models.Category(
        name=category.name,
        isOutcome=category.isOutcome
    )

    db.add(category_obj)
    db.commit()
    db.refresh(category_obj)

    return category_obj


async def get_categories(
    witch: str,
    db: _orm.Session = _fastapi.Depends(get_db)
):
    if (witch == "all"):
        return db.query(_models.Category).all()
    if (witch == "incomes"):
        return db.query(_models.Category).filter(
            _models.Category.isOutcome == False).all()
    if (witch == "outcomes"):
        return db.query(_models.Category).filter(
            _models.Category.isOutcome == True).all()


async def get_category(
    category_id: int,
    db: _orm.Session = _fastapi.Depends(get_db)
):
    category = db.query(_models.Category).filter(
        _models.Category.id == category_id).first()

    if (category == None):
        raise _fastapi.HTTPException(
            status_code=404, detail="Nie prawidłowe ID kategorii, nieznaleziono kategorii")

    return category


async def edit_category(
    category_id: int,
    category: _schemas.CategoryEdit,
    db: _orm.Session = _fastapi.Depends(get_db)
):
    category_obj = db.query(_models.Category).get(category_id)

    if (category_obj == None):
        raise _fastapi.HTTPException(
            status_code=404, detail="Nie prawidłowe ID kategorii, nieznaleziono kategorii")

    if (category.name):
        category_obj.name = category.name
    if (category.isOutcome):
        category_obj.isOutcome = category.isOutcome

    db.commit()
    db.refresh(category_obj)

    return category_obj


async def delete_category(
    category_id: int,
    db: _orm.Session = _fastapi.Depends(get_db)
):
    category_obj = db.query(_models.Category).get(category_id)

    if (category_obj == None):
        raise _fastapi.HTTPException(
            status_code=404, detail="Nie prawidłowe ID kategorii, nieznaleziono kategorii")

    db.delete(category_obj)
    db.commit()

    return category_obj


# ####################### #
#
#    Notes functions
#
# ####################### #
async def create_note(
    note: _schemas.NoteCreate,
    db: _orm.Session = _fastapi.Depends(get_db)
):
    note_obj = _models.Note(
        title=note.title,
        description=note.description,
        budget_id=note.budget_id
    )

    db.add(note_obj)
    db.commit()
    db.refresh(note_obj)

    return note_obj


async def get_notes(
    budget_id: int,
    db: _orm.Session = _fastapi.Depends(get_db)
):
    return db.query(_models.Note).filter(
        _models.Note.budget_id == budget_id).all()


async def get_note(
    note_id: int,
    db: _orm.Session = _fastapi.Depends(get_db)
):
    note = db.query(_models.Note).filter(
        _models.Note.id == note_id).first()

    if (note == None):
        raise _fastapi.HTTPException(
            status_code=404, detail="Nie prawidłowe ID notatki, nieznaleziono notatki")

    return note


async def edit_note(
    note_id: int,
    note: _schemas.NoteEdit,
    db: _orm.Session = _fastapi.Depends(get_db)
):
    note_obj = db.query(_models.Note).get(note_id)

    if (note_obj == None):
        raise _fastapi.HTTPException(
            status_code=404, detail="Nie prawidłowe ID notatki, nieznaleziono notatki")

    if (note.title):
        note_obj.title = note.title
    if (note.description):
        note_obj.description = note.description

    db.commit()
    db.refresh(note_obj)

    return note_obj


async def delete_note(
    note_id: int,
    db: _orm.Session = _fastapi.Depends(get_db)
):
    note_obj = db.query(_models.Note).get(note_id)

    if (note_obj == None):
        raise _fastapi.HTTPException(
            status_code=404, detail="Nie prawidłowe ID notatki, nieznaleziono notatki")

    db.delete(note_obj)
    db.commit()

    return {"message": "Notatka usunięta"}


# ########################## #
#
#    Transaction functions
#
# ########################## #
async def create_transaction(
    transaction: _schemas.TransactionCreate,
    db: _orm.Session = _fastapi.Depends(get_db),
    user: _schemas.User = _fastapi.Depends(get_current_user)
):
    transaction_obj = _models.Transaction(
        isOutcome=transaction.isOutcome,
        title=transaction.title,
        description=transaction.description,
        amount=transaction.amount,
        budget_id=transaction.budget_id,
        category_id=transaction.category_id,
        who_created_id=user.id
    )

    db.add(transaction_obj)
    db.commit()
    db.refresh(transaction_obj)

    return transaction_obj


async def edit_transaction(
    transaction_id: int,
    transaction: _schemas.TransactionUpdate,
    db: _orm.Session = _fastapi.Depends(get_db)
):
    transaction_obj = db.query(_models.Transaction).get(transaction_id)

    if (transaction_obj == None):
        raise _fastapi.HTTPException(
            status_code=404, detail="Nie prawidłowe ID transakcji, nieznaleziono transakcji")

    # if (transaction.isOutcome):
    transaction_obj.isOutcome = transaction.isOutcome
    if (transaction.title):
        transaction_obj.title = transaction.title
    if (transaction.description or transaction.description == ""):
        transaction_obj.description = transaction.description
    if (transaction.amount):
        transaction_obj.amount = transaction.amount
    if (transaction.category_id):
        transaction_obj.category_id = transaction.category_id
    if (transaction.date):
        transaction_obj.date = transaction.date

    db.commit()
    db.refresh(transaction_obj)

    return transaction_obj


async def delete_transaction(
    transaction_id: int,
    db: _orm.Session = _fastapi.Depends(get_db),
    user: _schemas.User = _fastapi.Depends(get_current_user)
):
    transaction_obj = db.query(_models.Transaction).get(transaction_id)

    if (transaction_obj == None):
        raise _fastapi.HTTPException(
            status_code=404, detail="Nie prawidłowe ID transakcji, nieznaleziono transakcji")
    
    if(transaction_obj.who_created_id != user.id):
        raise _fastapi.HTTPException(
            status_code=403, detail="Nie masz uprawnień do usunięcia tej transakcji")

    db.delete(transaction_obj)
    db.commit()

    return {"message": "Transakcja usunięta"}


async def get_transaction(
    transaction_id: int,
    db: _orm.Session = _fastapi.Depends(get_db)
):
    transaction = db.query(_models.Transaction).filter(
        _models.Transaction.id == transaction_id).first()

    if (transaction == None):
        raise _fastapi.HTTPException(
            status_code=404, detail="Nie prawidłowe ID transakcji, nieznaleziono transakcji")

    return transaction


async def get_transactions(
    budget_id: int,
    db: _orm.Session = _fastapi.Depends(get_db)
):
    return db.query(_models.Transaction).filter(
        _models.Transaction.budget_id == budget_id).order_by(_models.Transaction.date.desc()).all()


async def get_transactions_by_category(
    budget_id: int,
    category_id: int,
    db: _orm.Session = _fastapi.Depends(get_db)
):
    return db.query(_models.Transaction).filter(
        _models.Transaction.budget_id == budget_id,
        _models.Transaction.category_id == category_id).order_by(_models.Transaction.date.desc()).all()


async def get_transactions_by_date(
    budget_id: int,
    date_from: str,
    date_to: str,
    db: _orm.Session = _fastapi.Depends(get_db)
):
    return db.query(_models.Transaction).filter(
        _models.Transaction.budget_id == budget_id,
        _models.Transaction.date >= date_from,
        _models.Transaction.date <= date_to).order_by(_models.Transaction.date.desc()).all()
