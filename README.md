# CSMS Authentication & User API

A concise, production-ready reference for authenticating users in the CSMS backend, retrieving the current user profile, and viewing charge point data and session stats.

> **Base URL**
>
> ```text
> http://147.93.127.215:8000
> ```
>
> All endpoints below are prefixed with `/api`.

---

## Quick Start (Windows CMD)

```bat
:: Base URL
set BASE=http://147.93.127.215:8000
```

### 1) Sign up

```bat
curl -s -X POST "%BASE%/api/auth/signup/" ^
  -H "Content-Type: application/json" ^
  -d "{"username":"henoka","email":"test1@example.com","full_name":"Henoka Tadelea","password":"MyP@ssw0rd","password2":"MyP@ssw0rd","role":"user"}"
```

Another example (super admin):

```bat
curl -s -X POST "%BASE%/api/auth/signup/" ^
  -H "Content-Type: application/json" ^
  -d "{"username":"henokaa","email":"test2@example.com","full_name":"Henokaa Tadeleaa","password":"MyP@ssw0rd","password2":"MyP@ssw0rd","role":"super_admin"}"
```

**Success (example):**
```json
{"detail":"ok"}
```

### 2) Log in (get JWT pair)

```bat
curl -s -X POST "%BASE%/api/auth/login/" ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"bura\",\"password\":\"Abcd@1234\"}"
```

**Success (example):**
```json
{
  "refresh": "<REFRESH_JWT>",
  "access": "<ACCESS_JWT>",
  "role":"super_admin"
}
```

Save tokens in env vars for later calls:

```bat
set ACCESS=<ACCESS_JWT>
set REFRESH=<REFRESH_JWT>
```

### 3) Get current user

```bat
curl "%BASE%/api/me/" -H "Authorization: Bearer %ACCESS%"
```

**Success (example):**
```json
{
  "id": 48,
  "email": "test2@example.com",
  "role": "super_admin",
  "tenant_id": 23,
  "tenant_ws": "ws://147.93.127.215:8000/api/v16/85f8e0c7dc075c57b0f2141bc1dabe45",
  "username":"Yona",
  "full_name":"Yonatan",
  "phone":"0912122222"
}
```

### 4) Refresh access token

```bat
curl -s -X POST "%BASE%/api/auth/refresh/" ^
  -H "Content-Type: application/json" ^
  -d "{"refresh":"%REFRESH%"}"
```

**Success (example):**
```json
{ "access": "<NEW_ACCESS_JWT>" }
```

### 5) Request password reset (email is sent with reset link)

```bat
curl -s -X POST "%BASE%/api/auth/password/reset/" ^
  -H "Content-Type: application/json" ^
  -d "{"email":"ydidyatadele99@gmail.com"}"
```

**Success (example):**
```json
{"detail":"Password reset e-mail sent"}
```

Email contains a link like:
```
http://147.93.127.215:5173/reset-password/<UID>/<TOKEN>
```

### 6) Confirm password reset

After opening the link above and choosing a new password, call:

```bat
curl -s -X POST "%BASE%/api/auth/password/reset/confirm/" ^
  -H "Content-Type: application/json" ^
  -d "{"uid":"<UID>","token":"<TOKEN>","new_password":"<NEW_PASSWORD>"}"
```

**Success (example):**
```json
{"detail":"Password has been reset"}
```

### 7) Log out (invalidate tokens / end session)

```bat
curl -s -X POST "%BASE%/api/auth/logout/" ^
  -H "Authorization: Bearer %ACCESS%" ^
  -H "Content-Type: application/json" ^
  -d "{"refresh":"%REFRESH%"}"
```

**Success (example):**
```json
{"detail":"Logout successful"}
```

### 8) List my charge points

```bat
curl -s "%BASE%/api/charge-points/" ^
  -H "Authorization: Bearer %ACCESS%"
```

