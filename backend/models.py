from datetime import datetime, timezone
from typing import Optional, List
import enum
from sqlalchemy import String, Integer, DateTime, ForeignKey, JSON, Boolean, Text, Enum
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

# Base class for SQLAlchemy 2.0 Declarative models
class Base(DeclarativeBase):
    pass

class DocType(enum.Enum):
    PRESCRIPTION = "prescription"
    LAB_REPORT = "lab_report"
    DISCHARGE_SUMMARY = "discharge_summary"
    OTHER = "other"

class Patient(Base):
    """Stores core demographic data and ABDM identifier."""
    __tablename__ = 'patients'

    id: Mapped[int] = mapped_column(primary_key=True)
    abha_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    abha_number: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    phr_address: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    full_name: Mapped[str] = mapped_column(String(100))
    date_of_birth: Mapped[Optional[datetime]] = mapped_column(DateTime)
    gender: Mapped[str] = mapped_column(String(20))
    phone_number: Mapped[Optional[str]] = mapped_column(String(15))
    preferred_language: Mapped[str] = mapped_column(String(10), default="en")
    profile_photo: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    kyc_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    address_details: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    consent_record: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    encounters: Mapped[List["Encounter"]] = relationship(back_populates="patient", cascade="all, delete-orphan")
    documents: Mapped[List["ScannedDocument"]] = relationship(back_populates="patient", cascade="all, delete-orphan")

class Encounter(Base):
    """Represents a single clinical visit at the MediKiosk."""
    __tablename__ = 'encounters'

    id: Mapped[int] = mapped_column(primary_key=True)
    patient_id: Mapped[int] = mapped_column(ForeignKey('patients.id'))
    care_mode: Mapped[str] = mapped_column(String(20), default="allopathy") # "allopathy" | "ayush"
    chief_complaint: Mapped[str] = mapped_column(Text)
    
    # Flexible JSON storage for SOCRATES & AYUSH Dashavidha Pariksha
    hpi_data: Mapped[Optional[dict]] = mapped_column(JSON)
    ayush_data: Mapped[Optional[dict]] = mapped_column(JSON)
    vitals: Mapped[Optional[dict]] = mapped_column(JSON)
    
    # Emergency Triage & ABDM Status
    is_red_flag: Mapped[bool] = mapped_column(Boolean, default=False)
    triage_priority: Mapped[str] = mapped_column(String(30), default="ROUTINE") # "ROUTINE" | "URGENT" | "RED_FLAG_CRITICAL"
    red_flag_notes: Mapped[Optional[dict]] = mapped_column(JSON)
    
    # HL7 FHIR Bundle
    fhir_payload: Mapped[Optional[dict]] = mapped_column(JSON)
    status: Mapped[str] = mapped_column(String(30), default="pending_review")
    doctor_notes: Mapped[Optional[str]] = mapped_column(Text)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    patient: Mapped["Patient"] = relationship(back_populates="encounters")
    documents: Mapped[List["ScannedDocument"]] = relationship(back_populates="encounter")

class ScannedDocument(Base):
    """Stores metadata and AI OCR extracted data from uploaded medical records."""
    __tablename__ = 'scanned_documents'

    id: Mapped[int] = mapped_column(primary_key=True)
    patient_id: Mapped[int] = mapped_column(ForeignKey('patients.id'))
    encounter_id: Mapped[Optional[int]] = mapped_column(ForeignKey('encounters.id'))
    
    doc_type: Mapped[DocType] = mapped_column(Enum(DocType), default=DocType.PRESCRIPTION)
    file_url: Mapped[str] = mapped_column(String(255))
    raw_text: Mapped[Optional[str]] = mapped_column(Text)
    extracted_entities: Mapped[Optional[dict]] = mapped_column(JSON) 

    uploaded_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    patient: Mapped["Patient"] = relationship(back_populates="documents")
    encounter: Mapped["Encounter"] = relationship(back_populates="documents")
