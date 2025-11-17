# 🤖 AI Stock Analysis Platform

A professional, production-ready stock analysis application powered by multi-agent AI systems. Built with React, Material-UI, FastAPI, LangChain, LangGraph, and Ollama (Llama3).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.9%2B-blue)
![React](https://img.shields.io/badge/react-18.0%2B-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104%2B-green)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This AI-powered stock analysis platform uses a sophisticated multi-agent system to provide comprehensive stock analysis, including technical indicators, fundamental metrics, price predictions, and investment recommendations. The system leverages LangGraph to orchestrate multiple specialized AI agents that work in parallel to deliver deep insights.

### Key Highlights

- **Multi-Agent AI System**: Four specialized agents working in harmony
- **Local LLM**: Uses Ollama with Llama3 - no API keys, completely free
- **Real-time Data**: Fetches live stock data from Yahoo Finance
- **Professional UI**: Modern Material-UI design with responsive charts
- **Comprehensive Analysis**: Technical, fundamental, and predictive analytics

## ✨ Features

### 🔍 Stock Analysis
- **Real-time Price Data**: Current price, volume, market cap, P/E ratio
- **Technical Analysis**: RSI, SMA (20/50-day), trend analysis, momentum indicators
- **Fundamental Analysis**: Valuation metrics, financial health, dividend analysis
- **Price Predictions**: 6-month price targets with confidence levels
- **Investment Recommendations**: BUY/HOLD/SELL signals with detailed reasoning

### 📊 Visualizations
- **Interactive Charts**: Price history and trading volume
- **Performance Metrics**: 52-week range, price changes, market indicators
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### 🤖 AI Agents
1. **Data Collector Agent**: Gathers real-time stock data from Yahoo Finance
2. **Technical Analyst Agent**: Performs technical analysis using indicators
3. **Fundamental Analyst Agent**: Evaluates company financials and valuation
4. **Prediction Agent**: Generates forecasts and investment recommendations

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                        │
│              Material-UI + Recharts                         │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/REST
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                  Backend (FastAPI)                          │
│                   Port: 8000                                │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│              LangGraph Agent System                         │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Data     │  │  Technical   │  │ Fundamental  │       │
│  │ Collector  │─→│   Analyst    │─→│   Analyst    │       │
│  └────────────┘  └──────────────┘  └──────────────┘       │
│                          ↓                ↓                 │
│                    ┌──────────────┐                        │
│                    │  Prediction  │                        │
│                    │    Agent     │                        │
│                    └──────────────┘                        │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        ↓                               ↓
┌────────────────┐            ┌──────────────────┐
│  Ollama/Llama3 │            │  Yahoo Finance   │
│  (Local LLM)   │            │   (Stock Data)   │
└────────────────┘            └──────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 18+**: UI framework
- **Material-UI (MUI)**: Component library and design system
- **Recharts**: Data visualization
- **Axios/Fetch**: HTTP client

### Backend
- **FastAPI**: High-performance Python web framework
- **LangChain**: LLM orchestration framework
- **LangGraph**: Multi-agent workflow management
- **Ollama**: Local LLM inference server
- **yfinance**: Stock data retrieval
- **Pandas/NumPy**: Data processing

### AI/ML
- **Llama3**: Large language model (8B parameters)
- **Technical Indicators**: RSI, SMA, momentum analysis
- **Statistical Models**: Trend analysis, volatility calculations

## 📦 Prerequisites

### System Requirements
- **OS**: macOS, Linux, or Windows
- **RAM**: Minimum 8GB (16GB recommended for optimal performance)
- **Disk Space**: ~10GB free space
- **Internet**: Required for initial setup and stock data

### Software Requirements
- **Python**: 3.9 or higher
- **Node.js**: 16.x or higher
- **npm**: 8.x or higher
- **Git**: Latest version

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/ai-stock-analysis.git
cd ai-stock-analysis
```

### Step 2: Install Ollama

#### macOS / Linux
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

#### Windows
Download and install from: https://ollama.com/download/windows

#### Verify Installation
```bash
ollama --version
```

### Step 3: Pull Llama3 Model

```bash
# Pull Llama3 8B (recommended - 4.7GB)
ollama pull llama3

# Alternative: Llama3 70B (more accurate but requires 64GB RAM)
# ollama pull llama3:70b
```

### Step 4: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

### Step 5: Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install Node dependencies
npm install
```

## 🎮 Running the Application

You'll need **three terminal windows** to run the complete application:

### Terminal 1: Start Ollama Server

```bash
ollama serve
```

**Note**: On some systems, Ollama runs as a background service automatically. Check if it's already running:
```bash
curl http://localhost:11434
```

### Terminal 2: Start Backend Server

```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python main.py
```

The backend will start on: **http://localhost:8000**

You should see:
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Terminal 3: Start Frontend Application

```bash
cd frontend
npm start
```

The frontend will start on: **http://localhost:3000**

Your browser should automatically open to the application.

## 📖 Usage

### Basic Stock Analysis

1. **Open the Application**: Navigate to http://localhost:3000
2. **Enter Stock Ticker**: Type a stock symbol (e.g., AAPL, TSLA, MSFT, GOOGL)
3. **Click Analyze**: Wait for the AI agents to process the data (~10-30 seconds)
4. **Review Results**: Examine charts, metrics, and AI-generated insights

### Example Stock Tickers to Try

#### Technology
- `AAPL` - Apple Inc.
- `MSFT` - Microsoft Corporation
- `GOOGL` - Alphabet Inc.
- `TSLA` - Tesla Inc.
- `NVDA` - NVIDIA Corporation
- `META` - Meta Platforms Inc.

#### Finance
- `JPM` - JPMorgan Chase
- `BAC` - Bank of America
- `GS` - Goldman Sachs
- `V` - Visa Inc.
- `MA` - Mastercard

#### Consumer
- `AMZN` - Amazon.com Inc.
- `WMT` - Walmart Inc.
- `DIS` - The Walt Disney Company
- `NKE` - Nike Inc.
- `SBUX` - Starbucks Corporation

### Understanding the Analysis

#### Technical Analysis Section
- **Trend Analysis**: Bullish or bearish market direction
- **Support/Resistance**: Key price levels
- **RSI**: Overbought (>70) or oversold (<30) conditions
- **Moving Averages**: 20-day and 50-day trend indicators

#### Fundamental Analysis Section
- **Valuation**: P/E ratio assessment
- **Financial Health**: Profitability and stability metrics
- **Dividends**: Yield and sustainability
- **Long-term Merit**: Investment quality evaluation

#### AI Prediction Section
- **6-Month Price Target**: Predicted stock price
- **Expected Return**: Percentage gain/loss projection
- **Recommendation**: BUY/HOLD/SELL with reasoning
- **Risk Assessment**: Key opportunities and threats

## 🔌 API Documentation

### Endpoints

#### POST /analyze
Analyze a stock using the multi-agent AI system.

**Request:**
```json
{
  "ticker": "AAPL"
}
```

**Response:**
```json
{
  "company_name": "Apple Inc.",
  "ticker": "AAPL",
  "current_price": 185.92,
  "price_change": 1.25,
  "market_cap": "$2.85T",
  "pe_ratio": 29.45,
  "dividend_yield": 0.52,
  "week_52_range": "$124.17 - $199.62",
  "price_history": [...],
  "volume_data": [...],
  "technical_analysis": "...",
  "fundamental_analysis": "...",
  "predicted_price": 195.50,
  "predicted_change": 5.15,
  "recommendation": "BUY",
  "ai_summary": "..."
}
```

#### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "message": "AI Stock Analysis API is running with Ollama/Llama3"
}
```

#### GET /ollama-status
Check Ollama connection status.

**Response:**
```json
{
  "status": "connected",
  "model": "llama3",
  "message": "Ollama is running and Llama3 is available"
}
```

### Testing with cURL

```bash
# Check API health
curl http://localhost:8000/health