**Success (example):**
```json
[{"pk":"BURA","id":"BURA","name":"BURA","connector_id":0,"status":"Unavailable","updated":"2025-08-30T19:08:13.725980Z","price_per_kwh":"10.000","price_per_hour":"10.000","location":"234","lat":"46.876700","lng":"7.559829","owner_username":"bura"},{"pk":"FIRST","id":"FIRST","name":"FIRST","connector_id":0,"status":"Unavailable","updated":"2025-08-30T18:17:56.213893Z","price_per_kwh":"15.000","price_per_hour":"12.000","location":"bole","lat":"46.860142","lng":"7.491126","owner_username":"bura"},{"pk":"SECOND","id":"SECOND","name":"SECOND","connector_id":0,"status":"Unavailable","updated":"2025-08-10T22:54:00.040422Z","price_per_kwh":null,"price_per_hour":null,"location":"eth","lat":null,"lng":null,"owner_username":"bura"},{"pk":"THIRD","id":"THIRD","name":"THIRD","connector_id":1,"status":"Preparing","updated":"2025-08-22T21:39:10.817983Z","price_per_kwh":null,"price_per_hour":null,"location":"hi","lat":"47.193309","lng":"6.642280","owner_username":"bura"}]
```

### 9) Revenue (lifetime and current month)

```bat
curl -s "%BASE%/api/sessions/revenue/" ^
  -H "Authorization: Bearer %ACCESS%"
```

**Success (example):**
```json
{"lifetime":22547.45,"month":16888.33,"month_label":"August 2025"}
```

### 10) Charge point status stats (admin)

```bat
curl -s "%BASE%/api/admin/charge-points/stats/" ^
  -H "Authorization: Bearer %ACCESS%"
```

**Success (example):**
```json
{"by_status":{"Preparing":1,"Unavailable":3},"totals":{"available":0,"unavailable":3,"charging":0,"occupied":0,"preparing":1,"other":0}}
```

### 11) List charging sessions / transactions

If you only need the last 10 sessions, use `?limit=10` (max 200). `offset` is also supported.

```bat
curl -s "%BASE%/api/sessions/?limit=10" ^
  -H "Authorization: Bearer %ACCESS%"
```

**Success (example):**
```json
[{"id":75,"cp":"FIRST","user":"","kWh":0.0,"Started":"2025-08-28T10:09:53Z","Ended":null,"price_kwh":"15.000","price_hour":"12.000","total":697.262},{"id":74,"cp":"FIRST","user":"","kWh":0.0,"Started":"2025-08-28T10:08:40Z","Ended":null,"price_kwh":"15.000","price_hour":"12.000","total":697.505},{"id":73,"cp":"FIRST","user":"","kWh":0.0,"Started":"2025-08-28T10:06:46Z","Ended":null,"price_kwh":"15.000","price_hour":"12.000","total":697.885},{"id":72,"cp":"FIRST","user":"","kWh":0.0,"Started":"2025-08-28T10:06:01Z","Ended":null,"price_kwh":"15.000","price_hour":"12.000","total":698.035},{"id":69,"cp":"FIRST","user":"Henok","kWh":0.132,"Started":"2025-08-19T21:34:55Z","Ended":"2025-08-19T21:35:23Z","price_kwh":"15.000","price_hour":"12.000","total":2.073},{"id":68,"cp":"FIRST","user":"Henok","kWh":0.18,"Started":"2025-08-19T21:33:48Z","Ended":"2025-08-19T21:34:26Z","price_kwh":"15.000","price_hour":"12.000","total":2.827},{"id":67,"cp":"FIRST","user":"Henok","kWh":0.042,"Started":"2025-08-19T21:32:53Z","Ended":"2025-08-19T21:33:04Z","price_kwh":"15.000","price_hour":"12.000","total":0.667},{"id":66,"cp":"FIRST","user":"Henok","kWh":0.0,"Started":"2025-08-19T21:32:03Z","Ended":null,"price_kwh":"15.000","price_hour":"12.000","total":3152.828},{"id":65,"cp":"FIRST","user":"Henok","kWh":0.03,"Started":"2025-08-19T21:31:03Z","Ended":"2025-08-19T21:31:11Z","price_kwh":"15.000","price_hour":"12.000","total":0.477},{"id":64,"cp":"FIRST","user":"Henok","kWh":0.0,"Started":"2025-08-19T21:14:24Z","Ended":null,"price_kwh":"15.000","price_hour":"12.000","total":3156.358}]
```

### 12) Assign Specific Price for Specific user

```bat
curl -i "%BASE%/api/charge-points/BURA/user-prices/" ^
  -H "Authorization: Bearer %ACCESS%" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"driver@example.com\",\"price_per_kwh\":0.27,\"price_per_hour\":1.2}"
```

**Success (example):**
```json
{"id":2,"user":29,"user_email":"henoka@gmail.com","user_name":"Henok","price_per_kwh":"0.270","price_per_hour":"1.20"}
```

### 13) List specific prices assigned to specific users

