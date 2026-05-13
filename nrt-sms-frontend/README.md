# NRT-SMS Clone

Local clone of the NRT-SMS platform — a React-based SMS/WhatsApp campaign management dashboard. Frontend + backend run entirely locally.

## Quick Start

```bash
npm install
cd server && npm install && cd ..
npm run dev:full
```

Open http://localhost:5173

## Login

| Field    | Value                |
| -------- | -------------------- |
| Username | `BhanusamajAarogyam` |
| Password | `Newrise_64554`      |

## Scripts

| Command            | Description                    |
| ------------------ | ------------------------------ |
| `npm run dev`      | Start Vite frontend (port 5173) |
| `npm run server`   | Start mock backend (port 5000)  |
| `npm run dev:full` | Run both concurrently           |
| `npm run build`    | Type-check + production build   |

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **Redux Toolkit** (auth state, SMS state)
- **React Router v7** (nested layouts, protected routes)
- **Bootstrap 5** + **reactstrap** (UI)
- **Font Awesome** (icons)
- **Recharts** (charts)
- **react-toastify** (toast notifications)
- **Axios** (HTTP client with JWT interceptor)
- **Express.js** (mock backend)
- **SCSS** (custom theming)

## Project Structure

```
nrt-sms-frontend/
├── server/
│   └── index.js            # Mock Express backend (100+ endpoints)
├── src/
│   ├── api/
│   │   ├── axiosInstance.ts # Axios config with JWT interceptor
│   │   ├── authApi.ts       # Auth API calls
│   │   └── smsApi.ts        # SMS API calls
│   ├── assets/scss/         # Custom SCSS (variables, sidebar, auth, dashboard)
│   ├── components/
│   │   ├── CrudModal.tsx    # Generic add/edit modal + ConfirmModal
│   │   ├── Header.tsx        # Top navbar
│   │   ├── Loading.tsx       # Loading spinner
│   │   ├── PageHeader.tsx    # Page title + actions row
│   │   ├── PaginationBar.tsx # Reusable pagination
│   │   └── StatsCard.tsx     # Dashboard stat card
│   ├── layouts/
│   │   ├── MainLayout.tsx   # Sidebar + header + footer + Outlet
│   │   └── Sidebar.tsx      # Collapsible navigation
│   ├── pages/               # 17 pages across 12 feature directories
│   ├── store/
│   │   ├── index.ts         # Redux store config
│   │   └── slices/          # authSlice, smsSlice
│   ├── types/index.ts       # TypeScript interfaces
│   └── utils/
│       ├── constants.ts      # API URL, sidebar config
│       ├── downloadSample.ts # CSV sample file generator
│       ├── helpers.ts        # formatDate, formatCredits, etc.
│       └── toast.ts          # Toast notification helpers
```

## Pages

| Page               | Route                | Features                                       |
| ------------------ | -------------------- | ---------------------------------------------- |
| Dashboard          | `/`                  | Stats cards, recent SMS, quick actions          |
| Send SMS           | `/sms/send`          | Compose form, sender ID select, recent messages |
| Two Way SMS        | `/sms/two-way`       | Two-way comm table with pagination              |
| Send WhatsApp      | `/whatsapp/send`     | WhatsApp message compose                        |
| WhatsApp Templates | `/whatsapp/templates`| Template cards, CRUD modals, sample download    |
| WhatsApp Config    | `/whatsapp/config`   | Account configs, add/remove                     |
| DLT Templates      | `/dlt`               | Template table, CRUD, import, sample download   |
| Sender ID          | `/sender`            | Sender ID list, add/delete, sample download     |
| Phonebook          | `/contacts/phonebook`| Contacts table, search, CRUD, import, sample    |
| Groups             | `/contacts/groups`   | Group cards, create group                       |
| Campaigns          | `/campaigns`         | Campaign table, progress bars, polling, delete  |
| Reports Summary    | `/reports/summary`   | Overview stats, delivery report, export CSV     |
| Detailed Report    | `/reports/detailed`  | Filtered report, pagination, export CSV         |
| Users              | `/users`             | User table, CRUD, search, role select           |
| Roles              | `/roles`             | Role cards with permissions, create role        |
| Settings           | `/settings`          | App settings form, gateway config               |
| Account Settings   | `/account-setting`   | Profile update, password change                 |

## API

Mock backend on port 5000 with 100+ REST endpoints for SMS, WhatsApp, DLT, contacts, campaigns, reports, users, roles, and settings. JWT auth with 24h token expiry.
