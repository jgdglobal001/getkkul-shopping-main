const { execSync } = require('child_process');

function killPort(port) {
  try {
    console.log(`Finding process on port ${port}...`);
    
    // Find process
    const result = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
    const lines = result.trim().split('\n');
    const pids = new Set();
    
    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      if (line.includes('LISTENING') && parts.length >= 5) {
        const pid = parts[parts.length - 1];
        if (/^\d+$/.test(pid)) {
          pids.add(pid);
        }
      }
    });
    
    if (pids.size === 0) {
      console.log(`No process found on port ${port}`);
      return;
    }
    
    // Kill processes
    pids.forEach(pid => {
      console.log(`Killing process ${pid}...`);
      try {
        execSync(`taskkill /F /PID ${pid}`, { stdio: 'inherit' });
      } catch (e) {
        console.log(`Failed to kill ${pid}`);
      }
    });
    
    console.log(`Successfully killed ${pids.size} process(es)`);
    
  } catch (error) {
    if (error.message.includes('command failed')) {
      console.log(`No process found on port ${port}`);
    } else {
      console.error('Error:', error.message);
    }
  }
}

killPort(3002);

