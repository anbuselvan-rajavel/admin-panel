
```
admin-panel
├─ .env.local
├─ .env.production
├─ .eslintrc.json
├─ app
│  ├─ api
│  │  ├─ employees
│  │  │  ├─ route.tsx
│  │  │  └─ [id]
│  │  │     └─ route.tsx
│  │  └─ swagger
│  │     └─ route.tsx
│  ├─ components
│  │  ├─ (forms)
│  │  │  ├─ EmployeeFilterForm.tsx
│  │  │  ├─ UnifiedEmployeeForm.tsx
│  │  │  ├─ UserCreateForm.tsx
│  │  │  └─ UserFilterForm.tsx
│  │  ├─ FilterSidebar.tsx
│  │  ├─ Layout.tsx
│  │  ├─ Sidebar.tsx
│  │  └─ TitleBarActions.tsx
│  ├─ docs
│  │  └─ page.tsx
│  ├─ employees
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  └─ title.tsx
│  ├─ favicon.ico
│  ├─ fonts
│  │  ├─ GeistMonoVF.woff
│  │  └─ GeistVF.woff
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ schema
│  │  ├─ employeeSchema.tsx
│  │  └─ filterFormSchema.tsx
│  ├─ settings
│  │  └─ page.tsx
│  ├─ title.tsx
│  └─ users
│     ├─ layout.tsx
│     ├─ page.tsx
│     └─ Title.tsx
├─ docker-compose.yml
├─ Dockerfile
├─ lib
│  ├─ db.ts
│  └─ swagger.ts
├─ middleware.ts
├─ next-env.d.ts
├─ next.config.js
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ prisma
│  ├─ migrations
│  │  ├─ 20241108122515_update_post_model
│  │  │  └─ migration.sql
│  │  ├─ 20241109044011_init
│  │  │  └─ migration.sql
│  │  ├─ 20241126103555_update_employee_model
│  │  │  └─ migration.sql
│  │  ├─ 20241126111046_init
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  ├─ schema.prisma
│  └─ seed.ts
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ tailwind.config.ts
├─ tsconfig.json
└─ types
   └─ employee.d.ts

```