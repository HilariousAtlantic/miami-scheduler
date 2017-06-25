# miami-scheduler
Website for scheduling courses at Miami University - Oxford. www.miamischeduler.com

## Setup

### Database
```
brew install postgres
brew services start postgres
createuser -d miami_scheduler
createdb -U miami_scheduler miami_scheduler
```
