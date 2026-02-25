export interface Position {
  id: number;
  market: string;
  url: string;
  category: string;
  side: "YES" | "NO";
  entry_price: number;
  shares: number;
  cost: number;
  entry_date: string;
  resolution_date: string;
  thesis: string;
  current_price: number;
  pnl: number;
  status: "open" | "closed";
}

export interface Portfolio {
  meta: {
    name: string;
    created: string;
    initial_balance: number;
    currency: string;
    evaluation_date: string;
    strategy: string;
  };
  balance: number;
  last_updated: string;
  positions: Position[];
  summary: {
    total_invested: number;
    cash_remaining: number;
    num_positions: number;
    total_pnl: number;
    total_pnl_pct: number;
    portfolio_value: number;
    categories: Record<string, number>;
  };
}

export interface Trade {
  id: string;
  market: string;
  resolution: string;
  side: "YES" | "NO";
  entry_price: number;
  shares: number;
  cost: number;
  thesis: string;
  max_profit: number;
  max_loss: number;
  result: "WIN" | "LOSS" | "PENDING";
  pnl: number | null;
  resolution_note: string;
}

export interface TradesDay {
  date: string;
  note: string;
  btc_price_at_entry: number;
  trades: Trade[];
  summary: {
    total_short_term_bets: number;
    total_cost: number;
    total_max_profit: number;
    resolving_today: number;
    resolving_tomorrow: number;
    categories: string[];
    final_results: {
      resolved: number;
      pending: number;
      wins: number;
      losses: number;
      realized_pnl: number;
      pending_trade: string;
      best_case_total_pnl: number;
      worst_case_total_pnl: number;
    };
  };
}
