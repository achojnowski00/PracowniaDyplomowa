import sqlalchemy as _sql
import sqlalchemy.ext.declarative as _declarative
import sqlalchemy.orm as _orm

# DATABASE_URL = "mysql+mysqldb://root:@localhost/inzynierka"
# DATABASE_URL = "mysql+mysqldb://root:@localhost/inzynierkaNEW"
DATABASE_URL = "mysql+mysqldb://root:@localhost/homeorganizer"
# DATABASE_URL = "sqlite:///./database.db"
# DATABASE_URL = "mysql+mysqldb://login:password@host/database"



engine = _sql.create_engine(DATABASE_URL)


SessionLocal = _orm.sessionmaker(
    autocommit=False, autoflush=False, bind=engine)

Base = _declarative.declarative_base()
