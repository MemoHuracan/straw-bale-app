# Straw Bale App 🐂🌾

A **Next.js MVP web application** built to track straw bale usage across feedlot pens.  
This project connects **feed alleys**, **pens**, and **inventory management** into a single dashboard.

---

## ✨ Features
- 📍 **Dynamic routes** for alleys and pens (`/pens/[alley]` → `/pens/[alley]/[pen]`).
- 📊 **Global state management** with React Context API.
- ➕➖ **Add / remove bales** per pen (with inventory validation).
- 🔄 **Reset pen** and **reset alley** actions.
- 📦 **Inventory page** with live updates and item creation.
- 🎨 **Responsive grid-based UI** for alleys and pens.

---

## 🛠 Tech Stack
- [Next.js 14](https://nextjs.org/)
- React (Client Components + Context API)
- CSS (custom styles in `globals.css`)
-  (MVP prototype)

---

## 📷 Screenshots
_Add screenshots here (pens view, alley view, inventory page, etc.)_

---

## 🚜 Why this project?
Managing straw bales at scale in a feedlot can be error-prone and time-consuming.  
This MVP demonstrates how a digital dashboard can:
- Keep track of bales assigned per pen.
- Automatically update inventory levels.
- Provide a cleaner overview compared to paper or manual logs.

---

## 🚀 Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/MemoHuracan/straw-bale-app.git
cd straw-bale-app
npm install
npm run dev
