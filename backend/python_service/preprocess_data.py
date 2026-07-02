#!/usr/bin/env python3
"""
Preprocessing script for Marg-Manthan.
This script loads the raw CSV data, preprocesses it, and builds the graph.
"""

import os
import sys

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from preprocessing.data_loader import DataLoader
from graph.graph_builder import GraphBuilder

def main():
    """Main preprocessing pipeline."""
    print("=" * 60)
    print("Marg-Manthan Data Preprocessing")
    print("=" * 60)
    
    # Data paths
    DATA_PATH = "../data/Train_details_clean.csv"
    GRAPH_PATH = "../data/graph.pkl"
    STATION_INDEX_PATH = "../data/station_index.json"
    TRAIN_INDEX_PATH = "../data/train_index.json"
    STATION_NAMES_PATH = "../data/station_names.json"
    TRAIN_TIMETABLE_PATH = "../data/train_timetable.json"
    
    # Check if data file exists
    if not os.path.exists(DATA_PATH):
        print(f"Error: Data file not found at {DATA_PATH}")
        print("Please ensure the CSV file is in the correct location.")
        return
    
    # Create data directory if it doesn't exist
    os.makedirs("../data", exist_ok=True)
    
    # Step 1: Load and preprocess data
    print("\n[Step 1/3] Loading and preprocessing data...")
    data_loader = DataLoader(DATA_PATH)
    df = data_loader.preprocess()
    
    # Step 2: Build graph
    print("\n[Step 2/3] Building railway network graph...")
    graph_builder = GraphBuilder(df)
    graph_builder.build_graph()
    
    # Step 3: Save graph and indexes
    print("\n[Step 3/3] Saving graph and indexes...")
    graph_builder.save_graph(GRAPH_PATH, STATION_INDEX_PATH, TRAIN_INDEX_PATH, STATION_NAMES_PATH, TRAIN_TIMETABLE_PATH)
    
    print("\n" + "=" * 60)
    print("Preprocessing completed successfully!")
    print("=" * 60)
    print(f"\nGraph saved to: {GRAPH_PATH}")
    print(f"Station index saved to: {STATION_INDEX_PATH}")
    print(f"Train index saved to: {TRAIN_INDEX_PATH}")
    print(f"Station names saved to: {STATION_NAMES_PATH}")
    print(f"Train timetable saved to: {TRAIN_TIMETABLE_PATH}")
    print(f"\nYou can now start the FastAPI service with: python run_service.py")

if __name__ == "__main__":
    main()
