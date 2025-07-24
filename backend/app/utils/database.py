import psycopg2
from contextlib import contextmanager
from config.settings import DB_CONFIG

@contextmanager
def get_db_connection():
    """Context manager for database connections"""
    conn = None
    cursor = None
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        yield cursor, conn
    except Exception as e:
        if conn:
            conn.rollback()
        raise e
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()