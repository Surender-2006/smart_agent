import sys
from pdfminer.high_level import extract_text

def main():
    pdf_path = r"C:\\Users\\suren\\OneDrive\\Desktop\\Smart Agent\\EcoGrid_AI_Multi_Agent_System_Design_Document.pdf"
    try:
        text = extract_text(pdf_path)
        # Print first 2000 characters (approx first few pages)
        print(text[:2000])
    except Exception as e:
        print(f"Error extracting PDF: {e}", file=sys.stderr)

if __name__ == "__main__":
    main()
