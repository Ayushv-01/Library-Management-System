class Config(object):
    DEBUG = False
    TESTING = False

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///library.sqlite3'
    SECRET_KEY = '214bf57e9365a5dd28dfe94b'
    SECURITY_PASSWORD_SALT = '23cd9d1366a421ad84b02b53'
    SQLALCHEMY_TRACK_MODIFICATION =False
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = "Authentication-Token"
    