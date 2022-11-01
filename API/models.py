import datetime as _dt

import sqlalchemy as _sql
import sqlalchemy.orm as _orm
import passlib.hash as _hash

import database as _db


user_has_budget = _sql.Table("user_has_budget", _db.Base.metadata,
                             _sql.Column("user_id", _sql.Integer,
                                         _sql.ForeignKey("users.id")),
                             _sql.Column("budget_id", _sql.Integer,
                                         _sql.ForeignKey("budgets.id"))
                             )


class User(_db.Base):
    __tablename__ = "users"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    login = _sql.Column(_sql.String(64), unique=True, index=True)
    hashed_password = _sql.Column(_sql.String(256))
    name = _sql.Column(_sql.String(64), default="Twoja nazwa użytkownika")

    budgets = _orm.relationship(
        "Budget", secondary=user_has_budget, back_populates="users")
    transactions = _orm.relationship(
        "Transaction", back_populates="who_created")

    def verify_password(self, password):
        return _hash.bcrypt.verify(password, self.hashed_password)


class Budget(_db.Base):
    __tablename__ = "budgets"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    name = _sql.Column(_sql.String(64))

    users = _orm.relationship(
        "User", secondary=user_has_budget, back_populates="budgets")

    transactions = _orm.relationship("Transaction", back_populates="budget")
    notes = _orm.relationship("Note", back_populates="budget")


class Category(_db.Base):
    __tablename__ = "categories"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    name = _sql.Column(_sql.String(64), nullable=False)
    isOutcome = _sql.Column(_sql.Boolean, default=True)

    transactions = _orm.relationship("Transaction", back_populates="category")


class Transaction(_db.Base):
    __tablename__ = "transactions"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    isOutcome = _sql.Column(_sql.Boolean, default=True)
    title = _sql.Column(_sql.String(64), nullable=False)
    description = _sql.Column(_sql.String(256))
    amount = _sql.Column(_sql.Float, nullable=False)
    date = _sql.Column(_sql.DateTime, default=_dt.datetime.utcnow)

    budget_id = _sql.Column(_sql.Integer, _sql.ForeignKey("budgets.id"))
    category_id = _sql.Column(_sql.Integer, _sql.ForeignKey("categories.id"))
    who_created_id = _sql.Column(_sql.Integer, _sql.ForeignKey("users.id"))

    budget = _orm.relationship("Budget", back_populates="transactions")
    category = _orm.relationship("Category", back_populates="transactions")
    who_created = _orm.relationship("User", back_populates="transactions")


class Note(_db.Base):
    __tablename__ = "notes"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    title = _sql.Column(_sql.String(64), nullable=True)
    description = _sql.Column(_sql.String(256))
    date = _sql.Column(_sql.DateTime, default=_dt.datetime.utcnow)
    budget_id = _sql.Column(_sql.Integer, _sql.ForeignKey("budgets.id"))

    budget = _orm.relationship("Budget", back_populates="notes")


# Create database
# If you have any table in database, you can't create it again
# First delete all tables from database and then run this script
_db.Base.metadata.create_all(bind=_db.engine)
