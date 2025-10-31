FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
# The service needs access to the parent directory's modules.
# We will handle this via volumes in docker-compose, but we copy them here
# to ensure the Docker image can be built independently if needed.
COPY ../valorai_encryption.py .
COPY ../bitcoin_anchor.py .
COPY ../valora_eth_keys.py .
COPY ../valor_pdf_writer.py .
COPY ../multi_anchor_merkle.py .

EXPOSE 5000
CMD ["python", "valorcloud_anchor_service.py"]