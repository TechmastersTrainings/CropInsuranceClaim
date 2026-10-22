# Blockchain Crop Insurance System - Backend

## Tech Stack

- Python 3.11+
- Django 5
- Django REST Framework
- PostgreSQL
- JWT Authentication
- Hardhat (Blockchain)
- React (Frontend)

## Project Structure

```text
backend/
│
├── accounts/
├── farmers/
├── insurance/
├── weather/
├── claims/
├── core/
│
├── config/
├── media/
├── staticfiles/
│
├── manage.py
├── requirements.txt
└── README.md
```

## Installation

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

## Database

Create PostgreSQL database

```sql
CREATE DATABASE crop_insurance_db;
```

Configure `config/settings.py`.

## Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

## Create Super User

```bash
python manage.py createsuperuser
```

## Run Server

```bash
python manage.py runserver
```

## API Base URL

```
http://127.0.0.1:8000/api/
```

## Apps

- accounts
- farmers
- insurance
- weather
- claims
- core