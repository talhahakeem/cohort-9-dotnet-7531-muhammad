#!/usr/bin/env pwsh

# Comprehensive API Test Script for Task Management System

$API_BASE = "https://localhost:7287/api"
$TEST_EMAIL = "apitest_$(Get-Random)@example.com"
$TEST_PASSWORD = "TestPass123!"

# Suppress SSL warnings for self-signed certs
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor [System.Net.SecurityProtocolType]::Tls12
$ProgressPreference = 'SilentlyContinue'

function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null,
        [string]$Token = $null,
        [string]$Description
    )
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        if ($Token) {
            $headers["Authorization"] = "Bearer $Token"
        }
        
        $params = @{
            Uri = "$API_BASE$Endpoint"
            Method = $Method
            Headers = $headers
            SkipCertificateCheck = $true
            ErrorAction = 'Stop'
        }
        
        if ($Body) {
            $params["Body"] = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-WebRequest @params
        Write-Host "✓ $Description - Status: $($response.StatusCode)" -ForegroundColor Green
        return $response.Content | ConvertFrom-Json
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.Value__
        Write-Host "✗ $Description - Status: $statusCode - Error: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Test 1: Register User
Write-Host "`n=== TESTING REGISTRATION ===" -ForegroundColor Cyan
$registerReq = @{
    firstName = "Test"
    lastName = "User"
    email = $TEST_EMAIL
    password = $TEST_PASSWORD
    confirmPassword = $TEST_PASSWORD
}
$registerResult = Test-Endpoint -Method POST -Endpoint "/Auth/register" -Body $registerReq -Description "Register new user"

# Test 2: Login User
Write-Host "`n=== TESTING LOGIN ===" -ForegroundColor Cyan
$loginReq = @{
    email = $TEST_EMAIL
    password = $TEST_PASSWORD
}
$loginResult = Test-Endpoint -Method POST -Endpoint "/Auth/login" -Body $loginReq -Description "Login user"
$userToken = $loginResult.token

if ($loginResult) {
    Write-Host "Token obtained: $(if ($userToken) { 'Yes' } else { 'No' })" -ForegroundColor Yellow
}

# Test 3: Get Profile
if ($userToken) {
    Write-Host "`n=== TESTING PROFILE ===" -ForegroundColor Cyan
    $profileResult = Test-Endpoint -Method GET -Endpoint "/Profile" -Token $userToken -Description "Get user profile"
    if ($profileResult) {
        Write-Host "User: $($profileResult.fullName) | Email: $($profileResult.email) | Role: $($profileResult.role)" -ForegroundColor Yellow
    }
}

# Test 4: Get Dashboard Stats
if ($userToken) {
    Write-Host "`n=== TESTING DASHBOARD ===" -ForegroundColor Cyan
    $dashboardResult = Test-Endpoint -Method GET -Endpoint "/Dashboard/stats" -Token $userToken -Description "Get dashboard stats"
    if ($dashboardResult) {
        Write-Host "Pending: $($dashboardResult.pendingTasks) | InProgress: $($dashboardResult.inProgressTasks) | Completed: $($dashboardResult.completedTasks)" -ForegroundColor Yellow
    }
}

# Test 5: Create Task
$createdTaskId = $null
if ($userToken) {
    Write-Host "`n=== TESTING TASK CREATION ===" -ForegroundColor Cyan
    $createTaskReq = @{
        title = "Test Task $(Get-Random)"
        description = "This is a test task"
        category = "Testing"
        dueDate = (Get-Date).AddDays(7).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        status = "Pending"
        priority = "High"
    }
    $createResult = Test-Endpoint -Method POST -Endpoint "/Tasks" -Body $createTaskReq -Token $userToken -Description "Create task"
    if ($createResult) {
        $createdTaskId = $createResult.id
        Write-Host "Created Task ID: $createdTaskId" -ForegroundColor Yellow
    }
}

# Test 6: Get All Tasks
if ($userToken) {
    Write-Host "`n=== TESTING GET TASKS ===" -ForegroundColor Cyan
    $allTasksResult = Test-Endpoint -Method GET -Endpoint "/Tasks" -Token $userToken -Description "Get all tasks"
    if ($allTasksResult -is [array]) {
        Write-Host "Tasks count: $($allTasksResult.Count)" -ForegroundColor Yellow
    } elseif ($allTasksResult) {
        Write-Host "Tasks count: 1" -ForegroundColor Yellow
    }
}

# Test 7: Get Task by ID
if ($userToken -and $createdTaskId) {
    Write-Host "`n=== TESTING GET TASK BY ID ===" -ForegroundColor Cyan
    $getTaskResult = Test-Endpoint -Method GET -Endpoint "/Tasks/$createdTaskId" -Token $userToken -Description "Get task by ID"
    if ($getTaskResult) {
        Write-Host "Task: $($getTaskResult.title) | Status: $($getTaskResult.status) | Priority: $($getTaskResult.priority)" -ForegroundColor Yellow
    }
}

# Test 8: Update Task
if ($userToken -and $createdTaskId) {
    Write-Host "`n=== TESTING TASK UPDATE ===" -ForegroundColor Cyan
    $updateTaskReq = @{
        title = "Updated Test Task"
        description = "Updated description"
        category = "Testing"
        dueDate = (Get-Date).AddDays(7).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        status = "InProgress"
        priority = "Medium"
    }
    $updateResult = Test-Endpoint -Method PUT -Endpoint "/Tasks/$createdTaskId" -Body $updateTaskReq -Token $userToken -Description "Update task"
}

# Test 9: Delete Task
if ($userToken -and $createdTaskId) {
    Write-Host "`n=== TESTING TASK DELETION ===" -ForegroundColor Cyan
    $deleteResult = Test-Endpoint -Method DELETE -Endpoint "/Tasks/$createdTaskId" -Token $userToken -Description "Delete task"
}

# Test 10: Admin Test - Login as Admin
Write-Host "`n=== TESTING ADMIN FLOW ===" -ForegroundColor Cyan
$adminLoginReq = @{
    email = "admin@taskflow.local"
    password = "Admin123!"
}
$adminLoginResult = Test-Endpoint -Method POST -Endpoint "/Auth/login" -Body $adminLoginReq -Description "Login as admin"
$adminToken = $adminLoginResult.token

# Test 11: Admin Get Users
if ($adminToken) {
    Write-Host "`n=== TESTING ADMIN USER MANAGEMENT ===" -ForegroundColor Cyan
    $adminUsersResult = Test-Endpoint -Method GET -Endpoint "/AdminUsers" -Token $adminToken -Description "Get all users (Admin)"
    if ($adminUsersResult -is [array]) {
        Write-Host "Total users: $($adminUsersResult.Count)" -ForegroundColor Yellow
    } elseif ($adminUsersResult) {
        Write-Host "Total users: 1+" -ForegroundColor Yellow
    }
}

Write-Host "`n=== TEST COMPLETE ===" -ForegroundColor Cyan
Write-Host "All critical flows have been tested against the live backend API." -ForegroundColor Green
