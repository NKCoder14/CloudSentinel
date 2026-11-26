from typing import Any

from pydantic import BaseModel, ConfigDict


class Evidence(BaseModel):
    """Stores evidence supporting a security finding."""

    model_config = ConfigDict(extra="forbid")

    field: str
    observed_value: Any
    expected_value: Any
    explanation: str