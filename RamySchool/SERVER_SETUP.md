# Server Setup Guide

## Quick Start

The frontend is configured to connect to a local API server at `http://localhost:5132`.

### Option 1: Start the .NET API Server

1. Navigate to the API project:
   ```bash
   cd RamyScoolManagment/RamyScoolManagment.Api
   ```

2. Run the server:
   ```bash
   dotnet run
   ```

3. The API will be available at `http://localhost:5132`
4. Swagger documentation at `http://localhost:5132/swagger`

### Option 2: Use Mock Server (for development)

If you don't have the .NET server, you can create a simple mock server:

1. Install json-server globally:
   ```bash
   npm install -g json-server
   ```

2. Create a `db.json` file with sample data:
   ```json
   {
     "teachers": [
       {"id": 1, "fullName": "John Doe", "salary": 5000, "percentage": 10, "groups": []}
     ],
     "students": [
       {"id": 1, "name": "Jane Smith", "phoneNumber": "123456789", "enrollments": []}
     ],
     "groups": [
       {"id": 1, "name": "Math Group A", "teacherId": 1, "teacherName": "John Doe", "students": []}
     ],
     "sessions": [],
     "presences": [],
     "enrollments": []
   }
   ```

3. Start the mock server:
   ```bash
   json-server --watch db.json --port 5132 --routes routes.json
   ```

### Troubleshooting

- **ERR_NAME_NOT_RESOLVED**: The server URL is not accessible
- **ERR_NETWORK**: Network connectivity issues
- **Connection refused**: Server is not running on the specified port

Make sure the API server is running before starting the frontend application.