```bat
curl -i "%BASE%/api/charge-points/BURA/user-prices/" ^
  -H "Authorization: Bearer %ACCESS%" ^
  -H "Accept: application/json"
```

**Success (example):**
```json
[{"id":2,"user":29,"user_email":"henoka@gmail.com","user_name":"Henok","price_per_kwh":"0.270","price_per_hour":"1.20"}]
```

### 14) Get details of one charge point

```bat
curl -s "%BASE%/api/charge-points/<pk>/" ^
  -H "Authorization: Bearer %ACCESS%"
```

**Success (example):**
```json
{"pk":"BURA","id":"BURA","name":"BURA","connector_id":0,"status":"Unavailable","updated":"2025-09-05T09:14:06.478293Z","price_per_kwh":"500.000","price_per_hour":"250.000","location":"234","lat":"46.876700","lng":"7.559829","owner_username":"bura","plug_type":"type2","max_power_kw":"144.00","access_type":"public"}
```

### 15) Revenue increase/decrease over month

```bat
curl -s "%BASE%/api/sessions/revenue/mom/" -H "Authorization: Bearer %ACCESS%"
```

**Success (example):**
```json
{"this_month":{"start":"2025-09-01T00:00:00+00:00","end":"2025-09-30T23:59:59.999999+00:00","total":"1387224.87"},"last_month":{"start":"2025-08-01T00:00:00+00:00","end":"2025-08-31T23:59:59.999999+00:00","total":"16373.58"},"delta":{"absolute":"1370851.29","percent":8372.336959907363,"direction":"up"}}
```

### 16) Pagination

```bat
REM Page 1 (last 30 transactions)
curl -s "http://147.93.127.215:8000/api/sessions/" ^
  -H "Authorization: Bearer %ACCESS%"

REM Page 2 (last 31-60 transactions)
curl -s "http://147.93.127.215:8000/api/sessions/?offset=30" ^
  -H "Authorization: Bearer %ACCESS%"

REM Page 3 (last 61–90)
curl -s "http://147.93.127.215:8000/api/sessions/?offset=60" ^
  -H "Authorization: Bearer %ACCESS%"

```

