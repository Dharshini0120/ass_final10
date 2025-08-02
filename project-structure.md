healthcare-assessment/
├── apps/
│   ├── user-portal/                 # Patient/User facing app
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── globals.css
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── dashboard/
│   │   │   │   ├── appointments/
│   │   │   │   └── profile/
│   │   │   └── components/
│   │   ├── tailwind.config.js
│   │   └── next.config.js
│   │
│   └── admin-portal/                # Admin/Healthcare provider app
│       ├── src/
│       │   ├── app/
│       │   │   ├── globals.css
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx
│       │   │   ├── patients/
│       │   │   ├── assessments/
│       │   │   └── analytics/
│       │   └── components/
│       ├── tailwind.config.js
│       └── next.config.js
│
├── libs/
│   ├── shared-theme/               # Centralized theming
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── mui-theme.ts
│   │   │   ├── tailwind-config.ts
│   │   │   └── colors.ts
│   │
│   ├── shared-ui/                  # Reusable UI components
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── components/
│   │   │   │   ├── Button/
│   │   │   │   ├── Card/
│   │   │   │   ├── Form/
│   │   │   │   └── Layout/
│   │
│   ├── shared-utils/               # Common utilities
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── api/
│   │   │   ├── helpers/
│   │   │   └── hooks/
│   │
│   └── shared-types/               # TypeScript types
│       ├── src/
│       │   ├── index.ts
│       │   ├── user.types.ts
│       │   ├── assessment.types.ts
│       │   └── api.types.ts