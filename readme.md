# Gratibox

## About

This is the backend repo for GratiBox. A service that delivers you boxes of meditation goodies.

### Check out the front-end repo of the app.

[https://github.com/Deltinha/front-gratibox.git](https://github.com/Deltinha/front-gratibox.git)

## Technologies

- NodeJS
- ExpressJS
- nodemon
- pg
- dotenv
- cors
- Jest
- supertest
- bcrypt
- uuid
- joi
- faker
- prettier
- husky

## Running locally

1. Clone the back-end repo

```sh
git clone https://github.com/Deltinha/back-gratibox.git
```

2. Install NPM packages for the back-end repo

```sh
npm install
```

3. Restore the database using the file `./dump.sql`

4. Create a new file called `.env` in the root folder using `.env-example` as template. Feed the newly created file with the info of your database.

5. Run the app in development mode

```sh
npm run dev
```

## Info (incomplete)

`GET` /plans

You can access an array containing ALL the plans and the available delivery days for each one.

```json
[
  {
    "id": 1,
    "name": "mensal",
    "days": [
      {
        "deliveryDayId": 1,
        "day": 1,
        "weekDay": null
      },
      {
        "deliveryDayId": 2,
        "day": 10,
        "weekDay": null
      },
      {
        "deliveryDayId": 3,
        "day": 20,
        "weekDay": null
      }
    ]
  }
]
```

`GET` /products

You can access the list of products by using the /products endpoint.

```json
[
  {
    "id": 1,
    "name": "Chás"
  },
  {
    "id": 2,
    "name": "Insensos"
  },
  {
    "id": 3,
    "name": "Produtos orgânicos"
  }
]
```

`GET` /states

You can access the list of states covered by the delivery service by using the /states endpoint.

```json
[
  {
    "id": 2,
    "name": "SP"
  },
  {
    "id": 3,
    "name": "CE"
  },
  {
    "id": 5,
    "name": "MT"
  }
]
```
