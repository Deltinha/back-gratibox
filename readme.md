# Gratibox

## About

This is the backend repo for GratiBox. A service that delivers you boxes of meditation goodies.

## Technologies

- NodeJS
- ExpressJS
- dotenv
- Jest
- bcrypt
- uuid

## Running locally

1. Clone the back-end repo

```sh
git clone https://github.com/Deltinha/back-gratibox.git
```

3. Install NPM packages for the back-end repo

```sh
npm install
```

4. Create a local database following `./gratibox.sql`

5. Create a new file called `.env.dev` in the root folder using `.env-example` as template. Feed the newly created file with the info of your database.

6. Run the app in development mode

```sh
npm run dev
```

### Check out the front-end repo of this app.

[https://github.com/Deltinha/front-gratibox.git](https://github.com/Deltinha/front-gratibox.git)

## Info

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
  },...
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
