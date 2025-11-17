from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import TypedDict, Annotated, List, Dict
import operator
from langgraph.graph import StateGraph, END
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json

# Initialize FastAPI
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Ollama LLM with Llama3
llm = ChatOllama(
    model="llama3",
    temperature=0.3,
    base_url="http://localhost:11434"  # Default Ollama URL
)

# Define the state for our agent graph
class AgentState(TypedDict):
    ticker: str
    stock_data: Dict
    raw_data: object
    technical_analysis: str
    fundamental_analysis: str
    sentiment_analysis: str
    prediction: Dict
    messages: Annotated[List, operator.add]

# Request model
class StockRequest(BaseModel):
    ticker: str

# Agent 1: Data Collection Agent
def data_collector_agent(state: AgentState) -> AgentState:
    """Collects comprehensive stock data from Yahoo Finance"""
    ticker = state["ticker"]
    
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        hist = stock.history(period="6mo")
        
        # Calculate key metrics
        current_price = info.get('currentPrice', hist['Close'].iloc[-1])
        prev_close = hist['Close'].iloc[-2] if len(hist) > 1 else current_price
        price_change = ((current_price - prev_close) / prev_close) * 100
        
        # Get market cap in readable format
        market_cap = info.get('marketCap', 0)
        if market_cap > 1e12:
            market_cap_str = f"${market_cap/1e12:.2f}T"
        elif market_cap > 1e9:
            market_cap_str = f"${market_cap/1e9:.2f}B"
        else:
            market_cap_str = f"${market_cap/1e6:.2f}M"
        
        # Prepare price history for charts
        price_history = []
        for date, row in hist.tail(30).iterrows():
            price_history.append({
                "date": date.strftime("%m/%d"),
                "price": round(row['Close'], 2)
            })
        
        # Prepare volume data
        volume_data = []
        for date, row in hist.tail(20).iterrows():
            volume_data.append({
                "date": date.strftime("%m/%d"),
                "volume": int(row['Volume'] / 1000000)  # In millions
            })
        
        stock_data = {
            "company_name": info.get('longName', ticker),
            "ticker": ticker,
            "current_price": round(current_price, 2),
            "price_change": round(price_change, 2),
            "market_cap": market_cap_str,
            "pe_ratio": round(info.get('trailingPE', 0), 2) if info.get('trailingPE') else "N/A",
            "dividend_yield": round(info.get('dividendYield', 0) * 100, 2) if info.get('dividendYield') else 0,
            "week_52_range": f"${info.get('fiftyTwoWeekLow', 0):.2f} - ${info.get('fiftyTwoWeekHigh', 0):.2f}",
            "price_history": price_history,
            "volume_data": volume_data,
            "beta": info.get('beta', 1),
            "avg_volume": info.get('averageVolume', 0),
            "revenue": info.get('totalRevenue', 0),
            "profit_margin": info.get('profitMargins', 0),
        }
        
        state["stock_data"] = stock_data
        state["raw_data"] = hist
        state["messages"].append(f"Data collected successfully for {ticker}")
        
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Could not fetch data for {ticker}: {str(e)}")
    
    return state