# Check Ollama status
curl http://localhost:8000/ollama-status

# Analyze a stock
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"ticker": "AAPL"}'
```

## 📁 Project Structure

```
ai-stock-analysis/
├── backend/
│   ├── main.py                 # FastAPI application & agent system
│   ├── requirements.txt        # Python dependencies
│   └── README.md              # Backend documentation
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js             # Main application component
│   │   ├── App.css            # Application styles
│   │   ├── StockAnalysisPlatform.js  # Main stock analysis component
│   │   ├── index.js           # React entry point
│   │   └── index.css          # Global styles
│   ├── package.json           # Node dependencies
│   └── README.md              # Frontend documentation
│
├── .gitignore
├── LICENSE
└── README.md                   # This file
```

## 🐛 Troubleshooting

### Issue: "Could not connect to Ollama"

**Solution 1**: Start Ollama server
```bash
ollama serve
```

**Solution 2**: Check if Ollama is running
```bash
curl http://localhost:11434
# Should return: "Ollama is running"
```

**Solution 3**: Restart Ollama service
```bash
# macOS
brew services restart ollama

# Linux
sudo systemctl restart ollama
```

### Issue: "Model 'llama3' not found"

**Solution**: Pull the Llama3 model
```bash
ollama pull llama3
```

### Issue: "CORS Error" in Browser Console

**Solution**: Ensure backend is running on port 8000
```bash
# Check if backend is running
curl http://localhost:8000/health
```

### Issue: Slow AI Responses

**Solutions**:
1. Use smaller Llama3 variant: `ollama pull llama3:8b`
2. Ensure sufficient RAM (close other applications)
3. Check CPU usage and system resources
4. Consider using GPU acceleration if available

### Issue: Stock Data Not Loading

**Possible Causes**:
- Invalid ticker symbol (verify on Yahoo Finance)
- Network connectivity issues
- Rate limiting from Yahoo Finance

**Solution**: Try a different ticker or wait a few minutes

### Issue: Frontend Won't Start

**Solution**:
```bash
# Clear npm cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Issue: Backend Dependencies Failing

