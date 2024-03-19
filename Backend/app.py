import uvicorn
import pickle
import pathlib
from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File
from database import  SessionLocal
from sqlalchemy.orm import Session
from create_table import Login
from create_table import Patient
from create_table import Doctor
from fastapi.middleware.cors import CORSMiddleware
import datetime
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from pydantic import BaseModel
from datetime import timedelta
from fastapi.responses import JSONResponse
import speech_recognition as sr
from pydub import AudioSegment
import speech_recognition as sr
from fastapi import File, UploadFile
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from fastapi.responses import FileResponse
import os
from PIL import Image
import assemblyai as aai

# Temporarily change PosixPath to WindowsPath
temp = pathlib.PosixPath
pathlib.PosixPath = pathlib.WindowsPath

app = FastAPI()

SECRET_KEY = "jwt token"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# OAuth2PasswordBearer object to handle token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)



def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
# Authenticate user
def authenticate_user(username: str, password: str, db: Session):
    user = db.query(Login).filter(Login.username == username, Login.password == password).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

#C:\Users\Kartikey\Desktop\MedTalk Ai\Backend\app.py
# Create JWT token
def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Dependency to get current user
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(Login).filter(Login.username == username).first()
    if user is None:
        raise credentials_exception
    return user

class Token(BaseModel):
    access_token: str
    token_type: str
    hospital_id: int
# Login endpoint to generate JWT token

@app.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_db = db.query(Login).filter(Login.username == form_data.username).first()
    hospital_id = user_db.hospital_id
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "hospital_id": hospital_id}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer", hospital_id=hospital_id)

def check_hospital_access(current_user: Login = Depends(get_current_user), hospital_id: int = None):
    if current_user.hospital_id != hospital_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access forbidden")

def check_patient_access(current_user: Login = Depends(get_current_user), hospital_id: int = None, patient_id: int = None):
    if current_user.hospital_id != hospital_id or current_user.patient_id != patient_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access forbidden")

# Load the NER model using pickle
with open("modelFinal.pkl", "rb") as f:
    nlp_ner = pickle.load(f)

# Load the NER model using pickle
with open("modelDoc.pkl", "rb") as f:
    nlp_ner_doc = pickle.load(f)
    
# Revert the changes back to the original value
pathlib.PosixPath = temp

@app.get('/')
def index():
    return {'message': 'Hello, World'}


# @app.post('/login')
# def authenticate_user(username: str, password: str, db: Session = Depends(get_db)):
#     # Check if the username and password match the data in the database
#     user = db.query(Login).filter(Login.username == username, Login.password == password).first()
#     if not user:
#         raise HTTPException(status_code=401, detail="Invalid username or password")
    
#     # Return success along with the hospital ID
#     return {"message": "Login successful", "hospital_id": user.hospital_id}

@app.get("/fetch_hospital_name")
async def get_hospital_name(hospital_id: int, db: Session = Depends(get_db)):
    login = db.query(Login).filter(Login.hospital_id == hospital_id).first()
    if not login:
        return {"error": "Hospital not found"}
    return {"hospital_name": login.hospital_name}

# Route to predict entities
# @app.post('/newpatient')
# def predict_entities(text: str):
#     # Process the text using the NER model
#     doc = nlp_ner(text)
    
#     # Extract mapped entities
#     mapped = []
#     for ent in doc.ents:
#         mapped.append({
#             "value": ent.text,
#             "label": ent.label_
#         })
    
#     return mapped

def get_session_local():
    return SessionLocal()