**Success (example):**
```json
{"count":77,"next":"http://147.93.127.215:8000/api/sessions/?limit=30&offset=30","previous":null,"results":[{"id":91,"cp":"BURA","user":"demo","kWh":0.192,"Started":"2025-09-05T16:10:20Z","Ended":"2025-09-05T16:11:05Z","price_kwh":"500.000","price_hour":"250.000","total":99.125},{"id":90,"cp":"BURA","user":"TAG123","kWh":0.0,"Started":"2025-09-05T15:51:43Z","Ended":null,"price_kwh":"500.000","price_hour":"250.000","total":55227.385},{"id":89,"cp":"BURA","user":"TAG123","kWh":0.0,"Started":"2025-09-05T15:47:13Z","Ended":null,"price_kwh":"500.000","price_hour":"250.000","total":55246.135},{"id":88,"cp":"BURA","user":"demo","kWh":0.234,"Started":"2025-09-05T15:45:14Z","Ended":"2025-09-05T15:46:09Z","price_kwh":"500.000","price_hour":"250.000","total":120.819},{"id":87,"cp":"BURA","user":"demo","kWh":2.766,"Started":"2025-09-05T15:34:17Z","Ended":"2025-09-05T15:44:41Z","price_kwh":"500.000","price_hour":"250.000","total":1426.333},{"id":86,"cp":"BURA","user":"TAG123","kWh":0.0,"Started":"2025-09-05T15:27:16Z","Ended":null,"price_kwh":"500.000","price_hour":"250.000","total":55329.26},{"id":85,"cp":"BURA","user":"TAG123","kWh":0.0,"Started":"2025-09-05T15:27:04Z","Ended":null,"price_kwh":"500.000","price_hour":"250.000","total":55330.093},{"id":84,"cp":"BURA","user":"demo","kWh":0.06,"Started":"2025-09-05T15:26:23Z","Ended":"2025-09-05T15:26:39Z","price_kwh":"500.000","price_hour":"250.000","total":31.111},{"id":83,"cp":"BURA","user":"demo","kWh":0.0,"Started":"2025-09-05T15:26:08Z","Ended":null,"price_kwh":"500.000","price_hour":"250.000","total":55333.982},{"id":82,"cp":"FIRST","user":"","kWh":20884.498,"Started":"2025-09-05T09:09:11Z","Ended":"2025-09-05T09:10:26Z","price_kwh":"15.000","price_hour":"12.000","total":313267.72},{"id":81,"cp":"BURA","user":"","kWh":2144.492,"Started":"2025-09-04T11:04:29Z","Ended":"2025-09-04T11:10:37Z","price_kwh":"500.000","price_hour":"250.000","total":1072271.556},{"id":80,"cp":"THIRD","user":"","kWh":2144.492,"Started":"2025-09-04T11:02:36Z","Ended":"2025-09-04T11:08:51Z","price_kwh":null,"price_hour":null,"total":null},{"id":79,"cp":"THIRD","user":"","kWh":0.0,"Started":"2025-09-04T10:57:45Z","Ended":null,"price_kwh":null,"price_hour":null,"total":null},{"id":78,"cp":"FIRST","user":"Henok","kWh":0.0,"Started":"2025-09-01T21:47:23Z","Ended":null,"price_kwh":"15.000","price_hour":"12.000","total":3731.781},{"id":77,"cp":"FIRST","user":"Henok","kWh":0.0,"Started":"2025-09-01T21:43:46Z","Ended":null,"price_kwh":"15.000","price_hour":"12.000","total":3732.504},{"id":76,"cp":"FIRST","user":"demo","kWh":0.523,"Started":"2025-09-01T20:31:10Z","Ended":"2025-09-01T20:32:58Z","price_kwh":"15.000","price_hour":"12.000","total":8.205},{"id":75,"cp":"FIRST","user":"","kWh":0.0,"Started":"2025-08-28T10:09:53Z","Ended":null,"price_kwh":"15.000","price_hour":"12.000","total":5023.281},{"id":74,"cp":"FIRST","user":"","kWh":0.0,"Started":"2025-08-28T10:08:40Z","Ended":null,"price_kwh":"15.000","price_hour":"12.000","total":5023.524},{"id":73,"cp":"FIRST","user":"","kWh":0.0,"Started":"2025-08-28T10:06:46Z","Ended":null,"price_kwh":"15.000","price_hour":"12.000","total":5023.904},{"id":72,"cp":"FIRST","user":"","kWh":0.0,"Started":"2025-08-28T10:06:01Z","Ended":null,"price_kwh":"15.000","price_hour":"12.000","total":5024.054},{"id":69,"cp":"FIRST","user":"Henok","kWh":0.132,"Started":"2025-08-19T21:34:55Z","Ended":"2025-08-19T21:35:23Z","price_kwh":"15.000","price_hour":"12.000","total":2.073},{"id":68,"cp":"FIRST","user":"Henok","kWh":0.18,"Started":"2025-08-19T21:33:48Z","Ended":"2025-08-19T21:34:26Z","price_kwh":"15.000","price_hour":"12.000","total":2.827},{"id":67,"cp":"FIRST","user":"Henok","kWh":0.042,"Started":"2025-08-19T21:32:53Z","Ended":"2025-08-19T21:33:04Z","price_kwh":"15.000","price_hour":"12.000","total":0.667},{"id":66,"cp":"FIRST","user":"Henok","kWh":0.0,"Started":"2025-08-19T21:32:03Z","Ended":null,"price_kwh":"15.000","price_hour":"12.000","total":7478.848},{"id":65,"cp":"FIRST","user":"Henok","kWh":0.03,"Started":"2025-08-19T21:31:03Z","Ended":"2025-08-19T21:31:11Z","price_kwh":"15.000","price_hour":"12.000","total":0.477},{"id":64,"cp":"FIRST","user":"Henok","kWh":0.0,"Started":"2025-08-19T21:14:24Z","Ended":null,"price_kwh":"15.000","price_hour":"12.000","total":7482.378},{"id":63,"cp":"FIRST","user":"Henok","kWh":0.198,"Started":"2025-08-19T21:10:30Z","Ended":"2025-08-19T21:11:16Z","price_kwh":"15.000","price_hour":"12.000","total":3.123},{"id":62,"cp":"FIRST","user":"Henok","kWh":0.0,"Started":"2025-08-19T21:04:57Z","Ended":null,"price_kwh":"15.000","price_hour":"12.000","total":7484.268},{"id":61,"cp":"FIRST","user":"Henok","kWh":0.018,"Started":"2025-08-19T21:04:45Z","Ended":"2025-08-19T21:04:50Z","price_kwh":"15.000","price_hour":"12.000","total":0.287},{"id":60,"cp":"FIRST","user":"Henok","kWh":0.0,"Started":"2025-08-19T20:59:13Z","Ended":null,"price_kwh":"15.000","price_hour":"12.000","total":7485.414}]}
```

