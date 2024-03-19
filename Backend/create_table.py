from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import declarative_base

# Define the base class for declarative
Base = declarative_base()

class Patient(Base):
    __tablename__ = "patient"

    patient_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)  # Modified column definition
    age = Column(Integer)
    weight = Column(String)
    address = Column(String)
    doa = Column(String)
    contact_no = Column(String)
    hospital_id = Column(Integer)

class Doctor(Base):
    __tablename__ = "doctor"

    id = Column(Integer, primary_key=True, index=True)
    symptoms = Column(String)
    disease = Column(String)
    medicine = Column(String)
    diagnosis = Column(String)
    med_time = Column(String)
    hospital_id = Column(Integer)
    patient_id = Column(Integer)


class Login(Base):
    __tablename__ = "clinic_table"

    hospital_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True)  # Modified column definition
    password = Column(String)
    hospital_name = Column(String)

# Database connection URL
DATABASE_URL = "mssql+pyodbc://sa:sa@KARTIKEY-PC/Clinic?driver=ODBC+Driver+17+for+SQL+Server"

# Create engine and connect to the database
engine = create_engine(DATABASE_URL)

# Create the tables in the database
Base.metadata.create_all(engine)
