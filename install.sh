#!/bin/bash

##############################################################################
# Map Explorer - Installation Script
# Auto setup untuk development dan production
# Created: 2024
##############################################################################

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Banner
echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║   🗺️  Map Explorer - Smart Navigation & Tracking          ║"
echo "║      Instalasi Otomatis v1.0.0                           ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Function: Check command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function: Print status
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUKSES]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function: Check system requirements
check_requirements() {
    echo -e "\n${PURPLE}📋 Memeriksa System Requirements...${NC}\n"
    
    # Check Node.js
    if command_exists node; then
        NODE_VERSION=$(node -v)
        print_success "Node.js terinstall: $NODE_VERSION"
    else
        print_error "Node.js tidak ditemukan!"
        echo "Silakan install Node.js v16+ dari https://nodejs.org"
        exit 1
    fi
    
    # Check npm
    if command_exists npm; then
        NPM_VERSION=$(npm -v)
        print_success "npm terinstall: v$NPM_VERSION"
    else
        print_error "npm tidak ditemukan!"
        exit 1
    fi
    
    # Check Git
    if command_exists git; then
        GIT_VERSION=$(git --version)
        print_success "Git terinstall: $GIT_VERSION"
    else
        print_warning "Git tidak ditemukan. Beberapa fitur mungkin tidak tersedia."
    fi
    
    # Check disk space
    AVAILABLE_SPACE=$(df -h . | awk 'NR==2 {print $4}')
    print_success "Disk space tersedia: $AVAILABLE_SPACE"
    
    # Check memory
    if [[ "$OSTYPE" == "darwin"* ]]; then
        TOTAL_MEM=$(sysctl -n hw.memsize | awk '{print $0/1024/1024/1024 " GB"}')
    else
        TOTAL_MEM=$(free -h | awk '/^Mem:/ {print $2}')
    fi
    print_success "Memory total: $TOTAL_MEM"
}

# Function: Setup environment variables
setup_env() {
    echo -e "\n${PURPLE}🔧 Mengkonfigurasi Environment...${NC}\n"
    
    # Create .env file
    cat > .env << EOL
# Map Explorer Environment Configuration
REACT_APP_NAME=MapExplorer
REACT_APP_VERSION=1.0.0
REACT_APP_DESCRIPTION=Aplikasi Navigasi Modern

# API Keys (Opsional)
REACT_APP_OPENWEATHER_API_KEY=your_api_key_here
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here

# API Endpoints
REACT_APP_NOMINATIM_API=https://nominatim.openstreetmap.org
REACT_APP_OSRM_API=https://router.project-osrm.org
REACT_APP_OVERPASS_API=https://overpass-api.de/api

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_PUSH_NOTIFICATIONS=false
REACT_APP_ENABLE_OFFLINE_MODE=true

# Performance
REACT_APP_CACHE_DURATION=300
REACT_APP_MAX_SEARCH_RESULTS=20
REACT_APP_DEBOUNCE_DELAY=500
EOL
    
    print_success "File .env berhasil dibuat"
    
    # Create .env.example
    cp .env .env.example
    print_success "File .env.example berhasil dibuat"
}

# Function: Install dependencies
install_dependencies() {
    echo -e "\n${PURPLE}📦 Menginstall Dependencies...${NC}\n"
    
    # Clean install
    print_status "Membersihkan cache npm..."
    npm cache clean --force
    
    print_status "Menginstall dependencies utama..."
    npm install
    
    print_status "Menginstall dev dependencies..."
    npm install --save-dev \
        @testing-library/react \
        @testing-library/jest-dom \
        @testing-library/user-event \
        eslint \
        prettier \
        husky \
        lint-staged
    
    print_success "Semua dependencies berhasil diinstall"
}

# Function: Setup project configuration
setup_project() {
    echo -e "\n${PURPLE}⚙️  Mengkonfigurasi Project...${NC}\n"
    
    # Create necessary directories
    print_status "Membuat struktur direktori..."
    mkdir -p public/assets
    mkdir -p src/{components,hooks,services,utils,store,styles,assets}
    mkdir -p tests
    
    # Setup ESLint
    cat > .eslintrc.json << EOL
{
  "extends": [
    "react-app",
    "react-app/jest"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "warn",
    "react-hooks/exhaustive-deps": "warn"
  }
}
EOL
    
    # Setup Prettier
    cat > .prettierrc << EOL
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
EOL
    
    # Setup .gitignore
    cat > .gitignore << EOL
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build
/dist

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Cache
.cache/
.eslintcache
EOL
    
    print_success "Konfigurasi project berhasil"
}

