# 📚 MongoDB Setup Guide for Placement AI

This guide covers two ways to connect MongoDB to your Placement AI application:

1. **MongoDB Atlas (Cloud - Recommended)** - Free, no installation required
2. **Local MongoDB** - Install MongoDB on your computer

---

## ☁️ Option 1: MongoDB Atlas (Cloud - Recommended)

### Step 1: Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Try Free"** or **"Sign Up"**
3. Sign up with:
   - Google Account, OR
   - Email and password
4. Verify your email address

### Step 2: Create a Free Cluster

1. After signing in, you'll see the **"Build a Database"** prompt
2. Click **"Build a Database"**
3. Select **M0 FREE** tier (completely free!)
4. Choose your:
   - **Provider**: AWS, Google Cloud, or Azure (any works)
   - **Region**: Choose closest to your location
   - **Cluster Name**: `placement-ai-cluster` (or any name)
5. Click **"Create Cluster"**
6. Wait 3-5 minutes for cluster creation

### Step 3: Create Database User

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication method
4. Enter credentials:
   - **Username**: `placement-ai-user`
   - **Password**: Click "Autogenerate Secure Password" OR create your own
   - ⚠️ **Save the password!** You'll need it later
5. Under "Database User Privileges", select **"Read and write to any database"**
6. Click **"Add User"**

### Step 4: Configure Network Access (IMPORTANT!)

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. You have two options:

   **Option A: Allow All (Easier for Development)**
   - Click **"Allow Access from Anywhere"**
   - This adds `0.0.0.0/0` (all IP addresses)
   - Click **"Confirm"**

   **Option B: Add Specific IP (More Secure)**
   - Click **"Add Current IP Address"**
   - This only allows your current IP
   - You'll need to update this if your IP changes

4. Wait for the status to change to "Active"

### Step 5: Get Connection String

1. In the left sidebar, click **"Database"**
2. Find your cluster and click **"Connect"**
3. Choose **"Connect your application"**
4. Select:
   - **Driver**: Node.js
   - **Version**: Latest (5.5 or higher)
5. Copy the connection string, it looks like:
   ```
   mongodb+srv://placement-ai-user:<password>@placement-ai-cluster.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Replace `<password>`** with your actual password from Step 3

### Step 6: Add Connection String to Your Project

#### For Local Development:

1. Open `server/.env` file
2. Find the `MONGODB_URI` line
3. Replace with your connection string:

```env
# MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://placement-ai-user:YOUR_ACTUAL_PASSWORD@placement-ai-cluster.mongodb.net/placement-ai?retryWrites=true&w=majority
```

**Important Notes:**
- Replace `YOUR_ACTUAL_PASSWORD` with your database user password
- Add `/placement-ai` before the `?` to specify the database name
- If your password contains special characters (`@`, `#`, `:`, etc.), URL-encode them:
  - `@` → `%40`
  - `#` → `%23`
  - `:` → `%3A`
  - `/` → `%2F`

#### For Render Deployment:

1. Go to your backend service in Render Dashboard
2. Click **"Environment"** in the left sidebar
3. Add/Update `MONGODB_URI` with your connection string
4. Click **"Save Changes"** (this will redeploy)

---

## 💻 Option 2: Local MongoDB Installation

### Windows Installation

#### Step 1: Download MongoDB

