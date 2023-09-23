import sqlalchemy as _sql
import sqlalchemy.ext.declarative as _declarative
import sqlalchemy.orm as _orm

# DATABASE_URL = "mysql+mysqldb://root:@localhost/inzynierka"
# DATABASE_URL = "mysql+mysqldb://root:@localhost/inzynierkaNEW"
# DATABASE_URL = "mysql+mysqldb://root:@localhost/homeorganizer"
# DATABASE_URL = "sqlite:///./database.db"
# DATABASE_URL = "mysql+mysqldb://login:password@host/database"
# Extermal Database Url
DATABASE_URL = "postgresql://homeorg_user:8WEOd1dVyGNNeLsIdRfq8zwpnvzhO8sj@dpg-ck7ho9o8elhc73bbp7vg-a.frankfurt-postgres.render.com/homeorg"



engine = _sql.create_engine(DATABASE_URL)


SessionLocal = _orm.sessionmaker(
    autocommit=False, autoflush=False, bind=engine)

Base = _declarative.declarative_base()
