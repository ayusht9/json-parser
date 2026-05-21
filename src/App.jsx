import React, { useState, useEffect, useRef } from 'react';

// --- Sample Data Profiles ---
const SAMPLES = {
  users: {
    status: "success",
    total_records: 2,
    page: 1,
    results: [
      {
        id: "usr_9921",
        username: "alice_dev",
        isActive: true,
        profile: {
          first_name: "Alice",
          last_name: "Smith",
          avatar_url: "https://api.aerojson.dev/avatars/alice.png",
          skills: ["JavaScript", "Python", "OpenAPI"]
        },
        login_count: 42,
        metadata: null
      },
      {
        id: "usr_9922",
        username: "bob_engineer",
        isActive: false,
        profile: {
          first_name: "Bob",
          last_name: "Jones",
          avatar_url: null,
          skills: ["Docker", "Kubernetes", "Go"]
        },
        login_count: 108,
        metadata: {
          last_login_ip: "192.168.1.45"
        }
      }
    ]
  },
  products: {
    category: "Electronics",
    store: "AeroStore Tech",
    inventory: [
      {
        sku: "PROD-A5B9",
        name: "Quantum Keyboard",
        price: 189.99,
        in_stock: true,
        ratings: {
          average: 4.8,
          reviews_count: 320
        },
        tags: ["mechanical", "rgb", "usb-c"]
      },
      {
        sku: "PROD-X11A",
        name: "Ultralight Carbon Mouse",
        price: 89.50,
        in_stock: false,
        ratings: {
          average: 4.5,
          reviews_count: 142
        },
        tags: ["gaming", "wireless", "rechargeable"]
      }
    ]
  },
  weather: {
    location: {
      city: "San Francisco",
      country: "US",
      coordinates: {
        latitude: 37.7749,
        longitude: -122.4194
      }
    },
    current: {
      temp_c: 18.5,
      humidity: 62,
      conditions: "Partly Cloudy",
      wind_kph: 12.4
    },
    forecast_days: [
      { day: "Monday", max_c: 20.1, min_c: 14.5, icon: "sunny" },
      { day: "Tuesday", max_c: 18.0, min_c: 13.2, icon: "cloudy" }
    ]
  },
  openapi: {
    openapi: "3.0.0",
    info: {
      title: "AeroJSON Example Specification",
      version: "1.0.0",
      description: "Standard OpenAPI document with typical endpoints."
    },
    paths: {
      "/items": {
        "get": {
          "summary": "List all items",
          "responses": {
            "200": {
              "description": "A successful list of items"
            }
          }
        }
      }
    }
  },
  heavy: {
    dataset_name: "Heavy Corporate Operations Catalog",
    version: "4.2.1-prod",
    scanned_at: new Date().toISOString(),
    departments: [
      {
        dept_id: "D101",
        name: "Engineering",
        manager: { name: "Sarah Connor", active: true, clearance_level: 5 },
        budget: 1250000.50,
        teams: [
          {
            team_name: "Platform Architecture",
            leads: ["Bob Vance", "Michael Scott"],
            active_sprints: [
              { id: 410, points: 45, status: "completed" },
              { id: 411, points: 52, status: "in-progress" }
            ],
            repository_details: { provider: "GitHub", total_repos: 14 }
          },
          {
            team_name: "Developer Experience",
            leads: ["Pam Beesly"],
            active_sprints: [
              { id: 310, points: 30, status: "completed" }
            ],
            repository_details: { provider: "GitLab", total_repos: 5 }
          }
        ]
      },
      {
        dept_id: "D102",
        name: "Marketing & Strategy",
        manager: { name: "Jim Halpert", active: false, clearance_level: 3 },
        budget: 450000.00,
        teams: [
          {
            team_name: "Inbound Lead Generation",
            leads: ["Ryan Howard", "Kelly Kapoor"],
            active_sprints: [
              { id: 91, points: 12, status: "completed" },
              { id: 92, points: 18, status: "in-progress" }
            ],
            repository_details: { provider: "HubSpot", total_repos: 0 }
          }
        ]
      },
      {
        dept_id: "D103",
        name: "Quality Assurance",
        manager: { name: "Creed Bratton", active: true, clearance_level: 1 },
        budget: 310000.00,
        teams: [
          {
            team_name: "Automation Frameworks",
            leads: ["Dwight Schrute"],
            active_sprints: [
              { id: 110, points: 60, status: "completed" }
            ],
            repository_details: { provider: "GitHub", total_repos: 8 }
          }
        ]
      }
    ]
  }
};

// --- Custom Toast Component ---
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const addToast = (msg, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };
  return { toasts, addToast };
}

