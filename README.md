# Nexus — Personal Finance

> Finance platform with biometric/passkey WebAuthn login, budgets, AI finance coach, admin dashboard with roles, and email OTP.


---

## 📸 Screenshot


> Replace `screenshot.png` with an actual screenshot of your app running locally or on the live demo.

---

## 🚀 Features

- 🔐 **Biometric / Passkey Login** — WebAuthn authentication (no passwords)
- 📧 **Email OTP** — one-time password verification
- 💰 **Budgets** — set and track spending limits
- 🤖 **AI Finance Coach** — personalized financial guidance
- 👥 **Admin Dashboard** — role-based admin & user management
- 🌍 **Multi-Currency** — support for multiple currencies
- 📊 **Analytics Charts** — visualize income, expenses, and savings
- 🐘 **Laravel API + React + TypeScript** — type-safe full-stack architecture

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript + Vite |
| Backend | Laravel 11 (PHP) |
| Database | MySQL |
| Authentication | WebAuthn (Passkeys) + Email OTP |
| Styling | Tailwind CSS |
| Charts | Chart.js / Recharts |

---

## 📦 Installation

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+ & npm
- MySQL 8.0+

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/ZinMinHtet22/Personal-Finance-.git
cd Personal-Finance-/nexus-backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your database in .env
# DB_DATABASE=nexus
# DB_USERNAME=root
# DB_PASSWORD=

# Run migrations
php artisan migrate

# (Optional) Seed database
php artisan db:seed

# Start Laravel development server
php artisan serve
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd ../nexus-frontend

# Install dependencies
npm install
# or: pnpm install

# Start development server
npm run dev
# or: pnpm dev

# Build for production
npm run build
```

---

## 🌐 Live Demo

🔗 [https://nexus-frontend-tau-three.vercel.app](https://nexus-frontend-tau-three.vercel.app)

---

## 🔐 Environment Variables

Create a `.env` file in `nexus-backend/` based on `.env.example`. Key variables:

| Variable | Description |
|----------|-------------|
| `APP_KEY` | Laravel application key (auto-generated) |
| `DB_DATABASE` | MySQL database name |
| `DB_USERNAME` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `MAIL_*` | Mail settings for OTP emails |

> ⚠️ Never commit your actual `.env` file. It is gitignored.

---

## 📁 Project Structure

```
Personal-Finance-/
├── nexus-backend/
│   ├── app/
│   ├── config/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   ├── .env.example
│   ├── composer.json
│   └── artisan
├── nexus-frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── README.md
└── LICENSE
```

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Jeffery Zin Min Htet**  
Full-Stack Developer | IT Engineer | Content Developer  
Yangon, Myanmar  
- GitHub: [@ZinMinHtet22](https://github.com/ZinMinHtet22)
- LinkedIn: [zin-min-htet-a167b42b5](https://linkedin.com/in/zin-min-htet-a167b42b5)
- Email: jefferyyas8@gmail.com

---

> ⭐ Star this repo if you find it useful!