1. Go to [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Select:
   - **Version**: 7.0.x (or latest)
   - **Platform**: Windows
   - **Package**: msi
3. Click **"Download"**

#### Step 2: Install MongoDB

1. Run the downloaded `.msi` file
2. Click **"Next"** through the setup wizard
3. Accept the license agreement
4. Choose **"Complete"** installation
5. Select **"Install MongoDB as a Service"**
6. Choose default data directory: `C:\Program Files\MongoDB\Server\7.0\data`
7. Click **"Install"**
8. Click **"Finish"**

#### Step 3: Verify Installation

Open Command Prompt and run:
```bash
mongod --version
```

You should see version information.

#### Step 4: Start MongoDB Service

```bash
# Start MongoDB service
net start MongoDB

# Or using Windows Services:
# Win + R → services.msc → Find MongoDB → Start
```

#### Step 5: Create Data Directory (if needed)

```bash
# Create default data directory
mkdir C:\data\db

# Start MongoDB manually (if not running as service)
mongod --dbpath="C:\data\db"
```

### macOS Installation

#### Using Homebrew (Recommended):

```bash
# Add MongoDB tap
brew tap mongodb/brew

# Install MongoDB
brew install mongodb-community@7.0

# Start MongoDB as a background service
brew services start mongodb-community@7.0

# Or start manually
mongod --config /opt/homebrew/etc/mongod.conf
```

### Linux (Ubuntu) Installation

```bash
# Import MongoDB GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update and install
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Configure Local MongoDB Connection

Update `server/.env`:

```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/placement-ai
```

---

## 🧪 Testing MongoDB Connection

### Test with MongoDB Compass (GUI Tool)

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Install and open Compass
3. Paste your connection string
4. Click **"Connect"**
5. You should see your databases

### Test with Command Line

```bash
# For Atlas (Cloud)
mongosh "mongodb+srv://placement-ai-user:YOUR_PASSWORD@placement-ai-cluster.mongodb.net"

# For Local
mongosh "mongodb://localhost:27017"
```

### Test with Your Application

1. Start your backend server:
   ```bash
   cd server
   npm start
   ```

2. Look for this message:
   ```
   ✅ MongoDB Connected Successfully
   ```

3. If you see an error, check:
   - Connection string is correct
   - Password is correct (and URL-encoded if needed)
   - IP is whitelisted (for Atlas)
   - MongoDB service is running (for local)

---

## 🔧 Troubleshooting

### Error: "Connection refused"
**For Local MongoDB:**
- MongoDB service is not running
- Start it with: `net start MongoDB` (Windows) or `brew services start mongodb-community` (macOS)

**For Atlas:**
- Check if your IP is whitelisted
- Go to Network Access and add your current IP

### Error: "Authentication failed"
- Username or password is incorrect
- Make sure you're using the database user password, not your Atlas account password
- URL-encode special characters in password

### Error: "Connection timeout"
- Check your internet connection (for Atlas)
- Verify IP whitelist includes your current IP
- Try allowing access from anywhere (0.0.0.0/0)

### Error: "SSL/TLS required"
- Atlas requires SSL connection
- Make sure your connection string starts with `mongodb+srv://`
- The `+srv` enables SSL automatically

---

## 📊 Database Structure

Once connected, MongoDB will create these collections automatically:

```
placement-ai/
├── users/           # User accounts
│   ├── _id
│   ├── name
│   ├── email
│   ├── password (hashed)
│   └── createdAt
│
└── predictions/     # Prediction history
    ├── _id
    ├── userId
    ├── cgpa
    ├── dsa_score
    ├── projects
    ├── communication
    ├── internships
    ├── placement_probability
    ├── readiness_score
    └── createdAt
```

---

## 🔐 Security Best Practices

### For Development:
- Use `.env` file (already in `.gitignore`)
- Never commit `.env` to Git

### For Production:
1. **Use strong passwords** for database users
2. **Restrict IP access** when possible
3. **Use environment variables** in Render/Railway
4. **Rotate passwords** periodically
5. **Enable MongoDB Atlas** security features:
   - Two-factor authentication
   - Encryption at rest
   - Audit logs

---

## 📝 Quick Reference

### Connection String Format

```
# MongoDB Atlas (Cloud)
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# Local MongoDB
mongodb://localhost:27017/<database>
```

### Environment Variable

```env
# In server/.env
MONGODB_URI=your_connection_string_here
```

### Test Commands

```bash
# Check if MongoDB is running (local)
mongod --version

# Connect to MongoDB shell
mongosh

# Check connection in Node.js
node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('Connected!')).catch(console.error)"
```

---

## ✅ Checklist

Before running your application:

- [ ] MongoDB Atlas account created (or local MongoDB installed)
- [ ] Cluster created (Atlas) or service started (local)
- [ ] Database user created with read/write permissions
- [ ] Network access configured (IP whitelisted)
- [ ] Connection string copied
- [ ] Password replaced in connection string
- [ ] `MONGODB_URI` added to `server/.env`
- [ ] Backend server starts with "MongoDB Connected Successfully"

---

**Need more help?** Check the [MongoDB Documentation](https://www.mongodb.com/docs/) or ask in the project issues.
