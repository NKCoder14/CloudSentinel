from app.ingestion.snapshot import load_snapshot
from app.processing.parser import parse_config


def test_file(filename):

    print("\nTesting:", filename)

    try:
        with open("sample_data/" + filename, "rb") as file:
            content = file.read()

        raw_data = load_snapshot(content)
        result = parse_config(raw_data)

        print("SUCCESS: Configuration is valid")
        print("Total resources:", result["total_resources"])

    except Exception as error:
        print("REJECTED:", error)


if __name__ == "__main__":

    test_file("aws_config.json")
    test_file("invalid_config.json")
    test_file("missing_field_config.json")
    test_file("wrong_type_config.json")