## Quick Start (Windows CMD)

### 1) Start Remote Transaction

```bat
curl -s -X POST "%BASE%/api/charge-points/<pk>/command/" -H "Authorization: Bearer %ACCESS%" -H "Content-Type: application/json" -d "{\"action\":\"RemoteStartTransaction\",\"params\":{\"idTag\":\"TAG123\",\"connectorId\":1}}"

```

**Success (example):**
```json
{"detail":"queued"}
```

**backend logs:**
```
[CMD] BURA → RemoteStartTransaction {'id_tag': 'TAG123', 'connector_id': 1}
INFO:ocpp:BURA: send [2,"85912e8b-bf6f-400a-9c61-bc00657c6891","RemoteStartTransaction",{"idTag":"TAG123","connectorId":1}]
INFO:ocpp:BURA: receive message [3,"85912e8b-bf6f-400a-9c61-bc00657c6891",{"status":"Accepted"}]
[CMD]  ↳  RemoteStartTransaction(status='Accepted')
INFO:ocpp:BURA: receive message [2,"8934b43c-f0ad-4938-ac33-c93eb6dba7ae","Authorize",{"idTag":"TAG123"}]
INFO:ocpp:BURA: send [3,"8934b43c-f0ad-4938-ac33-c93eb6dba7ae",{"idTagInfo":{"status":"Accepted"}}]
INFO:ocpp:BURA: receive message [2,"a59c0719-1451-4730-8c29-75aebd00c5a0","StartTransaction",{"connectorId":1,"idTag":"TAG123","meterStart":0,"timestamp":"2025-09-05T18:51:43+03"}]
[StartTx] #90 on BURA meterStart=0Wh
INFO:ocpp:BURA: send [3,"a59c0719-1451-4730-8c29-75aebd00c5a0",{"transactionId":90,"idTagInfo":{"status":"Accepted"}}]
INFO:ocpp:BURA: receive message [2,"e2e61b39-131d-4ffb-81b6-9a760f897869","StatusNotification",{"connectorId":1,"errorCode":"NoError","status":"Preparing","timestamp":"2025-09-05T18:51:44+03"}]
[Status] BURA c1 → Preparing
INFO:ocpp:BURA: send [3,"e2e61b39-131d-4ffb-81b6-9a760f897869",{}]
INFO:ocpp:BURA: receive message [2,"d9802363-cd69-4872-b4f3-905a8de42ac0","StatusNotification",{"connectorId":1,"errorCode":"NoError","status":"Charging","timestamp":"2025-09-05T18:51:44+03"}]
[Status] BURA c1 → Charging
INFO:ocpp:BURA: send [3,"d9802363-cd69-4872-b4f3-905a8de42ac0",{}]
INFO:ocpp:BURA: receive message [2,"b6fff27d-623b-4f3d-b0e7-1145b73f8317","StatusNotification",{"connectorId":1,"errorCode":"NoError","status":"Charging","timestamp":"2025-09-05T18:51:45+03"}]
[Status] BURA c1 → Charging
INFO:ocpp:BURA: send [3,"b6fff27d-623b-4f3d-b0e7-1145b73f8317",{}]
INFO:ocpp:BURA: receive message [2,"15b715e8-2968-4856-afe3-d57fdd65a527","Heartbeat",{}]
INFO:ocpp:BURA: send [3,"15b715e8-2968-4856-afe3-d57fdd65a527",{"currentTime":"2025-09-05T15:51:58.612793+00:00"}]
```

---

## Endpoint Reference

