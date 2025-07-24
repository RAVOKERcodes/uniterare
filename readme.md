# Rare Disease Database Application

## Prerequisites

- Python 3.7+
- PostgreSQL database
- Groq API key (for AI-powered features)
- Node.js and npm (for frontend development)
- Git (for version control)

## Installation

1. Install the required packages for backend:
```bash
pip install -r backend/requirements.txt
```
2. Install the required packages for frontend:
```bash
npm install
```

## Configuration

Create a `backend/.env` file in the project root directory with the following variables:

```env
# Database Configuration
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432

# Groq API Configuration
GROQ_API_KEY=your_groq_api_key

# Multi-threaded Loading Configuration
max_workers=5
```

## Database Setup

1. Create a new PostgreSQL database
2. Run the database initialization script:
   ```bash
   python3 backend/dbscript.py
   ```
   This will create the necessary tables and load initial data.

3. Run the FDA drugs database initialization script:
   ```bash
   python3 backend/dbscript_FDA_drugs.py
   ```
   This will create the necessary tables and load initial data.

## Loading Disease Data

### Option 1: Single-threaded Loading
For smaller datasets or testing:
```bash
python3 backend/single_data_loader.py
```

### Option 2: Multi-threaded Loading
For faster loading of large datasets:
```bash
python3 backend/multi_thread_loader.py
```

## Running the Application

1. Start the Flask backend:
```bash
python3 backend/rare_disease.py
```
2. Start the frontend development server:
```bash
npm run dev
```

## Project Structure

- `backend/rare_disease.py` - Main Flask application
- `backend/dbscript.py` - Database initialization script
- `backend/dbscript_FDA_drugs.py` - Database initialization script for FDA drugs
- `backend/single_data_loader.py` - Single-threaded data loader
- `backend/multi_thread_loader.py` - Multi-threaded data loader
- `backend/nord_rare_disease_database_export.csv` - Sample disease data
- `backend/requirements.txt` - Project dependencies

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DB_NAME | PostgreSQL database name | Yes |
| DB_USER | Database username | Yes |
| DB_PASSWORD | Database password | Yes |
| DB_HOST | Database host | Yes |
| DB_PORT | Database port | Yes |
| GROQ_API_KEY | Groq API key for AI features | Yes |
| max_workers | Number of threads for multi-threaded loading | Yes |