# Agent 2: Technical Analysis Agent
def technical_analyst_agent(state: AgentState) -> AgentState:
    """Performs technical analysis using Llama3"""
    hist = state["raw_data"]
    stock_data = state["stock_data"]
    
    # Calculate technical indicators
    hist['SMA_20'] = hist['Close'].rolling(window=20).mean()
    hist['SMA_50'] = hist['Close'].rolling(window=50).mean()
    hist['RSI'] = calculate_rsi(hist['Close'])
    
    current_price = stock_data['current_price']
    sma_20 = hist['SMA_20'].iloc[-1]
    sma_50 = hist['SMA_50'].iloc[-1]
    rsi = hist['RSI'].iloc[-1]
    
    # Create prompt for LLM
    prompt = f"""As a technical analyst, analyze this stock data:
    
    Ticker: {state['ticker']}
    Current Price: ${current_price}
    20-day SMA: ${sma_20:.2f}
    50-day SMA: ${sma_50:.2f}
    RSI: {rsi:.2f}
    Beta: {stock_data['beta']}
    
    Provide a concise technical analysis covering:
    1. Trend analysis (bullish/bearish)
    2. Support and resistance levels
    3. Momentum indicators interpretation
    4. Short-term technical outlook
    
    Keep it under 150 words and practical."""
    
    messages = [
        SystemMessage(content="You are an expert technical analyst with years of experience in stock market analysis."),
        HumanMessage(content=prompt)
    ]
    
    try:
        response = llm.invoke(messages)
        state["technical_analysis"] = response.content
        state["messages"].append("Technical analysis completed")
    except Exception as e:
        state["technical_analysis"] = f"Technical analysis: Price trending {'above' if current_price > sma_20 else 'below'} 20-day SMA. RSI at {rsi:.1f} indicates {'overbought' if rsi > 70 else 'oversold' if rsi < 30 else 'neutral'} conditions."
        state["messages"].append(f"Technical analysis completed with fallback: {str(e)}")
    
    return state

# Agent 3: Fundamental Analysis Agent
def fundamental_analyst_agent(state: AgentState) -> AgentState:
    """Performs fundamental analysis using Llama3"""
    stock_data = state["stock_data"]
    
    prompt = f"""As a fundamental analyst, analyze this company:
    
    Company: {stock_data['company_name']}
    Market Cap: {stock_data['market_cap']}
    P/E Ratio: {stock_data['pe_ratio']}
    Dividend Yield: {stock_data['dividend_yield']}%
    Profit Margin: {stock_data.get('profit_margin', 0) * 100:.2f}%
    
    Provide a concise fundamental analysis covering:
    1. Valuation assessment
    2. Financial health
    3. Dividend sustainability
    4. Long-term investment merit
    
    Keep it under 150 words and actionable."""
    
    messages = [
        SystemMessage(content="You are an expert fundamental analyst specializing in company valuation and financial analysis."),
        HumanMessage(content=prompt)
    ]
    
    try:
        response = llm.invoke(messages)
        state["fundamental_analysis"] = response.content
        state["messages"].append("Fundamental analysis completed")
    except Exception as e:
        pe = stock_data['pe_ratio']
        state["fundamental_analysis"] = f"Fundamental analysis: Market cap of {stock_data['market_cap']} with P/E ratio of {pe}. {'Premium valuation' if isinstance(pe, (int, float)) and pe > 25 else 'Reasonable valuation' if isinstance(pe, (int, float)) else 'Valuation metrics unavailable'}. Dividend yield of {stock_data['dividend_yield']}%."
        state["messages"].append(f"Fundamental analysis completed with fallback: {str(e)}")
    
    return state

