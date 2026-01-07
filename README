# Traffic Sign Classification App

A robust Computer Vision web application that detects and classifies traffic signs (Stop Signs, Speed Limits, Traffic Lights, Crosswalks) in real-time. Built with **Flask**, **YOLOv8**, and **PostgreSQL**, and fully containerized with **Docker**.

![Project Status](https://img.shields.io/badge/status-active-success)
![Python](https://img.shields.io/badge/Python-3.12-blue)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED)

## Features

* **AI-Powered Detection:** Uses a custom-trained YOLOv8 model for high-accuracy object detection.
* **Interactive UI:** Modern Drag-and-Drop interface with real-time visual feedback.
* **Persistent Logging:** Automatically saves prediction results, timestamps, and detection counts to a PostgreSQL database.
* **Production Ready:** Fully containerized with Docker for consistent deployment across environments.
* **Data Persistence:** Docker Volume mapping ensures images and logs survive container restarts.

## Tech Stack

* **Backend:** Flask (Python)
* **AI/ML:** Ultralytics YOLOv8, OpenCV, Pillow
* **Database:** PostgreSQL, SQLAlchemy 2.0 (ORM), Flask-Migrate
* **Frontend:** HTML5, CSS3, JavaScript (Fetch API)
* **DevOps:** Docker, Docker Compose (Ready), WSL2

---

## Getting Started

### Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.
* [Git](https://git-scm.com/) installed.
* *(Optional)* Python 3.12+ and PostgreSQL for local non-Docker development.

### 1. Clone the Repository
```bash
git clone https://github.com/TherealArav/yolo_traficsign_classification_app.git
cd traffic-sign-classifier
````

### 2. Configure Environment Variables

Create a `.env` file in the root directory. **Do not commit this file.**

``` TOML
# .env
DB_USER=img_classification_traffic_admin
DB_PASSWORD=admin123
DB_NAME=img_classification_traffic_db
# For local dev use 'localhost'. Docker overrides this automatically.
DB_HOST=localhost 
```

---

## Running with Docker (Recommended)

This application is containerized to run seamlessly on any machine.

### 1. Build the Image

``` Bash
docker build -t img_classification_trafic_app .
```

### 2. Run the Container

This command connects the app to your host's database and maps the output folder so you can see the results locally.

```Bash
docker run -p 5000:5000 \
  -e DB_HOST=host.docker.internal \
  -v $(pwd)/static/predictions:/app/static/predictions \
  img_classification_trafic_app
```

- **Access the App:** Open `http://localhost:5000` in your browser.

- **View Database:** Your local Postgres instance will be populated with prediction logs.
    

---

## Running Locally (Without Docker)

If you want to develop or debug the Python code directly:

1. **Install Dependencies:**

    ``` bash
    pip install -r requirements.txt
    ```
2. Setup Database:
    
    Ensure your local PostgreSQL server is running and the user/database exists (see commands below).
    
3. **Run Migrations:**
    
    ``` bash
    flask db init
    flask db migrate -m "Initial migration"
    flask db upgrade
    ```
    
4. **Start the Server:**
    
    ```bash
    python app.py
    ```
---
## Database Setup (SQL)

If setting up the database manually for the first time, run these commands in your Postgres shell (`psql`):

``` SQL
CREATE DATABASE img_classification_traffic_db;
CREATE USER img_classification_traffic_admin WITH PASSWORD 'admin123';
GRANT ALL PRIVILEGES ON DATABASE img_classification_traffic_db TO img_classification_traffic_admin;

-- Connect to the DB and grant schema access (Postgres 15+)
\c img_classification_traffic_db
GRANT ALL ON SCHEMA public TO img_classification_traffic_admin;
```

---
## Project Structure

```Plaintext
traffic-sign-classifier/
├── static/
│   ├── css/style.css       # Frontend styling
│   ├── js/script.js        # Upload logic & drag-and-drop
│   └── predictions/        # Output folder for processed images
├── templates/
│   └── index.html          # Main application page
├── app.py                  # Main Flask application entry point
├── Dockerfile              # Docker build instructions
├── requirements.txt        # Python dependencies
├── .env                    # Secrets (Not tracked by Git)
└── README.md               # Documentation
```
## License

Distributed under the MIT License. See `LICENSE` for more information.