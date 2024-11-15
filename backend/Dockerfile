# Use a Python base image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .

# Install dependencies
RUN if [ "$(uname)" = "Darwin" ] || [ "$(uname)" = "Linux" ]; then \
        pip install --no-cache-dir -r requirements.txt; \
    elif [ "$(uname)" = "MINGW"* ]; then \
        pip install --no-cache-dir -r requirements-windows.txt; \
    else \
        echo "Unsupported OS"; \
    fi

# Copy the entire backend folder into the container
COPY backend/ .

# Expose the port that the app will run on (e.g., 8000)
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
