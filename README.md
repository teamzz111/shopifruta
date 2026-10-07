# ShopiFruta

[![CI](https://github.com/teamzz111/shopifruta/actions/workflows/ci.yml/badge.svg)](https://github.com/teamzz111/shopifruta/actions/workflows/ci.yml)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-3-6E9F18?logo=vitest&logoColor=white)
![Storybook](https://img.shields.io/badge/Storybook-8-FF4785?logo=storybook&logoColor=white)

ShopiFruta is a fruit e-commerce front end. It has a customer storefront and an admin dashboard. The code follows **Clean Architecture**: domain entities, repository interfaces and use cases know nothing about React, and a small typed **dependency injection container** wires them to concrete infrastructure. The UI is built from a shared, Storybook-documented component library that lives in the same Yarn Workspaces monorepo.

The user interface is in Spanish, and prices are in Colombian pesos with per-product tax rates.

## Features

- **Role-based access.** Log in as a *client* or an *admin* (role selection, no password), with protected routes for each role.
- **Product catalog.** 15 seeded products in three categories, with live stock levels persisted in `localStorage`.
- **Shopping cart.** Add, update and remove items. Stock is reserved when an item is added and restored when it is removed or the quantity drops.
- **Checkout.** Validated shipping form (name, phone, email, country). The country must be in the Americas, which is checked against the [REST Countries API](https://restcountries.com). Subtotal, per-item tax and total are calculated at checkout, and placing an order generates an invoice.
- **Customer invoices.** Clients see their own purchase history, matched by email, and can open each invoice's details in a modal.
- **Admin dashboard.** Total sales, number of invoices, units sold and unique customers, plus a list of every invoice with a detail view.
- **Responsive layout.** Tailwind CSS with a mobile navigation menu.

## Architecture

The app in `apps/ecommerce-app` is split into layers. Dependencies only point inward:

```
┌──────────────────────────────────────────────────────────────┐
│ Presentation   screens · presenters (hooks) · shared UI      │
│                Zustand stores                                │
└──────────────────────────────┬───────────────────────────────┘
                               │ container.resolve("...Actions")
┌──────────────────────────────▼───────────────────────────────┐
│ DI container   src/di/container.ts (composition root)        │
└──────────────────────────────┬───────────────────────────────┘
                               │ constructor injection
┌──────────────────────────────▼───────────────────────────────┐
│ Application    Actions (facades) → Use cases                 │
└──────────────────────────────┬───────────────────────────────┘
                               │ depends on interfaces only
┌──────────────────────────────▼───────────────────────────────┐
│ Domain         Entities · Repository interfaces              │
└──────────────────────────────▲───────────────────────────────┘
                               │ implements
┌──────────────────────────────┴───────────────────────────────┐
│ Infrastructure localStorage repositories · REST Countries    │
└──────────────────────────────────────────────────────────────┘
```

| Layer | Location | Responsibility |
| --- | --- | --- |
| Domain | `src/core/domain` | Entities (`Product`, `Invoice`, `Country`) and repository interfaces (`ProductRepository`, `InvoiceRepository`, `CountryRepository`). |
| Use cases | `src/core/useCases` | One class per operation, such as `GetInvoicesUseCase`, `CreateInvoiceUseCase`, `UpdateStockUseCase`, `GetInvoiceStatisticsUseCase` and `IsValidCountryInRegionUseCase`. Each receives its repository through the constructor. |
| Actions | `src/core/actions` | Facades (`ProductActions`, `InvoiceActions`, `CountryActions`) that group related use cases into a single entry point for the UI. |
| Infrastructure | `src/infraestructure`, plus the repository implementations | `ProductLocalStorageRepository` and `InvoiceLocalStorageRepository` persist to `localStorage`. `RemoteCountryRepository` calls the REST Countries API and caches results per region. |
| Presentation | `src/presentation`, `src/stores` | Screens contain only markup. Presenter hooks (`useCheckoutPresenter`, `useAdminPresenter`, …) hold the view logic. Zustand stores hold auth, cart, product and country state. |

### Dependency injection

`src/di/container.ts` is the single composition root. The container is typed against a `Dependencies` map, so `register` and `resolve` are checked at compile time:

```ts
class Container {
  register<K extends DependencyKeys>(key: K, instance: Dependencies[K]): void;
  resolve<K extends DependencyKeys>(key: K): Dependencies[K]; // throws if not registered
}
```

At startup, the container instantiates the repositories, injects them into the use cases, injects the use cases into the action facades, and registers everything. Stores and presenters only call `container.resolve("productActions" | "invoiceActions" | "countryActions")`, so they never import a concrete repository. To replace `localStorage` with a real API, you would write a new class that implements the repository interface and change one line in the container.

### Design patterns

- **Repository**: data access is hidden behind domain interfaces.
- **Use case / interactor**: each business operation is its own class.
- **Facade (Actions)**: gives the presentation layer one stable API per domain area.
- **Presenter (hooks)**: keeps view logic such as validation, totals and loading state out of the JSX.
- **Store**: global state with Zustand, using `persist` middleware for the session and the cart.

## UI component library

`apps/ui` (`@shopifruta/ui`) is a reusable component package built with Tailwind CSS and `class-variance-authority`, in the style of shadcn/ui:

- Components: `Button`, `Badge`, `Card` and `Modal`, with variants and sizes.
- Bundled with **tsup** into ESM and CJS with type declarations (`dist/`).
- Documented in **Storybook 8**, with stories for every component and Chromatic integration.
- Unit tested with Vitest and Testing Library.

The storefront uses it as a workspace dependency.

## Tech stack

| Area | Tools |
| --- | --- |
| UI | React 19, React Router 7, Tailwind CSS 4, Lucide icons |
| Language and build | TypeScript 5, Vite 6, tsup |
| State | Zustand 5 (with `persist`) |
| Testing | Vitest 3, Testing Library, jsdom |
| Component docs | Storybook 8, Chromatic |
| Quality | ESLint 9 (typescript-eslint, react-hooks), Prettier, Lefthook pre-push hook |
| Monorepo | Yarn Workspaces (Yarn 1) |
| CI | GitHub Actions (lint, test, build) |

## Project structure

```
.
├── apps/
│   ├── ecommerce-app/            # Storefront and admin dashboard
│   │   └── src/
│   │       ├── core/
│   │       │   ├── domain/
│   │       │   │   ├── entities/       # Product, Invoice, Country
│   │       │   │   └── repositories/   # Repository interfaces (+ invoice/country implementations)
│   │       │   ├── useCases/           # Products, Admin (invoices), Country, Stats
│   │       │   └── actions/            # Facades consumed by the UI
│   │       ├── di/container.ts         # Typed DI container / composition root
│   │       ├── infraestructure/        # localStorage product repository
│   │       ├── presentation/
│   │       │   ├── screen/             # Login, ProductList, Cart, Checkout, UserInvoice, AdminPanel, NotFound
│   │       │   ├── presenter/          # View-logic hooks per screen
│   │       │   └── shared/             # Navbar, ProductCard, Notification
│   │       ├── stores/                 # Zustand stores (auth, cart, products, countries)
│   │       ├── utils/                  # ProtectedRoute, helpers
│   │       └── __tests__/              # Checkout screen tests
│   └── ui/                       # @shopifruta/ui component library
│       ├── src/components/       # Button, Badge, Card, Modal
│       ├── src/__test__/         # Component tests
│       └── stories/              # Storybook stories
├── .github/workflows/ci.yml
├── lefthook.yml
└── package.json                  # Workspaces and root scripts
```

## Getting started

### Prerequisites

- Node.js 18 or later
- Yarn 1.22

### Install and run

```bash
git clone https://github.com/teamzz111/shopifruta.git
cd shopifruta
yarn install
yarn dev
```

The app runs at http://localhost:5173. Choose a role on the login screen to start.

### Scripts (from the repo root)

| Command | Description |
| --- | --- |
| `yarn dev` | Start the storefront dev server (Vite). |
| `yarn build` | Build the UI library, then type-check and build the storefront. |
| `yarn lint` | Run ESLint on the storefront. |
| `yarn test` | Run the UI library and storefront test suites. |
| `yarn storybook` | Start Storybook for the component library on port 6006. |

Each workspace also has its own scripts. For example, `yarn workspace @shopifruta/ecommerce-app test:watch` and `test:coverage`, and `yarn workspace @shopifruta/ui build-storybook`. To publish Storybook with `yarn workspace @shopifruta/ui chromatic`, set the `CHROMATIC_PROJECT_TOKEN` environment variable first.

## Testing

Tests run with **Vitest** in a jsdom environment, using **Testing Library**:

- `apps/ecommerce-app/src/__tests__/checkout.test.tsx`: tests for the checkout screen. They cover rendering the form, showing the price summary, handling user input and submitting the form. The Zustand stores, the router and the checkout presenter are mocked, so the view is tested on its own.
- `apps/ui/src/__test__/`: component tests for `Button` (variants, sizes, disabled state) and `Badge`.

```bash
yarn test
```

CI runs lint, tests and the production build on every push and pull request to `main`.
