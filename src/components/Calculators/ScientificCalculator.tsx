import React, { useState, useEffect } from 'react';
import { ShareButton } from '../Common/ShareButton';
import { Binary, History, Trash2 } from 'lucide-react';

interface HistoryItem {
  expression: string;
  result: string;
  time: string;
}

export const ScientificCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [angleMode, setAngleMode] = useState<'DEG' | 'RAD'>('DEG');
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isNewNumber, setIsNewNumber] = useState(true);

  // Handle number input
  const inputDigit = (digit: string) => {
    if (isNewNumber) {
      setDisplay(digit === '.' ? '0.' : digit);
      setIsNewNumber(false);
    } else {
      if (digit === '.' && display.includes('.')) return;
      setDisplay(display + digit);
    }
  };

  // Clear all
  const clearAll = () => {
    setDisplay('0');
    setExpression('');
    setIsNewNumber(true);
  };

  // Delete last digit
  const deleteLast = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
      setIsNewNumber(true);
    }
  };

  // Toggle plus/minus
  const toggleSign = () => {
    const val = parseFloat(display);
    if (!isNaN(val)) {
      setDisplay(String(-val));
    }
  };

  // Basic operators (+, -, *, /)
  const inputOperator = (op: string) => {
    setExpression(`${display} ${op} `);
    setIsNewNumber(true);
  };

  // Evaluate expression
  const evaluate = () => {
    if (!expression) return;

    try {
      const fullExpr = `${expression}${display}`
        .replace(/×/g, '*')
        .replace(/÷/g, '/');

      // Safe calculation using Function
      const evalResult = new Function(`return ${fullExpr}`)();
      const formatted = Number(evalResult.toFixed(10)).toString();

      setHistory((prev) => [
        {
          expression: `${expression}${display} =`,
          result: formatted,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
        ...prev.slice(0, 19),
      ]);

      setDisplay(formatted);
      setExpression('');
      setIsNewNumber(true);
    } catch {
      setDisplay('Error');
      setIsNewNumber(true);
    }
  };

  // Scientific functions
  const applyFunction = (fn: string) => {
    const val = parseFloat(display);
    if (isNaN(val)) return;

    let res = 0;
    const toRadians = angleMode === 'DEG' ? (val * Math.PI) / 180 : val;

    switch (fn) {
      case 'sin':
        res = Math.sin(toRadians);
        break;
      case 'cos':
        res = Math.cos(toRadians);
        break;
      case 'tan':
        res = Math.tan(toRadians);
        break;
      case 'asin':
        res = angleMode === 'DEG' ? (Math.asin(val) * 180) / Math.PI : Math.asin(val);
        break;
      case 'acos':
        res = angleMode === 'DEG' ? (Math.acos(val) * 180) / Math.PI : Math.acos(val);
        break;
      case 'atan':
        res = angleMode === 'DEG' ? (Math.atan(val) * 180) / Math.PI : Math.atan(val);
        break;
      case 'sqrt':
        res = Math.sqrt(val);
        break;
      case 'cbrt':
        res = Math.cbrt(val);
        break;
      case 'sq':
        res = val * val;
        break;
      case 'cube':
        res = val * val * val;
        break;
      case 'inv':
        res = 1 / val;
        break;
      case 'ln':
        res = Math.log(val);
        break;
      case 'log10':
        res = Math.log10(val);
        break;
      case 'exp':
        res = Math.exp(val);
        break;
      case 'fact':
        res = factorial(Math.round(val));
        break;
      case 'pi':
        res = Math.PI;
        break;
      case 'e':
        res = Math.E;
        break;
      default:
        return;
    }

    const formatted = Number(res.toFixed(10)).toString();
    setDisplay(formatted);
    setIsNewNumber(true);
  };

  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= Math.min(n, 100); i++) res *= i;
    return res;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement).tagName.toLowerCase())) return;

      if (/^[0-9]$/.test(e.key)) {
        inputDigit(e.key);
      } else if (e.key === '.') {
        inputDigit('.');
      } else if (e.key === '+') {
        inputOperator('+');
      } else if (e.key === '-') {
        inputOperator('-');
      } else if (e.key === '*') {
        inputOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        inputOperator('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        evaluate();
      } else if (e.key === 'Backspace') {
        deleteLast();
      } else if (e.key === 'Escape') {
        clearAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400">
              <Binary className="w-5 h-5" />
            </span>
            <span>Scientific & Math Calculator</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Trigonometry, logarithms, powers, roots, factorial, memory operations & history tape
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              showHistory
                ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 border-brand-500'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <History className="w-4 h-4" />
            <span>History ({history.length})</span>
          </button>
          <ShareButton calculatorId="scientific" params={{}} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-4xl mx-auto">
        {/* Main Calculator Body (8 Cols or 12 Cols depending on history) */}
        <div className={`space-y-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl ${showHistory ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          {/* Calculator Screen / Display */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white font-mono text-right border border-slate-800 space-y-1 shadow-inner">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-brand-400 font-bold">
                  {angleMode}
                </span>
                {memory !== 0 && (
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold">
                    M: {memory}
                  </span>
                )}
              </div>
              <div className="h-5 text-slate-400 font-medium truncate max-w-xs">{expression}</div>
            </div>

            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight truncate select-all">
              {display}
            </div>
          </div>

          {/* Quick Settings & Memory Bar */}
          <div className="flex items-center justify-between text-xs font-bold gap-2">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setAngleMode('DEG')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  angleMode === 'DEG'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                DEG
              </button>
              <button
                type="button"
                onClick={() => setAngleMode('RAD')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  angleMode === 'RAD'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                RAD
              </button>
            </div>

            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <button
                type="button"
                onClick={() => setMemory(0)}
                className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Memory Clear"
              >
                MC
              </button>
              <button
                type="button"
                onClick={() => {
                  setDisplay(String(memory));
                  setIsNewNumber(true);
                }}
                className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Memory Recall"
              >
                MR
              </button>
              <button
                type="button"
                onClick={() => setMemory(memory + parseFloat(display))}
                className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Memory Add"
              >
                M+
              </button>
              <button
                type="button"
                onClick={() => setMemory(memory - parseFloat(display))}
                className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Memory Subtract"
              >
                M-
              </button>
            </div>
          </div>

          {/* Scientific Keypad Grid */}
          <div className="grid grid-cols-5 gap-2 text-xs sm:text-sm font-bold select-none">
            {/* Row 1 */}
            <button type="button" onClick={() => applyFunction('sin')} className="btn-sci">sin</button>
            <button type="button" onClick={() => applyFunction('cos')} className="btn-sci">cos</button>
            <button type="button" onClick={() => applyFunction('tan')} className="btn-sci">tan</button>
            <button type="button" onClick={clearAll} className="btn-op text-rose-600 dark:text-rose-400 font-extrabold">AC</button>
            <button type="button" onClick={deleteLast} className="btn-op text-amber-600 dark:text-amber-400">DEL</button>

            {/* Row 2 */}
            <button type="button" onClick={() => applyFunction('asin')} className="btn-sci">sin⁻¹</button>
            <button type="button" onClick={() => applyFunction('acos')} className="btn-sci">cos⁻¹</button>
            <button type="button" onClick={() => applyFunction('atan')} className="btn-sci">tan⁻¹</button>
            <button type="button" onClick={toggleSign} className="btn-op">±</button>
            <button type="button" onClick={() => inputOperator('÷')} className="btn-op text-lg text-brand-600 dark:text-brand-400">÷</button>

            {/* Row 3 */}
            <button type="button" onClick={() => applyFunction('sqrt')} className="btn-sci">√x</button>
            <button type="button" onClick={() => inputDigit('7')} className="btn-num">7</button>
            <button type="button" onClick={() => inputDigit('8')} className="btn-num">8</button>
            <button type="button" onClick={() => inputDigit('9')} className="btn-num">9</button>
            <button type="button" onClick={() => inputOperator('×')} className="btn-op text-lg text-brand-600 dark:text-brand-400">×</button>

            {/* Row 4 */}
            <button type="button" onClick={() => applyFunction('sq')} className="btn-sci">x²</button>
            <button type="button" onClick={() => inputDigit('4')} className="btn-num">4</button>
            <button type="button" onClick={() => inputDigit('5')} className="btn-num">5</button>
            <button type="button" onClick={() => inputDigit('6')} className="btn-num">6</button>
            <button type="button" onClick={() => inputOperator('-')} className="btn-op text-lg text-brand-600 dark:text-brand-400">−</button>

            {/* Row 5 */}
            <button type="button" onClick={() => applyFunction('ln')} className="btn-sci">ln</button>
            <button type="button" onClick={() => inputDigit('1')} className="btn-num">1</button>
            <button type="button" onClick={() => inputDigit('2')} className="btn-num">2</button>
            <button type="button" onClick={() => inputDigit('3')} className="btn-num">3</button>
            <button type="button" onClick={() => inputOperator('+')} className="btn-op text-lg text-brand-600 dark:text-brand-400">+</button>

            {/* Row 6 */}
            <button type="button" onClick={() => applyFunction('pi')} className="btn-sci">π</button>
            <button type="button" onClick={() => applyFunction('e')} className="btn-sci">e</button>
            <button type="button" onClick={() => inputDigit('0')} className="btn-num">0</button>
            <button type="button" onClick={() => inputDigit('.')} className="btn-num">.</button>
            <button
              type="button"
              onClick={evaluate}
              className="py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-lg shadow-md transition-all active:scale-95"
            >
              =
            </button>
          </div>
        </div>

        {/* History Tape Side Panel */}
        {showHistory && (
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Calculation History
              </span>
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={() => setHistory([])}
                  className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {history.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No calculations in history tape yet
                </div>
              ) : (
                history.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setDisplay(item.result);
                      setIsNewNumber(true);
                    }}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-50 dark:hover:bg-brand-950/40 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer text-right transition-colors"
                  >
                    <div className="text-[11px] font-mono text-slate-400 truncate">{item.expression}</div>
                    <div className="text-lg font-mono font-bold text-slate-900 dark:text-white">{item.result}</div>
                    <div className="text-[9px] text-slate-400 mt-1">{item.time}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

