# SSIMP - Smart Sugar Industry Management Platform

A comprehensive management system for the sugar industry ecosystem, integrating sugarcane procurement, production, ethanol distillation, and power generation with real-time AI-based predictions and blockchain transparency.

## Features

- **Farmer Management**: Track farmer registrations, deliveries, and payments with blockchain-secured records
- **Smart Logistics**: Real-time truck tracking and route optimization
- **Production Monitoring**: IoT-based equipment monitoring and predictive maintenance
- **Distillery Operations**: Ethanol production tracking and quality control
- **Power Plant Management**: Co-generation power monitoring and distribution
- **Sustainability Tracking**: Carbon credits and environmental impact monitoring

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Radix UI, Tailwind CSS, shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 16+ or Bun runtime
- npm, yarn, or bun package manager

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd CANE-MANAGEMENT-PROJECT-CLEAN
```

2. Install dependencies
```bash
npm install
# or
yarn install
# or
bun install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

4. Open your browser and navigate to `http://localhost:8080`

### Build for Production

```bash
npm run build
# or
yarn build
# or
bun build
```

## Project Structure

```
CANE-MANAGEMENT-PROJECT-CLEAN/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── DashboardCard.tsx
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   ├── pages/            # Page components
│   │   ├── Overview.tsx
│   │   ├── Farmers.tsx
│   │   ├── Logistics.tsx
│   │   ├── Production.tsx
│   │   ├── Distillery.tsx
│   │   ├── PowerPlant.tsx
│   │   ├── Sustainability.tsx
│   │   └── NotFound.tsx
│   ├── data/             # Data utilities and mock APIs
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tailwind.config.ts   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## License

Proprietary - All rights reserved

## Contact

For more information, please contact the development team.
