### Dependencies
- NodeJS v10.15.3
- Redis
- Docker 
- docker-compose

### To start service locally:
```
npm install
npm run build
npm run docker:up
npm run start
```

App will be running on **5000** port (see `backend/config` dir).

## API
### Basic healthcheck endpoint 
`GET /info/healthcheck/ping`

Response 200 OK:
```json
{
  "message": "Pong!"
}
```

### Get user balance 
`GET /balance`

Response 200 OK:
```json
{
  "balance": "150"
}
```

### Get transactions history
`GET /transactions`

Has optional query arguments for pagination:
- **page** - \<number> - page number
- **pageSize** - \<number> - page size (max 12 entries)

Example: `GET /transactions?page=2&pageSize=3`  
Response 200 OK:
```json
{
  "total": 5,
  "transactions": [
    {
      "id": 126,
      "userId": 1,
      "type": "credit",
      "amount": "50",
      "createdAt": "2020-01-03T20:00:00.000Z"
    },
    {
      "id": 1000,
      "userId": 1,
      "type": "debit",
      "amount": "1250",
      "createdAt": "2020-01-14T17:01:06.171Z"
    }
  ]
}
```

### Add new transaction
`POST /transactions`  
Required payload:
- **type** - \<string> - valid values: `debit`, `credit`
- **amount** - \<string> - amount

Returns transaction id and updated user balance.  
Returns **400 Bad Request** if user doesn't have enough balance for new credit transaction.

Example 1. Response 200 OK.  
Body:
```json
{
  "type": "debit",
  "amount": "1250"
}
```
Returns:
```json
{
  "transactionId": 1000,
  "balance": "1400"
}
```

Example 2. Response 400 BadRequest. Body:
```json
{
  "type": "credit",
  "amount": "5000"
}
```
Returns:
```json
{
  "errorCode": "ADD_TRANSACTION.NOT_ENOUGH_BALANCE",
  "error": "Not enough balance. Current balance: 150"
}
```

### Get transaction by id
`GET /transactions/{id}`
Returns transaction by id.
Returns **400 Bad Request** if invalid transaction id was provided.

Required path params:
- **id** - \<number> - transaction id

Response 200 OK:
```json
{
  "id": 123,
  "userId": 1,
  "type": "debit",
  "amount": "100",
  "createdAt": "2020-01-01T10:00:00.000Z"
}
``` 

Response 400:
```json
{
  "errorCode": "TRANSACTION.INVALID_ID",
  "error": "Invalid transaction id"
}
```
