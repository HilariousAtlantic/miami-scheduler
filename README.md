# miami-scheduler
Website for scheduling courses at Miami University - Oxford. www.miamischeduler.com

## Setup

### Database
```
brew install postgres
brew services start postgres
npm run db:create
npm run db:setup
npm run db:import
```