**Solution**:
```bash
# Upgrade pip and reinstall
cd backend
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

## 🔧 Configuration

### Changing the LLM Model

Edit `backend/main.py`:

```python
# Use different Ollama model
llm = ChatOllama(
    model="mistral",  # Options: llama3, mistral, mixtral, phi, codellama
    temperature=0.3,
    base_url="http://localhost:11434"
)
```

Available models:
```bash
ollama list              # See installed models
ollama pull mistral      # Pull Mistral 7B
ollama pull mixtral      # Pull Mixtral 8x7B
ollama pull phi          # Pull Microsoft Phi-2
```

### Adjusting Analysis Parameters

In `backend/main.py`, modify technical indicators:

```python
# Change moving average periods
hist['SMA_20'] = hist['Close'].rolling(window=20).mean()  # Change 20
hist['SMA_50'] = hist['Close'].rolling(window=50).mean()  # Change 50

# Change RSI period
def calculate_rsi(prices, period=14):  # Change period
```

### Customizing UI Theme

Edit `frontend/src/StockAnalysisPlatform.js`:

```javascript
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',  // Change primary color
    },
    secondary: {
      main: '#8b5cf6',  // Change secondary color
    },
  },
});
```

## 🚀 Production Deployment

### Docker Setup (Coming Soon)

```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Environment Variables

Create `.env` file in backend directory:

```env
# Optional: Override default Ollama URL
OLLAMA_BASE_URL=http://localhost:11434

# Optional: Change model
OLLAMA_MODEL=llama3

# Optional: API rate limiting
RATE_LIMIT_PER_MINUTE=60
```

### Performance Optimization

1. **Enable GPU**: Ollama automatically uses GPU if available
2. **Caching**: Implement Redis for caching stock data
3. **Load Balancing**: Use multiple Ollama instances
4. **CDN**: Serve frontend static files from CDN

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest tests/
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📊 Performance Metrics

### Response Times
- **Data Collection**: ~2-3 seconds
- **Technical Analysis**: ~3-5 seconds
- **Fundamental Analysis**: ~3-5 seconds
- **Prediction Generation**: ~4-6 seconds
- **Total Analysis Time**: ~10-20 seconds

### Resource Usage
- **RAM**: 2-4GB (Llama3 8B)
- **CPU**: 2-4 cores recommended
- **Storage**: 5GB (model + dependencies)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use ESLint for JavaScript code
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **LangChain**: For the excellent LLM orchestration framework
- **Ollama**: For making local LLM inference accessible
- **Meta AI**: For the Llama3 model
- **Yahoo Finance**: For providing free stock data
- **Material-UI**: For the beautiful component library

## 📧 Contact

For questions, issues, or suggestions:

- **GitHub Issues**: [Create an issue](https://github.com/bw00786ock-analysis/issues)
- **Email**: bwilk84@gmail.com
- **Twitter**: @Bruce Wilkins

## 🗺️ Roadmap

### Version 1.1 (Planned)
- [ ] Portfolio tracking and management
- [ ] Historical comparison features
- [ ] News sentiment analysis
- [ ] Email alerts for price targets
- [ ] Dark/Light theme toggle

### Version 2.0 (Future)
- [ ] Multi-stock comparison
- [ ] Sector analysis
- [ ] Options trading analysis
- [ ] Backtesting capabilities
- [ ] Mobile app (React Native)

## ⭐ Star History

If you find this project useful, please consider giving it a star on GitHub!

---

**Built with ❤️ using React, FastAPI, LangChain, and Llama3**

*Last Updated: November 2025