@app.post('/newpatient')
async def add_new_patient(
    hospital_id: int,
    audio_file: UploadFile = File(...),
    current_user: Login = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    check_hospital_access(current_user, hospital_id)
    
        # Convert MP3 audio file to WAV format
    audio_content = await audio_file.read()
    with open("../input.mp3", "wb") as f:
        f.write(audio_content)
    audio = AudioSegment.from_mp3("../input.mp3")
    audio.export("../output.wav", format="wav")
    
    # # Perform speech recognition
    # r = sr.Recognizer()
    # with sr.AudioFile("../output.wav") as source:
    #     audio_data = r.record(source)


    #     # Use Google Speech Recognition to transcribe the audio
    #     text = r.recognize_google(audio_data, language='en-US')
    #     print("Transcription:", text)
    aai.settings.api_key = "YOUR API KEY"
    transcriber = aai.Transcriber()
    
    transcript = transcriber.transcribe("../output.wav")

    # print(transcript.text)
    text_without_dash = transcript.text.replace("-", "")
    # Process the text using the NER model
    doc = nlp_ner( text_without_dash)
    
    
    
    # Extract mapped entities
    patient_data = {}
    for ent in doc.ents:
        patient_data[ent.label_] = ent.text
    
    # Initialize a new Patient object
    doa = datetime.datetime.now().strftime("%Y-%m-%d") if "DATE OF ADMISSION" not in patient_data else patient_data["DATE OF ADMISSION"]
    age = patient_data.get("AGE")
    try:
        age = int(age)
    except ValueError:
        age = None
    new_patient = Patient(
        name=patient_data.get("NAME OF PATIENT", None),
    age=age,
    weight=f"{patient_data.get('WEIGHT', None)} kg" if patient_data.get("WEIGHT") is not None else None,
    contact_no=patient_data.get("NUMBER", None),
    address=patient_data.get("ADDRESS", None),
    doa=doa,
    hospital_id=hospital_id
    )
    
    # Save the new patient to the database
    try:
        db.add(new_patient)
        db.commit()
        db.refresh(new_patient)
        return {"message": "Patient added successfully", "patient_id": new_patient.patient_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add patient: {str(e)}")
    
    
@app.get("/patients/{hospital_id}")
async def get_patients(
    hospital_id: int, 
    current_user: Login = Depends(get_current_user),
    db: Session = Depends(get_db)):
    check_hospital_access(current_user, hospital_id)
    patients = db.query(Patient).filter(Patient.hospital_id == hospital_id).all()
    if not patients:
        return {"message": "No patients found for this hospital"}
    
    # Extract patient names and dates of admission
    patient_data = [{"name": patient.name, "doa": patient.doa, "id":patient.patient_id} for patient in patients]
    
    return {"patients": patient_data}

@app.post('/doctorconversation')
async def predict_entities(
    patient_id: int,
    hospital_id: int,
    audio_file: UploadFile = File(...),
    current_user: Login = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    #check_patient_access(current_user, hospital_id, patient_id)
    check_hospital_access(current_user, hospital_id)

        # Convert MP3 audio file to WAV format
    audio_content = await audio_file.read()
    with open("input.mp3", "wb") as f:
        f.write(audio_content)
    audio = AudioSegment.from_mp3("input.mp3")
    audio.export("output.wav", format="wav")
    
    # Perform speech recognition
    r = sr.Recognizer()
    with sr.AudioFile("output.wav") as source:
        audio_data = r.record(source)

    try:
        # Use Google Speech Recognition to transcribe the audio
        text = r.recognize_google(audio_data, language='en-US')
        print("Transcription:", text)
    except sr.UnknownValueError:
        return JSONResponse(status_code=400, content={"error": "Speech recognition could not understand the audio"})
    except sr.RequestError as e:
        return JSONResponse(status_code=500, content={"error": f"Failed to request speech recognition service: {str(e)}"})
    
    # Process the text using the NER model
    doc = nlp_ner_doc(text)
    
    # Extract mapped entities and concatenate values for the same label
    entities = {}
    for ent in doc.ents:
        if ent.label_ not in entities:
            entities[ent.label_] = ent.text
        else:
            entities[ent.label_] += f", {ent.text}"
    
    # Initialize a new Doctor object
    new_record = Doctor(
        symptoms=entities.get("SYMPTOMS", None),
        disease=entities.get("DISEASE", None),
        medicine=entities.get("MEDICINE", None),
        diagnosis=entities.get("DIAGNOSIS", None),
        med_time=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        hospital_id=hospital_id,
        patient_id=patient_id
    )
    
    # Save the new record to the database
    try:
        db.add(new_record)
        db.commit()
        db.refresh(new_record)
        return {"message": "Doctor's conversation recorded successfully", "record_id": new_record.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to record doctor's conversation: {str(e)}")
    
# @app.get("/doctors/{hospital_id}/{patient_id}")
# def get_doctors(patient_id: int, hospital_id: int, db: Session = Depends(get_db)):
#     doctors = db.query(Doctor).filter(Doctor.patient_id == patient_id, Doctor.hospital_id == hospital_id).all()
#     if not doctors:
#         return {"message": "No doctors found for this patient in the specified hospital"}
    
#     # Extract doctor details
#     doctor_data = []
#     for doctor in doctors:
#         doctor_data.append({
#             "id": doctor.id,
#             "symptoms": doctor.symptoms,
#             "disease": doctor.disease,
#             "medicine": doctor.medicine,
#             "diagnosis": doctor.diagnosis,
#             "med_time": doctor.med_time
#         })
    
#     return {"doctors": doctor_data}

@app.get("/patients_and_doctors/{hospital_id}/{patient_id}")
async def get_patients_and_doctors(
    patient_id: int, 
    hospital_id: int,
    current_user: Login = Depends(get_current_user),
    db: Session = Depends(get_db)):
    # Fetch patient details
    check_hospital_access(current_user, hospital_id)
    patient = db.query(Patient).filter(Patient.patient_id == patient_id, Patient.hospital_id == hospital_id).first()
    if not patient:
        return {"message": "No patient found for this ID and hospital"}
    
    patient_data = {
        "patient_id": patient.patient_id,
        "name": patient.name,
        "age": patient.age,
        "weight": patient.weight,
        "contact_no": patient.contact_no,
        "address": patient.address,
        "doa": patient.doa
    }

    # Fetch doctor details
    doctors = db.query(Doctor).filter(Doctor.patient_id == patient_id, Doctor.hospital_id == hospital_id).all()
    if not doctors:
        return {"patient": patient_data, "doctors": []}  # Return empty list for doctors if not found
    
    doctor_data = []
    for doctor in doctors:
        doctor_data.append({
            "id": doctor.id,
            "symptoms": doctor.symptoms,
            "disease": doctor.disease,
            "medicine": doctor.medicine,
            "diagnosis": doctor.diagnosis,
            "med_time": doctor.med_time
        })
    
    return {"patient": patient_data, "doctors": doctor_data}
@app.get("/generate_pdf/{hospital_id}/{patient_id}")
async def generate_pdf(
    patient_id: int, 
    hospital_id: int,
    current_user: Login = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch patient details
    check_hospital_access(current_user, hospital_id)
    patient = db.query(Patient).filter(Patient.patient_id == patient_id, Patient.hospital_id == hospital_id).first()
    if not patient:
        return {"message": "No patient found for this ID and hospital"}
    
    patient_data = {
        "Patient ID": patient.patient_id,
        "Name": patient.name,
        "Age": patient.age,
        "Weight": patient.weight,
        "Contact No": patient.contact_no,
        "Address": patient.address,
        "Date of Admission": patient.doa
    }

    # Fetch doctor details
    doctors = db.query(Doctor).filter(Doctor.patient_id == patient_id, Doctor.hospital_id == hospital_id).all()
    doctor_data = []
    for doctor in doctors:
        doctor_data.append({
            "ID": doctor.id,
            "Symptoms": doctor.symptoms,
            "Disease": doctor.disease,
            "Medicine": doctor.medicine,
            "Diagnosis": doctor.diagnosis,
            "Medication Time": doctor.med_time
        })

    # Generate PDF
    pdf_filename = f"patient_{patient_id}_report.pdf"
    pdf_path = f"C:/Users/Kartikey/Desktop/test/{pdf_filename}"  # Update the path where you want to save the PDF
    
    c = canvas.Canvas(pdf_path, pagesize=letter)
    y = 750
    for key, value in patient_data.items():
        if value:  # Exclude empty or null fields
            c.drawString(100, y, f"{key}: {value}")
            y -= 20
    
    y -= 20
    c.drawString(100, y, "Doctor's Details:")
    y -= 20
    for doctor in doctor_data:
        for key, value in doctor.items():
            if value:  # Exclude empty or null fields
                c.drawString(120, y, f"{key}: {value}")
                y -= 20
    c.save()

    # Download PDF
    return FileResponse(pdf_path, filename=pdf_filename)

@app.post("/logout")
async def logout():
    return {"message": "User logged out successfully"}


if __name__ == '__main__':
    uvicorn.run(app, host='127.0.0.1', port=8000)
# uvicorn app:app --reload
# docker build -t models .
# Run the Docker container
# docker run -d -p 8000:8000 models
# uvicorn app:app --reload --host 127.0.0.1 --port 8000






