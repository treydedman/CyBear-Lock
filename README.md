# CyBear Lock

**CyBear Lock** is a sleek and secure password manager that makes it effortless to store and manage your login credentials. With end-to-end encryption and a clean, responsive UI, CyBear Lock helps you stay organized and frees up your mental storage — so you can remember the important stuff (like where you put your car keys), not 27 different passwords.


## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, PostgreSQL
- **Auth**: JSON Web Tokens (JWT), Argon2 password hashing
- **Encryption**: AES encryption via CryptoJS for stored passwords



## ✨ Features

- 🔐 Add and manage encrypted password entries
- 🔍 Instant guest sign-in for a fully interactive demo
- 📱 Responsive layout (mobile-first)
- ❌ Guest accounts are restricted from sensitive actions like password reset and account deletion

## 🚀 Live Demo & Guest Experience

Try the Live version deployed to AWS:

### Curious how it works? 

Click **"Sign in as Guest"** and you'll be dropped into a full-featured demo environment with sample password entries like:

- `github.com` – Username: `KeepPushing` / Password: `commit2chaos`
- `canva.com` – Username: `AlmostOriginal` / Password: `ctrlC-ctrlV`
- `indeed.com` – Username: `HireMePls` / Password: `resume=Spam!`

#### ⚠️ The Guest account **cannot** reset its password or delete the account — but everything else is fair game, so please enjoy exploring!

---

### Want a personalized or custom experience? 

Create your own account and add password entries to examine and traverse the app.


---

## 🧪 Local Setup

1. Clone the repo:  
   `git clone https://github.com/treydedman/cybear-lock.git`
2. Install dependencies:  
   `npm install`
3. Set up the database:  
   - Create a PostgreSQL database
   - Run the provided `schema.sql` and `data.sql` files
4. Add environment variables:  
   `.env`


## 🤝 Contributing

This project is still growing! Pull requests and feedback are welcome.  
Feel free to fork the repo or reach out for suggestions.

Open to ideas, issues, and cool collabs!


Trey Dedman – [treydedman@gmail.com](mailto:treydedman@gmail.com)


