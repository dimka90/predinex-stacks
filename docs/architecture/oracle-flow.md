# Oracle Data Flow

1. Provider registers via `register-oracle`
2. Provider submits data via `submit-price`
3. Aggregation runs on every N submissions
4. Result stored in `aggregated-prices` map
