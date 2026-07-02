import networkx as nx
import pandas as pd
import pickle
import json
import os
from typing import Dict, List, Tuple
from datetime import datetime, timedelta


class GraphBuilder:
    """Builds and manages the railway network graph."""
    
    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.graph = nx.DiGraph()
        self.station_index = {}  # station_code -> station_id
        self.reverse_station_index = {}  # station_id -> station_code
        self.train_index = {}  # train_no -> list of stations
        self.station_names = {}  # station_code -> station_name
        self.train_timetable = {}  # train_no -> list of stops
        self.next_station_id = 0
        
    def _get_station_id(self, station_code: str) -> int:
        """Get or create a station ID for a given station code."""
        if station_code not in self.station_index:
            self.station_index[station_code] = self.next_station_id
            self.reverse_station_index[self.next_station_id] = station_code
            self.next_station_id += 1
        return self.station_index[station_code]
    
    def _parse_time(self, time_str: str) -> datetime:
        """Parse time string (HH:MM) to datetime object."""
        if pd.isna(time_str) or time_str == '':
            return None
        
        try:
            time_str = str(time_str).strip()
            if ':' in time_str:
                hours, minutes = map(int, time_str.split(':'))
                return datetime(2024, 1, 1, hours, minutes)
        except:
            return None
        
        return None
    
    def _calculate_travel_time(self, departure: datetime, arrival: datetime) -> int:
        """Calculate travel time in minutes between two datetime objects."""
        if departure is None or arrival is None:
            return 0
        
        # Handle overnight trains
        if arrival < departure:
            arrival += timedelta(days=1)
        
        delta = arrival - departure
        return int(delta.total_seconds() / 60)
    
    def build_graph(self):
        """Build the railway network graph from the preprocessed dataframe."""
        print("Building railway network graph...")
        
        # Group by train number to process each train's route
        train_groups = self.df.groupby('train_no')
        
        for train_no, train_data in train_groups:
            train_name = train_data['train_name'].iloc[0]
            train_data = train_data.sort_values('seq')
            
            # Store train route in index
            self.train_index[train_no] = train_data['station_code'].tolist()
            
            # Store train timetable details
            timetable_list = []
            for _, row in train_data.iterrows():
                dist_val = 0
                try:
                    dist_val = int(row['distance']) if pd.notna(row['distance']) else 0
                except:
                    dist_val = 0
                timetable_list.append({
                    'station_code': row['station_code'],
                    'station_name': row['station_name'],
                    'train_name': train_name,
                    'arrival_time': row['arrival_time'] if pd.notna(row['arrival_time']) else '00:00:00',
                    'departure_time': row['departure_time'] if pd.notna(row['departure_time']) else '00:00:00',
                    'distance': dist_val,
                    'seq': int(row['seq'])
                })
            self.train_timetable[train_no] = timetable_list
            
            # Create edges between consecutive stations
            for i in range(len(train_data) - 1):
                current_row = train_data.iloc[i]
                next_row = train_data.iloc[i + 1]
                
                from_station = current_row['station_code']
                to_station = next_row['station_code']
                
                from_id = self._get_station_id(from_station)
                to_id = self._get_station_id(to_station)
                
                departure_time = self._parse_time(current_row['departure_time'])
                arrival_time = self._parse_time(next_row['arrival_time'])
                
                distance = 0
                try:
                    distance = int(current_row['distance']) if pd.notna(current_row['distance']) else 0
                except:
                    distance = 0
                
                travel_time = self._calculate_travel_time(departure_time, arrival_time)
                
                # Store station names
                self.station_names[from_station] = current_row['station_name']
                self.station_names[to_station] = next_row['station_name']
                
                # Add edge with all relevant information
                edge_data = {
                    'train_no': train_no,
                    'train_name': train_name,
                    'from_station': from_station,
                    'to_station': to_station,
                    'departure_time': current_row['departure_time'],
                    'arrival_time': next_row['arrival_time'],
                    'distance': distance,
                    'travel_time': travel_time
                }
                
                self.graph.add_edge(from_id, to_id, **edge_data)
        
        print(f"Graph built with {self.graph.number_of_nodes()} stations and {self.graph.number_of_edges()} connections")
        print(f"Indexed {len(self.station_index)} stations and {len(self.train_index)} trains")
    
    def get_station_connections(self, station_code: str) -> List[Dict]:
        """Get all connections from a given station."""
        if station_code not in self.station_index:
            return []
        
        station_id = self.station_index[station_code]
        connections = []
        
        for _, _, edge_data in self.graph.out_edges(station_id, data=True):
            connections.append(edge_data)
        
        return connections
    
    def save_graph(self, graph_path: str, station_index_path: str, train_index_path: str, station_names_path: str = None, train_timetable_path: str = None):
        """Save the graph and indexes to disk."""
        print(f"Saving graph to {graph_path}...")
        with open(graph_path, 'wb') as f:
            pickle.dump(self.graph, f)
        
        print(f"Saving station index to {station_index_path}...")
        with open(station_index_path, 'w') as f:
            json.dump(self.station_index, f)
        
        print(f"Saving train index to {train_index_path}...")
        with open(train_index_path, 'w') as f:
            json.dump(self.train_index, f)
            
        if station_names_path:
            print(f"Saving station names to {station_names_path}...")
            with open(station_names_path, 'w') as f:
                json.dump(self.station_names, f)
                
        if train_timetable_path:
            print(f"Saving train timetable to {train_timetable_path}...")
            with open(train_timetable_path, 'w') as f:
                json.dump(self.train_timetable, f)
        
        print("Graph and indexes saved successfully!")
    
    def load_graph(self, graph_path: str, station_index_path: str, train_index_path: str, station_names_path: str = None, train_timetable_path: str = None):
        """Load the graph and indexes from disk."""
        print(f"Loading graph from {graph_path}...")
        with open(graph_path, 'rb') as f:
            self.graph = pickle.load(f)
        
        print(f"Loading station index from {station_index_path}...")
        with open(station_index_path, 'r') as f:
            self.station_index = json.load(f)
        
        print(f"Loading train index from {train_index_path}...")
        with open(train_index_path, 'r') as f:
            self.train_index = json.load(f)
            
        if station_names_path and os.path.exists(station_names_path):
            print(f"Loading station names from {station_names_path}...")
            with open(station_names_path, 'r') as f:
                self.station_names = json.load(f)
        else:
            self.station_names = {}
            
        if train_timetable_path and os.path.exists(train_timetable_path):
            print(f"Loading train timetable from {train_timetable_path}...")
            with open(train_timetable_path, 'r') as f:
                self.train_timetable = json.load(f)
        else:
            self.train_timetable = {}
        
        # Rebuild reverse station index
        self.reverse_station_index = {v: k for k, v in self.station_index.items()}
        self.next_station_id = max(self.station_index.values()) + 1 if self.station_index else 0
        
        print("Graph and indexes loaded successfully!")
