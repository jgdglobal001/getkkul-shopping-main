import os
import subprocess
import sys

def kill_process_on_port(port):
    try:
        # Find process using the port
        result = subprocess.run(
            f'netstat -ano | findstr :{port}',
            shell=True,
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            print(f"No process found on port {port}")
            return
        
        lines = result.stdout.strip().split('\n')
        pids = set()
        
        for line in lines:
            parts = line.split()
            if len(parts) >= 5 and 'LISTENING' in line:
                pid = parts[-1]
                if pid.isdigit():
                    pids.add(pid)
        
        if not pids:
            print(f"No LISTENING process found on port {port}")
            return
        
        # Kill each process
        for pid in pids:
            print(f"Killing process {pid}...")
            subprocess.run(f'taskkill /F /PID {pid}', shell=True)
        
        print(f"Successfully killed {len(pids)} process(es)")
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    kill_process_on_port(3002)

