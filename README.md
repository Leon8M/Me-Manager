
# Me Manager - Personal Finance & Productivity PWA

Take full control of your finances and productivity with Me Manager! A progressive web app (PWA) that works offline, helping you manage money, tasks, and goals with a sleek mobile-first interface.

```bash
# Start development environment
source env/bin/activate
```

## Table of Contents
Key Features

Tech Stack

Installation

Development Setup

Deployment

Offline Usage

Support

## Key Features

### 💰 Financial Management

Track income/expenses with SQLite backend

Categorize transactions (Food, Transport, etc.)

Interactive Pie/Bar charts for visualization

Monthly/yearly financial summaries

Balance tracking with real-time updates


### ⚡ Productivity Tools

Task management with priorities

Note taking integration

Transaction and whole management visualization

Cross-device data sync(Coming soon)

## Tech Stack

### Frontend:

React.js with Vite

Tailwind CSS

Chart.js for visualizations

PWA capabilities

Capacitor for native mobile builds

### Backend:

Python Flask

SQLite (with PostgreSQL option)

SQLAlchemy ORM

RESTful API endpoints

## Installation
```bash
# Clone repository
git clone https://github.com/Leon8M/Me-Manager
cd me-manager/client

# Install dependencies
npm install
pip install -r requirements.txt
```
## Development Setup

Frontend:

```bash
npm run dev
```
Backend:
```bash
cd server

source env/bin/activate

python app.py
```
Access at: http://localhost:3000

## Deployment
Render.com (Recommended):

Connect your GitHub repo

Set environment variables:

```env
# Only for you , for me i just explicitly call it
DATABASE_URL=postgresql://...
FLASK_ENV=production
```
Deploy!


Support
For issues or feature requests:
📧 Email: leonmunene254@gmail.com
😊 I know it is not perfectly secure, especially calling the backend url explicitly, it is emant for offlineuse only once i set up PWA functionality 
