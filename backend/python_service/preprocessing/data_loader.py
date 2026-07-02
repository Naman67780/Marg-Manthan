import pandas as pd
from typing import Dict, List
import re


class DataLoader:
    """Handles loading and initial preprocessing of railway timetable data."""
    
    def __init__(self, csv_path: str):
        self.csv_path = csv_path
        self.df = None
        
    def load_data(self) -> pd.DataFrame:
        """Load the CSV data into a pandas DataFrame."""
        self.df = pd.read_csv(self.csv_path)
        
        # Rename columns to snake_case
        column_mapping = {
            'Train No': 'train_no',
            'Train Name': 'train_name',
            'SEQ': 'seq',
            'Station Code': 'station_code',
            'Station Name': 'station_name',
            'Arrival time': 'arrival_time',
            'Departure Time': 'departure_time',
            'Distance': 'distance',
            'Source Station': 'source_station',
            'Source Station Name': 'source_station_name',
            'Destination Station': 'destination_station',
            'Destination Station Name': 'destination_station_name'
        }
        self.df = self.df.rename(columns=column_mapping)
        
        print(f"Loaded {len(self.df)} records from {self.csv_path}")
        return self.df
    
    def clean_data(self) -> pd.DataFrame:
        """Clean the dataset by removing duplicates and handling missing values."""
        if self.df is None:
            raise ValueError("Data not loaded. Call load_data() first.")
        
        # Remove duplicate rows
        initial_count = len(self.df)
        self.df = self.df.drop_duplicates()
        removed = initial_count - len(self.df)
        print(f"Removed {removed} duplicate records")
        
        # Handle missing values
        self.df = self.df.dropna(subset=['station_code', 'station_name'])
        
        # Convert distance to numeric, handle non-numeric values
        self.df['distance'] = pd.to_numeric(self.df['distance'], errors='coerce')
        
        return self.df
    
    def normalize_station_names(self) -> pd.DataFrame:
        """Normalize station names to handle variations in spelling and formatting."""
        if self.df is None:
            raise ValueError("Data not loaded. Call load_data() first.")
        
        # Convert to uppercase and strip whitespace
        self.df['station_name'] = self.df['station_name'].str.upper().str.strip()
        self.df['station_code'] = self.df['station_code'].str.upper().str.strip()
        
        # Remove common punctuation variations
        self.df['station_name'] = self.df['station_name'].str.replace(r'\.', '', regex=True)
        self.df['station_name'] = self.df['station_name'].str.replace(r'\s+', ' ', regex=True)
        
        # Normalize common variations
        self.df['station_name'] = self.df['station_name'].str.replace('C S T', 'CST')
        self.df['station_name'] = self.df['station_name'].str.replace('C.ST', 'CST')
        
        return self.df
    
    def get_station_list(self) -> Dict[str, str]:
        """Get a dictionary of station codes to station names."""
        if self.df is None:
            raise ValueError("Data not loaded. Call load_data() first.")
        
        stations = self.df[['station_code', 'station_name']].drop_duplicates()
        return dict(zip(stations['station_code'], stations['station_name']))
    
    def get_train_list(self) -> List[Dict]:
        """Get a list of all trains with their source and destination."""
        if self.df is None:
            raise ValueError("Data not loaded. Call load_data() first.")
        
        # Sort to ensure sequence is correct
        df_sorted = self.df.sort_values(['train_no', 'seq'])
        trains = df_sorted.groupby(['train_no', 'train_name']).agg({
            'source_station': 'first',
            'source_station_name': 'first',
            'destination_station': 'last',
            'destination_station_name': 'last'
        }).reset_index()
        
        return trains.to_dict('records')
    
    def preprocess(self) -> pd.DataFrame:
        """Run the complete preprocessing pipeline."""
        print("Starting data preprocessing...")
        self.load_data()
        self.clean_data()
        self.normalize_station_names()
        print("Preprocessing completed successfully!")
        return self.df
