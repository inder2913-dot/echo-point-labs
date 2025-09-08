# PROJECT WORKFLOW - DETAILED STEPWISE BREAKDOWN

## OVERVIEW
This document provides a comprehensive, step-by-step breakdown of the 6-step project workflow for device optimization and user profiling. This is designed to be implementation-ready for replication in any development environment.

---

## STEP 1: ORGANIZATION SETUP
**Purpose**: Collect project metadata and organization context

### Data Collected:
- `projectName` (required) - String
- `organizationType` (required) - String (from predefined list + custom industries)
- `companySize` - String (from predefined ranges)
- `description` - String (optional project description)

### Implementation Logic:

1. **Initialize Form State**:
   ```javascript
   const [formData, setFormData] = useState({
     projectName: initialData.projectName || "",
     organizationType: initialData.organizationType || "",
     companySize: initialData.companySize || "",
     description: initialData.description || ""
   })
   ```

2. **Predefined Options**:
   ```javascript
   const organizationTypes = [
     "Healthcare", "Financial Services", "Technology", "Manufacturing",
     "Education", "Government", "Retail", "Professional Services",
     "Non-Profit", "Other"
   ]
   
   const companySizes = [
     "1-50 employees", "51-200 employees", "201-1000 employees",
     "1001-5000 employees", "5000+ employees"
   ]
   ```

3. **Custom Industries Integration**:
   - Query Supabase `custom_industries` table
   - Filter by `user_id = current_user.id`
   - Display alongside standard options with "Custom" badge

4. **Validation Rules**:
   - `projectName`: Required, non-empty string
   - `organizationType`: Required, must be from predefined list or custom industry

5. **On Submit**:
   ```javascript
   onComplete({
     projectName: formData.projectName,
     organizationType: formData.organizationType,
     companySize: formData.companySize,
     description: formData.description
   })
   ```

---

## STEP 2: EMPLOYEE DATA UPLOAD
**Purpose**: Import employee information for user profiling

### Data Integration Options:
1. **Workday Integration** (Coming Soon)
2. **Dynamics 365 HR** (Coming Soon)
3. **CSV Upload** (Available)

### CSV Processing Logic:

1. **File Upload Handler**:
   ```javascript
   const handleFileUpload = async (event) => {
     const file = event.target.files?.[0]
     const text = await file.text()
     const lines = text.split('\n').filter(line => line.trim())
     const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
   }
   ```

2. **Header Mapping**:
   ```javascript
   // Map CSV headers to standard fields
   if (headerLower.includes('emp') && headerLower.includes('id')) {
     employee.id = value
   } else if (headerLower.includes('full') && headerLower.includes('name')) {
     employee.name = value
   } else if (headerLower.includes('department') || headerLower.includes('dept')) {
     employee.department = value
   } else if (headerLower.includes('job') && headerLower.includes('title')) {
     employee.role = value
   } else if (headerLower.includes('location') || headerLower.includes('office')) {
     employee.location = value
   }
   ```

3. **Data Enrichment**:
   - Combine first/last names if full name missing
   - Generate employee ID if missing
   - Store all unmapped fields with sanitized headers

4. **Expected CSV Format**:
   ```csv
   Employee ID,Full Name,Department,Job Title,Location
   EMP001,John Doe,Engineering,Software Engineer,New York
   EMP002,Jane Smith,Marketing,Marketing Specialist,San Francisco
   ```

5. **Output Data Structure**:
   ```javascript
   {
     employeeData: [
       {
         id: "EMP001",
         name: "John Doe",
         department: "Engineering",
         role: "Software Engineer",
         location: "New York"
       }
     ],
     uploadMethod: "csv"
   }
   ```

---

## STEP 3: DEVICE INVENTORY UPLOAD
**Purpose**: Import current device assignments and specifications

### Integration Options:
1. **Systrack Integration** (Coming Soon)
2. **Nexthink Integration** (Coming Soon)
3. **CSV Upload** (Available)

### CSV Processing Logic:

1. **Advanced Header Mapping**:
   ```javascript
   // Device identification
   if (headerLower.includes('device') && headerLower.includes('id')) {
     device.deviceId = value
   } else if (headerLower.includes('asset') && headerLower.includes('tag')) {
     device.deviceId = value
   } else if (headerLower.includes('serial') && headerLower.includes('number')) {
     device.deviceId = value
   }
   
   // User association
   if (headerLower.includes('user') && headerLower.includes('id')) {
     device.userId = value
   } else if (headerLower.includes('employee') && headerLower.includes('id')) {
     device.userId = value
   }
   
   // Hardware specifications
   if (headerLower.includes('cpu') || headerLower.includes('processor')) {
     device.cpu = value
   } else if (headerLower.includes('ram') || headerLower.includes('memory')) {
     device.ram = value
   } else if (headerLower.includes('storage') || headerLower.includes('disk')) {
     device.storage = value
   }
   ```

2. **Device Type Detection**:
   ```javascript
   if (!device.deviceType && device.model) {
     if (device.model.toLowerCase().includes('laptop') || 
         device.model.toLowerCase().includes('macbook')) {
       device.deviceType = 'Laptop'
     } else if (device.model.toLowerCase().includes('desktop') || 
                device.model.toLowerCase().includes('tower')) {
       device.deviceType = 'Desktop'
     }
   }
   ```

3. **Expected CSV Format**:
   ```csv
   Device ID,User ID,User Name,Device Type,Model,CPU,RAM,Storage,Operating System,Device Age
   DEV001,EMP001,John Doe,Laptop,Dell Latitude 7420,Intel i7-1185G7,16GB,512GB SSD,Windows 11,2 years
   ```

4. **Device Statistics Generation**:
   - Total device count
   - Laptop count (detected by model patterns)
   - Desktop count (detected by model patterns)

---

## STEP 4: USER PROFILING & BASELINES (CRITICAL STEP)
**Purpose**: Create user profiles and assign hardware baselines

### Profile Categories:

1. **Industry-Specific Profiles**:
   ```javascript
   const INDUSTRY_PROFILES = {
     retail: [
       {
         id: "store-manager",
         name: "Store Manager",
         criteria: ["Store Manager", "Assistant Manager", "Operations Manager"],
         baseline: {
           deviceType: "Desktop or Laptop",
           minRam: "16GB",
           minCpu: "Intel i5 / AMD Ryzen 5",
           minStorage: "512GB SSD",
           mobility: "Medium",
           specialRequirements: "Dual monitor support, POS integration"
         }
       }
     ]
   }
   ```

2. **Custom Industry Support**:
   - Query `custom_industry_profiles` table
   - Load profiles specific to user's custom industry
   - Fallback to default profiles if custom not available

### Auto-Assignment Logic:

```javascript
const autoAssignUsers = () => {
  const assignments = employees.map(employee => {
    let assignedProfile = null
    
    // Try to match by role/title
    for (const profile of availableProfiles) {
      if (profile.criteria.some(criterion => 
        employee.role?.toLowerCase().includes(criterion.toLowerCase())
      )) {
        assignedProfile = profile
        break
      }
    }
    
    // Fallback to department-based matching
    if (!assignedProfile) {
      assignedProfile = getDefaultProfileForDepartment(employee.department)
    }
    
    return {
      ...employee,
      assignedProfile: assignedProfile?.id,
      profileName: assignedProfile?.name
    }
  })
}
```

### Profile Editor Component:

```javascript
const ProfileEditor = ({ profile, onSave, onCancel }) => {
  const [editedProfile, setEditedProfile] = useState({
    ...profile,
    baseline: { ...profile.baseline }
  })
  
  // Hardware configuration options
  const ramOptions = ["4GB", "8GB", "16GB", "32GB", "64GB"]
  const cpuOptions = [
    "Intel i3 / AMD Ryzen 3",
    "Intel i5 / AMD Ryzen 5", 
    "Intel i7 / AMD Ryzen 7",
    "Intel i9 / AMD Ryzen 9"
  ]
  const storageOptions = [
    "256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD",
    "256GB HDD", "512GB HDD", "1TB HDD", "2TB HDD"
  ]
}
```