# Agent 4: Prediction Agent
def prediction_agent(state: AgentState) -> AgentState:
    """Makes price predictions and recommendations using Llama3"""
    stock_data = state["stock_data"]
    technical = state["technical_analysis"]
    fundamental = state["fundamental_analysis"]
    
    # Simple prediction model (in production, use more sophisticated ML models)
    hist = state["raw_data"]
    recent_trend = (hist['Close'].iloc[-1] - hist['Close'].iloc[-30]) / hist['Close'].iloc[-30]
    volatility = hist['Close'].pct_change().std()
    
    # AI-enhanced prediction
    prompt = f"""As a senior financial analyst, provide investment guidance:
    
    Company: {stock_data['company_name']}
    Current Price: ${stock_data['current_price']}
    Recent 30-day Trend: {recent_trend*100:.2f}%
    
    Technical Analysis:
    {technical}
    
    Fundamental Analysis:
    {fundamental}
    
    Based on this analysis, provide:
    1. A 6-month price target with brief reasoning
    2. Investment recommendation (BUY, HOLD, or SELL)
    3. Key risks and opportunities (2-3 sentences)
    
    Format your response as:
    Price Target: $XXX
    Recommendation: [BUY/HOLD/SELL]
    Analysis: [Your 2-3 sentence summary]
    
    Keep total response under 150 words."""
    
    messages = [
        SystemMessage(content="You are a senior investment analyst providing actionable, evidence-based advice."),
        HumanMessage(content=prompt)
    ]
    
    try:
        response = llm.invoke(messages)
        ai_output = response.content
    except Exception as e:
        # Fallback prediction
        predicted_price = stock_data['current_price'] * (1 + recent_trend * 0.5)
        recommendation = "HOLD"
        if recent_trend > 0.1:
            recommendation = "BUY"
        elif recent_trend < -0.1:
            recommendation = "SELL"
        
        ai_output = f"Price Target: ${predicted_price:.2f}\nRecommendation: {recommendation}\nAnalysis: Based on recent trend of {recent_trend*100:.1f}%, the stock shows {'positive' if recent_trend > 0 else 'negative'} momentum. Technical and fundamental factors suggest a {recommendation} position."
        state["messages"].append(f"Prediction completed with fallback: {str(e)}")
    
    # Parse AI response for structured data
    predicted_price = stock_data['current_price'] * (1 + recent_trend * 0.5)
    
    # Try to extract price target from AI response
    try:
        if "Price Target:" in ai_output or "$" in ai_output:
            import re
            price_matches = re.findall(r'\$(\d+\.?\d*)', ai_output)
            if price_matches:
                predicted_price = float(price_matches[0])
    except:
        pass
    
    # Determine recommendation based on analysis
    recommendation = "HOLD"
    if "BUY" in ai_output.upper() or "STRONG BUY" in ai_output.upper():
        recommendation = "BUY"
    elif "SELL" in ai_output.upper():
        recommendation = "SELL"
    
    predicted_change = ((predicted_price - stock_data['current_price']) / stock_data['current_price']) * 100
    
    state["prediction"] = {
        "predicted_price": round(predicted_price, 2),
        "predicted_change": round(predicted_change, 2),
        "recommendation": recommendation,
        "ai_summary": ai_output
    }
    state["messages"].append("Prediction and recommendation generated")
    
    return state

# Helper function for RSI calculation
def calculate_rsi(prices, period=14):
    """Calculate Relative Strength Index"""
    delta = prices.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    return rsi

# Build the agent graph
def build_agent_graph():
    """Constructs the LangGraph workflow"""
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("data_collector", data_collector_agent)
    workflow.add_node("technical_analyst", technical_analyst_agent)
    workflow.add_node("fundamental_analyst", fundamental_analyst_agent)
    workflow.add_node("predictor", prediction_agent)
    
    # Define edges
    workflow.set_entry_point("data_collector")
    workflow.add_edge("data_collector", "technical_analyst")
    workflow.add_edge("data_collector", "fundamental_analyst")
    workflow.add_edge("technical_analyst", "predictor")
    workflow.add_edge("fundamental_analyst", "predictor")
    workflow.add_edge("predictor", END)
    
    return workflow.compile()

# Initialize graph
agent_graph = build_agent_graph()

@app.post("/analyze")
async def analyze_stock(request: StockRequest):
    """Main endpoint to analyze a stock using the agent system"""
    
    initial_state = {
        "ticker": request.ticker.upper(),
        "stock_data": {},
        "raw_data": None,
        "technical_analysis": "",
        "fundamental_analysis": "",
        "sentiment_analysis": "",
        "prediction": {},
        "messages": []
    }
    
    # Run the agent graph
    final_state = agent_graph.invoke(initial_state)
    
    # Compile response
    response = {
        **final_state["stock_data"],
        "technical_analysis": final_state["technical_analysis"],
        "fundamental_analysis": final_state["fundamental_analysis"],
        **final_state["prediction"]
    }
    
    return response

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "AI Stock Analysis API is running with Ollama/Llama3"}

@app.get("/ollama-status")
async def ollama_status():
    """Check if Ollama is running and Llama3 is available"""
    try:
        test_response = llm.invoke([HumanMessage(content="Hello")])
        return {
            "status": "connected",
            "model": "llama3",
            "message": "Ollama is running and Llama3 is available"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Could not connect to Ollama: {str(e)}",
            "help": "Make sure Ollama is running with 'ollama serve' and Llama3 is installed with 'ollama pull llama3'"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)