# Function: Setup Git repository
setup_git() {
    echo -e "\n${PURPLE}📚 Setup Git Repository...${NC}\n"
    
    if command_exists git; then
        if [ ! -d .git ]; then
            git init
            print_success "Git repository diinisialisasi"
        else
            print_warning "Git repository sudah ada"
        fi
        
        # Setup git hooks dengan husky
        npx husky install
        npx husky add .husky/pre-commit "npx lint-staged"
        
        print_success "Git hooks berhasil dikonfigurasi"
    else
        print_warning "Git tidak tersedia, lewati setup git"
    fi
}

# Function: Build project
build_project() {
    echo -e "\n${PURPLE}🏗️  Build Project...${NC}\n"
    
    print_status "Menjalankan build production..."
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "Build berhasil! 🎉"
        print_status "File build tersedia di folder /build"
    else
        print_error "Build gagal!"
        exit 1
    fi
}

# Function: Run tests
run_tests() {
    echo -e "\n${PURPLE}🧪 Menjalankan Tests...${NC}\n"
    
    npm test -- --watchAll=false --passWithNoTests
    
    if [ $? -eq 0 ]; then
        print_success "Semua tests berhasil! ✅"
    else
        print_warning "Beberapa tests gagal, periksa kembali"
    fi
}

# Function: Start development server
start_dev() {
    echo -e "\n${PURPLE}🚀 Memulai Development Server...${NC}\n"
    
    print_status "Server akan berjalan di http://localhost:3000"
    print_status "Tekan Ctrl+C untuk menghentikan server"
    
    sleep 2
    npm start
}

# Function: Show help
show_help() {
    echo -e "\n${CYAN}📖 Penggunaan:${NC}"
    echo "  ./install.sh [options]"
    echo ""
    echo -e "${CYAN}Options:${NC}"
    echo "  -h, --help        Tampilkan bantuan"
    echo "  -i, --install     Install dependencies saja"
    echo "  -b, --build       Build production"
    echo "  -t, --test        Jalankan tests"
    echo "  -d, --dev         Jalankan development server"
    echo "  -f, --full        Full setup (default)"
    echo ""
    echo -e "${CYAN}Contoh:${NC}"
    echo "  ./install.sh --full       # Setup lengkap"
    echo "  ./install.sh -d           # Langsung jalankan dev server"
    echo "  ./install.sh -i           # Install dependencies saja"
}

# Main installation process
main() {
    case "$1" in
        -h|--help)
            show_help
            exit 0
            ;;
        -i|--install)
            check_requirements
            install_dependencies
            exit 0
            ;;
        -b|--build)
            check_requirements
            install_dependencies
            build_project
            exit 0
            ;;
        -t|--test)
            check_requirements
            run_tests
            exit 0
            ;;
        -d|--dev)
            check_requirements
            install_dependencies
            start_dev
            exit 0
            ;;
        -f|--full|*)
            echo -e "\n${GREEN}🔥 Memulai Full Setup Map Explorer...${NC}\n"
            
            # Step 1: Check requirements
            check_requirements
            
            # Step 2: Setup environment
            setup_env
            
            # Step 3: Install dependencies
            install_dependencies
            
            # Step 4: Setup project
            setup_project
            
            # Step 5: Setup Git
            setup_git
            
            # Step 6: Run tests
            run_tests
            
            # Step 7: Build
            build_project
            
            echo -e "\n${GREEN}"
            echo "╔══════════════════════════════════════════════════════════╗"
            echo "║                                                          ║"
            echo "║     ✨ Setup Selesai! ✨                                ║"
            echo "║                                                          ║"
            echo "║     📁 Project siap digunakan                           ║"
            echo "║     🚀 jalankan 'npm start' untuk development           ║"
            echo "║     📦 jalankan 'npm run build' untuk production        ║"
            echo "║                                                          ║"
            echo "║     📖 Baca README.md untuk dokumentasi lengkap         ║"
            echo "║                                                          ║"
            echo "╚══════════════════════════════════════════════════════════╝"
            echo -e "${NC}"
            
            # Ask to start dev server
            read -p "Mulai development server sekarang? (y/N) " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                start_dev
            fi
            ;;
    esac
}

# Run main function
main "$@"