### Key Implementation Details:

1. **Profile Loading Priority**:
   - Custom industry profiles (from database)
   - Standard industry profiles (hardcoded)
   - Default fallback profiles

2. **Assignment Preview**:
   - Real-time table showing employee → profile mappings
   - Assignment count per profile
   - Ability to manually reassign users

3. **Profile Editing**:
   - Modal dialog for editing baseline requirements
   - Dropdown selectors for hardware specs
   - Real-time validation of requirements

4. **Data Persistence**:
   ```javascript
   const handleContinue = () => {
     onComplete({
       userProfiles: userProfiles,
       userAssignments: userAssignments,
       profileBaselines: profileBaselines
     })
   }
   ```

---

## STEP 5: DEVICE ANALYSIS & COMPARISON (CRITICAL STEP)
**Purpose**: Compare current devices against user profile baselines

### Analysis Engine:

1. **Device-Employee Matching**:
   ```javascript
   const analyzeDevices = async () => {
     // Load real device data from Supabase
     const { data: deviceInventoryData } = await supabase
       .from('project_data')
       .select('*')
       .eq('step_name', 'deviceInventory')
       .order('created_at', { ascending: false })
       .limit(1)
     
     const devices = deviceInventoryData[0]?.data || []
     const employees = initialData.userAssignments || []
     
     // Match devices to employees
     const results = employees.map(employee => {
       let userDevice = findDeviceForEmployee(employee, devices)
       let analysis = analyzeDeviceCompliance(userDevice, employee.assignedProfile)
       
       return {
         ...employee,
         device: userDevice,
         analysis: analysis,
         status: analysis.overallStatus,
         score: analysis.complianceScore,
         issues: analysis.identifiedIssues
       }
     })
   }
   ```

2. **Device Matching Strategies**:
   ```javascript
   const findDeviceForEmployee = (employee, devices) => {
     // Try exact ID match
     let device = devices.find(d => d.userId === employee.id)
     
     // Try name-based matching
     if (!device) {
       device = devices.find(d => 
         d.userName && employee.name && 
         d.userName.toLowerCase().includes(employee.name.toLowerCase())
       )
     }
     
     // Try computer name matching (first.last pattern)
     if (!device && employee.name) {
       const nameParts = employee.name.toLowerCase().split(' ')
       if (nameParts.length >= 2) {
         const expectedComputerName = `${nameParts[0]}.${nameParts[1]}`
         device = devices.find(d => 
           d.computername && 
           d.computername.toLowerCase().includes(expectedComputerName)
         )
       }
     }
     
     return device
   }
   ```

3. **Compliance Analysis**:
   ```javascript
   const analyzeDeviceCompliance = (device, profileBaseline) => {
     const issues = []
     let score = 100
     
     // RAM Analysis
     const deviceRam = parseMemoryValue(device.ram)
     const requiredRam = parseMemoryValue(profileBaseline.minRam)
     if (deviceRam < requiredRam) {
       issues.push(`RAM below requirement: ${device.ram} < ${profileBaseline.minRam}`)
       score -= 25
     }
     
     // Storage Analysis
     const deviceStorage = parseStorageValue(device.storage)
     const requiredStorage = parseStorageValue(profileBaseline.minStorage)
     if (deviceStorage < requiredStorage) {
       issues.push(`Storage below requirement`)
       score -= 20
     }
     
     // Age Analysis
     if (device.age && parseInt(device.age) > 4) {
       issues.push(`Device age exceeds recommended lifecycle`)
       score -= 30
     }
     
     // Determine overall status
     let status = 'compliant'
     if (score < 70) status = 'needs-upgrade'
     else if (score < 85) status = 'minor-issues'
     else if (score > 100) status = 'over-provisioned'
     
     return { overallStatus: status, complianceScore: score, identifiedIssues: issues }
   }
   ```

### Status Categories:

