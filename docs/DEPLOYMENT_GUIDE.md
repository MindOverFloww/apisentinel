# API Sentinel — Cloud Deployment Guide (Free-Tier Stack)

This guide walks you through deploying **API Sentinel** on free-tier cloud platforms:
* **PostgreSQL Database:** Supabase or Neon (Managed PostgreSQL, Free)
* **Backend:** Render or Railway (Spring Boot Java 21 Web Service, Free)
* **Frontend:** Vercel or Render Static Site (React + Vite, Free)

---

## Architecture Overview

```mermaid
graph LR
    Client[Browser / User] -->|HTTPS| Frontend[Vercel / Render Static Site\nReact + Vite]
    Frontend -->|REST API + JWT| Backend[Render Web Service\nSpring Boot 3 + Java 21]
    Backend -->|JDBC over SSL| Database[(Supabase / Neon\nPostgreSQL 16/17)]
```

---

## Step 1: Deploy Database (Supabase or Neon)

### Using Supabase (Recommended):
1. Go to [https://supabase.com](https://supabase.com) and create a free project named `api-sentinel`.
2. Set a strong database password (e.g. `your_db_password`).
3. Under **Project Settings -> Database -> Connection string (URI)**, copy the URI:
   ```
   postgresql://postgres.[project-ref]:[your_password]@aws-0-[region].pooler.supabase.com:5432/postgres
   ```
4. In the Supabase **SQL Editor**, run the contents of [`backend/src/main/resources/seed_users.sql`](file:///home/deveshjangid/Documents/All%20work/college/Sentinel/Sentinel-API/backend/src/main/resources/seed_users.sql) to seed `admin`, `analyst`, and `viewer`.

---

## Step 2: Deploy Backend (Render Web Service)

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "Prepare cloud deployment configs"
   git push origin main
   ```
2. Go to [https://render.com](https://render.com) and click **New + -> Web Service**.
3. Connect your GitHub repository.
4. Configure the settings:
   * **Name:** `api-sentinel-backend`
   * **Root Directory:** `backend`
   * **Runtime:** `Docker` (Render automatically detects `backend/Dockerfile`)
   * **Instance Type:** `Free`
5. Under **Environment Variables**, add:
   * `DB_URL` = `jdbc:postgresql://[supabase-host]:5432/postgres?sslmode=require`
   * `DB_USERNAME` = `postgres` (or your Supabase user)
   * `DB_PASSWORD` = `[your-db-password]`
   * `JWT_SECRET` = `ceaORHQkCSVkA61jpJCseSyBBUETzibdu4uSPK9InlgyIBeRsSxQyV+bet+vhOrn`
   * `SERVER_PORT` = `8080`
6. Click **Deploy Web Service**.
7. Once deployed, Render will provide a live URL, e.g.:
   `https://api-sentinel-backend.onrender.com`

---

## Step 3: Deploy Frontend (Vercel)

1. Go to [https://vercel.com](https://vercel.com) and click **Add New -> Project**.
2. Import your GitHub repository.
3. Configure project settings:
   * **Framework Preset:** `Vite`
   * **Root Directory:** `frontend`
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
4. Under **Environment Variables**, add:
   * `VITE_API_BASE_URL` = `https://api-sentinel-backend.onrender.com/api`
5. Click **Deploy**.
6. Vercel will give you a public URL (e.g. `https://api-sentinel.vercel.app`).

---

## Step 4: Verification

1. Open your Vercel URL in your browser.
2. The sign-in page will load directly.
3. Log in with:
   * **Username:** `admin`
   * **Password:** `admin123`
4. Navigate to **Traffic**, **Incidents**, and **Rules** to see live synchronization across the cloud database.
5. In terminal, test a cloud attack simulation:
   ```bash
   curl "https://api-sentinel-backend.onrender.com/api/demo/products?search=%27%20OR%20%271%27=%271"
   ```
   Check your live Vercel dashboard — the SQL injection incident will pop up immediately!
