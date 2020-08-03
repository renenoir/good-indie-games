# Good Indie Games
[good-indie-games.xyz](https://good-indie-games.xyz/)


Good Indie Games is a website where you can find indie games with meta rating above 65. You can search, filter, sort games and also add them to your saved list. 
Done with igdb.com API.

Postman: https://www.getpostman.com/collections/c321869b42a9563815db


## Installation

```
git clone git@github.com:renenoir/good-indie-games.git
cd good-indie-games
```
Create .env file:
```
echo "DB_PASS=testdbpass
POSTGRES_PASSWORD=testdbpass
SECRET_KEY=testsecretkey
DB_HOST=db
DB_NAME=app
DB_USER=postgres
POSTGRES_DB=app
POSTGRES_USER=postgres" | cat >> .env
```
Launch:
```
docker-compose up --build
```
