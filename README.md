# miami-scheduler
Website for scheduling courses at Miami University - Oxford. www.miamischeduler.com

## Setup

### API & development servers
```
git clone https://github.com/HilariousAtlantic/miami-scheduler.git
cd miami-scheduler
npm i
npm start
```

In a new terminal window:

```
npm run dev
```

### Database
```
brew install mongodb
sudo mkdir -p /data/db
sudo chown -R $(whoami) /data/db
brew services start mongodb
npm run import
```
