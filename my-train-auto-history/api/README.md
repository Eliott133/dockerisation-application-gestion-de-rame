# Requirements
- mysqlclient support (see https://github.com/PyMySQL/mysqlclient)
- A SQL database (Mariadb recommended)
- A Mongodb database

# Installation

According to your environment you might want to use a virtual environment.

Install all requirements from requirements.txt (`pip install -r requirements.txt`).

# Configuration

Set config.py according to your environment:
- Global server configuration
- Production database configuration (SQL database)
- History database configuration (MongoDb database)

# Test Deployment

Start the standalone application:
```
python MyRamesServer.py [options]
```
or 
```
sh start-server.sh [options]
```

# Production Deployment

TBA.