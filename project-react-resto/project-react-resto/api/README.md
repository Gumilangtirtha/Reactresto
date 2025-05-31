# API Documentation

## Setup

1. Pastikan database MySQL sudah berjalan
2. Buat database dengan nama `apirestoran` (atau sesuaikan di `config.php`)
3. Buka `http://localhost/project-react-resto/api/setup.php` untuk membuat tabel users
4. Setelah setup selesai, Anda akan mendapatkan user admin default:
   - Username: admin
   - Password: password

## Endpoints

### Authentication

#### Register
- URL: `/api/register.php`
- Method: `POST`
- Data:
  ```json
  {
    "name": "User Name",
    "username": "username",
    "email": "user@example.com",
    "password": "password123",
    "role": "user"
  }
  ```
- Response Success:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "id": 1,
      "name": "User Name",
      "username": "username",
      "email": "user@example.com",
      "role": "user",
      "created_at": "2023-01-01 00:00:00",
      "updated_at": "2023-01-01 00:00:00"
    }
  }
  ```

#### Login
- URL: `/api/login.php`
- Method: `POST`
- Data:
  ```json
  {
    "username": "username", // Bisa username atau email
    "password": "password123"
  }
  ```
- Response Success:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": 1,
        "name": "User Name",
        "username": "username",
        "email": "user@example.com",
        "role": "user",
        "created_at": "2023-01-01 00:00:00",
        "updated_at": "2023-01-01 00:00:00"
      },
      "token": "your-auth-token"
    }
  }
  ```

### Users

#### Get All Users
- URL: `/api/users.php`
- Method: `GET`
- Headers:
  - Authorization: Bearer {token}
- Response Success:
  ```json
  {
    "success": true,
    "message": "Users retrieved successfully",
    "data": [
      {
        "id": 1,
        "name": "User Name",
        "username": "username",
        "email": "user@example.com",
        "role": "user",
        "created_at": "2023-01-01 00:00:00",
        "updated_at": "2023-01-01 00:00:00"
      }
    ]
  }
  ```

#### Get User by ID
- URL: `/api/users.php?id={id}`
- Method: `GET`
- Headers:
  - Authorization: Bearer {token}
- Response Success:
  ```json
  {
    "success": true,
    "message": "User retrieved successfully",
    "data": {
      "id": 1,
      "name": "User Name",
      "username": "username",
      "email": "user@example.com",
      "role": "user",
      "created_at": "2023-01-01 00:00:00",
      "updated_at": "2023-01-01 00:00:00"
    }
  }
  ```

#### Update User
- URL: `/api/users.php`
- Method: `PUT`
- Headers:
  - Authorization: Bearer {token}
- Data:
  ```json
  {
    "id": 1,
    "name": "Updated Name",
    "username": "updated_username",
    "email": "updated@example.com",
    "password": "newpassword123",
    "role": "admin"
  }
  ```
- Response Success:
  ```json
  {
    "success": true,
    "message": "User updated successfully",
    "data": {
      "id": 1,
      "name": "Updated Name",
      "username": "updated_username",
      "email": "updated@example.com",
      "role": "admin",
      "created_at": "2023-01-01 00:00:00",
      "updated_at": "2023-01-01 00:00:00"
    }
  }
  ```

#### Delete User
- URL: `/api/users.php`
- Method: `DELETE`
- Headers:
  - Authorization: Bearer {token}
- Data:
  ```json
  {
    "id": 1
  }
  ```
- Response Success:
  ```json
  {
    "success": true,
    "message": "User deleted successfully"
  }
  ```

## Error Responses

Semua endpoint akan mengembalikan response error dengan format yang sama:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Status Codes

- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error
