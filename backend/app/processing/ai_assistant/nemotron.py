import os
import requests
from dotenv import load_dotenv

load_dotenv()

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")

API_URL = "https://integrate.api.nvidia.com/v1/chat/completions"


def ask_nemotron(finding):

    # Input validation
    if not isinstance(finding, dict):
        raise TypeError("Finding must be a dictionary.")

    required_fields = ["name", "severity", "description"]

    for field in required_fields:
        if not finding.get(field):
            raise ValueError(f"Missing required field: {field}")

    if not NVIDIA_API_KEY:
        raise RuntimeError("NVIDIA API key is missing.")

    prompt = build_security_prompt(finding)

    headers = {
        "Authorization": f"Bearer {NVIDIA_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "nvidia/nemotron-3.5-lightning-30b-a3b",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.3,
        "max_tokens": 700,
        "chat_template_kwargs": {
            "enable_thinking": False
        }
    }

    # API request and error handling
    try:
        response = requests.post(
            API_URL,
            headers=headers,
            json=payload,
            timeout=60
        )

        response.raise_for_status()

    except requests.exceptions.Timeout:
        raise RuntimeError("Nemotron API request timed out.")

    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Nemotron API request failed: {e}")

    # Extract AI response
    try:
        result = response.json()["choices"][0]["message"]["content"]

    except (KeyError, IndexError, TypeError):
        raise ValueError("Unexpected response format from Nemotron.")

    if not result:
        raise ValueError("Nemotron returned an empty response.")

    # Structured output
    return {
        "finding_name": finding.get("name", "Unknown"),
        "severity": finding.get("severity", "Unknown"),
        "ai_analysis": result
    }


def analyze_findings(findings):

    results = []

    for finding in findings:

        try:
            result = ask_nemotron(finding)
            results.append(result)

        except Exception as e:
            results.append({
                "finding_name": (
                    finding.get("name", "Unknown")
                    if isinstance(finding, dict)
                    else "Unknown"
                ),
                "severity": (
                    finding.get("severity", "Unknown")
                    if isinstance(finding, dict)
                    else "Unknown"
                ),
                "ai_analysis": f"Analysis failed: {e}"
            })

    return results


def summarize_findings(findings):

    findings_text = ""

    for finding in findings:

        if not isinstance(finding, dict):
            continue

        findings_text += f"""
        Finding: {finding.get('name', 'Unknown')}
        Severity: {finding.get('severity', 'Unknown')}
        Description: {finding.get('description', 'Not provided')}
        ---
        """

    summary_finding = {
        "name": "Overall Security Audit Summary",
        "severity": "Multiple",
        "description": f"""
        Review the following security findings together and create
        an overall security audit summary.

        {findings_text}

        Include:
        - Overall security overview
        - Major risks identified
        - Recommended priorities
        - General defensive recommendations

        Do not invent facts or claim vulnerabilities were exploited.
        """
    }

    return ask_nemotron(summary_finding)


def build_security_prompt(finding):

    return f"""
    You are CloudSentinel, a defensive cloud security assistant.

    Analyze the security finding provided below.

    Finding: {finding.get('name', 'Unknown')}
    Severity: {finding.get('severity', 'Unknown')}
    Description: {finding.get('description', 'Not provided')}

    Return your answer using exactly these three sections:

    Explanation:
    Explain what the security issue means in simple language.

    Potential Impact:
    Describe the possible security risks without exaggerating.

    Remediation:
    Provide practical, defensive steps to fix the issue.

    Use simple, professional language.
    Do not invent facts or assume details that are not provided.
    """
def process_findings_report(findings):

    individual_results = analyze_findings(findings)

    overall_summary = summarize_findings(findings)

    return {
        "individual_analyses": individual_results,
        "overall_summary": overall_summary
    }