from settings import *


SECRET_KEY = 'THIS-is-a-secret-key-or-this-is-a-SECRET-key-meIVt35CHbpsjv8d'
DEBUG = True
TEMPLATE_DEBUG = True

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# Static files
STATIC_ROOT = '/home/ubuntu/prjs/snake/static_root/'

# E-mail
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'email-smtp.us-east-1.amazonaws.com'
EMAIL_HOST_USER = 'AKIAIZF2J6ZR6YFAMM4Q'
EMAIL_HOST_PASSWORD = 'AlMQfFuIIrI32R9zK0Q4Luc2TMUWIVVBHnVpmD0KWiyZ'
EMAIL_USE_TLS = True
