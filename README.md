# 📱 MobileShop
 
A full-stack mobile device e-commerce platform built with React, Node.js, PostgreSQL and Docker.
 
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=flat&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker)
 
---
 
## Overview
 
MobileShop allows guests to browse mobile devices, registered customers to purchase them, and admins to manage products, prices, stock and orders. The entire application runs in Docker — no local setup required beyond Docker itself.
 
---
 
## Tech Stack
 
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js 22 + Express 5 |
| Database | PostgreSQL 15 |
| Auth | JWT + bcrypt |
| Containerization | Docker + Docker Compose |
 
---
 
## Features
 
- Product browsing with brand filtering
- Shopping cart with stock validation
- Order placement and history
- JWT authentication and role-based access control
- Admin panel — manage products, prices, stock and orders
- Fully containerized — single command setup
---
 
## Prerequisites
 
- [Docker](https://docs.docker.com/get-docker/) v20+
- [Docker Compose](https://docs.docker.com/compose/) v2+
- [Git](https://git-scm.com/)
> Node.js is **not** required locally.
 
---
 
## Installation
 
```bash
# 1. Clone the repository
git clone <repository-url>
cd mobile-webshop
 
# 2. Create environment file
cp .env.example .env
# Edit .env with your values — DB_NAME, DB_USER, DB_PASSWORD, PORT, JWT_SECRET
 
# 3. Start the application
docker compose up --build
```
 
Open **http://localhost** in your browser.
 
**Demo accounts:**
 
| Role | Email | Password |
|------|-------|----------|
| Admin | jherbert@email.com | password123 |
| Customer | asmith@email.com | password123 |
 
---
 
> Full documentation in [`/docs`](./docs) — API reference, architecture, and design decisions.
 
**Bence** — MSc Programtervező informatikus, 2026