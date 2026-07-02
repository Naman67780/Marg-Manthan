# Marg-Manthan Python Service

This service handles data preprocessing, graph construction, and route search algorithms for the Marg-Manthan railway route planning system.

## Features

- **Data Preprocessing**: Load, clean, and normalize railway timetable data
- **Graph Construction**: Build NetworkX graph from railway connections
- **Route Search Algorithms**:
  - Direct train search
  - BFS for minimum train changes
  - Dijkstra for shortest distance
  - Modified Dijkstra for fastest route (considering waiting time and transfer penalties)
- **FastAPI Endpoints**: RESTful API for route search and station information

## Installation

```bash
cd backend/python_service
pip install -r requirements.txt
```

## Usage

### Preprocess Data (First Time Only)

```bash
python preprocess_data.py
```

This will:
1. Load the CSV data from `data/Train_details_clean.csv`
2. Clean and normalize station names
3. Build the railway network graph
4. Save the graph and indexes to `data/` directory

### Start the Service

```bash
python run_service.py
```

Or manually:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The service will start on `http://localhost:8000`

## API Endpoints

### Search Routes

```http
POST /search
Content-Type: application/json

{
  "source": "PUNE",
  "destination": "NDLS",
  "mode": "time"
}
```

Modes:
- `time`: Fastest route (default)
- `distance`: Shortest distance
- `changes`: Minimum train changes
- `direct`: Direct trains only

### Station Search

```http
GET /stations?q=PUN
```

### Station Details

```http
GET /station/PUNE
```

### Train Details

```http
GET /train/11077
```

### Health Check

```http
GET /health
```

### Statistics

```http
GET /stats
```

## Architecture

```
python_service/
├── app/
│   ├── __init__.py
│   └── main.py          # FastAPI application
├── graph/
│   ├── __init__.py
│   ├── graph_builder.py # Graph construction
│   └── route_search.py  # Search algorithms
├── preprocessing/
│   ├── __init__.py
│   └── data_loader.py   # Data preprocessing
├── data/                # Processed data storage
│   ├── graph.pkl
│   ├── station_index.json
│   └── train_index.json
├── requirements.txt
├── run_service.py       # Service startup script
└── preprocess_data.py   # Preprocessing script
```

## Integration with Node.js API

The Python service runs on port 8000, while the Node.js API runs on port 3000. The Node.js API acts as a gateway, forwarding route search requests to the Python service.

## Performance

- Preprocessing time: < 5 minutes (depends on dataset size)
- API response time: < 300ms
- Memory usage: < 1 GB