1. **Compliant** (85-100%): Device meets all requirements
2. **Minor Issues** (70-84%): Small gaps in specifications
3. **Needs Upgrade** (<70%): Significant deficiencies
4. **Over-Provisioned** (>100%): Exceeds requirements
5. **No Device**: Employee has no assigned device

### Analysis Results:

```javascript
const analysisResults = [
  {
    id: "EMP001",
    name: "John Smith",
    department: "Engineering",
    profile: "Senior Developer",
    device: {
      deviceId: "DEV001",
      model: "Dell Latitude 7420",
      cpu: "Intel i7-1185G7",
      ram: "16GB",
      storage: "512GB SSD"
    },
    status: "compliant",
    score: 95,
    issues: []
  }
]
```

### Summary Statistics:
- Overall compliance rate percentage
- Count by status category
- Device upgrade recommendations
- Over-provisioned devices for potential downgrade

---

## STEP 6: RECOMMENDATION ENGINE (CRITICAL STEP)
**Purpose**: Generate actionable optimization recommendations

### Recommendation Categories:

1. **Full Replacement** (needs-upgrade with multiple issues)
2. **Minor Upgrade** (specific component issues)
3. **Downgrade** (over-provisioned devices)
4. **New Assignment** (employees without devices)

### Recommendation Generation Logic:

```javascript
const generateRecommendations = () => {
  const comparisonResults = initialData.deviceComparison || []
  const generatedRecs = []
  let totalSavings = 0
  let upgradeCosts = 0
  let downgradeSavings = 0
  
  comparisonResults.forEach(result => {
    if (result.status === 'needs-upgrade') {
      const issues = result.issues || []
      const needsFullReplacement = issues.some(issue => 
        issue.includes('CPU') || 
        issue.includes('age') || 
        issue.includes('obsolete') ||
        (issues.length > 2)
      )
      
      if (needsFullReplacement) {
        // Full device replacement
        const recommendation = {
          userId: result.id,
          userName: result.name,
          type: 'replacement',
          priority: 'high',
          action: `Full device replacement with ${result.profile?.baseline.deviceType}`,
          reasoning: result.issues.join(', '),
          estimatedCost: 1500,
          timeline: '30 days',
          impact: 'High productivity gain expected'
        }
        generatedRecs.push(recommendation)
        upgradeCosts += 1500
      } else {
        // Minor fixes categorization
        issues.forEach(issue => {
          if (issue.toLowerCase().includes('storage') || issue.toLowerCase().includes('hdd')) {
            generatedRecs.push({
              type: 'minor-upgrade',
              action: 'Replace HDD with SSD',
              estimatedCost: 300,
              timeline: '1 week'
            })
          } else if (issue.toLowerCase().includes('ram')) {
            generatedRecs.push({
              type: 'minor-upgrade', 
              action: 'RAM upgrade',
              estimatedCost: 200,
              timeline: '1 week'
            })
          }
        })
      }
    } else if (result.status === 'over-provisioned') {
      // Potential downgrade
      generatedRecs.push({
        type: 'downgrade',
        action: 'Reassign to role requiring higher specs',
        estimatedCost: -800,
        timeline: '2 weeks'
      })
      downgradeSavings += 800
    } else if (result.status === 'no-device') {
      // New device assignment
      generatedRecs.push({
        type: 'new-assignment',
        action: `Assign new ${result.profile?.baseline.deviceType}`,
        estimatedCost: 1200,
        timeline: '3 weeks'
      })
    }
  })
}
```

### Cost Analysis Engine:

1. **Cost Categories**:
   ```javascript
   const costAnalysis = {
     totalRecommendations: recommendations.length,
     upgradeInvestment: recommendations
       .filter(r => r.estimatedCost > 0)
       .reduce((sum, r) => sum + r.estimatedCost, 0),
     downgradeSavings: Math.abs(recommendations
       .filter(r => r.estimatedCost < 0)
       .reduce((sum, r) => sum + r.estimatedCost, 0)),
     netImpact: recommendations.reduce((sum, r) => sum + r.estimatedCost, 0)
   }
   ```

