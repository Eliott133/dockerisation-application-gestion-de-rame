# BASE SERVER CONFIGURATION
# General
# use 0.0.0.0:5000 for a docker deployment
SERVER_HOST = '0.0.0.0'
SERVER_PORT = 5001
DEBUG = False
# CORS Configuration
ENABLE_CORS = True  # Enable CORS compliancy only if the front app is served by another server (mostly in dev. conf)

# SQL PRODUCTION DB CONNECTION CONFIGURATION
SQLDB_SETTINGS = {
    "db": 'prod-db',  # mandatory
    "user": 'user',  # mandatory
    "password": 'krWmP2PL',  # mandatory
    "host": 'sql-db',  # default localhost
    "port": 3306  # default 3306
}

# MONGODB HISOTRY DB CONNECTION CONFIGURATION
MONGODB_SETTINGS = {
    "db": "db-prod",  # Mandatory
    "host": "nosql-db",  # default localhost
    "port": 27017,  # default 27017
    "username": "root",  # Optional
    "password": "password",  # Optional
    "authentication_source": "admin"  # default is the db
}
