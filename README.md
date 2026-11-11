# OmniCalc Suite 🧮

An all-in-one financial calculator and multi-category unit conversion web application built with **React 19**, **TypeScript**, and **Tailwind CSS**.

Users can easily pick any calculator through the **Home Screen Hub**, the interactive **Picker directory**, the **Search Palette** (<kbd>Ctrl</kbd>+<kbd>K</kbd>), or jump straight to any tool via its dedicated **deep-link URL**.

---

## 🚀 Calculators, Unit Converters & Direct URLs

### 💰 Financial Calculators
| Calculator | Direct URL | Key Features |
| :--- | :--- | :--- |
| **Loan EMI** | `/#/emi` | Home, Car, & Personal Loans. Monthly EMI, total interest, full monthly & yearly amortization schedule, extra part-prepayment savings simulator. |
| **Fixed Deposit (FD)** | `/#/fd` | Cumulative (reinvested) & Non-Cumulative (monthly/quarterly/yearly payouts), Senior Citizen extra rate (+0.50%), compounding frequency (monthly, quarterly, half-yearly, yearly). |
| **Recurring Deposit (RD)** | `/#/rd` | Monthly installment savings, quarterly compounded banking standard, full deposit schedule & maturity breakdown. |
| **Cumulative Deposit** | `/#/cumulative` | Long-term wealth accumulation, reinvested compound interest, optional periodic additions, Effective Annual Yield (APY). |
| **SIP (Mutual Funds)** | `/#/sip` | Systematic Investment Plan wealth corpus calculator, capital vs estimated wealth gains, power of compounding chart. |
| **PPF Calculator** | `/#/ppf` | Public Provident Fund (15-30 year scheme), ₹1.5 Lakh annual ceiling, 100% tax-free guaranteed returns. |
| **Compound Interest** | `/#/compound` | Universal compound interest calculator with customizable compounding intervals (monthly, quarterly, semi-annual, annual). |

### 📐 Unit Converters
| Converter | Direct URL | Supported Units |
| :--- | :--- | :--- |
| **Area & Land** | `/#/unit-area` | Square Meters, Square Feet, Acres, Hectares, Guntha, Bigha, Square Kilometers, Square Miles, Square Yards. |
| **Length & Distance** | `/#/unit-length` | Meters, Kilometers, Miles, Feet, Inches, Yards, Centimeters, Millimeters, Nautical Miles. |
| **Temperature** | `/#/unit-temperature` | Celsius (°C), Fahrenheit (°F), Kelvin (K) with instant formula relationships. |
| **Volume & Capacity** | `/#/unit-volume` | Liters, Milliliters, Gallons (US & UK), Cubic Meters, Fluid Ounces, Cups, Pints, Quarts, Tablespoons, Teaspoons. |
| **Mass & Weight** | `/#/unit-mass` | Kilograms, Grams, Milligrams, Pounds (lbs), Ounces (oz), Metric Tons, Stones, Carats, Quintals. |
| **Digital Data** | `/#/unit-data` | Bytes, Bits, Kilobytes (KB), Megabytes (MB), Gigabytes (GB), Terabytes (TB), Petabytes (PB), Megabits (Mb), Gigabits (Gb). |
| **Speed & Velocity** | `/#/unit-speed` | Kilometers/hour (km/h), Miles/hour (mph), Meters/second (m/s), Knots, Feet/second (ft/s), Mach. |
| **Time Duration** | `/#/unit-time` | Seconds, Milliseconds, Minutes, Hours, Days, Weeks, Months, Years, Decades. |

### 🚀 Future Roadmap (Visible on Home Screen)
- **GST & Sales Tax Calculator** (Inclusive & Exclusive rates, CGST/SGST breakdown)
- **BMI & Health Composition Calculator** (Body Mass Index & caloric needs)
- **Date & Age Difference Calculator** (Exact calendar duration)
- **Scientific & Math Calculator**

---

## ✨ Core Highlights

1. **Home Screen Hub (`/#/home`)**:
   - Showcase all calculators & unit converters with category filters (`All`, `Finance`, `Unit Converters`, `Future Tools`).
   - Built-in search bar and quick launch cards.
2. **Instant Multi-Unit Conversion Matrix**:
   - Typing any number in a converter immediately shows the equivalent value across **all** units in that category simultaneously.
   - Quick Swap button (⇄) and one-click "Select as Target".
3. **Direct URL Routing & State Sharing**:
   - Every single calculator and converter has its own URL (`/#/emi`, `/#/unit-area`, `/#/unit-temperature`, etc.).
   - Share button encodes input parameters directly into the link (e.g., `/#/unit-area?from=acre&to=sq_ft&val=5`).
4. **Command Palette (<kbd>Ctrl</kbd>+<kbd>K</kbd> / <kbd>⌘</kbd>+<kbd>K</kbd>)**:
   - Instant search across all 19+ calculators, converters, and upcoming tools.
5. **Dark & Light Mode**:
   - Full dark mode support with accessible contrast tokens.

---

## 🛠️ How to Run Locally

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