| Path                                       | Method | Description                                   | Auth Needed | Notes |
|--------------------------------------------|--------|-----------------------------------------------|-------------|-------|
| `/api/auth/signup/`                        | POST   | Create a user account                          | No          |       |
| `/api/auth/login/`                         | POST   | Obtain JWT access/refresh pair                 | No          |       |
| `/api/auth/refresh/`                       | POST   | Refresh access token                           | No*         | Uses refresh JWT |
| `/api/auth/password/reset/`                | POST   | Request password reset email                   | No          |       |
| `/api/auth/password/reset/confirm/`        | POST   | Confirm reset with UID + token + new password  | No          |       |
| `/api/auth/logout/`                        | POST   | Log out (server-side invalidate)               | Yes         | Send access + refresh |
| `/api/me/`                                 | GET    | Get current user profile                       | Yes         | Send access JWT |
| `/api/charge-points/`                      | GET    | List my charge points                          | Yes         | Current user’s charge points |
| `/api/sessions/revenue/`                   | GET    | Revenue summary (lifetime & current month)     | Yes         | Returns `lifetime`, `month`, `month_label` |
| `/api/admin/charge-points/stats/`          | GET    | Charge point status stats                       | Yes         | Admin only (`super_admin`) |
| `/api/sessions/`                           | GET    | List charging sessions / transactions          | Yes         | Query: `limit` (≤200), `offset` |
| `/api/charge-points/BURA/user-prices/`     | POST    | Set Specific price for specific usser under specific CP    | Yes         | Send access JWT |
| `/api/charge-points/BURA/user-prices/`                                 | GET    | List specific prices assigned to specific users                       | Yes         | Send access JWT |

\* No `Authorization` header is required for `/auth/refresh/`, but the refresh token is mandatory in the JSON body.

---

## Authentication Model

- **JWT Access Token**: short-lived; used in the `Authorization` header.  
  Example: `Authorization: Bearer <ACCESS_JWT>`
- **JWT Refresh Token**: longer-lived; used to obtain a new access token via `/auth/refresh/`.
- **Logout** requires both:
  - `Authorization: Bearer <ACCESS_JWT>` header, and
  - JSON body `{ "refresh": "<REFRESH_JWT>" }` to invalidate the refresh token on the server.

> Never expose tokens in URLs or client-side logs. Store refresh tokens securely and rotate access tokens regularly.

---

## Example Responses

### Login
```json
{
  "refresh":"<REFRESH_JWT>",
  "access":"<ACCESS_JWT>",
  "role":"super_admin"
}
```

### Refresh
```json
{
  "access":"<NEW_ACCESS_JWT>"
}
```

### Me
```json
{
  "id":48,
  "email":"test2@example.com",
  "role":"super_admin",
  "tenant_id":23,
  "tenant_ws":"ws://147.93.127.215:8000/api/v16/85f8e0c7dc075c57b0f2141bc1dabe45"
}
```

---

## cURL (bash) equivalents

```bash
BASE="http://147.93.127.215:8000"

curl -s -X POST "$BASE/api/auth/login/"   -H "Content-Type: application/json"   -d '{"username":"henokaa","password":"MyP@ssw0rd"}'
```

Add the header when calling authenticated endpoints:

```bash
curl "$BASE/api/me/" -H "Authorization: Bearer $ACCESS"
```

---

## Postman Tips

1. **Create an Environment** with `BASE`, `ACCESS`, and `REFRESH` variables.
2. **Login** request: save `access` to `ACCESS` and `refresh` to `REFRESH` via a **Tests** script:
   ```js
   let data = pm.response.json();
   pm.environment.set("ACCESS", data.access);
   pm.environment.set("REFRESH", data.refresh);
   ```
3. **Authenticated requests**: set an **Authorization** header with `Bearer {{ACCESS}}`.
4. **Token refresh**: call `/auth/refresh/` with body `{ "refresh": "{{REFRESH}}" }` and update `ACCESS` in the **Tests** tab.
5. **Logout**: send both the `Authorization: Bearer {{ACCESS}}` header and the JSON body `{ "refresh": "{{REFRESH}}" }`.

---

## Error Handling (common HTTP codes)

- `400 Bad Request` – malformed input or validation error.
- `401 Unauthorized` – missing or invalid access token.
- `403 Forbidden` – authenticated but not permitted for the action.
- `404 Not Found` – endpoint or resource not found.
- `429 Too Many Requests` – client exceeded rate limits.
- `500 Internal Server Error` – unexpected server error.

Include the response body when reporting issues, especially for 4xx errors.

---

## Security Checklist

- Always use HTTPS in production.
- Keep access tokens short-lived; refresh to obtain new ones as needed.
- Store refresh tokens in an http-only, secure storage layer on trusted clients or servers.
- Revoke refresh tokens on logout and upon suspicious activity.
- Rotate credentials and monitor audit logs.

---

## Changelog

- **v1.1.0** – Added endpoints for charge points, revenue, status stats, and sessions.
- **v1.0.0** – Initial public documentation for CSMS Auth & User API.
