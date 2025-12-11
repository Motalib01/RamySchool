# RamySchool Management System

## Overview
A comprehensive school management system with automatic presence tracking for students enrolled in groups.

## API Base URL
```
http://localhost:5132/api
```

## Core Workflow

### 1. Student Enrollment & Automatic Presence Creation
When a student is added to a group, the system automatically:
- Creates initial sessions (default: 4 sessions)
- Creates **PENDING** presences for each session
- Student can later have their presence updated to Present/Absent

### 2. Presence Status Types
```csharp
enum PresenceStatus {
    Pending = 0,    // Default when student enrolled
    Present = 1,    // Student attended
    Absent = 2      // Student didn't attend
}
```

## API Endpoints

### Authentication
```http
POST /api/auth/login
POST /api/auth/register
```

### Teachers
```http
GET /api/teachers
POST /api/teachers
PUT /api/teachers/{id}
DELETE /api/teachers/{id}
```

### Students
```http
GET /api/students
POST /api/students
PUT /api/students/{id}
DELETE /api/students/{id}
```

### Groups
```http
GET /api/groups
GET /api/groups/{id}
POST /api/groups
PUT /api/groups/{id}
DELETE /api/groups/{id}
POST /api/groups/{groupId}/sessions
```

### Enrollments (Key for Presence Creation)
```http
POST /api/enrollments
```

### Presences
```http
GET /api/presences
GET /api/presences/{id}
POST /api/presences
PUT /api/presences/{id}
DELETE /api/presences/{id}
```

### Sessions
```http
GET /api/sessions
POST /api/sessions
PUT /api/sessions/{id}
DELETE /api/sessions/{id}
```

### Attendance (Quick Update)
```http
POST /api/attendance
```

## Frontend Integration Scenarios

### Scenario 1: Enroll Student in Group
```javascript
// 1. Create enrollment (automatically creates pending presences)
const enrollment = await fetch('/api/enrollments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        studentId: 1,
        groupId: 2,
        initialSessionsCount: 4,
        initialSessionStartAt: "2024-01-15T10:00:00Z"
    })
});

// Result: 4 sessions created with 4 PENDING presences
```

### Scenario 2: View Group with Students & Presences
```javascript
// Get group with all student presences
const group = await fetch('/api/groups/2').then(r => r.json());

// Response structure:
{
    "id": 2,
    "name": "Math Group A",
    "teacherId": 1,
    "teacherName": "John Smith",
    "students": [
        {
            "id": 1,
            "name": "Ahmed Ali",
            "phoneNumber": "123456789",
            "presences": [
                {
                    "id": 1,
                    "studentName": "Ahmed Ali",
                    "groupName": "Math Group A",
                    "sessionDate": "2024-01-15",
                    "presenceStatus": 0  // Pending
                }
            ]
        }
    ]
}
```

### Scenario 3: Update Presence Status
```javascript
// Update presence from Pending to Present/Absent
const updatePresence = await fetch('/api/presences/1', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        studentId: 1,
        sessionId: 1,
        status: 1  // 0=Pending, 1=Present, 2=Absent
    })
});
```

### Scenario 4: Quick Attendance Update
```javascript
// Alternative way to update attendance
const attendance = await fetch('/api/attendance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        studentId: 1,
        sessionId: 1,
        status: 1  // Present
    })
});
```

## Request/Response Models

### EnrollmentRequest
```json
{
    "studentId": 1,
    "groupId": 2,
    "initialSessionsCount": 4,
    "initialSessionStartAt": "2024-01-15T10:00:00Z"
}
```

### PresenceRequest
```json
{
    "studentId": 1,
    "sessionId": 1,
    "status": 1
}
```

### PresenceResponse
```json
{
    "id": 1,
    "studentName": "Ahmed Ali",
    "groupName": "Math Group A",
    "sessionDate": "2024-01-15",
    "presenceStatus": 1
}
```

## Frontend Implementation Tips

### 1. Presence Status Display
```javascript
const getStatusText = (status) => {
    switch(status) {
        case 0: return 'Pending';
        case 1: return 'Present';
        case 2: return 'Absent';
        default: return 'Unknown';
    }
};

const getStatusColor = (status) => {
    switch(status) {
        case 0: return 'yellow';   // Pending
        case 1: return 'green';    // Present
        case 2: return 'red';      // Absent
        default: return 'gray';
    }
};
```

### 2. Attendance Grid Component
```javascript
// Example React component structure
const AttendanceGrid = ({ groupId }) => {
    const [group, setGroup] = useState(null);
    
    useEffect(() => {
        fetch(`/api/groups/${groupId}`)
            .then(r => r.json())
            .then(setGroup);
    }, [groupId]);
    
    const updatePresence = async (presenceId, newStatus) => {
        await fetch(`/api/presences/${presenceId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentId: student.id,
                sessionId: session.id,
                status: newStatus
            })
        });
        // Refresh data
    };
    
    return (
        <table>
            <thead>
                <tr>
                    <th>Student</th>
                    <th>Session Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {group?.students.map(student => 
                    student.presences.map(presence => (
                        <tr key={presence.id}>
                            <td>{presence.studentName}</td>
                            <td>{presence.sessionDate}</td>
                            <td>{getStatusText(presence.presenceStatus)}</td>
                            <td>
                                <button onClick={() => updatePresence(presence.id, 1)}>
                                    Present
                                </button>
                                <button onClick={() => updatePresence(presence.id, 2)}>
                                    Absent
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
};
```

## Database Schema Overview

- **Students** → **Enrollments** → **Groups** → **Teachers**
- **Enrollments** → **Sessions** → **Presences**
- When student enrolls → Sessions created → Presences auto-created as PENDING

## Development Setup

1. Clone repository
2. Navigate to `RamyScoolManagment/RamyScoolManagment.Api`
3. Run `dotnet run`
4. API available at `http://localhost:5132`
5. Swagger UI at `http://localhost:5132/swagger`