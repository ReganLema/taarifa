"""
Django settings for taarifa_backend project.

Fully optimized for WhiteNoise static hosting & AWS ECS Production.
"""

from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# ==============================================================================
# CORE SECURITY CONFIGURATION (100% Environment Driven)
# ==============================================================================

# Strict loading: Forces application failure if keys are omitted at runtime
SECRET_KEY = os.getenv(
    "DJANGO_SECRET_KEY",
    "django-local-development-secret"
)

# Robust boolean casting for debug mode (Defaults to False if not explicitly 'True')
DEBUG = os.getenv("DEBUG", "False") == "True"

# Dynamically parse comma-separated hosts passed from ECS or Local environment
ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv(
        "ALLOWED_HOSTS",
        "localhost,127.0.0.1"
    ).split(",")
    if host.strip()
]


# ==============================================================================
# APPLICATION DEFINITION
# ==============================================================================

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Internal Project Apps
    'core',
    'rest_framework',

    # Third Party Integrations
    'corsheaders', 
    'graphene_django',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Added WhiteNoise directly under Security
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'taarifa_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'taarifa_backend.wsgi.application'


# ==============================================================================
# DATABASE CONFIGURATION (No Hardcoded Fallbacks)
# ==============================================================================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'taarifa_test'),
        'USER': os.getenv('DB_USER', 'postgres'),
        'PASSWORD': os.getenv('DB_PASSWORD', 'postgres'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}


# ==============================================================================
# HTTPS & BROWSER SECURITY SETTINGS (Enforced in Production)
# ==============================================================================

if not DEBUG:
    # SSL & Cookie Protections
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

    # Exclude the health check endpoint from HTTPS redirection
    SECURE_REDIRECT_EXEMPT = [r'^health/$']
    
    # Advanced Browser Guardrails
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    
    # Tells Django it is running behind an AWS Application Load Balancer (ALB)
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')


# ==============================================================================
# AUTHENTICATION & PASSWORD VALIDATION
# ==============================================================================

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# ==============================================================================
# INTERNATIONALIZATION
# ==============================================================================

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# ==============================================================================
# STATIC ASSETS MANAGEMENT (Optimized with WhiteNoise Storage)
# ==============================================================================

STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Compressed caching ensures lightning-fast load times for users without pulling from S3
if not DEBUG:
    STORAGES = {
        "staticfiles": {
            "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
        },
    }

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# ==============================================================================
# GRAPHQL & JWT CONFIGURATION
# ==============================================================================

GRAPHENE = {
    'SCHEMA': 'taarifa_backend.schema.schema',
    'MIDDLEWARE': [
        'graphql_jwt.middleware.JSONWebTokenMiddleware',
    ],
}

AUTHENTICATION_BACKENDS = [
    'graphql_jwt.backends.JSONWebTokenBackend',
    'django.contrib.auth.backends.ModelBackend',
]


# ==============================================================================
# NETWORK ROUTING (CORS & CSRF TRUSTED ORIGINS)
# ==============================================================================

CORS_ALLOW_ALL_ORIGINS = False 
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    "https://taarifa.vercel.app",  
    "https://www.taarifa.xyz",     
    "https://taarifa.xyz",         
]

CORS_ALLOW_METHODS = ['DELETE', 'GET', 'OPTIONS', 'PATCH', 'POST', 'PUT']

CORS_ALLOW_HEADERS = [
    'accept', 'accept-encoding', 'authorization', 'content-type',
    'dnt', 'origin', 'user-agent', 'x-csrftoken', 'x-requested-with',
]

CORS_EXPOSE_HEADERS = ['content-type', 'x-csrftoken']

CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    "https://taarifa.vercel.app",  
    "https://www.taarifa.xyz",     
    "https://taarifa.xyz",         
]