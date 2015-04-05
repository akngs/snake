from settings import *


SECRET_KEY = 'hello'
DEBUG = True
TEMPLATE_DEBUG = True


# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# E-mail
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
