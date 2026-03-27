# Scribd PDF Compiler

A userscript designed for desktop environments to display documents on Scribd without ad interruptions and to support consistent PDF generation (beta version).

## Compatibility

This script is strictly limited to desktop environments and is not compatible with mobile devices.

- Supported:
  - Desktop browsers (Google Chrome, Microsoft Edge, Mozilla Firefox)
  - Operating Systems: Windows, macOS, Linux

- Not Supported:
  - Android devices
  - iOS devices
  - Mobile browsers (including Desktop Mode)
  - Any mobile-based userscript environments

I tested it on 27 March 2026; this script simply cannot be run on a smartphone.

This limitation is due to the absence of the necessary feature (Developer Options); even if that feature were present, the script would still not run.

## Requirements

- A supported desktop browser:
  - Google Chrome / Chromium-based browser
  - Microsoft Edge
  - Mozilla Firefox

- Tampermonkey extension installed and enabled

## Installation

### 1. Install Tampermonkey

Download and install Tampermonkey from the official website:  
https://www.tampermonkey.net/

### 2. Enable Developer Mode (Chromium-based browsers)

For Chrome / Edge:
- Open: `chrome://extensions/`
- Enable **Developer Mode** (top-right corner)

For Firefox:
- No additional configuration is typically required

### 3. Get the Script

The userscript is located in this repository:

- [`scribd-pdf-compiler.user.py`](https://github.com/Xdit133/scribd-pdf-compiler/blob/main/src/scribd-pdf-compiler.user.js)

Open the file and copy its contents for manual installation.

### 4. Install the Script

1. Open the Tampermonkey Dashboard  
2. Click **"Create a new script"**  
3. Remove the default template code  
4. Paste the script into the editor  
5. Save using **Ctrl + S**

## Usage

1. Navigate to: https://www.scribd.com/  
2. Open any document  
3. The script will execute automatically

## Notes

- Ensure the script is enabled in Tampermonkey  
- Refresh the page after installation  
- Functionality may break if Scribd updates its internal structure or rendering system  

## Disclaimer

This project is intended for educational and research purposes only.  
Users are solely responsible for any use or misuse of this script.
## License

MIT License
