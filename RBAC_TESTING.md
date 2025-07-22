# RBAC Testing Guide

## 🔐 Role-Based Access Control (RBAC) Testing

### Current User Roles
- **Admin**: Full system access, user management, audit logs
- **User**: Basic application access only

## Testing Scenarios

### 1. Admin Route Protection
- **URL**: http://localhost:3001/admin
- **Expected**: Only admins can access
- **Test**: Try accessing as different user types

### 2. User Management Access
- **URL**: http://localhost:3001/admin/users  
- **Expected**: Only admins can view/modify users
- **Features**: Role changes, user deletion, admin notifications

### 3. Audit Log Access
- **URL**: http://localhost:3001/admin/audit
- **Expected**: Only admins can view audit trails
- **Features**: View all system actions and security events

### 4. API Endpoint Protection
- **Endpoint**: `/api/admin/users`
- **Expected**: Returns 403 for non-admins
- **Test**: Call API with different user sessions

## How to Test

### Step 1: Test as Admin User
1. Login with admin credentials
2. Visit `/admin` - Should see admin dashboard
3. Visit `/admin/users` - Should see user management
4. Try changing user roles - Should work
5. Try deleting users - Should work with confirmations

### Step 2: Test as Regular User  
1. Login with regular user credentials
2. Visit `/admin` - Should see "Access Denied"
3. Visit `/admin/users` - Should be redirected to login
4. Try API calls - Should get 403 Unauthorized

### Step 3: Test Role Changes
1. As admin, promote a user to admin
2. As admin, demote an admin to user
3. Verify notifications are sent
4. Check audit logs for all changes

### Step 4: Test Security Features
1. Try to demote yourself (should fail)
2. Try to demote last remaining admin (should fail)
3. Verify password confirmation for admin deletion
4. Check email/Slack notifications

## Test Users

To test properly, you need:
- At least 1 admin user
- At least 1 regular user

Create test accounts via registration and then promote one to admin.

## Verification Points

✅ **Route Protection**: Non-admins cannot access admin pages
✅ **API Security**: Admin APIs reject non-admin requests  
✅ **Self-Protection**: Admins cannot demote themselves
✅ **Last Admin Protection**: Cannot demote the last admin
✅ **Audit Logging**: All role changes are logged
✅ **Notifications**: Security alerts are sent
✅ **UI Controls**: Role-specific buttons and menus

## Current Status Check

Run these commands to check your current setup:

1. **Check if you have admin users**:
   - Go to `/admin/users` 
   - Look for users with "Admin" badge

2. **Create admin user if needed**:
   - Register a new account
   - Manually update database to set role: "admin"

3. **Test role switching**:
   - Use admin account to change user roles
   - Verify confirmations and notifications work

## Security Notes

- Middleware protects all `/admin/*` routes
- Server-side validation on all admin APIs
- Audit trail tracks all administrative actions
- Real-time notifications for security events
- Protection against common admin vulnerabilities
