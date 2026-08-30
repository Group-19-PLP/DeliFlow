import json
import os
from datetime import datetime

LOG_FILE_PATH = "docs/timing_logs.json"

def record_rehearsal_metrics():
    print("=== Reflex Presentation Rehearsal Log Sheet ===")
    pitch_time = input("Enter presentation pitch duration (MM:SS): ")
    exam_time = input("Enter panel cross-examination mock duration (MM:SS): ")
    flags = input("Enter slide titles that caused pacing bottlenecks/stumbles: ")
    
    log_payload = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "pitch_duration": pitch_time,
        "examination_duration": exam_time,
        "identified_bottlenecks": flags.split(',') if flags else []
    }
    
    logs = []
    if os.path.exists(LOG_FILE_PATH):
        with open(LOG_FILE_PATH, 'r') as f:
            try: logs = json.load(f)
            except: pass
            
    logs.append(log_payload)
    
    with open(LOG_FILE_PATH, 'w') as f:
        json.dump(logs, f, indent=2)
    print(f"Metrics successfully written to database system directory tracking log: {LOG_FILE_PATH}")

if __name__ == "__main__":
    record_rehearsal_metrics()
