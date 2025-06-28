// Network Security Pro - Client Application JavaScript

class NetworkSecurityPro {
    constructor() {
        this.currentUser = null;
        this.currentSection = 'dashboard';
        this.activeTool = null;
        this.scanResults = [];
        this.networkDevices = [];
        this.wirelessNetworks = [];
        this.securityEvents = [];
        this.charts = {};
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
        this.simulateRealTimeData();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Tool cards
        const toolCards = document.querySelectorAll('.tool-card');
        toolCards.forEach(card => {
            card.addEventListener('click', (e) => this.handleToolSelection(e));
        });

        // Tool interface tabs
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                this.handleTabSwitch(e);
            }
            if (e.target.classList.contains('tutorial-nav-btn')) {
                this.handleTutorialNavigation(e);
            }
        });

        // Close tool interface
        const closeTool = document.getElementById('close-tool');
        if (closeTool) {
            closeTool.addEventListener('click', () => this.closeToolInterface());
        }

        // Settings tabs
        const settingsTabs = document.querySelectorAll('.settings-content .tab-btn');
        settingsTabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.handleSettingsTab(e));
        });

        // Initialize Feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    checkAuthStatus() {
        // Simulate checking authentication status
        const token = sessionStorage.getItem('auth_token');
        if (token) {
            this.showMainApp();
        } else {
            this.showLogin();
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simulate authentication
        if (username && password) {
            // Mock JWT token
            const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
            sessionStorage.setItem('auth_token', mockToken);
            
            this.currentUser = {
                username: username,
                role: 'admin',
                permissions: ['scan', 'analyze', 'report', 'admin']
            };
            
            this.showMainApp();
            this.showNotification('Login successful', 'success');
        } else {
            this.showNotification('Please enter valid credentials', 'error');
        }
    }

    handleLogout() {
        sessionStorage.removeItem('auth_token');
        this.currentUser = null;
        this.showLogin();
        this.showNotification('Logged out successfully', 'info');
    }

    showLogin() {
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('main-app').classList.add('hidden');
    }

    showMainApp() {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        this.initializeDashboard();
    }

    handleNavigation(e) {
        const section = e.currentTarget.dataset.section;
        this.switchSection(section);
    }

    switchSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName).classList.add('active');

        this.currentSection = sectionName;

        // Initialize section-specific functionality
        switch (sectionName) {
            case 'dashboard':
                this.initializeDashboard();
                break;
            case 'wireless-security':
                this.initializeWirelessDashboard();
                break;
            case 'network-discovery':
                this.loadNetworkTools();
                break;
        }
    }

    initializeDashboard() {
        this.createNetworkChart();
        this.createChannelChart();
        this.updateMetrics();
        this.loadSecurityEvents();
    }

    createNetworkChart() {
        const ctx = document.getElementById('networkChart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.charts.network) {
            this.charts.network.destroy();
        }

        // Mock network topology data
        const networkData = {
            labels: ['Router', 'Switch', 'Servers', 'Workstations', 'IoT Devices', 'Mobile'],
            datasets: [{
                label: 'Active Connections',
                data: [1, 3, 8, 45, 23, 17],
                backgroundColor: [
                    '#1FB8CD', '#FFC185', '#B4413C', 
                    '#ECEBD5', '#5D878F', '#DB4545'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        };

        this.charts.network = new Chart(ctx, {
            type: 'doughnut',
            data: networkData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    createChannelChart() {
        const ctx = document.getElementById('channelChart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.charts.channel) {
            this.charts.channel.destroy();
        }

        // Mock WiFi channel usage data
        const channelData = {
            labels: ['Ch 1', 'Ch 6', 'Ch 11', 'Ch 36', 'Ch 40', 'Ch 44', 'Ch 149'],
            datasets: [{
                label: 'Signal Strength (dBm)',
                data: [-45, -62, -58, -41, -67, -52, -39],
                backgroundColor: '#1FB8CD',
                borderColor: '#1FB8CD',
                borderWidth: 2,
                fill: false
            }]
        };

        this.charts.channel = new Chart(ctx, {
            type: 'line',
            data: channelData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: -80,
                        max: -30
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    initializeWirelessDashboard() {
        this.loadWirelessNetworks();
        this.createChannelChart();
    }

    loadWirelessNetworks() {
        // Mock wireless networks data
        this.wirelessNetworks = [
            {
                ssid: 'HomeNetwork_5G',
                bssid: '00:11:22:33:44:55',
                encryption: 'WPA2',
                channel: 36,
                signal: -45,
                security: 'secure'
            },
            {
                ssid: 'CoffeeShop_Guest',
                bssid: '66:77:88:99:AA:BB',
                encryption: 'Open',
                channel: 6,
                signal: -62,
                security: 'vulnerable'
            },
            {
                ssid: 'Office_WiFi',
                bssid: 'CC:DD:EE:FF:00:11',
                encryption: 'WPA3',
                channel: 149,
                signal: -38,
                security: 'secure'
            }
        ];

        this.updateWirelessList();
    }

    updateWirelessList() {
        const networksList = document.querySelector('.networks-list');
        if (!networksList) return;

        networksList.innerHTML = this.wirelessNetworks.map(network => `
            <div class="network-item">
                <div class="network-info">
                    <div class="network-ssid">${network.ssid}</div>
                    <div class="network-details">
                        ${network.encryption} • Channel ${network.channel} • ${network.signal} dBm
                    </div>
                </div>
                <div class="network-actions">
                    <button class="btn btn--outline btn--sm" onclick="app.analyzeNetwork('${network.bssid}')">
                        Analyze
                    </button>
                </div>
            </div>
        `).join('');
    }

    analyzeNetwork(bssid) {
        const network = this.wirelessNetworks.find(n => n.bssid === bssid);
        if (network) {
            this.showNotification(`Starting analysis of ${network.ssid}...`, 'info');
            // Simulate network analysis
            setTimeout(() => {
                this.showNotification(`Analysis complete for ${network.ssid}`, 'success');
            }, 3000);
        }
    }

    handleToolSelection(e) {
        const toolCard = e.currentTarget;
        const toolName = toolCard.dataset.tool || toolCard.querySelector('h3').textContent;
        this.openToolInterface(toolName);
    }

    openToolInterface(toolName) {
        const toolInterface = document.getElementById('tool-interface');
        const toolTitle = document.getElementById('tool-title');
        
        if (toolInterface && toolTitle) {
            toolTitle.textContent = `${toolName} - Security Tool`;
            toolInterface.classList.remove('hidden');
            this.activeTool = toolName;
            
            // Load tool-specific configuration
            this.loadToolConfiguration(toolName);
        }
    }

    closeToolInterface() {
        const toolInterface = document.getElementById('tool-interface');
        if (toolInterface) {
            toolInterface.classList.add('hidden');
            this.activeTool = null;
        }
    }

    loadToolConfiguration(toolName) {
        // Load tool-specific tutorial content
        this.loadTutorialContent(toolName);
    }

    loadTutorialContent(toolName) {
        const tutorials = {
            'nmap': {
                overview: `
                    <h4>Nmap Overview</h4>
                    <p>Nmap (Network Mapper) is a free and open-source network discovery and security auditing tool.</p>
                    <h5>Key Features:</h5>
                    <ul>
                        <li>Host discovery and port scanning</li>
                        <li>Service and version detection</li>
                        <li>Operating system detection</li>
                        <li>Network security scanning</li>
                        <li>Flexible target specification</li>
                    </ul>
                    <p><strong>Legal Notice:</strong> Only use Nmap on networks you own or have explicit permission to test.</p>
                `,
                quickstart: `
                    <h4>Quick Start Guide</h4>
                    <div class="command-examples">
                        <div class="command-example">
                            <div class="command-title">Basic host discovery</div>
                            <div class="command-code">nmap -sn 192.168.1.0/24</div>
                            <div class="command-desc">Ping scan to discover live hosts in the network</div>
                        </div>
                        <div class="command-example">
                            <div class="command-title">TCP SYN scan</div>
                            <div class="command-code">nmap -sS 192.168.1.100</div>
                            <div class="command-desc">Stealth scan of common ports on target host</div>
                        </div>
                        <div class="command-example">
                            <div class="command-title">Service detection</div>
                            <div class="command-code">nmap -sV 192.168.1.100</div>
                            <div class="command-desc">Detect services and versions on open ports</div>
                        </div>
                    </div>
                `,
                examples: `
                    <h4>Advanced Examples</h4>
                    <div class="command-examples">
                        <div class="command-example">
                            <div class="command-title">Comprehensive scan</div>
                            <div class="command-code">nmap -A -T4 192.168.1.0/24</div>
                            <div class="command-desc">Aggressive scan with OS detection, version detection, script scanning</div>
                        </div>
                        <div class="command-example">
                            <div class="command-title">UDP scan</div>
                            <div class="command-code">nmap -sU -p 53,67,68,123,161 192.168.1.1</div>
                            <div class="command-desc">UDP scan of common services on gateway</div>
                        </div>
                    </div>
                `,
                advanced: `
                    <h4>Advanced Usage</h4>
                    <p>Advanced Nmap techniques for penetration testing and security assessment:</p>
                    <div class="command-examples">
                        <div class="command-example">
                            <div class="command-title">Script scanning</div>
                            <div class="command-code">nmap --script vuln 192.168.1.0/24</div>
                            <div class="command-desc">Run vulnerability detection scripts against targets</div>
                        </div>
                        <div class="command-example">
                            <div class="command-title">Firewall evasion</div>
                            <div class="command-code">nmap -f -T2 -D RND:10 192.168.1.100</div>
                            <div class="command-desc">Fragment packets, slow timing, and use decoys</div>
                        </div>
                    </div>
                `
            },
            'masscan': {
                overview: `
                    <h4>Masscan Overview</h4>
                    <p>Masscan is an Internet-scale port scanner, capable of scanning the entire Internet in under 6 minutes.</p>
                    <h5>Key Features:</h5>
                    <ul>
                        <li>Extremely fast port scanning</li>
                        <li>Asynchronous transmission</li>
                        <li>Custom packet transmission rates</li>
                        <li>Large-scale network scanning</li>
                        <li>Banner grabbing capabilities</li>
                    </ul>
                `,
                quickstart: `
                    <h4>Quick Start Guide</h4>
                    <div class="command-examples">
                        <div class="command-example">
                            <div class="command-title">Basic port scan</div>
                            <div class="command-code">masscan -p80,443 192.168.1.0/24</div>
                            <div class="command-desc">Scan for HTTP and HTTPS ports</div>
                        </div>
                        <div class="command-example">
                            <div class="command-title">Rate-limited scan</div>
                            <div class="command-code">masscan -p1-1000 --rate=1000 192.168.1.0/24</div>
                            <div class="command-desc">Scan first 1000 ports at 1000 packets per second</div>
                        </div>
                    </div>
                `
            }
        };

        const toolTutorial = tutorials[toolName.toLowerCase()] || tutorials['nmap'];
        
        // Update tutorial sections
        Object.keys(toolTutorial).forEach(section => {
            const element = document.getElementById(`tutorial-${section}`);
            if (element) {
                element.innerHTML = toolTutorial[section];
            }
        });
    }

    handleTabSwitch(e) {
        const tabName = e.target.dataset.tab;
        const container = e.target.closest('.tool-interface') || e.target.closest('.settings-content');
        
        if (container) {
            // Update tab buttons
            container.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');

            // Update tab content
            container.querySelectorAll('.tab-content, .settings-panel').forEach(content => {
                content.classList.remove('active');
            });
            
            const targetContent = container.querySelector(`#${tabName}-tab, #${tabName}-settings`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        }
    }

    handleTutorialNavigation(e) {
        const tutorialName = e.target.dataset.tutorial;
        
        // Update navigation
        document.querySelectorAll('.tutorial-nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');

        // Update content
        document.querySelectorAll('.tutorial-section').forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(`tutorial-${tutorialName}`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }

    handleSettingsTab(e) {
        const tabName = e.target.dataset.tab;
        
        // Update tab buttons
        document.querySelectorAll('.settings-tabs .tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');

        // Update panels
        document.querySelectorAll('.settings-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        const targetPanel = document.getElementById(`${tabName}-settings`);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
    }

    startScan() {
        const target = document.querySelector('#config-tab input[placeholder="192.168.1.0/24"]').value;
        const scanType = document.querySelector('#config-tab select').value;
        
        if (!target) {
            this.showNotification('Please specify a target', 'error');
            return;
        }

        this.showNotification(`Starting ${scanType} scan on ${target}...`, 'info');
        
        // Switch to output tab
        document.querySelector('[data-tab="output"]').click();
        
        // Simulate scan output
        this.simulateScanOutput(target, scanType);
    }

    simulateScanOutput(target, scanType) {
        const outputContent = document.getElementById('output-content');
        if (!outputContent) return;

        outputContent.innerHTML = '';
        
        const scanSteps = [
            `Starting Nmap scan on ${target}`,
            `Initiating ${scanType}...`,
            `Scanning 1000 ports on ${target}`,
            `Discovered open port 22/tcp on 192.168.1.1`,
            `Discovered open port 80/tcp on 192.168.1.1`,
            `Discovered open port 443/tcp on 192.168.1.1`,
            `Completed ${scanType} scan (3 hosts up) scanned in 12.34 seconds`
        ];

        let stepIndex = 0;
        const interval = setInterval(() => {
            if (stepIndex < scanSteps.length) {
                const timestamp = new Date().toLocaleTimeString();
                outputContent.innerHTML += `<div>[${timestamp}] ${scanSteps[stepIndex]}</div>`;
                outputContent.scrollTop = outputContent.scrollHeight;
                stepIndex++;
            } else {
                clearInterval(interval);
                this.showNotification('Scan completed successfully', 'success');
                this.updateScanResults();
            }
        }, 1000);
    }

    updateScanResults() {
        // Mock scan results
        const mockResults = [
            {
                host: '192.168.1.1',
                status: 'Up',
                ports: '22, 80, 443',
                os: 'Linux 5.4'
            },
            {
                host: '192.168.1.100',
                status: 'Up',
                ports: '80, 3306',
                os: 'Windows Server'
            },
            {
                host: '192.168.1.150',
                status: 'Up',
                ports: '22, 5432',
                os: 'Ubuntu 20.04'
            }
        ];

        const tbody = document.getElementById('results-tbody');
        if (tbody) {
            tbody.innerHTML = mockResults.map(result => `
                <tr>
                    <td>${result.host}</td>
                    <td><span class="status status--success">${result.status}</span></td>
                    <td>${result.ports}</td>
                    <td>${result.os}</td>
                </tr>
            `).join('');
        }
    }

    clearOutput() {
        const outputContent = document.getElementById('output-content');
        if (outputContent) {
            outputContent.innerHTML = '';
        }
    }

    updateMetrics() {
        // Simulate real-time metric updates
        const metrics = [
            { selector: '.metric-value', values: [147, 23, 8, '99.7%'] },
        ];

        // Update metrics with slight variations
        const metricElements = document.querySelectorAll('.metric-value');
        metricElements.forEach((element, index) => {
            const baseValues = [147, 23, 8, 99.7];
            if (index < baseValues.length) {
                let newValue = baseValues[index];
                if (typeof newValue === 'number') {
                    newValue += Math.floor(Math.random() * 5) - 2; // ±2 variation
                    if (index === 3) newValue = Math.max(95, Math.min(100, newValue)); // Keep percentage realistic
                }
                
                if (index === 3) {
                    element.textContent = newValue.toFixed(1) + '%';
                } else {
                    element.textContent = newValue;
                }
            }
        });
    }

    loadSecurityEvents() {
        this.securityEvents = [
            {
                type: 'critical',
                title: 'Critical Vulnerability Detected',
                description: 'SQL injection vulnerability found on web server 192.168.1.100',
                time: '2 minutes ago'
            },
            {
                type: 'warning',
                title: 'Unauthorized Device Detected',
                description: 'New device connected: MAC 00:11:22:33:44:55',
                time: '15 minutes ago'
            },
            {
                type: 'info',
                title: 'Scan Completed',
                description: 'Nmap port scan completed for subnet 192.168.1.0/24',
                time: '1 hour ago'
            },
            {
                type: 'warning',
                title: 'Weak Password Detected',
                description: 'Default credentials found on device 192.168.1.205',
                time: '2 hours ago'
            }
        ];

        this.updateSecurityTimeline();
    }

    updateSecurityTimeline() {
        const timeline = document.querySelector('.timeline');
        if (!timeline) return;

        timeline.innerHTML = this.securityEvents.map(event => `
            <div class="timeline-item">
                <div class="timeline-marker ${event.type}"></div>
                <div class="timeline-content">
                    <div class="timeline-title">${event.title}</div>
                    <div class="timeline-description">${event.description}</div>
                    <div class="timeline-time">${event.time}</div>
                </div>
            </div>
        `).join('');
    }

    simulateRealTimeData() {
        // Update metrics every 30 seconds
        setInterval(() => {
            this.updateMetrics();
        }, 30000);

        // Add new security events periodically
        setInterval(() => {
            this.addRandomSecurityEvent();
        }, 60000);

        // Update tool progress
        setInterval(() => {
            this.updateToolProgress();
        }, 5000);
    }

    addRandomSecurityEvent() {
        const eventTypes = ['info', 'warning', 'critical'];
        const events = [
            'New device detected on network',
            'Port scan detected from external IP',
            'Vulnerability scan completed',
            'Suspicious network activity detected',
            'Certificate expiration warning'
        ];

        const newEvent = {
            type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
            title: events[Math.floor(Math.random() * events.length)],
            description: `Automated security monitoring detected activity on ${new Date().toLocaleString()}`,
            time: 'Just now'
        };

        this.securityEvents.unshift(newEvent);
        if (this.securityEvents.length > 10) {
            this.securityEvents.pop();
        }

        this.updateSecurityTimeline();
    }

    updateToolProgress() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const currentWidth = parseInt(bar.style.width) || 0;
            if (currentWidth < 100) {
                const newWidth = Math.min(100, currentWidth + Math.random() * 10);
                bar.style.width = newWidth + '%';
                
                const progressText = bar.parentElement.nextElementSibling;
                if (progressText) {
                    progressText.textContent = Math.floor(newWidth) + '% Complete';
                }
            }
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 12px 16px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    z-index: 1000;
                    max-width: 400px;
                    animation: slideIn 0.3s ease-out;
                }
                .notification--success { background: var(--color-success); color: white; }
                .notification--error { background: var(--color-error); color: white; }
                .notification--warning { background: var(--color-warning); color: white; }
                .notification--info { background: var(--color-info); color: white; }
                .notification-content { display: flex; justify-content: space-between; align-items: center; }
                .notification-close { background: none; border: none; color: inherit; cursor: pointer; font-size: 18px; }
                @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
            `;
            document.head.appendChild(styles);
        }

        // Add to page
        document.body.appendChild(notification);

        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Public methods for global access
    startQuickScan() {
        this.showNotification('Starting quick network scan...', 'info');
        setTimeout(() => {
            this.showNotification('Quick scan completed - 15 devices found', 'success');
            this.updateMetrics();
        }, 3000);
    }

    showWirelessNetworks() {
        this.switchSection('wireless-security');
        this.showNotification('Scanning for wireless networks...', 'info');
    }

    generateReport() {
        this.showNotification('Generating security report...', 'info');
        setTimeout(() => {
            this.showNotification('Security report generated successfully', 'success');
        }, 2000);
    }
}

// Initialize the application
const app = new NetworkSecurityPro();

// Global functions for inline event handlers
function startQuickScan() {
    app.startQuickScan();
}

function showWirelessNetworks() {
    app.showWirelessNetworks();
}

function generateReport() {
    app.generateReport();
}

function startScan() {
    app.startScan();
}

function clearOutput() {
    app.clearOutput();
}

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});