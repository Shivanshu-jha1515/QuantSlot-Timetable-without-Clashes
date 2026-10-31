"""
main.py - FastAPI Backend for QuantSlot Quantum Timetable Optimizer
"""

import io
import csv
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

try:
    from backend.timetable_qubo import solve_timetable, get_sample_dataset, count_clashes
except ImportError:
    from timetable_qubo import solve_timetable, get_sample_dataset, count_clashes

app = FastAPI(
    title="QuantSlot Quantum Timetable Optimizer API",
    description="Quantum-inspired timetable optimization for academic institutions using QUBO.",
    version="1.0.0",
)

# Enable CORS for local Vite dev server and cloud environments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ClassItem(BaseModel):
    id: Any
    name: str
    teacher: Optional[str] = ""
    group: Optional[str] = ""
    room: Optional[str] = ""
    preferred_slot: Optional[int] = None


class WeightsModel(BaseModel):
    A: float = Field(default=5.0, description="H1: One-slot-per-class penalty weight")
    B: float = Field(default=8.0, description="H2: Conflict penalty weight")
    C: float = Field(default=1.0, description="H3: Soft preference & balance weight")


class OptimizeRequest(BaseModel):
    classes: List[ClassItem]
    slots: int = Field(default=12, ge=1, le=60, description="Total number of timetable slots")
    weights: Optional[WeightsModel] = Field(default_factory=WeightsModel)
    reads: Optional[int] = Field(default=30, ge=1, le=200, description="Number of annealing reads")


class OptimizeResponse(BaseModel):
    assignment: Dict[str, int]
    clashes_before: int
    clashes_after: int
    solve_time_ms: float
    solver_used: str
    details: List[Dict[str, Any]]


@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "QuantSlot Quantum-Inspired Timetable Optimizer",
        "version": "1.0.0",
    }


@app.get("/api/sample")
def get_sample():
    """
    Returns a benchmark academic sample dataset (30 classes, 12 slots).
    """
    try:
        sample = get_sample_dataset()
        return sample
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate sample data: {str(e)}")


@app.post("/api/optimize", response_model=OptimizeResponse)
def optimize_timetable(payload: OptimizeRequest):
    """
    Accepts classes, slot count, penalty weights, and annealing reads.
    Formulates QUBO matrix and runs quantum-inspired annealing.
    """
    if not payload.classes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The classes list cannot be empty.",
        )

    if payload.slots <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The number of slots must be greater than zero.",
        )

    classes_dict = [c.model_dump() for c in payload.classes]
    weights_dict = payload.weights.model_dump() if payload.weights else {"A": 5.0, "B": 8.0, "C": 1.0}

    try:
        result = solve_timetable(
            classes=classes_dict,
            num_slots=payload.slots,
            weight_a=weights_dict.get("A", 5.0),
            weight_b=weights_dict.get("B", 8.0),
            weight_c=weights_dict.get("C", 1.0),
            reads=payload.reads or 30,
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Optimization solver error: {str(e)}",
        )


@app.post("/api/upload")
async def upload_csv(file: UploadFile = File(...)):
    """
    Parses an uploaded CSV file with columns (id, name, teacher, group, room).
    Returns list of parsed classes.
    """
    if not file.filename.endswith(".csv"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must be a valid .csv file.",
        )

    try:
        content = await file.read()
        text_stream = io.StringIO(content.decode("utf-8-sig"))
        reader = csv.DictReader(text_stream)

        # Normalize column header names
        classes = []
        for idx, row in enumerate(reader):
            normalized_row = {k.strip().lower(): v.strip() for k, v in row.items() if k}
            
            # Map required/optional fields
            class_id = normalized_row.get("id") or str(idx + 1)
            name = (
                normalized_row.get("name")
                or normalized_row.get("course")
                or normalized_row.get("coursename")
                or normalized_row.get("coursetitle")
                or normalized_row.get("title")
                or normalized_row.get("class")
                or normalized_row.get("subject")
                or f"Class {idx + 1}"
            )
            teacher = (
                normalized_row.get("teacher")
                or normalized_row.get("faculty")
                or normalized_row.get("instructor")
                or normalized_row.get("professor")
                or normalized_row.get("lecturer")
                or ""
            )
            group = (
                normalized_row.get("group")
                or normalized_row.get("section")
                or normalized_row.get("cohort")
                or normalized_row.get("batch")
                or normalized_row.get("department")
                or ""
            )
            room = (
                normalized_row.get("room")
                or normalized_row.get("classroom")
                or normalized_row.get("hall")
                or normalized_row.get("lab")
                or normalized_row.get("roomno")
                or ""
            )

            classes.append({
                "id": class_id,
                "name": name,
                "teacher": teacher,
                "group": group,
                "room": room,
            })

        if not classes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CSV file contains no valid class rows or headers.",
            )

        return {
            "count": len(classes),
            "classes": classes,
            "filename": file.filename,
        }
    except UnicodeDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to decode file. Please ensure it is saved in UTF-8 format.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error parsing CSV: {str(e)}",
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
