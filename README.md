# TallmanChat

A modern, colorful ChatGPT-like UI that interfaces with Ollama Phi3 LLM, featuring a dual-pass processing system for optimal response quality.

## Features

- **Modern Design**: Beautiful gradient background with colorful, responsive UI
- **Dual-Pass Processing**: Makes two calls to the LLM - first for initial response, then for refinement
- **Copy Functionality**: Easy one-click copying of responses to clipboard
- **Privacy Focused**: Clear privacy notices about internal network usage
- **Real-time Status**: Visual indicators for model status and processing state
- **Responsive Design**: Works on both desktop and mobile devices

## Prerequisites

Before running TallmanChat, ensure you have:

1. **Node.js** (version 18 or higher)
2. **Ollama** installed and running
3. **Phi3 model** downloaded in Ollama

### Setting up Ollama with Phi3

1. Install Ollama from [https://ollama.ai](https://ollama.ai)
2. Download the Phi3 model:
   ```bash
   ollama pull phi3
   ```
3. Start Ollama service:
   ```bash
   ollama serve
   ```
4. Verify Ollama is running on `http://localhost:11434`

## Installation

1. Navigate to the project directory:
   ```bash
   cd tallmanchat
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

## Running the Application

### Startup (Windows/PowerShell)

1. **Start Ollama backend:**
   ```powershell
   ollama serve
   ```
2. **Start the development server:**
   ```powershell
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:5173`
4. Ensure the Phi3 model is loaded in Ollama before submitting prompts.

### Stopping the Application

- Press `Ctrl+C` in each terminal to stop the dev server and Ollama backend.
- If a process hangs or you get a port conflict (EADDRINUSE), run:
  ```powershell
  Get-Process -Name node | Stop-Process -Force
  Get-Process -Name ollama | Stop-Process -Force
  ```
  This will ensure all related processes are stopped and ports are freed.

## How It Works

### Dual-Pass Processing System

TallmanChat implements a sophisticated two-step processing approach:

1. **First Pass**: Your prompt is sent directly to the Phi3 model to generate an initial response
2. **Second Pass**: The initial response is refined using a specialized prompt that:
   - Retains only context relevant to your original prompt
   - Ensures accuracy and removes unnecessary information
   - Makes the response more concise and focused

Only the refined second response is displayed to you, ensuring optimal quality.

### API Integration

The application connects to Ollama's API at `http://localhost:11434/api/generate` with the following configuration:
- Model: `phi3`
- Stream: `false` (for complete responses)
- Dual API calls for processing refinement

## Usage

### User Instructions

1. Make sure both Ollama and the dev server are running (see above).
2. Enter your prompt in the chat input area.
3. Click the "Send" button.
4. Wait for the dual-pass processing to complete (status indicators will show progress).
5. View the refined response in the chat window.
6. Use the "Copy" button to copy the response to your clipboard.

If you encounter errors, see the Troubleshooting section below.

## Privacy & Security

- All prompts and responses are private to Tallman
- Only available on Tallman's internal network
- No data is stored or transmitted outside the local environment
- No login required, no history maintained

## Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Troubleshooting

### "Unable to connect to Ollama" Error

This error appears when:
- Ollama is not running
- Phi3 model is not installed
- Ollama is running on a different port

**Solutions:**
1. Ensure Ollama is running: `ollama serve`
2. Install Phi3 model: `ollama pull phi3`
3. Check Ollama is accessible at `http://localhost:11434`

### Dependencies Installation Issues

If you encounter dependency conflicts:
```bash
npm install --legacy-peer-deps --force
```

## Code Structure

```
/tallmanchat
├── public/                # Static assets
├── src/                   # Main React source code
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   ├── components/        # UI and logic components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   └── assets/            # Images, icons, etc.
├── package.json           # NPM dependencies and scripts
├── vite.config.js         # Vite configuration
├── README.md              # This file
└── ...
```

- `npm run dev` starts the app in development mode
- `npm run build` creates a production build in `/dist`

## Ollama Interface Details

- **API Endpoint:** `http://localhost:11434/api/generate`
- **Model:** `phi3`
- **Request:** JSON POST with prompt and options
- **Dual-Pass Logic:**
  1. First API call: sends user prompt, gets initial response.
  2. Second API call: sends refined prompt (context-aware), gets improved response.
- **Security:** All requests are local, no external data storage or transmission.

## Technical Details

- **Framework**: React 18 with Vite
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: Sonner
- **API**: Ollama REST API

## Copyright

© 2025 TallmanChat. All rights reserved.  
Made by MIFECO

