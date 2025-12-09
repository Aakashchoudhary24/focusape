# Study Timer — Pure Focus

> "One subject. One goal. One timer. One screen."

A minimalist, single-screen web application designed to help you track focused study hours for a specific goal. Inspired by the aesthetic of [Monkeytype](https://monkeytype.com), it features a pure black interface, subtle textures, and zero distractions.

## 🎯 Purpose

The goal is simple: **Track actual, focused effort.**

Unlike complex productivity suites, this app does not handle scheduling, journaling, or analytics. It replaces the stopwatch on your phone or the scribbled notes in your notebook. It exists solely to answer the question: *"Did I put in the work today?"*

## ✨ Features

- **Single Session Focus**: You can only track one subject at a time. To switch subjects, you must commit to finishing or resetting the current one.
- **Target-Based**: Set a specific hour goal for your session (e.g., "Biology", "4 hours").
- **Persistence**: State is saved automatically to `localStorage`. You can close the tab, restart your browser, or take a break, and your timer will be exactly where you left it.
- **Visual Progress**: A subtle progress bar fills up as you approach your target time.
- **Aesthetic**:
  - Dark Mode Only (#000000 background).
  - Film grain overlay for texture.
  - Monospaced typography (JetBrains Mono).
  - Fade-in animations and minimal interactions.

## 🛠️ Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Fonts**: JetBrains Mono (via Google Fonts)

## 📂 Project Structure

```text
/
├── index.html              # Entry HTML with Tailwind CDN and Grain CSS
├── index.tsx               # React Application Entry Point
├── App.tsx                 # Main Application Logic (State Management)
├── types.ts                # TypeScript Interfaces (StudySession)
├── metadata.json           # App metadata
├── components/
│   ├── Button.tsx          # Reusable minimalist button
│   ├── Grain.tsx           # SVG Noise overlay component
│   ├── ProgressBar.tsx     # Visual indicator of target completion
│   ├── SetupForm.tsx       # Input form for Subject and Hours
│   └── TimerDisplay.tsx    # Large format digital timer
└── utils/
    └── time.ts             # Time formatting helpers (HH:MM:SS)
```

## 🚀 How It Works

1.  **Initialization**:
    - When the app loads, it checks `localStorage` for an existing session (`study_timer_v1`).
    - If found, it restores the subject, target, and elapsed time.
    - If not, it presents the **Setup Form**.

2.  **Setup**:
    - User inputs a **Subject Name** (e.g., "Calculus") and **Target Hours** (e.g., "2.5").
    - Clicking "Start Focus" initializes the session.

3.  **The Session**:
    - The timer increments every second while `isRunning` is true.
    - **Play/Pause**: Toggles the timer state.
    - **Reset**: Wipes the current data and returns to the Setup screen. *Warning: This action is permanent.*

4.  **Completion**:
    - The timer continues to run even after 100% progress is reached, allowing for "overtime" study tracking if desired.

## 🎨 Design Philosophy

- **Subtlety**: Borders are dark gray (`zinc-800`), text is off-white (`zinc-200` to `zinc-500`). Nothing screams for attention.
- **Focus**: The timer is the largest element.
- **Texture**: The CSS `grain-overlay` adds an SVG turbulence filter to prevent the black background from feeling flat or sterile.

## 🏃‍♂️ Development

To run this project locally:

1.  Ensure you have Node.js installed.
2.  Install dependencies (assuming a standard React/Vite setup):
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

Open Source. Use it to build your own focus tools.
