# MidnightMP3

**MidnightMP3** is a minimal, stylized MP3 player built with **Electron**, featuring a custom UI, Python-powered audio playback, and smooth animated track titles. It's designed to be lightweight, fast, and highly extensiblem making it ideal for integration into AI workflows or creative tools.

---

## Features

- Load and play `.mp3` files via system dialog  
- Pause, resume, and stop playback  
- Dynamic track title display with **scrolling animation** for long names  
- Volume slider for output control  
- Frameless custom UI with Quit button  
- Custom background with aesthetic visuals  
- Python backend for precise audio control (using `pygame.mixer`)  
- Designed for easy expansion and AI integration

---

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Python 3](https://www.python.org/) (required for audio backend)
- Git

---

### Install & Run


    # Clone the repo
    git clone https://github.com/kpuentec/MidnightMP3.git
    cd MidnightMP3

    # Install dependencies
    npm install

    # Run the app
    npm start

---
### File Structure

MidnightMP3/
├── assets/              # Images (background, play/pause icons)
├── index.html           # Main UI structure
├── styles.css           # Custom styling
├── renderer.js          # Frontend logic (button handling, text scrolling)
├── main.js              # Electron main process
├── player.py            # Python audio engine using pygame
├── package.json         # App metadata and dependencies
├── package-lock.json
├── node_modules/
├── .gitignore           
├── LICENSE

