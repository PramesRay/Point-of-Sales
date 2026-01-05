# Point-of-Sales (Frontend) — Restaurant POS Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![GitHub Repo](https://img.shields.io/badge/repo-Point--of--Sales-blue?style=for-the-badge)](https://github.com/PramesRay/Point-of-Sales)

Frontend application for the multi-branch Restaurant Point-of-Sales (POS) and Operational Management System used for the thesis project “Nasi Uduk Remaja Cikini Haji Sawid”.  
Repository includes `src/`, `public/`, `package.json` and typical Vite + Vue project files.



## Demo / Preview
- [Preview Internal App](https://internalposnurchs.up.railway.app/)
- [Preview Customer App](https://nurchs.up.railway.app/)

## Tech Stack

### Main
* [![Vue.js](https://img.shields.io/badge/vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)](https://vuejs.org/)
* [![Vuetify](https://img.shields.io/badge/vuetify-1867C0?style=for-the-badge&logo=vuetify&logoColor=white)](https://vuetifyjs.com/)
* [![Vite](https://img.shields.io/badge/vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
* [![TypeScript](https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

### State & HTTP
* [![Pinia](https://img.shields.io/badge/pinia-4A78B0?style=for-the-badge&logo=pinia&logoColor=white)](https://pinia.vuejs.org/)
* [![Axios](https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)

### Auth & Payments
* [![Firebase](https://img.shields.io/badge/firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
* [![Midtrans](https://img.shields.io/badge/midtrans-00AEEF?style=for-the-badge&logoColor=white)](https://midtrans.com/)

### Utilities & Charts
* [![Day.js](https://img.shields.io/badge/day.js-FF5F5F?style=for-the-badge&logo=javascript&logoColor=white)](https://day.js.org/)
* [![Lodash](https://img.shields.io/badge/lodash-3492FF?style=for-the-badge&logo=lodash&logoColor=white)](https://lodash.com/)
* [![ApexCharts](https://img.shields.io/badge/apexcharts-5E2EC7?style=for-the-badge&logo=apexcharts&logoColor=white)](https://apexcharts.com/)

### Dev tooling
* [![ESLint](https://img.shields.io/badge/eslint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
* [![Prettier](https://img.shields.io/badge/prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white)](https://prettier.io/)
* [![Docker](https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)



## Table of contents

- [Getting Started](#getting-started)  
- [Environment Variables](#environment-variables)  
- [Project Structure](#project-structure)  
- [Author](#author)  
- [License](#license)



## Getting Started

**Clone repository**

```bash
git clone https://github.com/PramesRay/Point-of-Sales.git
cd Point-of-Sales
```

**Install dependencies**
```bash
npm install
# or
yarn install
```

**Run in development**
```bash
npm run dev
# or
yarn dev
```

**Build for production**
```bash
npm run build
# or
yarn build
```

## Environment Variables
Create a `.env` (or `.env.local`) file in project root with at least:
```env
# ===============================
# Application Configuration
# ===============================
VITE_NODE_ENV=development
VITE_PORT=5173

# ===============================
# API Configuration
# ===============================
VITE_API_URL=https://api.your-domain.com

# ===============================
# Firebase Configuration (Production)
# ===============================
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# ===============================
# Firebase Configuration (Development)
# ===============================
VITE_FIREBASE_API_KEY_DEV=your_firebase_api_key_dev
VITE_FIREBASE_AUTH_DOMAIN_DEV=your_project_dev.firebaseapp.com
VITE_FIREBASE_PROJECT_ID_DEV=your_firebase_project_id_dev
VITE_FIREBASE_STORAGE_BUCKET_DEV=your_project_dev.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID_DEV=your_messaging_sender_id_dev
VITE_FIREBASE_APP_ID_DEV=your_firebase_app_id_dev

# ===============================
# Payment Gateway (Midtrans)
# ===============================
VITE_MIDTRANS_CLIENT_KEY_DEV=your_midtrans_client_key_dev
```

## Project Structure
```sh
Point-of-Sales/
├── public/                # Static assets (icons, favicon)
├── src/
│   ├── assets/            # Static assets (images, icons)
│   ├── components/        # Reusable UI components
│   ├── composables/       # Vue composables (logic reuse)
│   ├── layouts/           # Application layouts
│   ├── plugins/           # Plugin initialization (Vuetify, etc.)
│   ├── router/            # Vue Router configuration
│   ├── scss/              # Global SCSS styles
│   ├── services/          # API service layer (Axios, fetch wrapper)
│   ├── stores/            # State management (Pinia stores)
│   ├── theme/             # Theme configuration (Vuetify / Berry)
│   ├── types/             # Global TypeScript types & interfaces
│   ├── utils/             # Utility/helper functions
│   ├── views/             # Page-level components (routes)
│   ├── App.vue            # Root Vue component
│   ├── main.ts            # Application entry point
│   └── config.ts          # Global application configuration
├── index.html
├── package.json
└── README.md
```

## Key Features (Frontend)

- Role-based dashboards (Owner, Finance, Cashier, Kitchen, Warehouse)
- QR-code ordering flow for customers (public facing)
- Real-time like UX with frequent polling or reactive UI updates
- Inventory & stock request forms and approval flows
- Shift management UI (start / end / status)
- Reservation calendar and management UI
- Fund request forms & status tracking
- Charts & KPI widgets using ApexCharts
- Global overlay manager for modals and forms
- Centralized alert/toast system (Pinia store)

## Author

### Prames Ray Lapian
Informatics Engineering Universitas Padjadjaran


## License
This project is licensed under the MIT License.
See the LICENSE file for details.
