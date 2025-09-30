FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN pip install --no-cache-dir requests schedule markdown-pdf web3 boto3 pydrive
CMD ["python3", "scheduler.py"]