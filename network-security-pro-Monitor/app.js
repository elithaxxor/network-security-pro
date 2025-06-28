// Network Security Monitoring Platform - Main Application Logic

class NetworkSecurityApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentCategory = 'network';
        this.currentTutorialCategory = 'basics';
        this.isMonitoring = false;
        this.consoleOutput = [];
        this.charts = {};
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupToolLibrary();
        this.setupConsole();
        this.setupModals();
        this.setupDashboard();
        this.setupTutorials();
        this.setupSettings();
        this.setupCharts();
        this.setupPassiveMonitor();
        this.setupOSINT();
        this.startRealtimeUpdates();
    }

    // Navigation System
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.content-section');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetSection = e.currentTarget.dataset.section;
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                // Update active section
                sections.forEach(s => s.classList.remove('active'));
                document.getElementById(targetSection).classList.add('active');
                
                this.currentSection = targetSection;
                this.onSectionChange(targetSection);
            });
        });
    }

    onSectionChange(section) {
        switch(section) {
            case 'dashboard':
                this.refreshDashboard();
                break;
            case 'active-scanner':
                this.loadToolsForCategory(this.currentCategory);
                break;
            case 'analytics':
                this.updateCharts();
                break;
            case 'tutorial':
                this.loadTutorialContent(this.currentTutorialCategory);
                break;
            case 'passive-monitor':
                this.initializePassiveMonitor();
                break;
            case 'osint':
                this.initializeOSINT();
                break;
        }
    }

    // Security Tools Data
    getSecurityTools() {
        return {
            network: [
                {
                    name: 'Nmap',
                    category: 'Network Discovery',
                    description: 'Network exploration and security auditing',
                    commands: [
                        'nmap -sn 192.168.1.0/24',
                        'nmap -sS -O -sV target.com',
                        'nmap --script vuln target.com'
                    ],
                    platforms: ['Linux', 'macOS', 'Windows'],
                    difficulty: 'Beginner',
                    tutorial: {
                        overview: 'Nmap is a powerful network scanner used for network discovery and security auditing.',
                        installation: 'Install via package manager: brew install nmap (macOS) or apt install nmap (Linux)',
                        examples: [
                            { cmd: 'nmap -sn 192.168.1.0/24', desc: 'Ping scan to discover live hosts' },
                            { cmd: 'nmap -sS target.com', desc: 'TCP SYN scan (stealth scan)' },
                            { cmd: 'nmap -sV -O target.com', desc: 'Version detection and OS fingerprinting' },
                            { cmd: 'nmap --script vuln target.com', desc: 'Run vulnerability detection scripts' }
                        ]
                    }
                },
                {
                    name: 'Masscan',
                    category: 'Port Scanning',
                    description: 'High-speed port scanner',
                    commands: [
                        'masscan -p1-65535 192.168.1.0/24 --rate=1000',
                        'masscan -p80,443 0.0.0.0/0 --rate=10000'
                    ],
                    platforms: ['Linux', 'macOS'],
                    difficulty: 'Intermediate',
                    tutorial: {
                        overview: 'Masscan is the fastest port scanner, capable of scanning the entire Internet in under 6 minutes.',
                        installation: 'Install via: brew install masscan (macOS) or apt install masscan (Linux)',
                        examples: [
                            { cmd: 'masscan -p80,443 192.168.1.0/24 --rate=1000', desc: 'Scan common web ports' },
                            { cmd: 'masscan -p1-65535 target.com --rate=10000', desc: 'Full port scan at high speed' }
                        ]
                    }
                },
                {
                    name: 'ARP-scan',
                    category: 'Network Discovery',
                    description: 'ARP request scanning for local network discovery',
                    commands: [
                        'arp-scan -l',
                        'arp-scan 192.168.1.0/24'
                    ],
                    platforms: ['Linux', 'macOS'],
                    difficulty: 'Beginner',
                    tutorial: {
                        overview: 'ARP-scan is used to discover and identify devices on the local network using ARP requests.',
                        installation: 'Install via: brew install arp-scan (macOS) or apt install arp-scan (Linux)',
                        examples: [
                            { cmd: 'arp-scan -l', desc: 'Scan local network automatically' },
                            { cmd: 'arp-scan 192.168.1.0/24', desc: 'Scan specific network range' }
                        ]
                    }
                }
            ],
            wireless: [
                {
                    name: 'Aircrack-ng',
                    category: 'WiFi Security',
                    description: 'Complete WiFi security testing suite',
                    commands: [
                        'airmon-ng start wlan0',
                        'airodump-ng wlan0mon',
                        'aireplay-ng -0 5 -a [BSSID] wlan0mon'
                    ],
                    platforms: ['Linux'],
                    difficulty: 'Advanced',
                    tutorial: {
                        overview: 'Aircrack-ng is a complete suite of tools to assess WiFi network security.',
                        installation: 'Install via: apt install aircrack-ng (Linux only)',
                        examples: [
                            { cmd: 'airmon-ng start wlan0', desc: 'Enable monitor mode on wireless interface' },
                            { cmd: 'airodump-ng wlan0mon', desc: 'Capture wireless packets' },
                            { cmd: 'aireplay-ng -0 5 -a [BSSID] wlan0mon', desc: 'Perform deauthentication attack' }
                        ]
                    }
                },
                {
                    name: 'Kismet',
                    category: 'Wireless Detection',
                    description: 'Wireless network detector and intrusion detection',
                    commands: [
                        'kismet',
                        'kismet -c wlan0'
                    ],
                    platforms: ['Linux', 'macOS'],
                    difficulty: 'Intermediate',
                    tutorial: {
                        overview: 'Kismet is a wireless network and device detector, sniffer, and intrusion detection system.',
                        installation: 'Install via package manager or compile from source',
                        examples: [
                            { cmd: 'kismet', desc: 'Start Kismet with default configuration' },
                            { cmd: 'kismet -c wlan0', desc: 'Start with specific wireless interface' }
                        ]
                    }
                },
                {
                    name: 'Bettercap',
                    category: 'Network Attack',
                    description: 'Modern network attack and monitoring framework',
                    commands: [
                        'bettercap -iface wlan0',
                        'bettercap -eval "wifi.recon on; wifi.show"'
                    ],
                    platforms: ['Linux', 'macOS', 'Windows'],
                    difficulty: 'Advanced',
                    tutorial: {
                        overview: 'Bettercap is a powerful, easily extensible and portable framework for network attacks and monitoring.',
                        installation: 'Install via: brew install bettercap (macOS) or apt install bettercap (Linux)',
                        examples: [
                            { cmd: 'bettercap -iface wlan0', desc: 'Start interactive session on wireless interface' },
                            { cmd: 'bettercap -eval "wifi.recon on"', desc: 'Enable WiFi reconnaissance' }
                        ]
                    }
                }
            ],
            web: [
                {
                    name: 'OWASP ZAP',
                    category: 'Web Security',
                    description: 'Web application security scanner',
                    commands: [
                        'zap.sh -daemon -port 8080',
                        'zap.sh -quickurl http://target.com'
                    ],
                    platforms: ['Linux', 'macOS', 'Windows'],
                    difficulty: 'Intermediate',
                    tutorial: {
                        overview: 'OWASP ZAP is one of the most popular free security tools for finding vulnerabilities in web applications.',
                        installation: 'Download from OWASP website or install via package manager',
                        examples: [
                            { cmd: 'zap.sh -daemon -port 8080', desc: 'Start ZAP as daemon on port 8080' },
                            { cmd: 'zap.sh -quickurl http://target.com', desc: 'Quick scan of target URL' }
                        ]
                    }
                },
                {
                    name: 'Nikto',
                    category: 'Web Vulnerability',
                    description: 'Web server vulnerability scanner',
                    commands: [
                        'nikto -h http://target.com',
                        'nikto -h target.com -p 80,443'
                    ],
                    platforms: ['Linux', 'macOS'],
                    difficulty: 'Beginner',
                    tutorial: {
                        overview: 'Nikto is a web server scanner that tests web servers for dangerous files and outdated software.',
                        installation: 'Install via: apt install nikto (Linux) or brew install nikto (macOS)',
                        examples: [
                            { cmd: 'nikto -h http://target.com', desc: 'Basic web server scan' },
                            { cmd: 'nikto -h target.com -p 80,443', desc: 'Scan specific ports' }
                        ]
                    }
                },
                {
                    name: 'SQLMap',
                    category: 'Database Security',
                    description: 'SQL injection detection and exploitation',
                    commands: [
                        "sqlmap -u 'http://target.com/page?id=1'",
                        'sqlmap -u target.com --forms --batch'
                    ],
                    platforms: ['Linux', 'macOS', 'Windows'],
                    difficulty: 'Advanced',
                    tutorial: {
                        overview: 'SQLMap is an open source penetration testing tool that automates SQL injection detection and exploitation.',
                        installation: 'Install via: apt install sqlmap (Linux) or pip install sqlmap',
                        examples: [
                            { cmd: "sqlmap -u 'http://target.com/page?id=1'", desc: 'Test URL parameter for SQL injection' },
                            { cmd: 'sqlmap -u target.com --forms --batch', desc: 'Automatically find and test forms' }
                        ]
                    }
                }
            ],
            osint: [
                {
                    name: 'TheHarvester',
                    category: 'OSINT',
                    description: 'Gather emails, subdomains, and other information',
                    commands: [
                        'theHarvester -d target.com -b google',
                        'theHarvester -d target.com -b all -l 500'
                    ],
                    platforms: ['Linux', 'macOS'],
                    difficulty: 'Beginner',
                    tutorial: {
                        overview: 'TheHarvester is a tool for gathering e-mail accounts, subdomain names, virtual hosts, and other information.',
                        installation: 'Install via: pip install theHarvester or apt install theharvester',
                        examples: [
                            { cmd: 'theHarvester -d target.com -b google', desc: 'Search using Google as data source' },
                            { cmd: 'theHarvester -d target.com -b all -l 500', desc: 'Search all sources with 500 results limit' }
                        ]
                    }
                },
                {
                    name: 'SpiderFoot',
                    category: 'OSINT Automation',
                    description: 'Automated OSINT reconnaissance tool',
                    commands: [
                        'python3 sf.py -s target.com',
                        'python3 sf.py -l 127.0.0.1:5001'
                    ],
                    platforms: ['Linux', 'macOS', 'Windows'],
                    difficulty: 'Intermediate',
                    tutorial: {
                        overview: 'SpiderFoot is an open source intelligence automation tool that integrates with multiple data sources.',
                        installation: 'Clone from GitHub and install Python dependencies',
                        examples: [
                            { cmd: 'python3 sf.py -s target.com', desc: 'Start scan on target domain' },
                            { cmd: 'python3 sf.py -l 127.0.0.1:5001', desc: 'Start web interface' }
                        ]
                    }
                }
            ]
        };
    }

    // Tool Library Setup
    setupToolLibrary() {
        const categoryTabs = document.querySelectorAll('.category-tab');
        const toolSearch = document.getElementById('tool-search');

        categoryTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                
                categoryTabs.forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                this.currentCategory = category;
                this.loadToolsForCategory(category);
            });
        });

        if (toolSearch) {
            toolSearch.addEventListener('input', (e) => {
                this.searchTools(e.target.value);
            });
        }

        // Load initial tools
        this.loadToolsForCategory('network');
    }

    loadToolsForCategory(category) {
        const tools = this.getSecurityTools()[category] || [];
        const toolsGrid = document.getElementById('tools-grid');
        const toolLibraryGrid = document.getElementById('tool-library-grid');

        const toolsHTML = tools.map(tool => `
            <div class="tool-card" data-tool="${tool.name.toLowerCase()}">
                <div class="tool-name">${tool.name}</div>
                <div class="tool-category">${tool.category}</div>
                <div class="tool-description">${tool.description}</div>
                <div class="tool-difficulty">${tool.difficulty}</div>
            </div>
        `).join('');

        if (toolsGrid) toolsGrid.innerHTML = toolsHTML;
        if (toolLibraryGrid) toolLibraryGrid.innerHTML = toolsHTML;

        // Add click handlers
        document.querySelectorAll('.tool-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const toolName = e.currentTarget.dataset.tool;
                this.openToolModal(toolName);
            });
        });
    }

    searchTools(query) {
        const allTools = Object.values(this.getSecurityTools()).flat();
        const filteredTools = allTools.filter(tool => 
            tool.name.toLowerCase().includes(query.toLowerCase()) ||
            tool.description.toLowerCase().includes(query.toLowerCase()) ||
            tool.category.toLowerCase().includes(query.toLowerCase())
        );

        const toolLibraryGrid = document.getElementById('tool-library-grid');
        if (toolLibraryGrid) {
            const toolsHTML = filteredTools.map(tool => `
                <div class="tool-card" data-tool="${tool.name.toLowerCase()}">
                    <div class="tool-name">${tool.name}</div>
                    <div class="tool-category">${tool.category}</div>
                    <div class="tool-description">${tool.description}</div>
                    <div class="tool-difficulty">${tool.difficulty}</div>
                </div>
            `).join('');
            
            toolLibraryGrid.innerHTML = toolsHTML;
            
            document.querySelectorAll('.tool-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    const toolName = e.currentTarget.dataset.tool;
                    this.openToolModal(toolName);
                });
            });
        }
    }

    // Modal System
    setupModals() {
        const modal = document.getElementById('tool-modal');
        const closeBtn = document.querySelector('.modal-close');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // Tool tabs
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tool-tab')) {
                const tab = e.target.dataset.tab;
                document.querySelectorAll('.tool-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.loadToolTabContent(tab);
            }
        });
    }

    openToolModal(toolName) {
        const allTools = Object.values(this.getSecurityTools()).flat();
        const tool = allTools.find(t => t.name.toLowerCase() === toolName);
        
        if (tool) {
            document.getElementById('modal-tool-name').textContent = tool.name;
            this.currentTool = tool;
            this.loadToolTabContent('overview');
            document.getElementById('tool-modal').classList.add('active');
        }
    }

    loadToolTabContent(tab) {
        const content = document.getElementById('tool-content');
        const tool = this.currentTool;
        
        if (!tool) return;

        switch(tab) {
            case 'overview':
                content.innerHTML = `
                    <h3>Overview</h3>
                    <p><strong>Category:</strong> ${tool.category}</p>
                    <p><strong>Difficulty:</strong> ${tool.difficulty}</p>
                    <p><strong>Platforms:</strong> ${tool.platforms.join(', ')}</p>
                    <p><strong>Description:</strong> ${tool.description}</p>
                    <p>${tool.tutorial?.overview || 'No detailed overview available.'}</p>
                `;
                break;
            case 'tutorial':
                content.innerHTML = `
                    <h3>Tutorial</h3>
                    <h4>Installation</h4>
                    <p>${tool.tutorial?.installation || 'Installation instructions not available.'}</p>
                    <h4>Usage Examples</h4>
                    ${tool.tutorial?.examples?.map(ex => `
                        <div class="command-example">${ex.cmd}</div>
                        <div class="command-description">${ex.desc}</div>
                    `).join('') || '<p>No usage examples available.</p>'}
                `;
                break;
            case 'commands':
                content.innerHTML = `
                    <h3>Common Commands</h3>
                    ${tool.commands.map(cmd => `
                        <div class="command-example">${cmd}</div>
                    `).join('')}
                    <h4>Command Reference</h4>
                    <p>Use the Execute tab to run these commands safely in a controlled environment.</p>
                `;
                break;
            case 'execute':
                content.innerHTML = `
                    <h3>Execute ${tool.name}</h3>
                    <div class="form-group">
                        <label class="form-label">Target/Parameters:</label>
                        <input type="text" class="form-control" id="tool-target" placeholder="Enter target or parameters...">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Command Template:</label>
                        <select class="form-control" id="command-template">
                            ${tool.commands.map(cmd => `<option value="${cmd}">${cmd}</option>`).join('')}
                        </select>
                    </div>
                    <button class="btn btn--primary" onclick="app.executeTool()">Execute Command</button>
                    <div class="console-output" id="tool-output" style="margin-top: 16px; height: 200px; overflow-y: auto;"></div>
                `;
                break;
        }
    }

    executeTool() {
        const target = document.getElementById('tool-target').value;
        const template = document.getElementById('command-template').value;
        const output = document.getElementById('tool-output');
        
        if (!target) {
            this.addToOutput(output, 'Error: Please enter a target or parameters', 'error');
            return;
        }

        const command = template.replace(/target\.com|192\.168\.1\.0\/24|\[BSSID\]/g, target);
        this.addToOutput(output, `Executing: ${command}`, 'info');
        this.addToOutput(output, 'Note: This is a simulation for educational purposes', 'warning');
        
        // Simulate command execution
        setTimeout(() => {
            this.simulateToolOutput(output, this.currentTool.name, target);
        }, 1000);
    }

    simulateToolOutput(output, toolName, target) {
        const responses = {
            'nmap': [
                `Starting Nmap scan on ${target}`,
                'Host is up (0.0012s latency)',
                'PORT     STATE SERVICE',
                '22/tcp   open  ssh',
                '80/tcp   open  http',
                '443/tcp  open  https',
                'Scan completed successfully'
            ],
            'nikto': [
                `Scanning ${target}`,
                '+ Server: Apache/2.4.41',
                '+ Retrieved x-powered-by header: PHP/7.4.3',
                '+ No CGI Directories found',
                '+ Scan completed'
            ],
            'masscan': [
                `Starting masscan on ${target}`,
                'Scanning 65535 ports',
                'Discovered open port 80/tcp',
                'Discovered open port 443/tcp',
                'Rate: 1000 packets/sec'
            ]
        };

        const toolResponses = responses[toolName.toLowerCase()] || ['Simulation output not available for this tool'];
        
        toolResponses.forEach((line, index) => {
            setTimeout(() => {
                this.addToOutput(output, line, 'success');
            }, index * 500);
        });
    }

    // Console System
    setupConsole() {
        const executeBtn = document.getElementById('execute-command');
        const commandInput = document.getElementById('command-input');
        const clearBtn = document.getElementById('clear-console');

        if (executeBtn) {
            executeBtn.addEventListener('click', () => {
                const command = commandInput.value.trim();
                if (command) {
                    this.executeCommand(command);
                    commandInput.value = '';
                }
            });
        }

        if (commandInput) {
            commandInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const command = e.target.value.trim();
                    if (command) {
                        this.executeCommand(command);
                        e.target.value = '';
                    }
                }
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearConsole();
            });
        }
    }

    executeCommand(command) {
        const consoleOutput = document.getElementById('console-output');
        this.addToOutput(consoleOutput, `$ ${command}`, 'command');
        
        // Simulate command processing
        setTimeout(() => {
            this.processCommand(command, consoleOutput);
        }, 500);
    }

    processCommand(command, output) {
        const cmd = command.toLowerCase();
        
        if (cmd.includes('nmap')) {
            this.addToOutput(output, 'Nmap scan initiated...', 'info');
            this.addToOutput(output, 'Use the Tool Library for guided Nmap execution', 'warning');
        } else if (cmd.includes('help')) {
            this.addToOutput(output, 'Available commands: nmap, nikto, masscan, aircrack-ng, help, clear', 'info');
        } else if (cmd.includes('clear')) {
            this.clearConsole();
        } else {
            this.addToOutput(output, `Command '${command}' not recognized. Type 'help' for available commands.`, 'error');
        }
    }

    addToOutput(output, text, type = 'normal') {
        const line = document.createElement('div');
        line.className = `console-line ${type}`;
        line.textContent = text;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    clearConsole() {
        const consoleOutput = document.getElementById('console-output');
        consoleOutput.innerHTML = `
            <div class="console-line">Console cleared</div>
            <div class="console-line">Ready to execute security scans...</div>
        `;
    }

    // Dashboard Functions
    setupDashboard() {
        const refreshBtn = document.getElementById('refresh-dashboard');
        const exportBtn = document.getElementById('export-report');
        const quickActions = document.querySelectorAll('.action-btn');

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshDashboard();
            });
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportReport();
            });
        }

        quickActions.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.executeQuickAction(action);
                e.preventDefault();
            });
        });
    }

    refreshDashboard() {
        // Simulate data refresh
        const metrics = {
            'active-hosts': Math.floor(Math.random() * 50) + 10,
            'open-ports': Math.floor(Math.random() * 200) + 100,
            'vulnerabilities': Math.floor(Math.random() * 20) + 5,
            'threats': Math.floor(Math.random() * 5) + 1
        };

        Object.entries(metrics).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });

        this.addActivity('Dashboard refreshed', 'info');
    }

    executeQuickAction(action) {
        const actions = {
            'nmap-scan': () => {
                this.addActivity('Nmap scan initiated on local network', 'info');
                this.simulateProgress('Nmap scan', 5000);
            },
            'wifi-scan': () => {
                this.addActivity('WiFi scan started', 'info');
                this.simulateProgress('WiFi scan', 3000);
            },
            'vuln-scan': () => {
                this.addActivity('Vulnerability scan initiated', 'warning');
                this.simulateProgress('Vulnerability scan', 8000);
            },
            'osint-lookup': () => {
                this.addActivity('OSINT lookup started', 'info');
                this.simulateProgress('OSINT lookup', 4000);
            }
        };

        if (actions[action]) {
            actions[action]();
        }
    }

    simulateProgress(taskName, duration) {
        setTimeout(() => {
            this.addActivity(`${taskName} completed successfully`, 'success');
            this.refreshDashboard();
        }, duration);
    }

    addActivity(message, type) {
        const feed = document.getElementById('activity-feed');
        if (!feed) return;

        const time = new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <span class="activity-time">${time}</span>
            <span class="activity-desc">${message}</span>
            <span class="status status--${type}">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
        `;

        feed.insertBefore(item, feed.firstChild);
        
        // Keep only last 10 items
        while (feed.children.length > 10) {
            feed.removeChild(feed.lastChild);
        }
    }

    exportReport() {
        // Simulate report generation
        this.addActivity('Generating security report...', 'info');
        setTimeout(() => {
            this.addActivity('Report exported successfully', 'success');
        }, 2000);
    }

    // Passive Monitor Setup
    setupPassiveMonitor() {
        const startBtn = document.getElementById('start-monitor');
        const pauseBtn = document.getElementById('pause-monitor');

        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startPassiveMonitoring();
            });
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.pausePassiveMonitoring();
            });
        }
    }

    initializePassiveMonitor() {
        if (!this.isMonitoring) {
            this.startPassiveMonitoring();
        }
        this.updateBandwidthDisplay();
    }

    startPassiveMonitoring() {
        this.isMonitoring = true;
        const startBtn = document.getElementById('start-monitor');
        const pauseBtn = document.getElementById('pause-monitor');
        
        if (startBtn) startBtn.textContent = 'Monitoring...';
        if (pauseBtn) pauseBtn.style.display = 'inline-block';
        
        this.addActivity('Passive monitoring started', 'info');
        
        // Start monitoring intervals
        this.monitoringInterval = setInterval(() => {
            this.updateNetworkMonitoring();
        }, 5000);
    }

    pausePassiveMonitoring() {
        this.isMonitoring = false;
        const startBtn = document.getElementById('start-monitor');
        const pauseBtn = document.getElementById('pause-monitor');
        
        if (startBtn) startBtn.textContent = 'Start Monitoring';
        if (pauseBtn) pauseBtn.style.display = 'none';
        
        this.addActivity('Passive monitoring paused', 'warning');
        
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }
    }

    updateNetworkMonitoring() {
        // Simulate network monitoring updates
        this.updateBandwidthDisplay();
        
        // Randomly add new alerts
        if (Math.random() < 0.3) {
            this.generateRandomAlert();
        }
    }

    updateBandwidthDisplay() {
        const downloadSpeed = (Math.random() * 50 + 10).toFixed(1);
        const uploadSpeed = (Math.random() * 20 + 5).toFixed(1);
        const usage = Math.floor(Math.random() * 40 + 30);
        
        const bandwidthStats = document.querySelector('.bandwidth-stats');
        const bandwidthFill = document.querySelector('.bandwidth-fill');
        
        if (bandwidthStats) {
            bandwidthStats.innerHTML = `
                <span>Download: ${downloadSpeed} MB/s</span>
                <span>Upload: ${uploadSpeed} MB/s</span>
            `;
        }
        
        if (bandwidthFill) {
            bandwidthFill.style.width = `${usage}%`;
        }
    }

    generateRandomAlert() {
        const alerts = [
            { message: 'Unusual traffic pattern detected on port 443', severity: 'medium' },
            { message: 'Multiple failed login attempts from 192.168.1.100', severity: 'high' },
            { message: 'Suspicious DNS queries to unknown domains', severity: 'medium' },
            { message: 'Port scan detected from external IP', severity: 'high' },
            { message: 'Large file transfer detected', severity: 'low' },
            { message: 'Unusual network protocol usage', severity: 'medium' }
        ];
        
        const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
        this.addAlert(randomAlert.message, randomAlert.severity);
    }

    addAlert(message, severity) {
        const alertsList = document.getElementById('alerts-list');
        if (!alertsList) return;

        const time = new Date().toLocaleTimeString();
        const item = document.createElement('div');
        item.className = 'alert-item';
        item.innerHTML = `
            <span class="alert-severity ${severity}">${severity.toUpperCase()}</span>
            <span class="alert-message">${message}</span>
            <span class="alert-time">${time}</span>
        `;

        alertsList.insertBefore(item, alertsList.firstChild);
        
        // Keep only last 5 alerts
        while (alertsList.children.length > 5) {
            alertsList.removeChild(alertsList.lastChild);
        }
    }

    // OSINT Setup
    setupOSINT() {
        const configureBtn = document.getElementById('configure-apis');
        
        if (configureBtn) {
            configureBtn.addEventListener('click', () => {
                this.showAPIConfiguration();
            });
        }
        
        // Setup search functionality
        this.setupOSINTSearch();
    }

    setupOSINTSearch() {
        const searchInputs = document.querySelectorAll('.source-actions input');
        const searchButtons = document.querySelectorAll('.source-actions .btn');
        
        searchButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const input = searchInputs[index];
                if (input && input.value.trim()) {
                    this.performOSINTSearch(input.value.trim(), index === 0 ? 'shodan' : 'wigle');
                }
            });
        });
        
        searchInputs.forEach((input, index) => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && input.value.trim()) {
                    this.performOSINTSearch(input.value.trim(), index === 0 ? 'shodan' : 'wigle');
                }
            });
        });
    }

    initializeOSINT() {
        this.loadIntelligenceFeed();
    }

    performOSINTSearch(query, source) {
        this.addIntelligenceFeed(`Search initiated for "${query}" using ${source.toUpperCase()}`, source);
        
        // Simulate search results
        setTimeout(() => {
            if (source === 'shodan') {
                this.addIntelligenceFeed(`Found 12 devices matching "${query}" - Apache/2.4.41 servers detected`, source);
                this.addIntelligenceFeed(`Vulnerable services identified on ports 80, 443, 8080`, source);
            } else if (source === 'wigle') {
                this.addIntelligenceFeed(`Located 8 WiFi networks matching "${query}"`, source);
                this.addIntelligenceFeed(`Geographic distribution: 3 locations within 5km radius`, source);
            }
        }, 2000);
    }

    loadIntelligenceFeed() {
        // Load initial intelligence feed
        const initialFeed = [
            { source: 'Shodan', content: 'New vulnerable device found: Apache/2.4.41 on 45.123.45.67', time: '2 minutes ago' },
            { source: 'WiGLE', content: 'WiFi network "FreeWiFi" detected at coordinates 40.7128, -74.0060', time: '5 minutes ago' },
            { source: 'Shodan', content: 'Critical vulnerability detected in IoT device cluster', time: '8 minutes ago' },
            { source: 'WiGLE', content: 'New wireless access point identified in target area', time: '12 minutes ago' }
        ];
        
        const feedElement = document.getElementById('intel-feed');
        if (feedElement) {
            feedElement.innerHTML = initialFeed.map(item => `
                <div class="feed-item">
                    <span class="feed-source">${item.source}</span>
                    <span class="feed-content">${item.content}</span>
                    <span class="feed-time">${item.time}</span>
                </div>
            `).join('');
        }
    }

    addIntelligenceFeed(content, source) {
        const feedElement = document.getElementById('intel-feed');
        if (!feedElement) return;
        
        const time = 'Just now';
        const item = document.createElement('div');
        item.className = 'feed-item';
        item.innerHTML = `
            <span class="feed-source">${source.charAt(0).toUpperCase() + source.slice(1)}</span>
            <span class="feed-content">${content}</span>
            <span class="feed-time">${time}</span>
        `;
        
        feedElement.insertBefore(item, feedElement.firstChild);
        
        // Keep only last 10 items
        while (feedElement.children.length > 10) {
            feedElement.removeChild(feedElement.lastChild);
        }
    }

    showAPIConfiguration() {
        alert('API Configuration:\n\n1. Sign up for Shodan API at shodan.io\n2. Register for WiGLE API at wigle.net\n3. Enter your API keys in the Settings section\n4. Save configuration to enable full OSINT functionality');
    }

    // Tutorial System
    setupTutorials() {
        const categories = document.querySelectorAll('.tutorial-category');
        const searchInput = document.getElementById('tutorial-search');

        categories.forEach(cat => {
            cat.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                
                categories.forEach(c => c.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                this.currentTutorialCategory = category;
                this.loadTutorialContent(category);
            });
        });

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTutorials(e.target.value);
            });
        }

        this.loadTutorialContent('basics');
    }

    loadTutorialContent(category) {
        const content = document.getElementById('tutorial-detail');
        const tutorials = this.getTutorialContent();
        
        if (tutorials[category] && content) {
            content.innerHTML = tutorials[category];
        }
    }

    getTutorialContent() {
        return {
            basics: `
                <h2>Network Security Fundamentals</h2>
                <h3>TCP/IP Basics</h3>
                <p>Understanding the TCP/IP protocol stack is essential for network security. The stack consists of four layers:</p>
                <ul>
                    <li><strong>Application Layer:</strong> HTTP, HTTPS, FTP, SSH, DNS</li>
                    <li><strong>Transport Layer:</strong> TCP, UDP</li>
                    <li><strong>Internet Layer:</strong> IP, ICMP</li>
                    <li><strong>Link Layer:</strong> Ethernet, WiFi</li>
                </ul>
                
                <h3>Common Ports and Services</h3>
                <div class="code-block">
22  - SSH (Secure Shell)
23  - Telnet
25  - SMTP (Simple Mail Transfer Protocol)
53  - DNS (Domain Name System)
80  - HTTP (HyperText Transfer Protocol)
110 - POP3 (Post Office Protocol)
143 - IMAP (Internet Message Access Protocol)
443 - HTTPS (HTTP Secure)
993 - IMAPS (IMAP Secure)
995 - POP3S (POP3 Secure)
                </div>
                
                <h3>Network Topologies</h3>
                <p>Common network topologies include:</p>
                <ul>
                    <li><strong>Star:</strong> Central hub with devices connected directly</li>
                    <li><strong>Mesh:</strong> Multiple interconnected paths</li>
                    <li><strong>Ring:</strong> Devices connected in a circular fashion</li>
                    <li><strong>Bus:</strong> Single backbone cable</li>
                </ul>
            `,
            tools: `
                <h2>Security Tool Tutorials</h2>
                <p>This section contains detailed tutorials for each security tool in our library.</p>
                
                <h3>Network Scanning Tools</h3>
                <ul>
                    <li><strong>Nmap:</strong> Network discovery and port scanning</li>
                    <li><strong>Masscan:</strong> High-speed port scanning</li>
                    <li><strong>ARP-scan:</strong> Local network discovery</li>
                </ul>
                
                <h3>Wireless Security Tools</h3>
                <ul>
                    <li><strong>Aircrack-ng:</strong> WiFi security assessment</li>
                    <li><strong>Kismet:</strong> Wireless network detection</li>
                    <li><strong>Bettercap:</strong> Network attack framework</li>
                </ul>
                
                <h3>Web Application Testing</h3>
                <ul>
                    <li><strong>OWASP ZAP:</strong> Web application scanner</li>
                    <li><strong>Nikto:</strong> Web vulnerability scanner</li>
                    <li><strong>SQLMap:</strong> SQL injection testing</li>
                </ul>
                
                <p>Click on any tool in the Tool Library to access detailed tutorials, examples, and execution interfaces.</p>
            `,
            ethics: `
                <h2>Ethical Hacking Guidelines</h2>
                
                <h3>Legal Considerations</h3>
                <p><strong>⚠️ WARNING:</strong> Only perform security testing on systems you own or have explicit written permission to test.</p>
                
                <h4>Key Legal Points:</h4>
                <ul>
                    <li>Obtain proper authorization before testing</li>
                    <li>Respect scope limitations</li>
                    <li>Follow applicable laws and regulations</li>
                    <li>Document all activities thoroughly</li>
                </ul>
                
                <h3>Responsible Disclosure</h3>
                <p>When discovering vulnerabilities:</p>
                <ol>
                    <li>Report to the organization privately first</li>
                    <li>Allow reasonable time for remediation</li>
                    <li>Avoid causing harm or accessing sensitive data</li>
                    <li>Follow coordinated disclosure principles</li>
                </ol>
                
                <h3>Testing Methodologies</h3>
                <p>Follow established frameworks:</p>
                <ul>
                    <li><strong>OWASP Testing Guide:</strong> Web application security testing</li>
                    <li><strong>NIST Cybersecurity Framework:</strong> Risk management approach</li>
                    <li><strong>PTES (Penetration Testing Execution Standard):</strong> Comprehensive testing methodology</li>
                </ul>
                
                <h3>Best Practices</h3>
                <ul>
                    <li>Start with passive reconnaissance</li>
                    <li>Use minimal necessary force</li>
                    <li>Document everything</li>
                    <li>Clean up after testing</li>
                    <li>Provide actionable recommendations</li>
                </ul>
            `,
            advanced: `
                <h2>Advanced Security Techniques</h2>
                
                <h3>Advanced Reconnaissance</h3>
                <p>Beyond basic scanning, advanced techniques include:</p>
                <ul>
                    <li><strong>OSINT (Open Source Intelligence):</strong> Information gathering from public sources</li>
                    <li><strong>Social Engineering:</strong> Human-based attack vectors</li>
                    <li><strong>Supply Chain Analysis:</strong> Third-party risk assessment</li>
                </ul>
                
                <h3>Evasion Techniques</h3>
                <div class="code-block">
# Slow scan to avoid detection
nmap -sS -T1 target.com

# Fragmented packets
nmap -f target.com

# Decoy scanning
nmap -D decoy1,decoy2,ME target.com
                </div>
                
                <h3>Post-Exploitation</h3>
                <p>After gaining access:</p>
                <ul>
                    <li>Maintain persistence</li>
                    <li>Escalate privileges</li>
                    <li>Lateral movement</li>
                    <li>Data exfiltration (in authorized tests only)</li>
                </ul>
                
                <h3>Red Team vs Blue Team</h3>
                <p><strong>Red Team:</strong> Offensive security, simulating attackers</p>
                <p><strong>Blue Team:</strong> Defensive security, protecting systems</p>
                <p><strong>Purple Team:</strong> Collaborative approach combining both</p>
            `
        };
    }

    searchTutorials(query) {
        // Simple tutorial search implementation
        const content = document.getElementById('tutorial-detail');
        if (query.length > 2) {
            content.innerHTML = `
                <h2>Search Results for "${query}"</h2>
                <p>Searching through tutorial content...</p>
                <p>Use the navigation menu to browse specific categories.</p>
            `;
        } else {
            this.loadTutorialContent(this.currentTutorialCategory);
        }
    }

    // Settings Management
    setupSettings() {
        const saveBtn = document.getElementById('save-settings');
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveSettings();
            });
        }
    }

    saveSettings() {
        // Simulate settings save
        this.addActivity('Settings saved successfully', 'success');
        
        // In a real implementation, this would save to a backend or local storage
        const settings = {
            shodanKey: document.getElementById('shodan-key')?.value || '',
            wigleKey: document.getElementById('wigle-key')?.value || '',
            scanRate: document.getElementById('scan-rate')?.value || 'normal',
            scanTimeout: document.getElementById('scan-timeout')?.value || '30',
            enableAlerts: document.getElementById('enable-alerts')?.checked || false,
            enableEmail: document.getElementById('enable-email')?.checked || false
        };
        
        console.log('Settings saved:', settings);
    }

    // Chart Setup
    setupCharts() {
        this.createTrafficChart();
        this.createVulnerabilityChart();
    }

    createTrafficChart() {
        const canvas = document.getElementById('traffic-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Simple chart simulation
        ctx.fillStyle = '#21808D';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#FCFCF9';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Network Traffic Monitor', canvas.width/2, canvas.height/2);
        ctx.fillText('(Real-time data visualization)', canvas.width/2, canvas.height/2 + 20);
    }

    createVulnerabilityChart() {
        const canvas = document.getElementById('vuln-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Simple chart simulation
        ctx.fillStyle = '#FFC185';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#134252';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Vulnerability Trends', canvas.width/2, canvas.height/2);
        ctx.fillText('(Historical data analysis)', canvas.width/2, canvas.height/2 + 20);
    }

    updateCharts() {
        // Refresh charts with new data
        this.createTrafficChart();
        this.createVulnerabilityChart();
    }

    // Real-time Updates
    startRealtimeUpdates() {
        // Simulate real-time updates every 30 seconds
        setInterval(() => {
            if (this.currentSection === 'dashboard') {
                this.updateMetrics();
            }
            if (this.currentSection === 'passive-monitor' && this.isMonitoring) {
                this.updateMonitoring();
            }
        }, 30000);
    }

    updateMetrics() {
        // Simulate minor changes in metrics
        const elements = ['active-hosts', 'open-ports', 'vulnerabilities', 'threats'];
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const current = parseInt(element.textContent);
                const change = Math.floor(Math.random() * 6) - 3; // -3 to +3
                const newValue = Math.max(0, current + change);
                element.textContent = newValue;
            }
        });
    }

    updateMonitoring() {
        // Update monitoring displays
        this.updateBandwidthDisplay();
        
        // Add random alerts
        if (Math.random() < 0.2) { // 20% chance
            this.generateRandomAlert();
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new NetworkSecurityApp();
});

// Additional utility functions
function formatTime(date) {
    return date.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function sanitizeInput(input) {
    return input.replace(/[<>]/g, '');
}

function validateIP(ip) {
    const regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return regex.test(ip) && ip.split('.').every(octet => parseInt(octet) <= 255);
}

function validateDomain(domain) {
    const regex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return regex.test(domain);
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NetworkSecurityApp;
}