// --- Recursive Tree Component ---
function TreeNode({ nodeKey, value, isLast = true, displayKey = null, path = "$", addToast, expandCounter, collapseCounter }) {
  const [expanded, setExpanded] = useState(true);
  const [limit, setLimit] = useState(40);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    if (expandCounter > 0) {
      setExpanded(true);
    }
  }, [expandCounter]);

  useEffect(() => {
    if (collapseCounter > 0) {
      setExpanded(false);
    }
  }, [collapseCounter]);
  
  const type = typeof value;
  const isObject = value !== null && type === 'object';
  const isArray = Array.isArray(value);
  const keys = isObject && !isArray ? Object.keys(value) : [];
  const totalItems = isObject ? (isArray ? value.length : keys.length) : 0;

  const toggleExpanded = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const showMore = (e) => {
    e.stopPropagation();
    setLimit(prev => prev + 40);
  };

  const handleCopyPath = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(path);
    addToast('JSONPath copied to clipboard!', 'success');
  };

  const handleCopyValue = (e) => {
    e.stopPropagation();
    const valStr = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
    navigator.clipboard.writeText(valStr);
    addToast('Node value copied to clipboard!', 'success');
  };

  const renderValueInline = () => {
    if (value === null) return <span className="type-null">null</span>;
    if (type === 'string') return <span className="type-string">"{value}"</span>;
    if (type === 'number') return <span className="type-number">{value}</span>;
    if (type === 'boolean') return <span className="type-boolean">{value ? 'true' : 'false'}</span>;
    
    const openBracket = isArray ? '[' : '{';
    return (
      <>
        <span className="tree-bracket">{openBracket}</span>
        <span className="tree-node-info">
          {isArray ? `${totalItems} items` : `${totalItems} keys`}
        </span>
      </>
    );
  };

  return (
    <div className="tree-node">
      <div 
        className="tree-node-row"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="tree-node-content">
          {isObject ? (
            <span className={`tree-toggle-icon ${expanded ? 'expanded' : ''}`} onClick={toggleExpanded}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </span>
          ) : (
            <span style={{ width: '14px', display: 'inline-block' }}></span>
          )}

          {(displayKey !== null || nodeKey) && (
            <>
              <span className="tree-key">{displayKey !== null ? displayKey : `"${nodeKey}"`}</span>
              <span className="tree-colon">: </span>
            </>
          )}
          {renderValueInline()}
        </div>

        {showActions && (
          <div className="tree-node-actions animate-fade-in">
            <span className="tree-node-path-badge" title={path}>{path}</span>
            <button className="tree-action-btn" onClick={handleCopyPath} title="Copy JSONPath">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>Path</span>
            </button>
            <button className="tree-action-btn" onClick={handleCopyValue} title="Copy Node Value">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
              <span>Value</span>
            </button>
          </div>
        )}
      </div>

      {isObject && (
        <div className="tree-node-children" style={{ display: expanded ? 'block' : 'none' }}>
          <div className="tree-node-list">
            {isArray ? (
              value.slice(0, limit).map((item, idx) => (
                <TreeNode 
                  key={idx} 
                  nodeKey={idx.toString()} 
                  value={item} 
                  isLast={idx === totalItems - 1} 
                  displayKey={idx.toString()} 
                  path={`${path}[${idx}]`}
                  addToast={addToast}
                  expandCounter={expandCounter}
                  collapseCounter={collapseCounter}
                />
              ))
            ) : (
              keys.slice(0, limit).map((k, idx) => (
                <TreeNode 
                  key={k} 
                  nodeKey={k} 
                  value={value[k]} 
                  isLast={idx === totalItems - 1} 
                  path={/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? `${path}.${k}` : `${path}["${k.replace(/"/g, '\"')}"]`}
                  addToast={addToast}
                  expandCounter={expandCounter}
                  collapseCounter={collapseCounter}
                />
              ))
            )}
            
            {totalItems > limit && (
              <div className="tree-node-row show-more-row" onClick={showMore}>
                <span className="tree-show-more-text">
                  Show next {totalItems - limit} items...
                </span>
              </div>
            )}
          </div>
          
          <div className="tree-node-row closing-bracket-row">
            <span style={{ width: '14px', display: 'inline-block' }}></span>
            <span className="tree-bracket">{isArray ? ']' : '}'}</span>
          </div>
        </div>
      )}
    </div>
  );
}
function syntaxHighlight(json) {
  if (typeof json !== 'string') {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
    let cls = 'type-number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'tree-key';
      } else {
        cls = 'type-string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'type-boolean';
    } else if (/null/.test(match)) {
      cls = 'type-null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}

// --- GridTab Subcomponent ---
function GridTab({ data }) {
  const [detectedArrays, setDetectedArrays] = useState({});
  const [selectedPath, setSelectedPath] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    const list = {};
    const collectArrays = (obj, path) => {
      if (Object.keys(list).length >= 35) return;
      if (obj === null || typeof obj !== 'object') return;
      
      if (Array.isArray(obj)) {
        list[path] = obj;
        obj.forEach((item, index) => {
          if (index < 2) collectArrays(item, `${path}[${index}]`);
        });
      } else {
        for (const key in obj) {
          const val = obj[key];
          const nextPath = path === 'root' ? key : `${path}.${key}`;
          if (val !== null && typeof val === 'object') {
            if (Array.isArray(val)) {
              list[nextPath] = val;
              val.forEach((item, index) => {
                if (index < 2) collectArrays(item, `${nextPath}[${index}]`);
              });
            } else {
              collectArrays(val, nextPath);
            }
          }
        }
      }
    };

    if (data) {
      collectArrays(data, 'root');
    }
    setDetectedArrays(list);
    const paths = Object.keys(list);
    if (paths.length > 0) {
      setSelectedPath(paths[0]);
      setCurrentPage(1);
    } else {
      setSelectedPath('');
    }
  }, [data]);

  const paths = Object.keys(detectedArrays);
  const activeArray = detectedArrays[selectedPath] || [];

  if (paths.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <span className="text-muted">No Array nodes could be extracted from your JSON structure.</span>
      </div>
    );
  }

  // Column calculations
  let isPrimitiveArray = false;
  let headers = [];
  if (activeArray.length > 0) {
    if (typeof activeArray[0] !== 'object' || activeArray[0] === null) {
      isPrimitiveArray = true;
      headers = ['Index', 'Value'];
    } else {
      headers = ['Index'];
      const keySet = new Set();
      activeArray.forEach(item => {
        if (item && typeof item === 'object') {
          Object.keys(item).forEach(k => keySet.add(k));
        }
      });
      headers = headers.concat(Array.from(keySet));
    }
  }

  const totalRecords = activeArray.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);
  const paginatedArray = activeArray.slice(startIndex, endIndex);

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.map(h => `"${h.replace(/"/g, '""')}"`).join(",") + "\r\n";

    activeArray.forEach((rowItem, index) => {
      const rowCells = [String(index)];
      if (isPrimitiveArray) {
        rowCells.push(rowItem === null ? 'null' : String(rowItem));
      } else {
        for (let col = 1; col < headers.length; col++) {
          const colKey = headers[col];
          const val = rowItem ? rowItem[colKey] : undefined;
          let cellStr = '';
          if (val !== undefined && val !== null) {
            cellStr = typeof val === 'object' ? JSON.stringify(val) : String(val);
          }
          rowCells.push(cellStr);
        }
      }
      csvContent += rowCells.map(c => `"${c.replace(/"/g, '""')}"`).join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aerojson_export_${selectedPath.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderCellContent = (val) => {
    if (val === undefined) return <span className="text-muted" style={{ opacity: 0.35 }}>-</span>;
    if (val === null) return <span className="grid-badge grid-badge-null">null</span>;
    
    const type = typeof val;
    if (type === 'string') return <span className="type-string">"{val}"</span>;
    if (type === 'number') return <span className="type-number">{val}</span>;
    if (type === 'boolean') return <span className="type-boolean">{val ? 'true' : 'false'}</span>;

    if (Array.isArray(val)) {
      if (val.length === 0) return <span className="text-muted">[]</span>;
      const isObjectArray = typeof val[0] === 'object' && val[0] !== null;

      if (!isObjectArray) {
        return val.map((item, i) => {
          let itemCls = typeof item;
          if (item === null) itemCls = 'null';
          return (
            <span key={i} className={`grid-badge grid-badge-${itemCls}`}>
              {String(item)}
            </span>
          );
        });
      } else {
        const subKeys = new Set();
        val.forEach(subObj => {
          if (subObj) Object.keys(subObj).forEach(k => subKeys.add(k));
        });
        const subHeaders = Array.from(subKeys).slice(0, 4);

        return (
          <table className="cell-nested-table">
            <thead>
              <tr>
                {subHeaders.map(sh => <th key={sh}>{sh}</th>)}
              </tr>
            </thead>
            <tbody>
              {val.slice(0, 3).map((subRow, r) => (
                <tr key={r}>
                  {subHeaders.map(sh => {
                    const innerVal = subRow ? subRow[sh] : undefined;
                    let displayVal = '-';
                    if (innerVal !== undefined) {
                      if (innerVal === null) displayVal = 'null';
                      else if (typeof innerVal === 'object') displayVal = '{...}';
                      else displayVal = String(innerVal);
                    }
                    return <td key={sh}>{displayVal}</td>;
                  })}
                </tr>
              ))}
              {val.length > 3 && (
                <tr>
                  <td colSpan={subHeaders.length} className="text-muted text-center" style={{ fontSize: '9.5px', padding: '2px' }}>
                    + {val.length - 3} more items
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        );
      }
    }

    if (type === 'object') {
      const keys = Object.keys(val);
      if (keys.length === 0) return <span className="text-muted">{"{}"}</span>;
      return (
        <div className="cell-nested-object">
          {keys.map(k => {
            const innerVal = val[k];
            let displayVal = '';
            if (innerVal === null) displayVal = 'null';
            else if (Array.isArray(innerVal)) displayVal = `[${innerVal.length}]`;
            else if (typeof innerVal === 'object') displayVal = '{...}';
            else displayVal = String(innerVal);

            return (
              <div key={k} className="nested-prop-row">
                <span className="nested-prop-key">{k}</span>
                <span className="nested-prop-val">{displayVal}</span>
              </div>
            );
          })}
        </div>
      );
    }
    return String(val);
  };

  return (
    <>
      <div className="grid-controls card">
        <div className="grid-selector-wrapper">
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
            Select Array Node:
          </label>
          <select 
            value={selectedPath} 
            onChange={(e) => { setSelectedPath(e.target.value); setCurrentPage(1); }} 
            className="form-select select-sm" 
            style={{ maxWidth: '320px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)' }}
          >
            {paths.map(p => (
              <option key={p} value={p}>
                {p} ({detectedArrays[p].length} items)
              </option>
            ))}
          </select>
        </div>
        <div className="grid-actions" style={{ marginLeft: 'auto' }}>
          <button onClick={handleExportCSV} className="btn btn-xs btn-secondary">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="grid-viewport card" style={{ overflow: 'auto' }}>
        <div className="grid-table-container">
          {activeArray.length === 0 ? (
            <span className="text-muted">Empty Array node</span>
          ) : (
            <table className="grid-table">
              <thead>
                <tr>
                  {headers.map(h => <th key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {paginatedArray.map((rowItem, i) => {
                  const actualIdx = startIndex + i;
                  return (
                    <tr key={actualIdx}>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textAlign: 'center' }}>
                        {actualIdx}
                      </td>
                      {isPrimitiveArray ? (
                        <td>{renderCellContent(rowItem)}</td>
                      ) : (
                        headers.slice(1).map(colKey => (
                          <td key={colKey}>
                            {renderCellContent(rowItem ? rowItem[colKey] : undefined)}
                          </td>
                        ))
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {totalRecords > pageSize && (
          <div className="grid-pagination" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(p => p - 1)} 
              className="btn btn-xs btn-secondary"
            >
              Previous
            </button>
            <span className="font-mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Page {currentPage} of {totalPages} (Records {startIndex + 1} - {endIndex} of {totalRecords})
            </span>
            <button 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(p => p + 1)} 
              className="btn btn-xs btn-secondary"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// --- App Entry Point ---
export default function App() {
  const [theme, setTheme] = useState('dark-theme');
  const [inputText, setInputText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [syntaxError, setSyntaxError] = useState(null);
  const [activeTab, setActiveTab] = useState('swagger');
  
  // Pane Resizing State
  const [editorWidth, setEditorWidth] = useState(500);
  const isDragging = useRef(false);

  // Collapse/Minimize States
  const [isEditorCollapsed, setIsEditorCollapsed] = useState(false);
  const [isViewerCollapsed, setIsViewerCollapsed] = useState(false);
  const [treeExpandCounter, setTreeExpandCounter] = useState(0);
  const [treeCollapseCounter, setTreeCollapseCounter] = useState(0);

  const handleMouseDown = (e) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMouseMove = (moveEvent) => {
      if (!isDragging.current) return;
      const newWidth = Math.max(320, Math.min(window.innerWidth - 320, moveEvent.clientX));
      setEditorWidth(newWidth);
    };

    const onMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  
  // Custom Toasts
  const { toasts, addToast } = useToasts();
  
  // Dropdown
  const [showSamples, setShowSamples] = useState(false);
  
  // Element Refs
  const editorRef = useRef(null);
  const lineNumbersRef = useRef(null);

  // Sync scroll
  const handleEditorScroll = () => {
    if (editorRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = editorRef.current.scrollTop;
    }
  };

  // Set Theme
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Load initial sample
  useEffect(() => {
    loadSample('users');
  }, []);

  const loadSample = (key) => {
    const data = SAMPLES[key];
    if (data) {
      const formatted = JSON.stringify(data, null, 2);
      setInputText(formatted);
      tryParse(formatted);
      addToast(`Loaded sample: ${key}`, 'success');
    }
  };

  // Debounced Parsing
  const debounceTimeout = useRef(null);
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputText(val);
    
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      tryParse(val);
    }, 300);
  };

  const tryParse = (text) => {
    if (!text.trim()) {
      setParsedData(null);
      setSyntaxError(null);
      return;
    }
    try {
      const parsed = JSON.parse(text);
      setParsedData(parsed);
      setSyntaxError(null);
    } catch (e) {
      setParsedData(null);
      setSyntaxError(e.message);
    }
  };

  const formatJSON = () => {
    if (!parsedData) {
      addToast('No valid JSON to format', 'error');
      return;
    }
    const formatted = JSON.stringify(parsedData, null, 2);
    setInputText(formatted);
    addToast('Formatted JSON payload', 'success');
  };

  const minifyJSON = () => {
    if (!parsedData) {
      addToast('No valid JSON to minify', 'error');
      return;
    }
    const minified = JSON.stringify(parsedData);
    setInputText(minified);
    addToast('Minified JSON payload', 'success');
  };

  const copyInput = () => {
    if (!inputText.trim()) {
      addToast('Nothing to copy', 'error');
      return;
    }
    navigator.clipboard.writeText(inputText);
    addToast('Copied raw JSON to clipboard', 'success');
  };

  const clearInput = () => {
    setInputText('');
    setParsedData(null);
    setSyntaxError(null);
    addToast('Editor cleared', 'info');
  };

  // Swagger Property Inference
  const inferSchemaProperties = (data, prefix = '') => {
    if (data === null || typeof data !== 'object') return [];
    let rows = [];
    if (Array.isArray(data)) {
      if (data.length > 0 && typeof data[0] === 'object') {
        return inferSchemaProperties(data[0], prefix + '[0].');
      }
      return [{
        name: prefix || 'root',
        type: 'array',
        required: true,
        validation: 'Array of primitive values'
      }];
    }
    for (const key in data) {
      const val = data[key];
      const type = val === null ? 'null' : typeof val;
      let validation = '';
      if (type === 'string') {
        if (val.startsWith('http')) validation = 'Format: URL';
        else if (val.includes('@')) validation = 'Format: Email';
        else validation = `Max Length: ${Math.max(30, val.length * 2)}`;
      } else if (type === 'number') {
        validation = val % 1 === 0 ? 'Type: Integer' : 'Type: Float';
      } else if (Array.isArray(val)) {
        validation = `Array length: ${val.length}`;
      } else if (type === 'object') {
        validation = 'Nested Object schema';
      }
      rows.push({
        name: prefix + key,
        type: Array.isArray(val) ? 'array' : type,
        required: true,
        validation
      });
      if (val !== null && type === 'object' && !Array.isArray(val)) {
        rows = rows.concat(inferSchemaProperties(val, prefix + key + '.'));
      }
    }
    return rows;
  };

  const lines = inputText.split('\n');

  return (
    <div className="app-container">
      {/* Toast notifications */}
      <div id="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type} show`}>
            {t.type === 'success' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            ) : t.type === 'error' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            )}
            <span>{t.msg}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </div>
          <span className="brand-name">AeroJSON</span>
          <span className="brand-version">v1.1.0-react</span>
        </div>

        <div className="header-actions">
          <div className="dropdown-wrapper">
            <button className="btn btn-secondary dropdown-trigger" onClick={() => setShowSamples(!showSamples)}>
              <span>Load Sample JSON</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            {showSamples && (
              <div className="dropdown-menu show" style={{ top: '100%', right: 0 }}>
                <button onClick={() => { loadSample('users'); setShowSamples(false); }}>Users Account profile</button>
                <button onClick={() => { loadSample('products'); setShowSamples(false); }}>Products Inventory list</button>
                <button onClick={() => { loadSample('weather'); setShowSamples(false); }}>Weather Forecast telemetry</button>
                <button onClick={() => { loadSample('openapi'); setShowSamples(false); }}>OpenAPI Specs draft</button>
                <button onClick={() => { loadSample('heavy'); setShowSamples(false); }}>Deeply Nested Heavy Dataset</button>
              </div>
            )}
          </div>

          <div className={`status-badge ${inputText ? (parsedData ? 'status-valid' : 'status-invalid') : 'status-empty'}`}>
            <div className="status-indicator"></div>
            <span className="status-text">{inputText ? (parsedData ? 'Valid JSON' : 'Syntax Error') : 'Empty Input'}</span>
          </div>

          <button className="icon-btn" onClick={() => setTheme(theme === 'dark-theme' ? 'light-theme' : 'dark-theme')} title="Toggle Light/Dark Theme">
            {theme === 'dark-theme' ? (
              <svg className="sun-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            ) : (
              <svg className="moon-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            )}
          </button>
        </div>
      </header>

      {/* Main Layout Workspace Grid */}
      <main className="workspace">
        {/* Left Pane: Editor */}
        {isEditorCollapsed ? (
          <div 
            className="collapsed-dock-bar" 
            onClick={() => setIsEditorCollapsed(false)}
            title="Expand Input Editor"
            style={{ borderRight: '1px solid var(--border-color)' }}
          >
            <div className="dock-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="13 17 18 12 13 7"></polyline>
                <polyline points="6 17 11 12 6 7"></polyline>
              </svg>
            </div>
            <span className="dock-title">Expand Editor</span>
          </div>
        ) : (
          <section className="pane pane-editor" style={{ width: isViewerCollapsed ? '100%' : `${editorWidth}px`, flex: isViewerCollapsed ? '1' : 'none' }}>
            <div className="pane-header">
              <h2>JSON INPUT EDITOR</h2>
              <div className="editor-actions">
                <button className="btn btn-sm btn-primary" onClick={formatJSON}>Format</button>
                <button className="btn btn-sm btn-secondary" onClick={minifyJSON}>Minify</button>
                <button className="btn btn-sm btn-secondary" onClick={copyInput}>Copy</button>
                <button className="btn btn-sm btn-danger" onClick={clearInput}>Clear</button>
                <button 
                  className="btn btn-sm btn-secondary icon-btn-only" 
                  onClick={() => setIsEditorCollapsed(true)}
                  title="Minimize Editor"
                  style={{ padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="11 17 6 12 11 7"></polyline>
                    <polyline points="18 17 13 12 18 7"></polyline>
                  </svg>
                </button>
              </div>
            </div>

            <div className="editor-wrapper card">
              <div className="line-numbers" ref={lineNumbersRef}>
                {lines.map((_, i) => <span key={i}>{i + 1}</span>)}
              </div>
              <textarea
                id="json-input"
                ref={editorRef}
                value={inputText}
                onChange={handleInputChange}
                onScroll={handleEditorScroll}
                placeholder='Paste or write your JSON here...'
                spellCheck="false"
              />
            </div>

            <div className="console-panel card">
              <div className="console-header">Console Output</div>
              <div id="error-console" className="console-viewport">
                {syntaxError ? (
                  <div className="console-message text-danger">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    {syntaxError}
                  </div>
                ) : parsedData ? (
                  <div className="console-message text-success">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    JSON parsed successfully. Ready.
                  </div>
                ) : (
                  <div className="console-message text-muted">Ready to parse JSON data.</div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Resizable Divider */}
        {!isEditorCollapsed && !isViewerCollapsed && (
          <div className="workspace-divider" onMouseDown={handleMouseDown} />
        )}

        {/* Right Pane: Visualizers */}
        {isViewerCollapsed ? (
          <div 
            className="collapsed-dock-bar" 
            onClick={() => setIsViewerCollapsed(false)}
            title="Expand Visualizer Tools"
            style={{ borderLeft: '1px solid var(--border-color)' }}
          >
            <div className="dock-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="11 17 6 12 11 7"></polyline>
                <polyline points="18 17 13 12 18 7"></polyline>
              </svg>
            </div>
            <span className="dock-title">Expand Visualizers</span>
          </div>
        ) : (
          <section className="pane pane-viewer">
            <div className="pane-header tabs-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <nav className="tabs-nav" style={{ flex: 1 }}>
                <button className={`tab-btn ${activeTab === 'swagger' ? 'active' : ''}`} onClick={() => setActiveTab('swagger')}>
                  <svg className="tab-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  <span>Swagger Spec Docs</span>
                </button>
                <button className={`tab-btn ${activeTab === 'tree' ? 'active' : ''}`} onClick={() => setActiveTab('tree')}>
                  <svg className="tab-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                  <span>Interactive Tree</span>
                </button>
                <button className={`tab-btn ${activeTab === 'grid' ? 'active' : ''}`} onClick={() => setActiveTab('grid')}>
                  <svg className="tab-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line></svg>
                  <span>Data Grid</span>
                </button>
                <button className={`tab-btn ${activeTab === 'tools' ? 'active' : ''}`} onClick={() => setActiveTab('tools')}>
                  <svg className="tab-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                  <span>JSON Tools</span>
                </button>
                <button className={`tab-btn ${activeTab === 'sandbox' ? 'active' : ''}`} onClick={() => setActiveTab('sandbox')}>
                  <svg className="tab-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                  <span>API Sandbox</span>
                </button>
                <button className={`tab-btn ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>
                  <svg className="tab-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                  <span>Code Snippets</span>
                </button>
              </nav>
              <button 
                className="tab-btn-collapse"
                onClick={() => setIsViewerCollapsed(true)}
                title="Collapse Visualizers"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="13 17 18 12 13 7"></polyline>
                  <polyline points="6 17 11 12 6 7"></polyline>
                </svg>
              </button>
            </div>

          <div className="tabs-content">
            {/* Tab: Swagger Spec */}
            {activeTab === 'swagger' && (
              <div className="tab-panel active">
                <div className="swagger-spec-layout">
                  <div className="swagger-endpoint card collapsed">
                    <div className="endpoint-bar" onClick={(e) => e.currentTarget.parentElement.classList.toggle('collapsed')}>
                      <span className="method-badge method-post">POST</span>
                      <span className="endpoint-path">/v1/mock/resource</span>
                      <span className="endpoint-desc">Verify, mock validate, and process inbound payloads</span>
                      <span className="chevron-toggle">▼</span>
                    </div>
                    <div className="endpoint-details">
                      <h3>Request Parameters Schema</h3>
                      <table className="swagger-table">
                        <thead>
                          <tr>
                            <th>Parameter</th>
                            <th>Type</th>
                            <th>Required</th>
                            <th>Validation Rule</th>
                          </tr>
                        </thead>
                        <tbody>
                          {parsedData ? (
                            inferSchemaProperties(parsedData).map((prop, i) => (
                              <tr key={i}>
                                <td><strong><code>{prop.name}</code></strong></td>
                                <td><span className="badge" style={{ color: 'var(--accent-cyan)' }}>{prop.type}</span></td>
                                <td><span className="text-danger">Yes</span></td>
                                <td><span className="text-muted" style={{ fontSize: '12px' }}>{prop.validation || 'None'}</span></td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="text-muted text-center">Paste valid JSON in the editor to view schema specs</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="swagger-model card">
                    <div className="model-header" onClick={() => {
                      const details = document.getElementById('model-detail-pre');
                      if (details) details.style.display = details.style.display === 'none' ? 'block' : 'none';
                    }}>
                      <span>Model Schema: <code>AeroSchemaModel</code></span>
                      <span className="chevron">▼</span>
                    </div>
                    <pre id="model-detail-pre" className="code-block font-mono" style={{ padding: '16px', margin: 0 }}>
                      {parsedData ? (
                        <code dangerouslySetInnerHTML={{
                          __html: '{\n' + inferSchemaProperties(parsedData).map((prop, i, arr) => (
                            `  "${prop.name}": <span class="type-${prop.type}">${prop.type}</span>${i === arr.length - 1 ? '' : ','}${prop.validation ? ` // ${prop.validation}` : ''}`
                          )).join('\n') + '\n}'
                        }} />
                      ) : (
                        <code className="text-muted">// Ready to infer model specifications</code>
                      )}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Interactive Tree */}
            {activeTab === 'tree' && (
              <div className="tab-panel active">
                <div className="tree-controls card">
                  <div className="search-box">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input 
                      type="text" 
                      id="tree-search" 
                      placeholder="Search property keys or values..."
                      onChange={(e) => {
                        const val = e.target.value.toLowerCase();
                        document.querySelectorAll('.tree-node-row').forEach(el => {
                          if (val && el.innerText.toLowerCase().includes(val)) {
                            el.classList.add('search-match');
                          } else {
                            el.classList.remove('search-match');
                          }
                        });
                      }}
                    />
                  </div>
                  <div className="tree-actions">
                    <button className="btn btn-sm btn-secondary" onClick={() => setTreeExpandCounter(prev => prev + 1)}>Expand All</button>
                    <button className="btn btn-sm btn-secondary" onClick={() => setTreeCollapseCounter(prev => prev + 1)}>Collapse All</button>
                  </div>
                </div>

                <div className="tree-viewport card">
                  <div id="tree-root">
                    {parsedData ? (
                      <div className="tree-node-list">
                        <TreeNode 
                          nodeKey="" 
                          value={parsedData} 
                          isLast={true} 
                          displayKey="Root" 
                          path="$" 
                          addToast={addToast} 
                          expandCounter={treeExpandCounter}
                          collapseCounter={treeCollapseCounter}
                        />
                      </div>
                    ) : (
                      <span className="text-muted">Enter valid JSON in the editor to visualize as an interactive tree.</span>
                    )}
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'grid' && (
              <div className="tab-panel active">
                <GridTab data={parsedData} />
              </div>
            )}

            {/* Tab: JSON Tools */}
            {activeTab === 'tools' && (
              <ToolsTab data={parsedData} addToast={addToast} />
            )}

            {/* Tab: Sandbox Simulator */}
            {activeTab === 'sandbox' && (
              <SandboxTab data={parsedData} addToast={addToast} />
            )}

            {/* Tab: Code Snippets */}
            {activeTab === 'code' && (
              <CodeSnippetsTab data={parsedData} addToast={addToast} />
            )}
          </div>
        </section>
        )}
      </main>
    </div>
  );
}

// --- ToolsTab Subcomponent ---
function ToolsTab({ data, addToast }) {
  const [activeTool, setActiveTool] = useState('query');
  const [queryStr, setQueryStr] = useState('');
  const [convertFormat, setConvertFormat] = useState('yaml');
  const [transformedOutput, setTransformedOutput] = useState(null);

  // XML / YAML Converters
  const jsonToYaml = (obj, indent = 0) => {
    const spaces = ' '.repeat(indent);
    if (obj === null) return 'null';
    if (typeof obj === 'string') {
      if (/[^a-zA-Z0-9\s]/.test(obj) || obj.includes('\n')) {
        return `"${obj.replace(/"/g, '\\"')}"`;
      }
      return obj;
    }
    if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      let yaml = '';
      obj.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          const sub = jsonToYaml(item, indent + 2);
          const lines = sub.split('\n');
          yaml += `${spaces}- ${lines[0].trim()}\n`;
          for (let i = 1; i < lines.length; i++) yaml += `  ${lines[i]}\n`;
        } else {
          yaml += `${spaces}- ${jsonToYaml(item, 0)}\n`;
        }
      });
      return yaml.trimEnd();
    }
    if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      if (keys.length === 0) return '{}';
      let yaml = '';
      keys.forEach(key => {
        const val = obj[key];
        if (typeof val === 'object' && val !== null) {
          yaml += `${spaces}${key}:\n${jsonToYaml(val, indent + 2)}\n`;
        } else {
          yaml += `${spaces}${key}: ${jsonToYaml(val, 0)}\n`;
        }
      });
      return yaml.trimEnd();
    }
    return '';
  };

  const jsonToXml = (obj, rootName = 'root', indent = 0) => {
    const spaces = ' '.repeat(indent);
    if (obj === null) return `${spaces}<${rootName} nil="true" />`;
    const type = typeof obj;
    if (type === 'string' || type === 'number' || type === 'boolean') {
      const escapeXml = (unsafe) => unsafe.replace(/[<>&'"]/g, (c) => {
        if (c === '<') return '&lt;';
        if (c === '>') return '&gt;';
        if (c === '&') return '&amp;';
        if (c === '\'') return '&apos;';
        return '&quot;';
      });
      return `${spaces}<${rootName}>${escapeXml(String(obj))}</${rootName}>`;
    }
    if (Array.isArray(obj)) {
      let xml = '';
      obj.forEach(item => { xml += jsonToXml(item, 'item', indent) + '\n'; });
      return xml.trimEnd();
    }
    if (type === 'object') {
      let xml = `${spaces}<${rootName}>\n`;
      for (const key in obj) {
        const val = obj[key];
        const cleanKey = key.replace(/[^a-zA-Z0-9_.-]/g, '_');
        if (Array.isArray(val)) {
          xml += `${spaces}  <${cleanKey}>\n`;
          val.forEach(item => { xml += jsonToXml(item, 'element', indent + 4) + '\n'; });
          xml += `${spaces}  </${cleanKey}>\n`;
        } else {
          xml += jsonToXml(val, cleanKey, indent + 2) + '\n';
        }
      }
      xml += `${spaces}</${rootName}>`;
      return xml;
    }
    return '';
  };

  // Evaluate Query
  const evaluateQuery = (obj, query) => {
    if (!query.trim()) return obj;
    let normalized = query.replace(/\[['"]?([^'"]+?)['"]?\]/g, '.$1').replace(/^\./, '');
    const parts = normalized.split('.');
    let current = obj;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (current === null || current === undefined) return undefined;
      if (part === '*') {
        if (Array.isArray(current)) {
          const remaining = parts.slice(i + 1).join('.');
          if (!remaining) return current;
          return current.map(item => evaluateQuery(item, remaining)).filter(x => x !== undefined);
        }
        return undefined;
      }
      if (Array.isArray(current) && !isNaN(part)) {
        current = current[parseInt(part)];
      } else if (typeof current === 'object') {
        current = current[part];
      } else {
        return undefined;
      }
    }
    return current;
  };

  // Flatten / Expand
  const flattenObject = (obj, prefix = '', result = {}) => {
    if (obj === null) {
      result[prefix] = null;
      return result;
    }
    if (Array.isArray(obj)) {
      if (obj.length === 0) result[prefix] = [];
      else obj.forEach((item, idx) => flattenObject(item, prefix ? `${prefix}.${idx}` : `${idx}`, result));
    } else if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      if (keys.length === 0) result[prefix] = {};
      else keys.forEach(key => flattenObject(obj[key], prefix ? `${prefix}.${key}` : key, result));
    } else {
      result[prefix] = obj;
    }
    return result;
  };

  const expandObject = (flat) => {
    const result = {};
    for (const key in flat) {
      const parts = key.split('.');
      let current = result;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isLast = i === parts.length - 1;
        const nextPart = parts[i + 1];
        const isNextIndex = nextPart !== undefined && !isNaN(nextPart);
        if (isLast) {
          current[part] = flat[key];
        } else {
          if (current[part] === undefined) {
            current[part] = isNextIndex ? [] : {};
          }
          current = current[part];
        }
      }
    }
    return result;
  };

  const handleFlatten = () => {
    if (!data) return addToast('No valid JSON to flatten', 'error');
    const flat = flattenObject(data);
    setTransformedOutput(JSON.stringify(flat, null, 2));
    addToast('JSON structures flattened', 'success');
  };

  const handleExpand = () => {
    if (!data) return addToast('No valid JSON to expand', 'error');
    try {
      const expanded = expandObject(data);
      setTransformedOutput(JSON.stringify(expanded, null, 2));
      addToast('Dotted properties expanded', 'success');
    } catch (e) {
      addToast('Failed to expand dotted properties', 'error');
    }
  };

  // Calculations
  const queryResult = data ? evaluateQuery(data, queryStr) : undefined;
  const convertResult = data ? (convertFormat === 'yaml' ? jsonToYaml(data) : jsonToXml(data, 'root')) : '';

  const handleDownloadConvert = () => {
    const blob = new Blob([convertResult], { type: convertFormat === 'yaml' ? 'text/yaml' : 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `aerojson_converted.${convertFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast(`Downloaded converted ${convertFormat.toUpperCase()} file`, 'success');
  };

  return (
    <div className="tab-panel active">
      <div className="tools-layout">
        {/* Left sidebar menu */}
        <div className="tools-sidebar card">
          <h3>JSON Utility Tools</h3>
          <nav className="tools-nav">
            <button className={`tool-menu-btn ${activeTool === 'query' ? 'active' : ''}`} onClick={() => setActiveTool('query')}>
              <span>JSONPath Query Filter</span>
            </button>
            <button className={`tool-menu-btn ${activeTool === 'convert' ? 'active' : ''}`} onClick={() => setActiveTool('convert')}>
              <span>YAML & XML Converter</span>
            </button>
            <button className={`tool-menu-btn ${activeTool === 'flatten' ? 'active' : ''}`} onClick={() => setActiveTool('flatten')}>
              <span>Flatten & Expand JSON</span>
            </button>
          </nav>
        </div>

        {/* Viewport content */}
        <div className="tool-viewport card">
          {/* Query Filter */}
          {activeTool === 'query' && (
            <div className="tool-subpanel active">
              <div className="tool-panel-header" style={{ marginBottom: '14px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--accent-cyan)' }}>JSONPath Query Filter</h4>
              </div>
              <div className="setting-row" style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Query String (Dot-notation or simple JSONPath):
                </label>
                <div className="search-box" style={{ maxWidth: '100%', width: '100%', marginBottom: '8px', background: 'var(--bg-input)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  <input 
                    type="text" 
                    value={queryStr} 
                    onChange={(e) => setQueryStr(e.target.value)} 
                    placeholder="e.g. departments[0].teams or results[*].username" 
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }} 
                  />
                </div>
                <span className="text-muted" style={{ fontSize: '11px' }}>
                  Examples: <code>category</code>, <code>departments[0].name</code>, <code>departments[*].manager.name</code>
                </span>
              </div>
              
              <div className="code-viewport-header" style={{ marginTop: '20px' }}>
                <span>Filtered Result</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(queryResult, null, 2));
                    addToast('Copied filtered result to clipboard', 'success');
                  }} 
                  className="btn btn-xs btn-secondary"
                >
                  Copy
                </button>
              </div>
              <div className="code-content-wrapper" style={{ maxHeight: '320px' }}>
                <pre>
                  {queryResult !== undefined ? (
                    <code dangerouslySetInnerHTML={{ __html: syntaxHighlight(JSON.stringify(queryResult, null, 2)) }} />
                  ) : (
                    <code className="text-danger">Query returns no matching properties.</code>
                  )}
                </pre>
              </div>
            </div>
          )}

          {/* Converter */}
          {activeTool === 'convert' && (
            <div className="tool-subpanel active">
              <div className="tool-panel-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--accent-cyan)', margin: 0 }}>YAML & XML Converter</h4>
                <div className="editor-actions" style={{ display: 'flex', gap: 0 }}>
                  <button className={`btn btn-xs btn-secondary ${convertFormat === 'yaml' ? 'active' : ''}`} onClick={() => setConvertFormat('yaml')} style={{ borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)', borderRight: 'none' }}>YAML</button>
                  <button className={`btn btn-xs btn-secondary ${convertFormat === 'xml' ? 'active' : ''}`} onClick={() => setConvertFormat('xml')} style={{ borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>XML</button>
                </div>
              </div>

              <div className="code-viewport-header" style={{ marginTop: '16px' }}>
                <span>{convertFormat === 'yaml' ? 'YAML Output' : 'XML Output'}</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={handleDownloadConvert} className="btn btn-xs btn-secondary">Download</button>
                  <button onClick={() => { navigator.clipboard.writeText(convertResult); addToast('Copied converted output to clipboard', 'success'); }} className="btn btn-xs btn-secondary">Copy</button>
                </div>
              </div>
              <div className="code-content-wrapper" style={{ maxHeight: '340px' }}>
                <pre><code className="font-mono">{convertResult || 'XML / YAML converted output will display here.'}</code></pre>
              </div>
            </div>
          )}

          {/* Flatten/Expand */}
          {activeTool === 'flatten' && (
            <div className="tool-subpanel active">
              <div className="tool-panel-header" style={{ marginBottom: '14px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--accent-cyan)' }}>Structure Flatten & Expand</h4>
              </div>
              <p className="section-desc">Flatten collapses nested object structures into single key-value dotted paths. Expand restores dotted paths back to a nested tree structure.</p>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <button onClick={handleFlatten} className="btn btn-primary btn-sm" style={{ flex: 1, padding: '10px 0' }}>Flatten JSON</button>
                <button onClick={handleExpand} className="btn btn-accent btn-sm" style={{ flex: 1, padding: '10px 0' }}>Expand JSON</button>
              </div>
              
              <div className="code-viewport-header">
                <span>Transformed Result</span>
                <button onClick={() => { navigator.clipboard.writeText(transformedOutput); addToast('Copied transformed result to clipboard', 'success'); }} className="btn btn-xs btn-secondary">Copy</button>
              </div>
              <div className="code-content-wrapper" style={{ maxHeight: '300px' }}>
                <pre>
                  {transformedOutput ? (
                    <code dangerouslySetInnerHTML={{ __html: syntaxHighlight(transformedOutput) }} />
                  ) : (
                    <code className="text-muted">Click Flatten or Expand above to see results.</code>
                  )}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- SandboxTab Subcomponent ---
function SandboxTab({ data, addToast }) {
  const [method, setMethod] = useState('POST');
  const [status, setStatus] = useState(200);
  const [latency, setLatency] = useState(100);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  // Set method default based on array/object
  useEffect(() => {
    if (data) {
      setMethod(Array.isArray(data) ? 'GET' : 'POST');
    }
  }, [data]);

  const handleExecute = async () => {
    setLoading(true);
    setResponse(null);
    const startTime = Date.now();
    try {
      // Connect to the Node/Express server API
      const res = await fetch('/api/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          latency,
          status,
          payload: data || {}
        })
      });

      const body = await res.json();
      const duration = Date.now() - startTime;
      const bodyStr = JSON.stringify(body, null, 2);
      
      // Reconstruct header string
      let headerStr = `HTTP/1.1 ${res.status} ${res.statusText}\n`;
      res.headers.forEach((v, k) => {
        headerStr += `${k}: ${v}\n`;
      });

      setResponse({
        status: `${res.status} ${res.statusText}`,
        statusCode: res.status,
        duration: `${duration} ms`,
        size: `${(bodyStr.length / 1024).toFixed(2)} KB`,
        body: bodyStr,
        headers: headerStr
      });
      addToast(`Mock Sandbox response: status ${res.status}`, res.ok ? 'success' : 'error');
    } catch (e) {
      addToast(`Mock sandbox request failed: ${e.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-panel active">
      <div className="sandbox-panel card">
        <div className="sandbox-bar">
          <select 
            value={method} 
            onChange={(e) => setMethod(e.target.value)} 
            className="form-select select-sm method-selector" 
            style={{ 
              maxWidth: '90px', 
              fontWeight: 700, 
              color: method === 'GET' ? 'var(--swagger-get)' : method === 'POST' ? 'var(--swagger-post)' : method === 'PUT' ? 'var(--swagger-put)' : 'var(--swagger-delete)' 
            }}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>

          <input 
            type="text" 
            readOnly 
            value="https://api.aerojson.dev/v1/mock/resource" 
            className="form-input text-field" 
            style={{ background: 'var(--bg-input)', color: 'var(--text-muted)' }} 
          />

          <button onClick={handleExecute} disabled={loading} className="btn btn-accent btn-sm">
            {loading ? 'Sending...' : 'Execute'}
          </button>
        </div>

        <div className="sandbox-settings" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
          <div className="setting-row">
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Simulated Target Status Code:
            </label>
            <select value={status} onChange={(e) => setStatus(parseInt(e.target.value))} className="form-select select-sm" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)' }}>
              <option value="200">200 OK (Success)</option>
              <option value="201">201 Created (Success)</option>
              <option value="400">400 Bad Request (Error)</option>
              <option value="401">401 Unauthorized (Error)</option>
              <option value="403">403 Forbidden (Error)</option>
              <option value="404">404 Not Found (Error)</option>
              <option value="500">500 Internal Server Error (Error)</option>
            </select>
          </div>

          <div className="setting-row">
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>Simulated Network Latency:</span>
              <span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>{latency} ms</span>
            </label>
            <input 
              type="range" 
              min="0" 
              max="2000" 
              step="50" 
              value={latency} 
              onChange={(e) => setLatency(parseInt(e.target.value))} 
              style={{ width: '100%', accentColor: 'var(--accent-cyan)' }} 
            />
          </div>
        </div>
      </div>

      <div className="sandbox-response-card card" style={{ marginTop: '20px' }}>
        <div className="pane-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <h2>Simulated Server Response</h2>
        </div>

        {response ? (
          <>
            <div className="sandbox-meta-row" style={{ display: 'flex', gap: '20px', margin: '14px 0', fontSize: '13px' }}>
              <div>Status: <span className="resp-badge" style={{ padding: '3px 8px', borderRadius: 'var(--radius-sm)', background: response.statusCode < 300 ? 'var(--swagger-post-bg)' : 'var(--swagger-delete-bg)', color: response.statusCode < 300 ? 'var(--swagger-post)' : 'var(--swagger-delete)', fontWeight: 600 }}>{response.status}</span></div>
              <div>Duration: <span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>{response.duration}</span></div>
              <div>Size: <span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>{response.size}</span></div>
            </div>

            <div className="sandbox-subtabs-wrapper">
              <div className="tab-subnav" style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '10px' }}>
                <span className="subtab-btn active" style={{ cursor: 'pointer', borderBottom: '2px solid var(--accent-cyan)', paddingBottom: '4px' }}>Response Body</span>
              </div>

              <div className="code-content-wrapper" style={{ maxHeight: '240px', overflowY: 'auto' }}>
                <pre><code dangerouslySetInnerHTML={{ __html: syntaxHighlight(response.body) }} /></pre>
              </div>

              <div className="code-viewport-header" style={{ marginTop: '16px' }}>Response Headers</div>
              <div className="code-content-wrapper" style={{ maxHeight: '160px', overflowY: 'auto', background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <pre className="font-mono" style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>{response.headers}</pre>
              </div>
            </div>
          </>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <span className="text-muted">{loading ? 'Simulating requests to Node endpoint...' : 'Click "Execute" above to trigger simulated mock API call.'}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// --- CodeSnippetsTab Subcomponent ---
function CodeSnippetsTab({ data, addToast }) {
  const [lang, setLang] = useState('curl');

  const jsonString = JSON.stringify(data || {});
  const prettyJsonString = JSON.stringify(data || {}, null, 2);

  const getTS = (obj, interfaceName = "RootSchema") => {
    let output = `export interface ${interfaceName} {\n`;
    if (obj === null) return `export type ${interfaceName} = null;`;
    if (Array.isArray(obj)) {
      if (obj.length > 0) {
        if (typeof obj[0] === 'object' && obj[0] !== null) {
          const subType = getTS(obj[0], `${interfaceName}Item`);
          return `${subType}\n\nexport type ${interfaceName} = ${interfaceName}Item[];`;
        }
        return `export type ${interfaceName} = ${typeof obj[0]}[];`;
      }
      return `export type ${interfaceName} = any[];`;
    }
    for (const key in obj) {
      const val = obj[key];
      const type = typeof val;
      if (val === null) output += `  ${key}: null;\n`;
      else if (type === 'object') {
        const camelKey = key.charAt(0).toUpperCase() + key.slice(1);
        if (Array.isArray(val)) {
          if (val.length > 0 && typeof val[0] === 'object' && val[0] !== null) {
            output += `  ${key}: ${camelKey}Item[];\n`;
          } else {
            const innerType = val.length > 0 ? typeof val[0] : 'any';
            output += `  ${key}: ${innerType}[];\n`;
          }
        } else {
          output += `  ${key}: ${camelKey};\n`;
        }
      } else {
        output += `  ${key}: ${type};\n`;
      }
    }
    output += `}\n`;
    for (const key in obj) {
      const val = obj[key];
      if (val !== null && typeof val === 'object') {
        const camelKey = key.charAt(0).toUpperCase() + key.slice(1);
        if (Array.isArray(val)) {
          if (val.length > 0 && typeof val[0] === 'object' && val[0] !== null) {
            output = getTS(val[0], `${camelKey}Item`) + "\n\n" + output;
          }
        } else {
          output = getTS(val, camelKey) + "\n\n" + output;
        }
      }
    }
    return output;
  };

  let code = '';
  let title = '';
  if (lang === 'curl') {
    title = 'cURL HTTP Request';
    code = `curl -X POST "https://api.aerojson.dev/v1/mock/resource" \\
  -H "Accept: application/json" \\
  -H "Content-Type: application/json" \\
  -d '${jsonString.replace(/'/g, "'\\''")}'`;
  } else if (lang === 'javascript') {
    title = 'JavaScript (Fetch API)';
    code = `const payload = ${prettyJsonString};\n\nfetch("https://api.aerojson.dev/v1/mock/resource", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify(payload)
})
.then(response => response.json())
.then(data => console.log("Success:", data))
.catch(error => console.error("Error:", error));`;
  } else if (lang === 'python') {
    title = 'Python (Requests Module)';
    code = `import requests

url = "https://api.aerojson.dev/v1/mock/resource"
headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}
payload = ${JSON.stringify(data, null, 4)}

response = requests.post(url, json=payload, headers=headers)
if response.status_code in [200, 201]:
    print("Success:", response.json())
else:
    print(f"Error {response.status_code}:", response.text)`;
  } else {
    title = 'TypeScript Definitions';
    code = getTS(data, 'AeroSchema');
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    addToast('Copied code snippet to clipboard', 'success');
  };

  return (
    <div className="tab-panel active">
      <div className="code-snippets-panel card">
        <div className="code-selectors" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button className={`lang-btn ${lang === 'curl' ? 'active' : ''}`} onClick={() => setLang('curl')}>cURL</button>
          <button className={`lang-btn ${lang === 'javascript' ? 'active' : ''}`} onClick={() => setLang('javascript')}>JavaScript</button>
          <button className={`lang-btn ${lang === 'python' ? 'active' : ''}`} onClick={() => setLang('python')}>Python</button>
          <button className={`lang-btn ${lang === 'typescript' ? 'active' : ''}`} onClick={() => setLang('typescript')}>TypeScript</button>
        </div>

        <div className="code-viewport">
          <div className="code-viewport-header">
            <span>{title}</span>
            <button onClick={handleCopy} className="btn btn-xs btn-secondary">Copy Snippet</button>
          </div>
          <div className="code-content-wrapper" style={{ maxHeight: '380px', overflowY: 'auto' }}>
            <pre className="font-mono" style={{ margin: 0, fontSize: '13px', color: 'var(--text-primary)' }}>
              <code>{code || '// Enter valid JSON to generate snippets'}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}