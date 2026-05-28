# Ecommerce Cart Module

A small ecommerce shopping cart module built with **FastAPI + SQLModel** on the backend and **Next.js** on the frontend. The module supports basic cart operations and demonstrates clean API design, separation of concerns, and modern best practices.

This project was implemented as a technical assessment and intentionally keeps the setup lightweight while remaining production‑minded.

---

## Features

### Shopping Cart

* Add an item to the cart
* Update an item in the cart
* Remove an item from the cart
* Retrieve all items in the cart

### Reporting (Basic)

* Retrieve cart items and compute totals (quantity and price) on the frontend

---

## Tech Stack

### Backend

* **FastAPI** – API framework
* **SQLModel** – ORM & schema validation
* **SQLite** – Lightweight temporary database
* **Uvicorn** – ASGI server

### Frontend

* **Next.js (App Router)**
* **TypeScript**
* **Fetch API** for backend communication

---

## Project Structure

```
ecommerce-cart/
├── backend/
│   └── app/
│       ├── __init__.py
│       ├── main.py
│       ├── database.py
│       ├── models.py
│       └── routes/
│           ├── __init__.py
│           └── cart.py
│
├── frontend/
│   ├── app/
│   │   └── cart/page.tsx
│   ├── components/
│   │   └── Cart.tsx
│   └── services/
│       └── cartApi.ts
│
└── README.md
```

---

## Backend Overview

The backend exposes a REST API that manages cart state. It uses SQLite for persistence and FastAPI lifespan events for initialization.

### Key Design Decisions

* **SQLite** is used to keep setup simple and reproducible
* Business logic is kept separate from routes
* UUIDs are used for item identifiers
* Lifespan handlers replace deprecated startup events

### API Endpoints

| Method | Endpoint           | Description                  |
| ------ | ------------------ | ---------------------------- |
| POST   | `/cart/items`      | Add an item to the cart      |
| GET    | `/cart/items`      | Retrieve all cart items      |
| PUT    | `/cart/items/{id}` | Update an item in the cart   |
| DELETE | `/cart/items/{id}` | Remove an item from the cart |
| GET    | `/health`          | Health check                 |

---

## Frontend Overview

The frontend consumes the backend API and displays cart data. It does not own cart state permanently; instead, it fetches data from the backend and renders it.

### Responsibilities

* Fetch cart items from the backend
* Display cart contents
* Trigger add, update, and delete actions
* Compute basic reporting (total quantity and price)

---

## Running the Project Locally

### Prerequisites

* Python 3.10+
* Node.js 18+

---

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend will be available at:

* API: [http://localhost:8000](http://localhost:8000)
* Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at:

* [http://localhost:3000](http://localhost:3000)

---

## Notes & Tradeoffs

* Cart items are not scoped per user for simplicity
* No authentication was added as it was outside the assessment scope
* In a production system, the cart would likely be stored in Redis or a database per user session
* SQLite can easily be swapped for PostgreSQL with minimal changes

---

## Assessment Rationale

This implementation prioritizes:

* Clean architecture
* Readability
* Correct REST semantics
* Modern FastAPI best practices

The goal was to demonstrate strong engineering judgment rather than over‑engineering the solution.

---

## Future Improvements

* User‑scoped carts
* Redis‑backed cart storage
* Cart summary endpoint
* Authentication and authorization
* Dockerized setup

---

## Author

**Victor Ogunsusi**
Software Engineer
