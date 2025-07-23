# 📊 Market Seasonality Explorer

An interactive React-based dashboard to explore historical performance, volatility, and liquidity trends of financial instruments using calendar-based views. Built as part of the GoQuant frontend assignment.

---

## 🚀 Features

### 📅 Calendar Views
- Daily, Weekly, Monthly views with smooth transitions
- Keyboard and touch-friendly navigation
- Highlights for current date, selected ranges

### 📈 Data Visualization Layers
- **Volatility Heatmap** – Color-coded cells based on intensity
- **Liquidity Indicators** – Volume bars and patterns per day
- **Performance Metrics** – Green/red arrows and trend icons

### 🧠 Technical Insights
- RSI, MACD, SMA (20/50), Bollinger Bands
- Volume and Volatility rank analysis
- Market sentiment classification

### 📋 Dashboard Modal
- Click any date to view detailed breakdown
- Tabbed modal for Overview, Price Chart, and Technicals
- Export to PDF / CSV / Image

### 🧰 Filter Controls
- Instrument selection (Crypto only for live data)
- Time range and calendar view filters
- Active filter indicators with quick reset

### 📱 Responsive Design
- Mobile-first layout and calendar zoom
- Fully functional on small devices and tablets

---

## 📡 Data Sources

- **Live Data**: [CoinGecko API](https://www.coingecko.com/en/api)
- **Instruments Supported**:
  - Bitcoin (BTC)
  - Ethereum (ETH)

---

## 🧪 Testing (Optional)
Basic test scaffold using [Vitest](https://vitest.dev) is included. Test coverage is limited due to submission constraints. Setup is prepared for future expansion.

---

## 🛠 Tech Stack

- **Framework**: React + TypeScript + Vite
- **UI**: Material UI (MUI v5)
- **Charting**: Recharts
- **State**: React Hooks
- **Testing**: Vitest, React Testing Library (partially configured)

---


## 📁 Folder Structure (Partial)
src/
│
├── components/
│ ├── Calendar/
│ ├── Filters/
│ ├── Legend/
│ ├── Modal/
│ └── AppBar/
│
├── types/
├── utils/
└── test/

---

## 📦 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/codekid69/Market-Seasonality-Explorer.git
cd Market-Seasonality-Explorer
npm install
npm run dev

