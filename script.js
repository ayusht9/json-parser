// AeroJSON Core Application Logic

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const jsonInput = document.getElementById('json-input');
  const lineNumbers = document.getElementById('line-numbers');
  const errorConsole = document.getElementById('error-console');
  const parserStatus = document.getElementById('parser-status');
  
  // Header Actions
  const themeToggle = document.getElementById('theme-toggle');
  const samplesBtn = document.getElementById('samples-btn');
  const samplesDropdown = document.getElementById('samples-dropdown');
  
  // Editor Actions
  const btnFormat = document.getElementById('btn-format');
  const btnMinify = document.getElementById('btn-minify');
  const btnCopyInput = document.getElementById('btn-copy-input');
  const btnClear = document.getElementById('btn-clear');
  
  // Tab Elements
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const subtabButtons = document.querySelectorAll('.subtab-btn');
  const subtabPanels = document.querySelectorAll('.subtab-panel');
  
  // Tree Tab Elements
  const treeRoot = document.getElementById('tree-root');
  const treeSearch = document.getElementById('tree-search');
  const btnTreeExpand = document.getElementById('btn-tree-expand');
  const btnTreeCollapse = document.getElementById('btn-tree-collapse');
  
  // Swagger Tab Elements
  const swaggerPostSchemaBody = document.getElementById('swagger-post-schema-body');
  const swaggerModelProperties = document.getElementById('swagger-model-properties');
  
  // Sandbox Tab Elements
  const sandboxMethod = document.getElementById('sandbox-method');
  const btnSandboxSend = document.getElementById('btn-sandbox-send');
  const sandboxLatency = document.getElementById('sandbox-latency');
  const sandboxLatencyLabel = document.getElementById('sandbox-latency-label');
  const sandboxResponseStatus = document.getElementById('sandbox-response-status');
  const sandboxResponseMeta = document.getElementById('sandbox-response-meta');
  const respStatus = document.getElementById('resp-status');
  const respDuration = document.getElementById('resp-duration');
  const respSize = document.getElementById('resp-size');
  const sandboxResponsePre = document.getElementById('sandbox-response-pre');
  const sandboxHeadersPre = document.getElementById('sandbox-headers-pre');
  
  // Code Snippets Tab
  const langButtons = document.querySelectorAll('.lang-btn');
  const activeLangTitle = document.getElementById('active-lang-title');
  const snippetCodeBlock = document.getElementById('snippet-code-block');
  const btnCopyCode = document.getElementById('btn-copy-code');
  const toastContainer = document.getElementById('toast-container');

  // Data Grid Tab Elements
  const gridArraySelect = document.getElementById('grid-array-select');
  const gridTableContainer = document.getElementById('grid-table-container');
  const btnGridExport = document.getElementById('btn-grid-export');
  const btnGridPrev = document.getElementById('btn-grid-prev');
  const btnGridNext = document.getElementById('btn-grid-next');
  const gridPageInfo = document.getElementById('grid-page-info');
  const gridPagination = document.getElementById('grid-pagination');

  // JSON Tools Tab Elements
  const toolMenuButtons = document.querySelectorAll('.tool-menu-btn');
  const toolSubpanels = document.querySelectorAll('.tool-subpanel');
  const queryInput = document.getElementById('query-input');
  const queryResultPre = document.getElementById('query-result-pre');
  const btnCopyQueryResult = document.getElementById('btn-copy-query-result');
  const btnConvertYaml = document.getElementById('btn-convert-yaml');
  const btnConvertXml = document.getElementById('btn-convert-xml');
  const convertOutputTitle = document.getElementById('convert-output-title');
  const convertResultPre = document.getElementById('convert-result-pre');
  const btnDownloadConvert = document.getElementById('btn-download-convert');
  const btnCopyConvert = document.getElementById('btn-copy-convert');
  const btnToolFlatten = document.getElementById('btn-tool-flatten');
  const btnToolExpand = document.getElementById('btn-tool-expand');
  const transformedResultPre = document.getElementById('transformed-result-pre');
  const btnCopyTransformed = document.getElementById('btn-copy-transformed');

  // --- State Variables ---
  let parsedData = null;
  let activeLanguage = 'curl';
  
  // Grid State
  let detectedArrays = {};
  let selectedArrayPath = '';
  let gridCurrentPage = 1;
  const gridPageSize = 15;

  // Tools State
  let activeTool = 'query';
  let activeConvertFormat = 'yaml';

  // --- Sample Data Profiles ---
  const samples = {
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

  // --- Initial Operations ---
  updateLineNumbers();
  loadSample('users');

  // --- Theme Toggle ---
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');
    
    const isLight = document.body.classList.contains('light-theme');
    themeToggle.querySelector('.sun-icon').style.display = isLight ? 'none' : 'block';
    themeToggle.querySelector('.moon-icon').style.display = isLight ? 'block' : 'none';
    
    showToast(`Switched to ${isLight ? 'Light' : 'Dark'} theme`, 'info');
  });

  // --- Samples Dropdown ---
  samplesBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    samplesDropdown.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    samplesDropdown.classList.remove('show');
  });

  samplesDropdown.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const sampleKey = e.target.getAttribute('data-sample');
      loadSample(sampleKey);
      samplesDropdown.classList.remove('show');
    });
  });

  function loadSample(key) {
    if (samples[key]) {
      jsonInput.value = JSON.stringify(samples[key], null, 2);
      processJSONChangeImmediate();
      showToast(`Loaded sample: ${key}`, 'success');
    }
  }

  // --- Input Debouncing for Performance ---
  let debounceTimeout = null;
  jsonInput.addEventListener('input', () => {
    updateLineNumbers();
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      processJSONChangeImmediate();
    }, 300);
  });

  jsonInput.addEventListener('scroll', () => {
    lineNumbers.scrollTop = jsonInput.scrollTop;
  });

  function updateLineNumbers() {
    const lines = jsonInput.value.split('\n');
    const lineCount = Math.max(1, lines.length);
    let html = '';
    for (let i = 1; i <= lineCount; i++) {
      html += `<span>${i}</span>`;
    }
    lineNumbers.innerHTML = html;
  }

  // --- Editor Buttons ---
  btnFormat.addEventListener('click', () => {
    if (!parsedData) {
      showToast('No valid JSON to format', 'error');
      return;
    }
    jsonInput.value = JSON.stringify(parsedData, null, 2);
    updateLineNumbers();
    processJSONChangeImmediate();
    showToast('Formatted JSON', 'success');
  });

  btnMinify.addEventListener('click', () => {
    if (!parsedData) {
      showToast('No valid JSON to minify', 'error');
      return;
    }
    jsonInput.value = JSON.stringify(parsedData);
    updateLineNumbers();
    processJSONChangeImmediate();
    showToast('Minified JSON', 'success');
  });

  btnCopyInput.addEventListener('click', () => {
    if (!jsonInput.value.trim()) {
      showToast('Nothing to copy', 'error');
      return;
    }
    copyTextToClipboard(jsonInput.value);
    showToast('Copied raw JSON to clipboard', 'success');
  });

  btnClear.addEventListener('click', () => {
    jsonInput.value = '';
    updateLineNumbers();
    processJSONChangeImmediate();
    showToast('Editor cleared', 'info');
  });

  function copyTextToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        console.error('Copy fallback failed', err);
      }
      document.body.removeChild(textarea);
    }
  }

  // --- Toast Manager ---
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '';
    if (type === 'success') {
      icon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else if (type === 'error') {
      icon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    } else {
      icon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    toast.innerHTML = `${icon}<span>${message}</span>`;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toastContainer.removeChild(toast);
      }, 300);
    }, 3000);
  }

  // --- Parsing and Engine ---
  function processJSONChangeImmediate() {
    const text = jsonInput.value;
    
    if (!text.trim()) {
      parsedData = null;
      setParserStatus('empty');
      errorConsole.innerHTML = '<div class="console-message text-muted">Ready to parse JSON data.</div>';
      clearOutputs();
      return;
    }

    try {
      const parsed = JSON.parse(text);
      parsedData = parsed;
      setParserStatus('valid');
      errorConsole.innerHTML = '<div class="console-message text-success"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>JSON parsed successfully.</div>';
      
      // Update UI components
      renderTreeView(parsed);
      generateSwaggerSchema(parsed);
      updateCodeSnippets();
      updateSandboxUrlMethod();
      setupDataGrid(parsed);
      updateJSONToolsOutputs();
    } catch (err) {
      parsedData = null;
      setParserStatus('invalid');
      let errorMessage = err.message;
      errorConsole.innerHTML = `<div class="console-message text-danger"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>${errorMessage}</div>`;
      clearToolOutputs();
    }
  }

  function setParserStatus(state) {
    parserStatus.className = `status-badge status-${state}`;
    const text = parserStatus.querySelector('.status-text');
    if (state === 'empty') {
      text.innerText = 'Empty Input';
    } else if (state === 'valid') {
      text.innerText = 'Valid JSON';
    } else {
      text.innerText = 'Syntax Error';
    }
  }

  function clearOutputs() {
    treeRoot.innerHTML = '<span class="text-muted">Enter valid JSON in the editor to visualize as an interactive tree.</span>';
    swaggerPostSchemaBody.innerHTML = '<tr><td colspan="4" class="text-muted text-center">Paste JSON into the editor to view schema definition</td></tr>';
    swaggerModelProperties.innerHTML = '<span class="text-muted">No model details found. Please input standard JSON.</span>';
    snippetCodeBlock.innerHTML = 'Code snippet generates automatically when valid JSON is present.';
    gridArraySelect.innerHTML = '<option value="">-- No Array Selected --</option>';
    gridTableContainer.innerHTML = '<span class="text-muted">Load valid JSON and select an array node to display as a grid.</span>';
    gridPagination.style.display = 'none';
    clearToolOutputs();
  }

  function clearToolOutputs() {
    queryResultPre.innerHTML = '<span class="text-muted">Enter a query above to view live results.</span>';
    convertResultPre.innerHTML = 'XML / YAML converted output will display here.';
    transformedResultPre.innerHTML = '<span class="text-muted">Click Flatten or Expand above to see results.</span>';
  }

  // --- Tab Control Switcher ---
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      const panelId = btn.getAttribute('data-tab');
      document.getElementById(panelId).classList.add('active');
    });
  });

  subtabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      subtabButtons.forEach(b => b.classList.remove('active'));
      subtabPanels.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      const panelId = btn.getAttribute('data-subtab');
      document.getElementById(panelId).classList.add('active');
    });
  });

  // --- Tab 2: Interactive Tree Visualizer with Progressive Loading ---
  function renderTreeView(data) {
    treeRoot.innerHTML = '';
    const rootList = document.createElement('div');
    rootList.className = 'tree-node-list';
    const rootNode = createTreeNode('', data, true, 'Root');
    rootList.appendChild(rootNode);
    treeRoot.appendChild(rootList);
  }

  function createTreeNode(key, value, isLast = true, displayKey = null) {
    const node = document.createElement('div');
    node.className = 'tree-node';
    
    const content = document.createElement('div');
    content.className = 'tree-node-content';
    
    const type = typeof value;
    const isObject = value !== null && type === 'object';
    
    if (isObject) {
      const toggle = document.createElement('span');
      toggle.className = 'tree-toggle-icon expanded';
      toggle.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
      content.appendChild(toggle);
      
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const children = node.querySelector('.tree-node-children');
        if (children) {
          const isHidden = children.style.display === 'none';
          children.style.display = isHidden ? 'block' : 'none';
          toggle.classList.toggle('expanded', isHidden);
        }
      });
    } else {
      const spacer = document.createElement('span');
      spacer.style.width = '14px';
      spacer.style.display = 'inline-block';
      content.appendChild(spacer);
    }

    if (displayKey !== null || key) {
      const keySpan = document.createElement('span');
      keySpan.className = 'tree-key';
      keySpan.innerText = displayKey !== null ? displayKey : `"${key}"`;
      content.appendChild(keySpan);
      
      const colon = document.createElement('span');
      colon.className = 'tree-colon';
      colon.innerText = ': ';
      content.appendChild(colon);
    }

    if (value === null) {
      const valSpan = document.createElement('span');
      valSpan.className = 'type-null';
      valSpan.innerText = 'null';
      content.appendChild(valSpan);
    } else if (type === 'string') {
      const valSpan = document.createElement('span');
      valSpan.className = 'type-string';
      valSpan.innerText = `"${value}"`;
      content.appendChild(valSpan);
    } else if (type === 'number') {
      const valSpan = document.createElement('span');
      valSpan.className = 'type-number';
      valSpan.innerText = value;
      content.appendChild(valSpan);
    } else if (type === 'boolean') {
      const valSpan = document.createElement('span');
      valSpan.className = 'type-boolean';
      valSpan.innerText = value ? 'true' : 'false';
      content.appendChild(valSpan);
    } else if (isObject) {
      const isArray = Array.isArray(value);
      const openBracket = isArray ? '[' : '{';
      const closeBracket = isArray ? ']' : '}';
      
      const bracketSpan = document.createElement('span');
      bracketSpan.className = 'tree-bracket';
      bracketSpan.innerText = openBracket;
      content.appendChild(bracketSpan);
      
      const childrenWrapper = document.createElement('div');
      childrenWrapper.className = 'tree-node-children';
      
      const childList = document.createElement('div');
      childList.className = 'tree-node-list';

      let keys = isArray ? [] : Object.keys(value);
      const totalItems = isArray ? value.length : keys.length;
      const initialLimit = 40;
      
      const infoSpan = document.createElement('span');
      infoSpan.className = 'tree-node-info';
      infoSpan.innerText = isArray ? `${totalItems} items` : `${totalItems} keys`;
      content.appendChild(infoSpan);

      const renderBatch = (start) => {
        const end = Math.min(start + initialLimit, totalItems);
        if (isArray) {
          for (let i = start; i < end; i++) {
            const childNode = createTreeNode(i.toString(), value[i], i === totalItems - 1, i.toString());
            childList.appendChild(childNode);
          }
        } else {
          for (let i = start; i < end; i++) {
            const k = keys[i];
            const childNode = createTreeNode(k, value[k], i === totalItems - 1);
            childList.appendChild(childNode);
          }
        }

        if (end < totalItems) {
          const loadMoreRow = document.createElement('div');
          loadMoreRow.className = 'tree-node';
          loadMoreRow.style.marginLeft = '18px';
          loadMoreRow.innerHTML = `<span style="color:var(--accent-cyan); cursor:pointer; text-decoration:underline; font-size:12px;">[Show next ${totalItems - end} items...]</span>`;
          loadMoreRow.addEventListener('click', (e) => {
            e.stopPropagation();
            loadMoreRow.remove();
            renderBatch(end);
          });
          childList.appendChild(loadMoreRow);
        }
      };

      renderBatch(0);

      const closingNode = document.createElement('div');
      closingNode.className = 'tree-node';
      closingNode.style.marginLeft = '18px';
      
      const closingContent = document.createElement('div');
      closingContent.className = 'tree-node-content';
      closingContent.innerHTML = `<span style="width:14px; display:inline-block;"></span><span class="tree-bracket">${closeBracket}</span>`;
      closingNode.appendChild(closingContent);

      childrenWrapper.appendChild(childList);
      childrenWrapper.appendChild(closingNode);
      node.appendChild(content);
      node.appendChild(childrenWrapper);
      return node;
    }

    node.appendChild(content);
    return node;
  }

  // Tree action handles
  btnTreeExpand.addEventListener('click', () => {
    document.querySelectorAll('.tree-node-children').forEach(el => { el.style.display = 'block'; });
    document.querySelectorAll('.tree-toggle-icon').forEach(el => { el.classList.add('expanded'); });
  });

  btnTreeCollapse.addEventListener('click', () => {
    document.querySelectorAll('.tree-node-children').forEach(el => { el.style.display = 'none'; });
    document.querySelectorAll('.tree-toggle-icon').forEach(el => { el.classList.remove('expanded'); });
  });

  treeSearch.addEventListener('input', () => {
    const query = treeSearch.value.trim().toLowerCase();
    const contents = document.querySelectorAll('.tree-node-content');
    if (!query) {
      contents.forEach(el => el.classList.remove('search-match'));
      return;
    }
    contents.forEach(el => {
      const valString = el.innerText.toLowerCase();
      if (valString.includes(query)) {
        el.classList.add('search-match');
        let parent = el.closest('.tree-node-children');
        while (parent) {
          parent.style.display = 'block';
          const toggle = parent.previousElementSibling.querySelector('.tree-toggle-icon');
          if (toggle) toggle.classList.add('expanded');
          parent = parent.parentElement.closest('.tree-node-children');
        }
      } else {
        el.classList.remove('search-match');
      }
    });
  });

  // --- Tab 5: Professional Tabular Data Grid ---
  function setupDataGrid(data) {
    detectedArrays = {};
    gridArraySelect.innerHTML = '';
    collectConcreteArrays(data, 'root', detectedArrays, 35);
    
    const arrayPaths = Object.keys(detectedArrays);
    if (arrayPaths.length === 0) {
      gridArraySelect.innerHTML = '<option value="">-- No Arrays Found in JSON --</option>';
      gridTableContainer.innerHTML = '<div style="padding:40px; text-align:center;"><span class="text-muted">No Array nodes could be extracted from your JSON structure.</span></div>';
      gridPagination.style.display = 'none';
      return;
    }

    arrayPaths.forEach(path => {
      const option = document.createElement('option');
      option.value = path;
      const count = detectedArrays[path].length;
      option.innerText = `${path} (${count} items)`;
      gridArraySelect.appendChild(option);
    });

    selectedArrayPath = arrayPaths[0];
    gridArraySelect.value = selectedArrayPath;
    gridCurrentPage = 1;
    renderDataGridTable();
  }

  function collectConcreteArrays(obj, path, map, limit) {
    if (Object.keys(map).length >= limit) return;
    if (obj === null || typeof obj !== 'object') return;
    
    if (Array.isArray(obj)) {
      map[path] = obj;
      obj.forEach((item, index) => {
        if (index < 2) {
          collectConcreteArrays(item, `${path}[${index}]`, map, limit);
        }
      });
    } else {
      for (const key in obj) {
        const val = obj[key];
        const nextPath = path === 'root' ? key : `${path}.${key}`;
        if (val !== null && typeof val === 'object') {
          if (Array.isArray(val)) {
            map[nextPath] = val;
            val.forEach((item, index) => {
              if (index < 2) {
                collectConcreteArrays(item, `${nextPath}[${index}]`, map, limit);
              }
            });
          } else {
            collectConcreteArrays(val, nextPath, map, limit);
          }
        }
      }
    }
  }

  gridArraySelect.addEventListener('change', () => {
    selectedArrayPath = gridArraySelect.value;
    gridCurrentPage = 1;
    renderDataGridTable();
  });

  function renderDataGridTable() {
    const array = detectedArrays[selectedArrayPath];
    if (!array || array.length === 0) {
      gridTableContainer.innerHTML = '<div style="padding:40px; text-align:center;"><span class="text-muted">Empty Array node</span></div>';
      gridPagination.style.display = 'none';
      return;
    }

    let isPrimitiveArray = false;
    let headers = [];
    
    if (typeof array[0] !== 'object' || array[0] === null) {
      isPrimitiveArray = true;
      headers = ['Index', 'Value'];
    } else {
      headers = ['Index'];
      const keySet = new Set();
      array.forEach(item => {
        if (item && typeof item === 'object') {
          Object.keys(item).forEach(k => keySet.add(k));
        }
      });
      headers = headers.concat(Array.from(keySet));
    }

    const totalRecords = array.length;
    const totalPages = Math.ceil(totalRecords / gridPageSize);
    gridCurrentPage = Math.max(1, Math.min(gridCurrentPage, totalPages));
    
    const startIndex = (gridCurrentPage - 1) * gridPageSize;
    const endIndex = Math.min(startIndex + gridPageSize, totalRecords);
    
    gridPagination.style.display = totalRecords > gridPageSize ? 'flex' : 'none';
    gridPageInfo.innerText = `Page ${gridCurrentPage} of ${totalPages} (Records ${startIndex + 1} - ${endIndex} of ${totalRecords})`;
    
    btnGridPrev.disabled = gridCurrentPage === 1;
    btnGridNext.disabled = gridCurrentPage === totalPages;

    let tableHtml = `<table class="grid-table"><thead><tr>`;
    headers.forEach(h => {
      tableHtml += `<th>${escapeHTML(h)}</th>`;
    });
    tableHtml += `</tr></thead><tbody>`;

    for (let i = startIndex; i < endIndex; i++) {
      const rowItem = array[i];
      tableHtml += `<tr>`;
      tableHtml += `<td style="font-family:var(--font-mono); color:var(--text-muted); text-align:center;">${i}</td>`;
      
      if (isPrimitiveArray) {
        tableHtml += `<td>${renderCellContent(rowItem)}</td>`;
      } else {
        for (let colIndex = 1; colIndex < headers.length; colIndex++) {
          const colKey = headers[colIndex];
          const cellVal = rowItem ? rowItem[colKey] : undefined;
          tableHtml += `<td>${renderCellContent(cellVal)}</td>`;
        }
      }
      tableHtml += `</tr>`;
    }
    
    tableHtml += `</tbody></table>`;
    gridTableContainer.innerHTML = tableHtml;
  }

  function renderCellContent(val) {
    if (val === undefined) {
      return `<span class="text-muted" style="opacity:0.35;">-</span>`;
    }
    if (val === null) {
      return `<span class="grid-badge grid-badge-null">null</span>`;
    }

    const type = typeof val;
    if (type === 'string') {
      return `<span class="type-string">"${escapeHTML(val)}"</span>`;
    }
    if (type === 'number') {
      return `<span class="type-number">${val}</span>`;
    }
    if (type === 'boolean') {
      return `<span class="type-boolean">${val ? 'true' : 'false'}</span>`;
    }

    if (Array.isArray(val)) {
      if (val.length === 0) return `<span class="text-muted">[]</span>`;
      const isObjectArray = typeof val[0] === 'object' && val[0] !== null;
      
      if (!isObjectArray) {
        return val.map(item => {
          let itemCls = typeof item;
          if (item === null) itemCls = 'null';
          return `<span class="grid-badge grid-badge-${itemCls}">${escapeHTML(String(item))}</span>`;
        }).join(' ');
      } else {
        const subKeys = new Set();
        val.forEach(subObj => {
          if (subObj) Object.keys(subObj).forEach(k => subKeys.add(k));
        });
        const subHeaders = Array.from(subKeys).slice(0, 4);
        
        let nestedTable = `<table class="cell-nested-table"><thead><tr>`;
        subHeaders.forEach(sh => {
          nestedTable += `<th>${escapeHTML(sh)}</th>`;
        });
        nestedTable += `</tr></thead><tbody>`;
        
        const subRowsCount = Math.min(3, val.length);
        for (let r = 0; r < subRowsCount; r++) {
          nestedTable += `<tr>`;
          subHeaders.forEach(sh => {
            const innerVal = val[r] ? val[r][sh] : undefined;
            let displayVal = '-';
            if (innerVal !== undefined) {
              if (innerVal === null) displayVal = 'null';
              else if (typeof innerVal === 'object') displayVal = '{...}';
              else displayVal = String(innerVal);
            }
            nestedTable += `<td>${escapeHTML(displayVal)}</td>`;
          });
          nestedTable += `</tr>`;
        }

        if (val.length > 3) {
          nestedTable += `<tr><td colspan="${subHeaders.length}" class="text-muted text-center" style="font-size:9.5px; padding:2px;">+ ${val.length - 3} more items</td></tr>`;
        }
        nestedTable += `</tbody></table>`;
        return nestedTable;
      }
    }

    if (type === 'object') {
      const keys = Object.keys(val);
      if (keys.length === 0) return `<span class="text-muted">{}</span>`;
      
      let objList = `<div class="cell-nested-object">`;
      keys.forEach(k => {
        const innerVal = val[k];
        let displayVal = '';
        if (innerVal === null) displayVal = 'null';
        else if (Array.isArray(innerVal)) displayVal = `[${innerVal.length}]`;
        else if (typeof innerVal === 'object') displayVal = '{...}';
        else displayVal = String(innerVal);
        
        objList += `
          <div class="nested-prop-row">
            <span class="nested-prop-key">${escapeHTML(k)}</span>
            <span class="nested-prop-val">${escapeHTML(displayVal)}</span>
          </div>
        `;
      });
      objList += `</div>`;
      return objList;
    }
    return String(val);
  }

  function escapeHTML(str) {
    if (typeof str !== 'string') return String(str);
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  btnGridPrev.addEventListener('click', () => {
    if (gridCurrentPage > 1) {
      gridCurrentPage--;
      renderDataGridTable();
    }
  });

  btnGridNext.addEventListener('click', () => {
    const array = detectedArrays[selectedArrayPath];
    if (array) {
      const totalPages = Math.ceil(array.length / gridPageSize);
      if (gridCurrentPage < totalPages) {
        gridCurrentPage++;
        renderDataGridTable();
      }
    }
  });

  btnGridExport.addEventListener('click', () => {
    const array = detectedArrays[selectedArrayPath];
    if (!array || array.length === 0) {
      showToast('No grid dataset available to export', 'error');
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    let isPrimitiveArray = false;
    let headers = [];
    
    if (typeof array[0] !== 'object' || array[0] === null) {
      isPrimitiveArray = true;
      headers = ['Index', 'Value'];
    } else {
      headers = ['Index'];
      const keySet = new Set();
      array.forEach(item => {
        if (item && typeof item === 'object') {
          Object.keys(item).forEach(k => keySet.add(k));
        }
      });
      headers = headers.concat(Array.from(keySet));
    }

    csvContent += headers.map(h => `"${h.replace(/"/g, '""')}"`).join(",") + "\r\n";

    array.forEach((rowItem, index) => {
      const rowCells = [String(index)];
      if (isPrimitiveArray) {
        const valStr = rowItem === null ? 'null' : String(rowItem);
        rowCells.push(valStr);
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
    link.setAttribute("download", `aerojson_export_${selectedArrayPath.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Grid exported to CSV successfully', 'success');
  });

  // --- Tab 6: JSON Tools Suite Handlers ---
  toolMenuButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      toolMenuButtons.forEach(b => b.classList.remove('active'));
      toolSubpanels.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      activeTool = btn.getAttribute('data-tool');
      document.getElementById(`tool-panel-${activeTool}`).classList.add('active');
      triggerToolExecution();
    });
  });

  queryInput.addEventListener('input', () => {
    if (activeTool === 'query') {
      runQueryFilter();
    }
  });

  btnCopyQueryResult.addEventListener('click', () => {
    const text = queryResultPre.innerText;
    if (text.startsWith('Enter a query') || text.startsWith('Query returns no')) {
      showToast('No query output to copy', 'error');
      return;
    }
    copyTextToClipboard(text);
    showToast('Copied filtered result to clipboard', 'success');
  });

  btnConvertYaml.addEventListener('click', () => {
    btnConvertYaml.classList.add('active');
    btnConvertXml.classList.remove('active');
    activeConvertFormat = 'yaml';
    convertOutputTitle.innerText = 'YAML Output';
    runConverter();
  });

  btnConvertXml.addEventListener('click', () => {
    btnConvertXml.classList.add('active');
    btnConvertYaml.classList.remove('active');
    activeConvertFormat = 'xml';
    convertOutputTitle.innerText = 'XML Output';
    runConverter();
  });

  btnCopyConvert.addEventListener('click', () => {
    const text = convertResultPre.innerText;
    if (text.startsWith('XML / YAML') || text.startsWith('Select a target')) {
      showToast('No conversion output to copy', 'error');
      return;
    }
    copyTextToClipboard(text);
    showToast('Copied converted output to clipboard', 'success');
  });

  btnDownloadConvert.addEventListener('click', () => {
    const text = convertResultPre.innerText;
    if (text.startsWith('XML / YAML') || text.startsWith('Select a target')) {
      showToast('No conversion output to download', 'error');
      return;
    }
    const mime = activeConvertFormat === 'yaml' ? 'text/yaml' : 'application/xml';
    const ext = activeConvertFormat === 'yaml' ? 'yaml' : 'xml';
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `aerojson_converted.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded converted ${ext.toUpperCase()} file`, 'success');
  });

  btnToolFlatten.addEventListener('click', () => {
    if (!parsedData) {
      showToast('No valid JSON to flatten', 'error');
      return;
    }
    const flat = flattenObject(parsedData);
    const text = JSON.stringify(flat, null, 2);
    transformedResultPre.innerHTML = syntaxHighlightJson(text);
    showToast('JSON structures flattened', 'success');
  });

  btnToolExpand.addEventListener('click', () => {
    if (!parsedData) {
      showToast('No valid JSON to expand', 'error');
      return;
    }
    try {
      // Validate that active json is flat or contains keys with dots
      const expanded = expandObject(parsedData);
      const text = JSON.stringify(expanded, null, 2);
      transformedResultPre.innerHTML = syntaxHighlightJson(text);
      showToast('Dotted properties expanded', 'success');
    } catch (e) {
      showToast('Failed to expand. Source must be flat dotted keys.', 'error');
    }
  });

  btnCopyTransformed.addEventListener('click', () => {
    const text = transformedResultPre.innerText;
    if (text.includes('Click Flatten or Expand')) {
      showToast('No transformation output to copy', 'error');
      return;
    }
    copyTextToClipboard(text);
    showToast('Copied transformed result to clipboard', 'success');
  });

  function updateJSONToolsOutputs() {
    if (!parsedData) return;
    runQueryFilter();
    runConverter();
  }

  function triggerToolExecution() {
    if (!parsedData) return;
    if (activeTool === 'query') runQueryFilter();
    else if (activeTool === 'convert') runConverter();
  }

  // Live Query Filter Engine (JSONPath Wildcard Dot-Notation parser)
  function runQueryFilter() {
    if (!parsedData) {
      queryResultPre.innerHTML = '<span class="text-muted">Enter a query above to view live results.</span>';
      return;
    }
    const query = queryInput.value.trim();
    if (!query) {
      queryResultPre.innerHTML = syntaxHighlightJson(JSON.stringify(parsedData, null, 2));
      return;
    }

    try {
      const result = evaluateQuery(parsedData, query);
      if (result === undefined) {
        queryResultPre.innerHTML = '<span class="text-danger">Query returns no matching properties.</span>';
      } else {
        queryResultPre.innerHTML = syntaxHighlightJson(JSON.stringify(result, null, 2));
      }
    } catch (e) {
      queryResultPre.innerHTML = `<span class="text-danger">Invalid query syntax: ${e.message}</span>`;
    }
  }

  function evaluateQuery(data, queryStr) {
    if (!queryStr.trim()) return data;
    
    // Normalize bracket queries e.g. results[0] or departments["teams"] to dotted paths
    let normalized = queryStr
      .replace(/\[['"]?([^'"]+?)['"]?\]/g, '.$1')
      .replace(/^\./, '');
      
    const parts = normalized.split('.');
    let current = data;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (current === null || current === undefined) return undefined;

      if (part === '*') {
        if (Array.isArray(current)) {
          const remainingQuery = parts.slice(i + 1).join('.');
          if (!remainingQuery) return current;
          return current.map(item => evaluateQuery(item, remainingQuery)).filter(x => x !== undefined);
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
  }

  // live XML & YAML Serializer Engines
  function runConverter() {
    if (!parsedData) {
      convertResultPre.innerText = 'XML / YAML converted output will display here.';
      return;
    }

    if (activeConvertFormat === 'yaml') {
      const yaml = jsonToYaml(parsedData);
      convertResultPre.innerText = yaml;
    } else {
      const xml = jsonToXml(parsedData, 'root');
      convertResultPre.innerText = xml;
    }
  }

  function jsonToYaml(obj, indent = 0) {
    const spaces = ' '.repeat(indent);
    if (obj === null) return 'null';
    if (typeof obj === 'string') {
      if (/[^a-zA-Z0-9\s]/.test(obj) || obj.includes('\n')) {
        return `"${obj.replace(/"/g, '\\"')}"`;
      }
      return obj;
    }
    if (typeof obj === 'number' || typeof obj === 'boolean') {
      return String(obj);
    }
    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      let yaml = '';
      obj.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          const sub = jsonToYaml(item, indent + 2);
          const lines = sub.split('\n');
          yaml += `${spaces}- ${lines[0].trim()}\n`;
          for (let i = 1; i < lines.length; i++) {
            yaml += `  ${lines[i]}\n`;
          }
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
  }

  function jsonToXml(obj, rootName = 'root', indent = 0) {
    const spaces = ' '.repeat(indent);
    if (obj === null) return `${spaces}<${rootName} nil="true" />`;
    const type = typeof obj;

    if (type === 'string' || type === 'number' || type === 'boolean') {
      return `${spaces}<${rootName}>${escapeXml(String(obj))}</${rootName}>`;
    }

    if (Array.isArray(obj)) {
      let xml = '';
      obj.forEach(item => {
        xml += jsonToXml(item, 'item', indent) + '\n';
      });
      return xml.trimEnd();
    }

    if (type === 'object') {
      let xml = `${spaces}<${rootName}>\n`;
      for (const key in obj) {
        const val = obj[key];
        const cleanKey = key.replace(/[^a-zA-Z0-9_.-]/g, '_');
        if (Array.isArray(val)) {
          xml += `${spaces}  <${cleanKey}>\n`;
          val.forEach(item => {
            xml += jsonToXml(item, 'element', indent + 4) + '\n';
          });
          xml += `${spaces}  </${cleanKey}>\n`;
        } else {
          xml += jsonToXml(val, cleanKey, indent + 2) + '\n';
        }
      }
      xml += `${spaces}</${rootName}>`;
      return xml;
    }
    return '';
  }

  function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
      }
      return c;
    });
  }

  // Dotted Key Flattener Algorithms
  function flattenObject(obj, prefix = '', result = {}) {
    if (obj === null) {
      result[prefix] = null;
      return result;
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        result[prefix] = [];
      } else {
        obj.forEach((item, index) => {
          flattenObject(item, prefix ? `${prefix}.${index}` : `${index}`, result);
        });
      }
    } else if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      if (keys.length === 0) {
        result[prefix] = {};
      } else {
        keys.forEach(key => {
          flattenObject(obj[key], prefix ? `${prefix}.${key}` : key, result);
        });
      }
    } else {
      result[prefix] = obj;
    }
    return result;
  }

  function expandObject(flatObj) {
    const result = {};
    for (const key in flatObj) {
      const parts = key.split('.');
      let current = result;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isLast = i === parts.length - 1;
        const nextPart = parts[i + 1];
        const isNextIndex = nextPart !== undefined && !isNaN(nextPart);
        
        if (isLast) {
          current[part] = flatObj[key];
        } else {
          if (current[part] === undefined) {
            current[part] = isNextIndex ? [] : {};
          }
          current = current[part];
        }
      }
    }
    return result;
  }

  // --- Tab 1: Swagger Docs Generation ---
  function generateSwaggerSchema(data) {
    swaggerPostSchemaBody.innerHTML = '';
    const properties = inferSchemaProperties(data);
    
    if (properties.length === 0) {
      swaggerPostSchemaBody.innerHTML = '<tr><td colspan="4" class="text-muted text-center">Empty structure or primitive JSON root.</td></tr>';
      swaggerModelProperties.innerText = '// Primitive Value or empty object';
      return;
    }

    properties.forEach(prop => {
      const row = document.createElement('tr');
      const validationText = prop.validation || 'None';
      row.innerHTML = `
        <td><strong><code>${prop.name}</code></strong></td>
        <td><span class="badge" style="color:var(--accent-cyan)">${prop.type}</span></td>
        <td><span class="text-${prop.required ? 'danger' : 'muted'}">${prop.required ? 'Yes' : 'No'}</span></td>
        <td><span class="text-muted" style="font-size:12px">${validationText}</span></td>
      `;
      swaggerPostSchemaBody.appendChild(row);
    });

    let modelText = '{\n';
    properties.forEach((prop, i) => {
      const isLast = i === properties.length - 1;
      const desc = prop.validation ? ` // ${prop.validation}` : '';
      modelText += `  "${prop.name}": <span class="type-${prop.type}">${prop.type}</span>${isLast ? '' : ','}${desc}\n`;
    });
    modelText += '}';
    swaggerModelProperties.innerHTML = modelText;
  }

  function inferSchemaProperties(data, prefix = '') {
    if (data === null || typeof data !== 'object') {
      return [];
    }

    let rows = [];
    if (Array.isArray(data)) {
      if (data.length > 0 && typeof data[0] === 'object') {
        return inferSchemaProperties(data[0], prefix + '[0].');
      } else {
        return [{
          name: prefix || 'root',
          type: 'array',
          required: true,
          validation: 'Array containing primitives'
        }];
      }
    }

    for (const key in data) {
      const value = data[key];
      const type = value === null ? 'null' : typeof value;
      const isRequired = true;
      
      let validation = '';
      if (type === 'string') {
        if (value.startsWith('http')) {
          validation = 'Format: URL';
        } else if (value.includes('@')) {
          validation = 'Format: Email';
        } else {
          validation = `Max Length: ${Math.max(30, value.length * 2)}`;
        }
      } else if (type === 'number') {
        validation = value % 1 === 0 ? 'Type: Integer' : 'Type: Float';
      } else if (Array.isArray(value)) {
        validation = `Array length: ${value.length}`;
      } else if (type === 'object') {
        validation = 'Nested Object schema';
      }

      rows.push({
        name: prefix + key,
        type: Array.isArray(value) ? 'array' : type,
        required: isRequired,
        validation: validation
      });

      if (value !== null && type === 'object' && !Array.isArray(value)) {
        const subProps = inferSchemaProperties(value, prefix + key + '.');
        rows = rows.concat(subProps);
      }
    }

    return rows;
  }

  // --- Tab 3: API Sandbox Mock Simulator ---
  function updateSandboxUrlMethod() {
    if (parsedData) {
      sandboxMethod.value = Array.isArray(parsedData) ? 'GET' : 'POST';
      sandboxMethod.dispatchEvent(new Event('change'));
    }
  }

  sandboxMethod.addEventListener('change', () => {
    const method = sandboxMethod.value;
    if (method === 'GET') {
      sandboxMethod.style.color = 'var(--swagger-get)';
    } else if (method === 'POST') {
      sandboxMethod.style.color = 'var(--swagger-post)';
    } else if (method === 'PUT') {
      sandboxMethod.style.color = 'var(--swagger-put)';
    } else {
      sandboxMethod.style.color = 'var(--swagger-delete)';
    }
  });

  sandboxLatency.addEventListener('input', () => {
    sandboxLatencyLabel.innerText = `${sandboxLatency.value} ms`;
  });

  btnSandboxSend.addEventListener('click', () => {
    btnSandboxSend.disabled = true;
    btnSandboxSend.innerText = 'Sending...';
    sandboxResponseMeta.style.display = 'none';
    sandboxResponsePre.innerHTML = '<span class="text-muted">Resolving simulated response handshake...</span>';
    sandboxHeadersPre.innerHTML = 'Connecting...';
    
    const latency = parseInt(sandboxLatency.value);
    const targetStatus = parseInt(sandboxResponseStatus.value);
    const method = sandboxMethod.value;

    setTimeout(() => {
      btnSandboxSend.disabled = false;
      btnSandboxSend.innerText = 'Execute';
      sandboxResponseMeta.style.display = 'flex';
      
      respStatus.innerText = getStatusString(targetStatus);
      respStatus.className = 'resp-badge status-code';
      if (targetStatus >= 200 && targetStatus < 300) {
        respStatus.style.backgroundColor = 'var(--swagger-post-bg)';
        respStatus.style.color = 'var(--swagger-post)';
      } else {
        respStatus.style.backgroundColor = 'var(--swagger-delete-bg)';
        respStatus.style.color = 'var(--swagger-delete)';
      }

      respDuration.innerText = `${latency} ms`;
      
      let responseBodyObj = {};
      if (targetStatus === 200 || targetStatus === 201) {
        if (method === 'GET') {
          responseBodyObj = Array.isArray(parsedData) ? parsedData : [parsedData];
        } else {
          responseBodyObj = {
            success: true,
            id: `id_${Math.floor(Math.random() * 89999 + 10000)}`,
            created_at: new Date().toISOString(),
            echo_payload: parsedData || { message: "Empty payload received" }
          };
        }
      } else if (targetStatus === 400) {
        responseBodyObj = {
          error: "Bad Request",
          message: "The requested JSON payload failed validation requirements.",
          invalid_fields: inferSchemaProperties(parsedData).slice(0, 2).map(p => ({
            field: p.name,
            reason: `Value does not match constraint: ${p.validation || 'Invalid structure'}`
          }))
        };
      } else if (targetStatus === 401) {
        responseBodyObj = {
          error: "Unauthorized",
          message: "Authentication credentials missing or invalid token signature provided."
        };
      } else if (targetStatus === 403) {
        responseBodyObj = {
          error: "Forbidden",
          message: "Your API token lacks required authorization scopes to access resource."
        };
      } else if (targetStatus === 404) {
        responseBodyObj = {
          error: "Not Found",
          message: "The mock endpoint resource could not be found."
        };
      } else {
        responseBodyObj = {
          error: "Internal Server Error",
          message: "Simulated runtime error occurred in backend container pool."
        };
      }

      const bodyStr = JSON.stringify(responseBodyObj, null, 2);
      respSize.innerText = `${(bodyStr.length / 1024).toFixed(2)} KB`;
      sandboxResponsePre.innerHTML = syntaxHighlightJson(bodyStr);
      
      const headerStr = 
`HTTP/1.1 ${getStatusString(targetStatus)}
Date: ${new Date().toUTCString()}
Content-Type: application/json; charset=utf-8
Content-Length: ${bodyStr.length}
Connection: keep-alive
x-simulated-latency: ${latency}ms
x-powered-by: AeroJSON Mock Sandbox`;
      
      sandboxHeadersPre.innerText = headerStr;
      showToast(`Mock request completed: Status ${targetStatus}`, targetStatus < 300 ? 'success' : 'error');
    }, latency);
  });

  function getStatusString(code) {
    const codes = {
      200: "200 OK",
      201: "201 Created",
      400: "400 Bad Request",
      401: "401 Unauthorized",
      403: "403 Forbidden",
      404: "404 Not Found",
      500: "500 Internal Server Error"
    };
    return codes[code] || `${code} Response`;
  }

  function syntaxHighlightJson(json) {
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

  // --- Tab 4: Code Snippets Generator ---
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      langButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeLanguage = btn.getAttribute('data-lang');
      updateCodeSnippets();
    });
  });

  function updateCodeSnippets() {
    if (!parsedData) {
      snippetCodeBlock.innerHTML = '// Enter valid JSON in the editor to populate code templates';
      return;
    }

    const jsonString = JSON.stringify(parsedData);
    const prettyJsonString = JSON.stringify(parsedData, null, 2);
    let code = '';
    
    if (activeLanguage === 'curl') {
      activeLangTitle.innerText = 'cURL HTTP Request';
      code = `curl -X POST "https://api.aerojson.dev/v1/mock/resource" \\
  -H "Accept: application/json" \\
  -H "Content-Type: application/json" \\
  -d '${jsonString.replace(/'/g, "'\\''")}'`;
    } else if (activeLanguage === 'javascript') {
      activeLangTitle.innerText = 'JavaScript (Fetch API)';
      code = `const payload = ${prettyJsonString.split('\n').join('\n')};

fetch("https://api.aerojson.dev/v1/mock/resource", {
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
    } else if (activeLanguage === 'python') {
      activeLangTitle.innerText = 'Python (Requests Module)';
      code = `import requests

url = "https://api.aerojson.dev/v1/mock/resource"
headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}

payload = ${JSON.stringify(parsedData, null, 4)}

response = requests.post(url, json=payload, headers=headers)

if response.status_code == 201 or response.status_code == 200:
    print("Success:", response.json())
else:
    print(f"Error {response.status_code}:", response.text)`;
    } else if (activeLanguage === 'typescript') {
      activeLangTitle.innerText = 'TypeScript Definitions';
      code = generateTypeScriptTypes(parsedData, "AeroSchema");
    }
    snippetCodeBlock.innerText = code;
  }

  function generateTypeScriptTypes(obj, interfaceName = "RootSchema") {
    let output = `export interface ${interfaceName} {\n`;
    
    if (obj === null) {
      return `export type ${interfaceName} = null;`;
    }
    
    if (Array.isArray(obj)) {
      if (obj.length > 0) {
        if (typeof obj[0] === 'object' && obj[0] !== null) {
          const subType = generateTypeScriptTypes(obj[0], `${interfaceName}Item`);
          return `${subType}\n\nexport type ${interfaceName} = ${interfaceName}Item[];`;
        } else {
          return `export type ${interfaceName} = ${typeof obj[0]}[];`;
        }
      }
      return `export type ${interfaceName} = any[];`;
    }

    for (const key in obj) {
      const val = obj[key];
      const type = typeof val;
      if (val === null) {
        output += `  ${key}: null;\n`;
      } else if (type === 'object') {
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
            output = generateTypeScriptTypes(val[0], `${camelKey}Item`) + "\n\n" + output;
          }
        } else {
          output = generateTypeScriptTypes(val, camelKey) + "\n\n" + output;
        }
      }
    }
    return output;
  }

  btnCopyCode.addEventListener('click', () => {
    if (!parsedData) {
      showToast('No code snippet to copy', 'error');
      return;
    }
    copyTextToClipboard(snippetCodeBlock.innerText);
    showToast('Copied code snippet to clipboard', 'success');
  });
});

// Accordions Toggles
window.toggleEndpoint = function(element) {
  element.parentElement.classList.toggle('collapsed');
};

window.toggleModel = function(element) {
  const modelProperties = document.getElementById('swagger-model-properties');
  const chevron = element.querySelector('.chevron');
  const isHidden = modelProperties.style.display === 'none';
  modelProperties.style.display = isHidden ? 'block' : 'none';
  if (chevron) chevron.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
};