2. **Priority-Based Costing**:
   - **Critical**: Security vulnerabilities, EOL devices
   - **High**: Performance bottlenecks, compliance issues  
   - **Medium**: Minor upgrades, optimization opportunities
   - **Low**: Nice-to-have improvements

### Security & Vulnerability Analysis:

1. **Security Issues Detection**:
   ```javascript
   // Windows 10 EOL detection
   if (device.os && device.os.includes('Windows 10')) {
     securityIssues.push({
       type: 'eol-os',
       severity: 'critical',
       description: 'Windows 10 reaching end of support',
       recommendation: 'Upgrade to Windows 11 or replace device'
     })
   }
   
   // Unpatched systems
   if (device.lastPatchDate && isOlderThan(device.lastPatchDate, 90)) {
     securityIssues.push({
       type: 'unpatched',
       severity: 'high', 
       description: 'System not updated in 90+ days'
     })
   }
   ```

2. **Battery Health Analysis**:
   ```javascript
   if (device.deviceType === 'Laptop') {
     if (device.batteryHealth && device.batteryHealth < 70) {
       recommendations.push({
         type: 'battery-replacement',
         priority: 'medium',
         estimatedCost: 150,
         reasoning: `Battery health at ${device.batteryHealth}%`
       })
     }
   }
   ```

### Project Cost Calculation:

```javascript
const calculateProjectCosts = (recommendations) => {
  const costBreakdown = {
    hardware: 0,
    labor: 0,
    opportunity: 0,
    training: 0
  }
  
  recommendations.forEach(rec => {
    // Hardware costs
    costBreakdown.hardware += rec.estimatedCost || 0
    
    // Labor costs (IT time for implementation)
    switch(rec.type) {
      case 'replacement':
        costBreakdown.labor += 200 // 4 hours @ $50/hr
        break
      case 'minor-upgrade':
        costBreakdown.labor += 100 // 2 hours @ $50/hr
        break
      case 'new-assignment':
        costBreakdown.labor += 150 // 3 hours @ $50/hr
        break
    }
    
    // Training costs for new devices
    if (rec.type === 'replacement' && rec.action.includes('different OS')) {
      costBreakdown.training += 300
    }
  })
  
  return costBreakdown
}
```

### Data Persistence:

```javascript
const saveProject = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  // Save main project record
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      name: initialData.projectName,
      status: 'completed',
      user_id: user.id,
      organization_type: initialData.organizationType,
      industry: initialData.organizationType
    })
    .select()
    .single()
  
  // Save detailed project data
  await supabase
    .from('project_data')
    .insert({
      project_id: project.id,
      step_name: 'recommendations',
      data: {
        recommendations: recommendations,
        costAnalysis: costAnalysis,
        summary: summary
      }
    })
}
```

---

## IMPLEMENTATION GUIDELINES FOR REPLIT

### 1. **State Management**:
- Use React useState for component-level state
- Pass data between steps via props and callbacks
- Store step completion status in parent component

### 2. **File Upload Processing**:
- Use FileReader API for CSV parsing
- Implement robust header mapping with fallbacks
- Handle various CSV formats and encoding issues

### 3. **Database Integration**:
- Use Supabase client for data persistence
- Implement proper error handling and loading states
- Query real data for analysis steps (steps 4-6)

### 4. **UI Components**:
- Use shadcn/ui component library
- Implement proper loading and success states
- Add proper validation and error messages

### 5. **Data Flow**:
```
Step 1 → Organization data
Step 2 → Employee data → Store in projectData.employeeData
Step 3 → Device data → Store in projectData.deviceData  
Step 4 → User profiles → Store in projectData.userProfiles + userAssignments
Step 5 → Analysis results → Store in projectData.deviceComparison
Step 6 → Recommendations → Store in projectData.recommendations + Save to DB
```

### 6. **Critical Functions to Implement**:
- CSV parsing with flexible header mapping
- Device-employee matching algorithms
- Compliance analysis engine
- Recommendation generation logic
- Cost calculation formulas
- Data persistence to database

This breakdown should provide everything needed to implement the exact functionality in Replit or any other development environment.