from fastapi import FastAPI, UploadFile, File, HTTPException
from app.ingestion.snapshot import load_snapshot
from app.processing.parser import parse_config

app = FastAPI(
    title="CloudSentinel API",
    description="Automated Cloud Security Audit Engine",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "Welcome to CloudSentinel!",
        "status": "API is running"
    }


@app.post("/upload-config")
async def upload_config(file: UploadFile = File(...)):

    # Check file extension
    if not file.filename.lower().endswith(".json"):
        raise HTTPException(
            status_code=400,
            detail="Only JSON files are allowed"
        )

    try:
        # Read uploaded file
        content = await file.read()

        # Load JSON snapshot
        raw_data = load_snapshot(content)

        # Validate, extract and normalize resources
        result = parse_config(raw_data)

        return {
            "message": "Configuration uploaded successfully",
            "audit_status": "Ready for security audit",
            "data": result
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred"
        )