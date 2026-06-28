# AWS Learning Roadmap for Frontend Developers
## Mastering EC2, S3, CloudFront, Lambda, and Amplify

> **Duration:** 8-12 weeks (with 10-15 hours per week)  
> **Level:** Beginner to Advanced  
> **Focus:** Hands-on, project-based learning

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Phase 0: AWS Fundamentals (Week 1)](#phase-0-aws-fundamentals-week-1)
3. [Phase 1: Storage & Hosting with S3 (Week 2)](#phase-1-storage--hosting-with-s3-week-2)
4. [Phase 2: Content Delivery with CloudFront (Week 3)](#phase-2-content-delivery-with-cloudfront-week-3)
5. [Phase 3: Serverless Computing with Lambda (Weeks 4-5)](#phase-3-serverless-computing-with-lambda-weeks-4-5)
6. [Phase 4: Virtual Servers with EC2 (Week 6)](#phase-4-virtual-servers-with-ec2-week-6)
7. [Phase 5: Full-Stack with Amplify (Weeks 7-8)](#phase-5-full-stack-with-amplify-weeks-7-8)
8. [Phase 6: Integration & Advanced Patterns (Weeks 9-10)](#phase-6-integration--advanced-patterns-weeks-9-10)
9. [Phase 7: Production Best Practices (Weeks 11-12)](#phase-7-production-best-practices-weeks-11-12)
10. [Capstone Project](#capstone-project)
11. [Resources & Next Steps](#resources--next-steps)

---

## Prerequisites

### **Required Knowledge:**
- ✅ HTML, CSS, JavaScript fundamentals
- ✅ Basic understanding of HTTP/HTTPS
- ✅ Command line basics (terminal/bash)
- ✅ Git fundamentals
- ✅ Node.js and npm basics

### **Required Tools:**
- AWS Account (Free Tier eligible)
- AWS CLI installed (optional for beginners, essential for intermediate+)
- Code editor (VS Code recommended)
- Git installed
- Node.js (v18+) installed

### **Learning Approach: Console First, CLI Later**

**For Beginners (Weeks 1-4):**
- ✅ Use AWS Console (web interface) primarily
- ✅ Learn by clicking and exploring
- ✅ Understand what each service does visually
- ⚠️ CLI commands provided as reference only

**For Intermediate (Weeks 5-8):**
- ✅ Start using CLI for repetitive tasks
- ✅ Copy-paste CLI commands from the guide
- ✅ Gradually understand command structure
- ⚠️ Still use Console for complex configurations

**For Advanced (Weeks 9-12):**
- ✅ Prefer CLI for most operations
- ✅ Write your own automation scripts
- ✅ Use Infrastructure as Code (CloudFormation/CDK)
- ⚠️ Use Console only for troubleshooting

### **Setup Checklist:**

**Essential (Start Here):**
```bash
# 1. Create AWS Free Tier Account
# Visit: https://aws.amazon.com/free/
# 2. Set up MFA (Multi-Factor Authentication)
# 3. Create billing alerts in Console
```

**Optional but Recommended (Install when ready for CLI):**
```bash
# Install AWS CLI
# macOS
brew install awscli

# Windows
# Download from: https://aws.amazon.com/cli/

# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Verify installation
aws --version

# Configure AWS CLI
aws configure
# Enter:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region (e.g., us-east-1)
# - Default output format (json)

# Verify configuration
aws sts get-caller-identity
```

### **Safety First - Budget Setup:**
```bash
# Set up billing alerts (highly recommended!)
# 1. Go to AWS Billing Dashboard
# 2. Create a budget (e.g., $10/month)
# 3. Set up email alerts at 50%, 80%, 100%
```

---

## CLI vs Console: Complete Guide

### **Why Both Approaches Are Provided in This Roadmap**

This roadmap includes both CLI commands and Console instructions because:

1. **CLI commands document the exact steps** - Even if you use Console, seeing the CLI version helps understand what's happening
2. **You can choose your preference** - Use whichever method you're comfortable with
3. **CLI becomes essential later** - For automation, CI/CD, and professional workflows

### **How to Use This Roadmap Based on Your Preference:**

#### **Option 1: Console-First (Recommended for Beginners)**

```
📋 Read the CLI command → 🖱️ Do it in Console → ✅ Understand the concept
```

**Example: Creating an S3 Bucket**

**CLI Version (in roadmap):**
```bash
aws s3 mb s3://my-bucket-name
```

**Console Version (what you actually do):**
1. Go to AWS Console → S3
2. Click "Create bucket"
3. Enter bucket name: `my-bucket-name`
4. Select region
5. Click "Create bucket"

**Result:** Same outcome, but Console shows you all the options!

#### **Option 2: CLI-First (For Those Comfortable with Terminal)**

Just copy-paste the commands and learn as you go.

#### **Option 3: Hybrid (Best Long-term Approach)**

- **First time:** Use Console to understand visually
- **Second time:** Use CLI command from roadmap
- **Third time:** Write your own script

### **Real-World Scenarios:**

#### **Scenario 1: Deploying Your Website**

**Console Approach:**
```
1. Open AWS Console (2 minutes)
2. Navigate to S3 (30 seconds)
3. Click through bucket settings (2 minutes)
4. Upload files one by one or in batches (5 minutes)
5. Configure static hosting (2 minutes)
6. Navigate to CloudFront (1 minute)
7. Create distribution (3 minutes)
8. Wait and refresh to get domain (1 minute)

Total: ~15-20 minutes of clicking
```

**CLI Approach:**
```bash
# deploy.sh
aws s3 sync ./dist s3://my-bucket --delete
aws cloudfront create-invalidation --distribution-id E123 --paths "/*"

# Run: ./deploy.sh
Total: 10 seconds
```

**When to use each:**
- Console: First deployment or setup
- CLI: Every subsequent deployment (daily/weekly)

#### **Scenario 2: Debugging Issues**

**Best Approach: Console**
- Visual logs in CloudWatch
- Click through configuration
- See error messages highlighted
- Explore related resources

#### **Scenario 3: Setting Up 10 Environments**

**Best Approach: CLI/IaC**
- One script, multiple environments
- Consistent configuration
- Version controlled
- Easily repeatable

### **Translation Guide: CLI → Console**

Here's how to "translate" common CLI commands to Console actions:

```bash
# CLI: aws s3 ls
# Console: Go to S3 → View buckets list

# CLI: aws s3 cp file.txt s3://bucket/
# Console: S3 → bucket → Upload → Select file

# CLI: aws lambda invoke --function-name my-func
# Console: Lambda → Functions → my-func → Test

# CLI: aws cloudfront create-invalidation
# Console: CloudFront → Distribution → Invalidations → Create

# CLI: aws logs tail /aws/lambda/my-func
# Console: CloudWatch → Log groups → /aws/lambda/my-func → View logs
```

### **What You MUST Know CLI For (Non-negotiable for Senior Developers):**

1. **CI/CD Pipelines** - Jenkins, GitHub Actions, etc. require CLI
   ```yaml
   # .github/workflows/deploy.yml
   - run: aws s3 sync ./dist s3://my-bucket
   ```

2. **Deployment Scripts** - Team needs repeatable deployments
   ```bash
   #!/bin/bash
   npm run build
   aws s3 sync ./dist s3://${BUCKET}
   aws cloudfront create-invalidation --distribution-id ${DIST_ID} --paths "/*"
   ```

3. **Infrastructure as Code** - CloudFormation, Terraform, CDK
   ```bash
   aws cloudformation deploy --template-file template.yml
   ```

4. **Automated Testing** - Test your infrastructure
   ```bash
   aws s3 ls s3://my-bucket || exit 1
   ```

### **What You CAN Do in Console (Totally Fine):**

1. **Initial Setup** - Creating VPCs, setting up IAM
2. **Complex Configurations** - Lambda with many triggers
3. **Exploration** - Learning new services
4. **Troubleshooting** - Debugging issues
5. **One-off Tasks** - Creating a test resource
6. **Monitoring** - Viewing CloudWatch dashboards

### **Practical Learning Path:**

**Week 1-2: 100% Console**
- Get comfortable with AWS interface
- Understand service relationships
- Learn by exploring

**Week 3-4: 80% Console, 20% CLI**
- Try simple CLI commands
- Use CLI for file uploads
- Still configure in Console

**Week 5-6: 50% Console, 50% CLI**
- Use CLI for repetitive tasks
- Create simple deployment scripts
- Console for new features

**Week 7-8: 30% Console, 70% CLI**
- Prefer CLI for known tasks
- Script common workflows
- Console for debugging

**Week 9-12: 20% Console, 80% CLI**
- Automate everything possible
- Use Infrastructure as Code
- Console for troubleshooting only

### **My Recommendation for Frontend Developers:**

```javascript
const learningStrategy = {
  phase1_Understanding: 'Console',      // See and learn
  phase2_Practicing: 'Both',            // Build muscle memory
  phase3_Professional: 'CLI + IaC',     // Production workflows
  phase4_Debugging: 'Console',          // Visual troubleshooting
};
```

### **Bottom Line:**

> **Start with Console to understand, transition to CLI for efficiency, master both for professional work.**

**You don't need to memorize bash commands** - you need to:
1. ✅ Understand what each service does (Console is great for this)
2. ✅ Know when to automate (CLI becomes essential)
3. ✅ Copy good scripts (you can use the roadmap's commands)
4. ✅ Gradually build your own automation

**The roadmap includes CLI commands so you can:**
- See exactly what's being configured (documentation)
- Copy-paste when you're ready (convenience)
- Learn automation gradually (professional development)
- Have reference for CI/CD later (career advancement)

---

## Phase 0: AWS Fundamentals (Week 1)

### **Learning Objectives:**
- Understand cloud computing basics
- Navigate AWS Console
- Understand AWS regions and availability zones
- Learn IAM basics
- Understand AWS billing

### **Day 1-2: AWS Overview & Account Setup**

**Theory (2 hours):**
- What is cloud computing?
- AWS global infrastructure
- AWS Free Tier details
- Shared responsibility model

**Hands-on (2 hours):**
```bash
# Task 1: Explore AWS Console
# - Navigate different service dashboards
# - Understand service categorization
# - Bookmark frequently used services

# Task 2: Set up MFA (Multi-Factor Authentication)
# 1. Go to IAM → Root user → Security credentials
# 2. Enable MFA using Google Authenticator or similar
# 3. Test login with MFA

# Task 3: Create billing alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "BillingAlert" \
  --alarm-description "Alert when charges exceed $10" \
  --metric-name EstimatedCharges \
  --namespace AWS/Billing \
  --statistic Maximum \
  --period 21600 \
  --evaluation-periods 1 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold
```

### **Day 3-4: IAM Deep Dive**

**Theory (2 hours):**
- Users, groups, roles, policies
- Principle of least privilege
- IAM best practices

**Hands-on (3 hours):**
```bash
# Task 1: Create IAM user for yourself (don't use root!)
aws iam create-user --user-name frontend-developer

# Task 2: Create a group with appropriate permissions
aws iam create-group --group-name frontend-developers

# Task 3: Attach managed policies to group
aws iam attach-group-policy \
  --group-name frontend-developers \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

aws iam attach-group-policy \
  --group-name frontend-developers \
  --policy-arn arn:aws:iam::aws:policy/CloudFrontFullAccess

# Task 4: Add user to group
aws iam add-user-to-group \
  --user-name frontend-developer \
  --group-name frontend-developers

# Task 5: Create access keys for your user
aws iam create-access-key --user-name frontend-developer

# Task 6: Configure AWS CLI with your new user credentials
aws configure --profile frontend-dev
```

**Practice Exercise:**
Create a custom IAM policy that allows:
- Read/Write to a specific S3 bucket
- CloudFront invalidation permissions
- CloudWatch Logs read access

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::my-learning-bucket",
        "arn:aws:s3:::my-learning-bucket/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation",
        "cloudfront:ListInvalidations"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:DescribeLogGroups",
        "logs:DescribeLogStreams",
        "logs:GetLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

### **Day 5-7: AWS CLI Mastery**

**Hands-on (5 hours):**
```bash
# Essential AWS CLI commands practice

# 1. Service discovery
aws help
aws s3 help
aws s3 ls help

# 2. Working with profiles
aws configure list-profiles
aws s3 ls --profile frontend-dev

# 3. Output formats
aws s3 ls --output json
aws s3 ls --output table
aws s3 ls --output text

# 4. Filtering with JMESPath
aws iam list-users --query 'Users[?UserName==`frontend-developer`]'
aws s3 ls --query 'Buckets[?contains(Name, `test`)]'

# 5. Pagination
aws s3api list-objects --bucket my-bucket --max-items 10
aws s3api list-objects --bucket my-bucket --starting-token NEXT_TOKEN
```

### **Week 1 Checkpoint:**
- [ ] AWS account created and secured with MFA
- [ ] IAM user created (not using root)
- [ ] Billing alerts configured
- [ ] AWS CLI installed and configured
- [ ] Completed IAM policy exercise
- [ ] Comfortable with basic AWS CLI commands

---

## Phase 1: Storage & Hosting with S3 (Week 2)

### **Learning Objectives:**
- Understand S3 concepts (buckets, objects, regions)
- Host static websites on S3
- Configure bucket policies and CORS
- Work with S3 versioning and lifecycle rules
- Generate presigned URLs

### **Day 1-2: S3 Fundamentals**

**Theory (2 hours):**
- Object storage vs block storage vs file storage
- S3 bucket naming rules
- Storage classes
- S3 pricing model
- Data consistency model

**Hands-on (3 hours):**
```bash
# Task 1: Create your first S3 bucket
aws s3 mb s3://my-first-frontend-website-$(date +%s) --region us-east-1

# Save bucket name to environment variable
export BUCKET_NAME="my-first-frontend-website-XXXXXX"

# Task 2: Upload files
echo "Hello AWS!" > index.html
aws s3 cp index.html s3://${BUCKET_NAME}/

# Task 3: List objects
aws s3 ls s3://${BUCKET_NAME}/

# Task 4: Download files
aws s3 cp s3://${BUCKET_NAME}/index.html ./downloaded.html

# Task 5: Sync directories
mkdir my-website
cd my-website
echo "<h1>Home</h1>" > index.html
echo "<h1>About</h1>" > about.html
mkdir assets
echo "body { color: blue; }" > assets/style.css

aws s3 sync . s3://${BUCKET_NAME}/ --delete

# Task 6: Check what will be synced (dry run)
aws s3 sync . s3://${BUCKET_NAME}/ --dryrun
```

### **Day 3-4: Static Website Hosting**

**Project: Host Your First Static Website**

```bash
# Step 1: Create a simple website
mkdir portfolio-website
cd portfolio-website

# Create index.html
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Portfolio</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Welcome to My Portfolio</h1>
        <nav>
            <a href="index.html">Home</a>
            <a href="about.html">About</a>
            <a href="projects.html">Projects</a>
        </nav>
    </header>
    <main>
        <h2>Hello, I'm learning AWS!</h2>
        <p>This website is hosted on Amazon S3.</p>
    </main>
    <script src="script.js"></script>
</body>
</html>
EOF

# Create style.css
cat > style.css << 'EOF'
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

header {
    text-align: center;
    padding: 2rem;
}

nav {
    margin-top: 1rem;
}

nav a {
    color: white;
    text-decoration: none;
    margin: 0 1rem;
    padding: 0.5rem 1rem;
    border: 2px solid white;
    border-radius: 5px;
    transition: all 0.3s;
}

nav a:hover {
    background: white;
    color: #667eea;
}

main {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
}
EOF

# Create script.js
cat > script.js << 'EOF'
console.log('Website loaded successfully!');
console.log('Hosted on AWS S3');

// Add timestamp
document.addEventListener('DOMContentLoaded', () => {
    const timestamp = new Date().toLocaleString();
    const p = document.createElement('p');
    p.textContent = `Last loaded: ${timestamp}`;
    document.querySelector('main').appendChild(p);
});
EOF

# Create error page
cat > error.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>404 - Page Not Found</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <main style="text-align: center;">
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <a href="index.html">Go Home</a>
    </main>
</body>
</html>
EOF

# Step 2: Upload to S3
aws s3 sync . s3://${BUCKET_NAME}/ --delete

# Step 3: Enable static website hosting
aws s3 website s3://${BUCKET_NAME}/ \
  --index-document index.html \
  --error-document error.html

# Step 4: Make bucket public (for static website)
# First, disable Block Public Access
aws s3api put-public-access-block \
  --bucket ${BUCKET_NAME} \
  --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# Then, add bucket policy
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \
  --bucket ${BUCKET_NAME} \
  --policy file://bucket-policy.json

# Step 5: Get website URL
aws s3api get-bucket-website --bucket ${BUCKET_NAME}
echo "Website URL: http://${BUCKET_NAME}.s3-website-us-east-1.amazonaws.com"

# Visit the URL in your browser!
```

### **Day 5: Advanced S3 Features**

**Hands-on Exercises:**

```bash
# Exercise 1: Enable versioning
aws s3api put-bucket-versioning \
  --bucket ${BUCKET_NAME} \
  --versioning-configuration Status=Enabled

# Upload a new version
echo "<h1>Updated Home Page</h1>" > index.html
aws s3 cp index.html s3://${BUCKET_NAME}/

# List versions
aws s3api list-object-versions --bucket ${BUCKET_NAME}

# Exercise 2: Lifecycle rules
cat > lifecycle.json << 'EOF'
{
  "Rules": [
    {
      "Id": "DeleteOldVersions",
      "Status": "Enabled",
      "NoncurrentVersionExpiration": {
        "NoncurrentDays": 30
      }
    },
    {
      "Id": "TransitionToIA",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 90,
          "StorageClass": "STANDARD_IA"
        }
      ],
      "Filter": {
        "Prefix": "archives/"
      }
    }
  ]
}
EOF

aws s3api put-bucket-lifecycle-configuration \
  --bucket ${BUCKET_NAME} \
  --lifecycle-configuration file://lifecycle.json

# Exercise 3: CORS configuration
cat > cors.json << 'EOF'
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
EOF

aws s3api put-bucket-cors \
  --bucket ${BUCKET_NAME} \
  --cors-configuration file://cors.json

# Exercise 4: Server-side encryption
aws s3api put-bucket-encryption \
  --bucket ${BUCKET_NAME} \
  --server-side-encryption-configuration \
    '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'

# Exercise 5: Object metadata and tags
aws s3 cp index.html s3://${BUCKET_NAME}/index.html \
  --metadata author="YourName",version="2.0" \
  --cache-control "max-age=86400" \
  --content-type "text/html" \
  --tagging "Environment=Production&Project=Portfolio"
```

### **Day 6-7: Presigned URLs and Security**

**Theory (1 hour):**
- Presigned URLs concept
- Use cases (secure uploads/downloads)
- Expiration times
- Security best practices

**Hands-on Project: Secure File Upload System**

```javascript
// create-presigned-url.js
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({ region: 'us-east-1' });

async function generateUploadUrl(fileName, fileType) {
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: `uploads/${Date.now()}-${fileName}`,
    ContentType: fileType,
    Metadata: {
      uploadedBy: 'user-123',
      uploadedAt: new Date().toISOString()
    }
  });

  const url = await getSignedUrl(s3Client, command, { 
    expiresIn: 300 // 5 minutes
  });
  
  return url;
}

// Example usage
(async () => {
  const uploadUrl = await generateUploadUrl('test.jpg', 'image/jpeg');
  console.log('Upload URL:', uploadUrl);
  console.log('\nUse this URL to upload a file:');
  console.log(`curl -X PUT -T your-file.jpg "${uploadUrl}"`);
})();
```

```html
<!-- frontend-upload.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Secure S3 Upload</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
        }
        #drop-zone {
            border: 3px dashed #ccc;
            border-radius: 10px;
            padding: 50px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
        }
        #drop-zone:hover, #drop-zone.drag-over {
            border-color: #4CAF50;
            background: #f0f0f0;
        }
        #progress {
            display: none;
            margin-top: 20px;
        }
        .progress-bar {
            width: 100%;
            height: 30px;
            background: #f0f0f0;
            border-radius: 15px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: #4CAF50;
            width: 0%;
            transition: width 0.3s;
        }
    </style>
</head>
<body>
    <h1>Secure File Upload to S3</h1>
    
    <div id="drop-zone">
        <p>Click to select file or drag and drop here</p>
        <input type="file" id="file-input" style="display: none">
    </div>
    
    <div id="progress">
        <p id="status">Uploading...</p>
        <div class="progress-bar">
            <div class="progress-fill"></div>
        </div>
    </div>
    
    <div id="result"></div>

    <script>
        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('file-input');
        const progress = document.getElementById('progress');
        const status = document.getElementById('status');
        const result = document.getElementById('result');

        // API endpoint to get presigned URL (you'll need to create this)
        const API_ENDPOINT = 'YOUR_API_ENDPOINT/get-upload-url';

        dropZone.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) uploadFile(file);
        });

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file) uploadFile(file);
        });

        async function uploadFile(file) {
            try {
                progress.style.display = 'block';
                status.textContent = 'Getting upload URL...';

                // Step 1: Get presigned URL from your backend
                const response = await fetch(API_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fileName: file.name,
                        fileType: file.type
                    })
                });

                const { uploadUrl, fileKey } = await response.json();

                // Step 2: Upload directly to S3
                status.textContent = 'Uploading to S3...';
                
                const xhr = new XMLHttpRequest();
                
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        document.querySelector('.progress-fill').style.width = percentComplete + '%';
                        status.textContent = `Uploading... ${Math.round(percentComplete)}%`;
                    }
                });

                xhr.addEventListener('load', () => {
                    if (xhr.status === 200) {
                        status.textContent = 'Upload successful!';
                        result.innerHTML = `
                            <p style="color: green; margin-top: 20px;">
                                ✓ File uploaded successfully!<br>
                                File key: ${fileKey}
                            </p>
                        `;
                    } else {
                        throw new Error('Upload failed');
                    }
                });

                xhr.addEventListener('error', () => {
                    throw new Error('Upload failed');
                });

                xhr.open('PUT', uploadUrl);
                xhr.setRequestHeader('Content-Type', file.type);
                xhr.send(file);

            } catch (error) {
                console.error('Upload error:', error);
                status.textContent = 'Upload failed!';
                result.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
            }
        }
    </script>
</body>
</html>
```

### **Week 2 Checkpoint:**
- [ ] Created and configured S3 buckets
- [ ] Hosted a static website on S3
- [ ] Configured bucket policies and CORS
- [ ] Implemented versioning and lifecycle rules
- [ ] Generated and used presigned URLs
- [ ] Understand S3 security best practices

---

## Phase 2: Content Delivery with CloudFront (Week 3)

### **Learning Objectives:**
- Understand CDN concepts
- Create and configure CloudFront distributions
- Implement caching strategies
- Use Lambda@Edge for edge computing
- Optimize performance and costs

### **Day 1-2: CloudFront Basics**

**Theory (2 hours):**
- What is a CDN?
- Edge locations vs regional edge caches
- CloudFront vs S3 website hosting
- Origin types (S3, custom origins)
- Cache hit ratio optimization

**Hands-on (3 hours):**

```bash
# Task 1: Create Origin Access Identity (OAI)
aws cloudfront create-cloud-front-origin-access-identity \
  --cloud-front-origin-access-identity-config \
    CallerReference=$(date +%s),Comment="OAI for my website"

# Save the OAI ID
export OAI_ID="YOUR_OAI_ID"

# Task 2: Update S3 bucket policy to allow CloudFront
cat > cloudfront-bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontOAI",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${OAI_ID}"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
    }
  ]
}
EOF

# Remove public access (not needed with CloudFront)
aws s3api put-public-access-block \
  --bucket ${BUCKET_NAME} \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

aws s3api put-bucket-policy \
  --bucket ${BUCKET_NAME} \
  --policy file://cloudfront-bucket-policy.json

# Task 3: Create CloudFront distribution
cat > distribution-config.json << EOF
{
  "CallerReference": "$(date +%s)",
  "Comment": "My first CloudFront distribution",
  "Enabled": true,
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-${BUCKET_NAME}",
        "DomainName": "${BUCKET_NAME}.s3.us-east-1.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": "origin-access-identity/cloudfront/${OAI_ID}"
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-${BUCKET_NAME}",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"],
      "CachedMethods": {
        "Quantity": 2,
        "Items": ["GET", "HEAD"]
      }
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "Compress": true,
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000
  },
  "CustomErrorResponses": {
    "Quantity": 2,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponseCode": "200",
        "ResponsePagePath": "/index.html",
        "ErrorCachingMinTTL": 300
      },
      {
        "ErrorCode": 403,
        "ResponseCode": "200",
        "ResponsePagePath": "/index.html",
        "ErrorCachingMinTTL": 300
      }
    ]
  },
  "DefaultRootObject": "index.html"
}
EOF

# Create the distribution (this takes 15-20 minutes to deploy)
aws cloudfront create-distribution \
  --distribution-config file://distribution-config.json

# Get distribution ID and domain
aws cloudfront list-distributions \
  --query 'DistributionList.Items[0].[Id,DomainName]' \
  --output text
```

### **Day 3-4: Caching Strategies**

**Project: Implement Optimal Caching**

```bash
# Create a website with different file types
mkdir cached-website
cd cached-website

# HTML files (dynamic content, no cache)
cat > index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Caching Demo</title>
    <link rel="stylesheet" href="/assets/css/style.css?v=1">
</head>
<body>
    <h1>CloudFront Caching Demo</h1>
    <p>Page loaded at: <span id="time"></span></p>
    <img src="/assets/images/logo.png" alt="Logo">
    <script src="/assets/js/app.js?v=1"></script>
</body>
</html>
EOF

# CSS (long-term cache with versioning)
mkdir -p assets/css
cat > assets/css/style.css << 'EOF'
body {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 50px auto;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

img {
    max-width: 100%;
    border-radius: 10px;
}
EOF

# JavaScript (long-term cache with versioning)
mkdir -p assets/js
cat > assets/js/app.js << 'EOF'
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('time').textContent = new Date().toLocaleString();
    console.log('Cache-Control headers:');
    console.log('HTML: no-cache');
    console.log('CSS/JS: max-age=31536000, immutable');
    console.log('Images: max-age=86400');
});
EOF

# Upload with appropriate cache headers
# HTML - no cache
aws s3 cp index.html s3://${BUCKET_NAME}/ \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/html"

# CSS/JS - long-term cache (use versioning)
aws s3 cp assets/css/style.css s3://${BUCKET_NAME}/assets/css/ \
  --cache-control "public, max-age=31536000, immutable" \
  --content-type "text/css"

aws s3 cp assets/js/app.js s3://${BUCKET_NAME}/assets/js/ \
  --cache-control "public, max-age=31536000, immutable" \
  --content-type "application/javascript"

# Images - medium-term cache
# (Create a sample image or use an existing one)
aws s3 cp assets/images/ s3://${BUCKET_NAME}/assets/images/ \
  --recursive \
  --cache-control "public, max-age=86400"

# Create cache invalidation
aws cloudfront create-invalidation \
  --distribution-id ${DISTRIBUTION_ID} \
  --paths "/*"

# Monitor invalidation status
aws cloudfront get-invalidation \
  --distribution-id ${DISTRIBUTION_ID} \
  --id ${INVALIDATION_ID}
```

**Cache Invalidation Script:**

```bash
#!/bin/bash
# invalidate-cache.sh

DISTRIBUTION_ID=$1
PATHS=$2

if [ -z "$DISTRIBUTION_ID" ] || [ -z "$PATHS" ]; then
    echo "Usage: ./invalidate-cache.sh DISTRIBUTION_ID 'PATHS'"
    echo "Example: ./invalidate-cache.sh E123456789 '/index.html /assets/*'"
    exit 1
fi

echo "Creating cache invalidation..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id ${DISTRIBUTION_ID} \
  --paths ${PATHS} \
  --query 'Invalidation.Id' \
  --output text)

echo "Invalidation created: ${INVALIDATION_ID}"
echo "Waiting for completion..."

while true; do
    STATUS=$(aws cloudfront get-invalidation \
      --distribution-id ${DISTRIBUTION_ID} \
      --id ${INVALIDATION_ID} \
      --query 'Invalidation.Status' \
      --output text)
    
    echo "Status: ${STATUS}"
    
    if [ "$STATUS" = "Completed" ]; then
        echo "✓ Cache invalidation completed!"
        break
    fi
    
    sleep 10
done
```

### **Day 5-6: Lambda@Edge**

**Theory (1 hour):**
- Lambda@Edge vs CloudFront Functions
- Edge function event types (viewer request/response, origin request/response)
- Use cases and limitations

**Project: Security Headers with Lambda@Edge**

```javascript
// security-headers.js
'use strict';

exports.handler = async (event) => {
    const response = event.Records[0].cf.response;
    const headers = response.headers;

    // Security headers
    headers['strict-transport-security'] = [{
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubdomains; preload'
    }];
    
    headers['content-security-policy'] = [{
        key: 'Content-Security-Policy',
        value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
    }];
    
    headers['x-content-type-options'] = [{
        key: 'X-Content-Type-Options',
        value: 'nosniff'
    }];
    
    headers['x-frame-options'] = [{
        key: 'X-Frame-Options',
        value: 'DENY'
    }];
    
    headers['x-xss-protection'] = [{
        key: 'X-XSS-Protection',
        value: '1; mode=block'
    }];
    
    headers['referrer-policy'] = [{
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin'
    }];
    
    headers['permissions-policy'] = [{
        key: 'Permissions-Policy',
        value: 'geolocation=(), microphone=(), camera=()'
    }];

    return response;
};
```

**Deployment:**

```bash
# Package Lambda function
zip security-headers.zip security-headers.js

# Create IAM role for Lambda@Edge
cat > trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": [
          "lambda.amazonaws.com",
          "edgelambda.amazonaws.com"
        ]
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

aws iam create-role \
  --role-name lambda-edge-execution \
  --assume-role-policy-document file://trust-policy.json

aws iam attach-role-policy \
  --role-name lambda-edge-execution \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# Create Lambda function (must be in us-east-1 for Lambda@Edge)
aws lambda create-function \
  --region us-east-1 \
  --function-name security-headers \
  --runtime nodejs18.x \
  --role arn:aws:iam::ACCOUNT_ID:role/lambda-edge-execution \
  --handler security-headers.handler \
  --zip-file fileb://security-headers.zip \
  --timeout 5 \
  --memory-size 128

# Publish version
aws lambda publish-version \
  --function-name security-headers \
  --region us-east-1

# Associate with CloudFront (use AWS Console or update distribution config)
```

**Project: A/B Testing with Lambda@Edge**

```javascript
// ab-testing.js
'use strict';

exports.handler = async (event) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;
    
    // Check if user already has a variant cookie
    const cookieHeader = headers.cookie;
    let variant = null;
    
    if (cookieHeader) {
        for (const cookie of cookieHeader) {
            if (cookie.value.includes('variant=')) {
                const match = cookie.value.match(/variant=([AB])/);
                if (match) {
                    variant = match[1];
                }
            }
        }
    }
    
    // Assign variant if not already assigned (50/50 split)
    if (!variant) {
        variant = Math.random() < 0.5 ? 'A' : 'B';
    }
    
    // Add custom header for origin
    request.headers['x-variant'] = [{ key: 'X-Variant', value: variant }];
    
    // Rewrite URI based on variant
    if (variant === 'B' && request.uri === '/') {
        request.uri = '/variant-b.html';
    }
    
    return request;
};

// For origin response, set the cookie
exports.responseHandler = async (event) => {
    const response = event.Records[0].cf.response;
    const request = event.Records[0].cf.request;
    const variant = request.headers['x-variant'][0].value;
    
    response.headers['set-cookie'] = [{
        key: 'Set-Cookie',
        value: `variant=${variant}; Path=/; Max-Age=2592000; Secure; HttpOnly`
    }];
    
    return response;
};
```

### **Day 7: Performance Optimization**

**Hands-on Tasks:**

```bash
# Task 1: Enable compression
# Already enabled in distribution config with "Compress": true

# Task 2: Configure custom error pages
mkdir error-pages
cat > error-pages/404.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>404 - Not Found</title>
    <style>
        body {
            font-family: Arial;
            text-align: center;
            padding: 50px;
            background: #f0f0f0;
        }
        h1 { color: #e74c3c; }
    </style>
</head>
<body>
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <a href="/">Go Home</a>
</body>
</html>
EOF

aws s3 cp error-pages/404.html s3://${BUCKET_NAME}/404.html

# Task 3: Monitor CloudFront metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name Requests \
  --dimensions Name=DistributionId,Value=${DISTRIBUTION_ID} \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600 \
  --statistics Sum

# Task 4: Analyze cache hit ratio
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name CacheHitRate \
  --dimensions Name=DistributionId,Value=${DISTRIBUTION_ID} \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600 \
  --statistics Average
```

### **Week 3 Checkpoint:**
- [ ] Created CloudFront distribution with S3 origin
- [ ] Configured Origin Access Identity
- [ ] Implemented caching strategies
- [ ] Created cache invalidations
- [ ] Deployed Lambda@Edge function
- [ ] Understand performance optimization techniques

---

## Phase 3: Serverless Computing with Lambda (Weeks 4-5)

### **Learning Objectives:**
- Understand serverless architecture
- Create and deploy Lambda functions
- Configure triggers and event sources
- Implement error handling and logging
- Optimize Lambda performance

### **Week 4, Day 1-2: Lambda Fundamentals**

**Theory (2 hours):**
- Serverless computing concepts
- Lambda execution model
- Cold starts vs warm starts
- Pricing model
- Supported runtimes

**Hands-on (3 hours):**

```javascript
// hello-lambda.js
exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            message: 'Hello from Lambda!',
            timestamp: new Date().toISOString(),
            event: event
        })
    };
    
    return response;
};
```

```bash
# Create Lambda function
zip hello-lambda.zip hello-lambda.js

# Create execution role
cat > lambda-trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

aws iam create-role \
  --role-name lambda-execution-role \
  --assume-role-policy-document file://lambda-trust-policy.json

aws iam attach-role-policy \
  --role-name lambda-execution-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# Wait a few seconds for role to propagate
sleep 10

# Create function
aws lambda create-function \
  --function-name hello-lambda \
  --runtime nodejs18.x \
  --role arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/lambda-execution-role \
  --handler hello-lambda.handler \
  --zip-file fileb://hello-lambda.zip \
  --timeout 30 \
  --memory-size 128 \
  --environment "Variables={STAGE=dev}"

# Test invocation
aws lambda invoke \
  --function-name hello-lambda \
  --payload '{"name": "AWS Learner"}' \
  response.json

cat response.json

# View logs
aws logs tail /aws/lambda/hello-lambda --follow
```

### **Week 4, Day 3-5: API Integration**

**Project: RESTful API with Lambda**

```javascript
// api-handler.js
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

// Helper function for responses
function response(statusCode, body) {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
        },
        body: JSON.stringify(body)
    };
}

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    try {
        const { httpMethod, path, body: requestBody, pathParameters } = event;
        
        // Handle CORS preflight
        if (httpMethod === 'OPTIONS') {
            return response(200, {});
        }
        
        // Parse body for POST/PUT requests
        const data = requestBody ? JSON.parse(requestBody) : null;
        
        // Route handling
        switch (`${httpMethod} ${path}`) {
            case 'GET /items':
                return await listItems();
                
            case 'GET /items/{id}':
                return await getItem(pathParameters.id);
                
            case 'POST /items':
                return await createItem(data);
                
            case 'PUT /items/{id}':
                return await updateItem(pathParameters.id, data);
                
            case 'DELETE /items/{id}':
                return await deleteItem(pathParameters.id);
                
            default:
                return response(404, { error: 'Route not found' });
        }
        
    } catch (error) {
        console.error('Error:', error);
        return response(500, { error: error.message });
    }
};

async function listItems() {
    const params = {
        TableName: TABLE_NAME,
        Limit: 100
    };
    
    const result = await dynamodb.scan(params).promise();
    return response(200, { items: result.Items, count: result.Count });
}

async function getItem(id) {
    const params = {
        TableName: TABLE_NAME,
        Key: { id }
    };
    
    const result = await dynamodb.get(params).promise();
    
    if (!result.Item) {
        return response(404, { error: 'Item not found' });
    }
    
    return response(200, result.Item);
}

async function createItem(data) {
    if (!data || !data.name) {
        return response(400, { error: 'Name is required' });
    }
    
    const item = {
        id: AWS.util.uuid.v4(),
        name: data.name,
        description: data.description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    const params = {
        TableName: TABLE_NAME,
        Item: item
    };
    
    await dynamodb.put(params).promise();
    return response(201, item);
}

async function updateItem(id, data) {
    if (!data || !data.name) {
        return response(400, { error: 'Name is required' });
    }
    
    const params = {
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: 'SET #name = :name, description = :description, updatedAt = :updatedAt',
        ExpressionAttributeNames: {
            '#name': 'name'
        },
        ExpressionAttributeValues: {
            ':name': data.name,
            ':description': data.description || '',
            ':updatedAt': new Date().toISOString()
        },
        ReturnValues: 'ALL_NEW'
    };
    
    const result = await dynamodb.update(params).promise();
    return response(200, result.Attributes);
}

async function deleteItem(id) {
    const params = {
        TableName: TABLE_NAME,
        Key: { id }
    };
    
    await dynamodb.delete(params).promise();
    return response(204, {});
}
```

**Deployment Script:**

```bash
#!/bin/bash
# deploy-api.sh

# Create DynamoDB table
aws dynamodb create-table \
  --table-name items-table \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

# Create Lambda function with DynamoDB permissions
cat > lambda-dynamodb-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Scan",
        "dynamodb:Query"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/items-table"
    }
  ]
}
EOF

aws iam put-role-policy \
  --role-name lambda-execution-role \
  --policy-name DynamoDBAccess \
  --policy-document file://lambda-dynamodb-policy.json

# Package and deploy
npm install aws-sdk
zip -r api-handler.zip api-handler.js node_modules/

aws lambda create-function \
  --function-name api-handler \
  --runtime nodejs18.x \
  --role arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/lambda-execution-role \
  --handler api-handler.handler \
  --zip-file fileb://api-handler.zip \
  --timeout 30 \
  --memory-size 256 \
  --environment "Variables={TABLE_NAME=items-table}"

echo "✓ Lambda function created successfully!"
```

### **Week 4, Day 6-7: Event-Driven Architecture**

**Project: S3 Image Processing**

```javascript
// image-processor.js
const AWS = require('aws-sdk');
const sharp = require('sharp');

const s3 = new AWS.S3();

exports.handler = async (event) => {
    console.log('S3 Event:', JSON.stringify(event, null, 2));
    
    // Get bucket and key from S3 event
    const record = event.Records[0];
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
    
    console.log(`Processing image: ${bucket}/${key}`);
    
    try {
        // Only process images in the 'uploads/' folder
        if (!key.startsWith('uploads/')) {
            console.log('Skipping non-upload file');
            return;
        }
        
        // Download image from S3
        const image = await s3.getObject({
            Bucket: bucket,
            Key: key
        }).promise();
        
        // Create thumbnails
        const sizes = [
            { name: 'thumbnail', width: 150, height: 150 },
            { name: 'small', width: 300, height: 300 },
            { name: 'medium', width: 600, height: 600 }
        ];
        
        const resizePromises = sizes.map(async (size) => {
            const resized = await sharp(image.Body)
                .resize(size.width, size.height, {
                    fit: 'cover',
                    position: 'center'
                })
                .jpeg({ quality: 80 })
                .toBuffer();
            
            const newKey = key.replace('uploads/', `processed/${size.name}/`);
            
            await s3.putObject({
                Bucket: bucket,
                Key: newKey,
                Body: resized,
                ContentType: 'image/jpeg',
                CacheControl: 'public, max-age=31536000',
                Metadata: {
                    originalKey: key,
                    size: size.name,
                    processedAt: new Date().toISOString()
                }
            }).promise();
            
            console.log(`Created ${size.name}: ${newKey}`);
            return newKey;
        });
        
        await Promise.all(resizePromises);
        
        console.log('✓ Image processing complete');
        
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Image processed successfully' })
        };
        
    } catch (error) {
        console.error('Error processing image:', error);
        throw error;
    }
};
```

**Setup:**

```bash
# Create package with sharp dependency
mkdir image-processor
cd image-processor
npm init -y
npm install sharp aws-sdk

# Copy function code
cp ../image-processor.js .

# Package (sharp needs to be compiled for Lambda environment)
# Use AWS Lambda Layer or Docker to build
docker run --rm -v "$PWD":/var/task lambci/lambda:build-nodejs18.x \
  npm install --production

zip -r image-processor.zip .

# Create function
aws lambda create-function \
  --function-name image-processor \
  --runtime nodejs18.x \
  --role arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/lambda-execution-role \
  --handler image-processor.handler \
  --zip-file fileb://image-processor.zip \
  --timeout 60 \
  --memory-size 1024

# Add S3 trigger permission
aws lambda add-permission \
  --function-name image-processor \
  --statement-id s3-trigger \
  --action lambda:InvokeFunction \
  --principal s3.amazonaws.com \
  --source-arn arn:aws:s3:::${BUCKET_NAME}

# Configure S3 bucket notification
cat > s3-notification.json << EOF
{
  "LambdaFunctionConfigurations": [
    {
      "LambdaFunctionArn": "$(aws lambda get-function --function-name image-processor --query 'Configuration.FunctionArn' --output text)",
      "Events": ["s3:ObjectCreated:*"],
      "Filter": {
        "Key": {
          "FilterRules": [
            {
              "Name": "prefix",
              "Value": "uploads/"
            },
            {
              "Name": "suffix",
              "Value": ".jpg"
            }
          ]
        }
      }
    }
  ]
}
EOF

aws s3api put-bucket-notification-configuration \
  --bucket ${BUCKET_NAME} \
  --notification-configuration file://s3-notification.json

# Test by uploading an image
aws s3 cp test-image.jpg s3://${BUCKET_NAME}/uploads/test-image.jpg

# Check logs
aws logs tail /aws/lambda/image-processor --follow
```

### **Week 5, Day 1-3: Lambda Layers & Dependencies**

**Project: Create Reusable Lambda Layer**

```bash
# Create layer structure
mkdir -p lambda-layer/nodejs
cd lambda-layer/nodejs

# Install common dependencies
npm init -y
npm install \
  aws-sdk \
  uuid \
  moment \
  lodash \
  axios

cd ..

# Package layer
zip -r lambda-layer.zip nodejs/

# Publish layer
aws lambda publish-layer-version \
  --layer-name common-dependencies \
  --description "Common npm packages for Lambda functions" \
  --zip-file fileb://lambda-layer.zip \
  --compatible-runtimes nodejs18.x

# Get layer ARN
LAYER_ARN=$(aws lambda list-layer-versions \
  --layer-name common-dependencies \
  --query 'LayerVersions[0].LayerVersionArn' \
  --output text)

# Use layer in function
aws lambda update-function-configuration \
  --function-name api-handler \
  --layers ${LAYER_ARN}
```

### **Week 5, Day 4-7: Advanced Lambda Patterns**

**Project: Step Functions State Machine**

```json
{
  "Comment": "Image processing pipeline",
  "StartAt": "ValidateImage",
  "States": {
    "ValidateImage": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:REGION:ACCOUNT:function:validate-image",
      "Next": "IsValid",
      "Catch": [
        {
          "ErrorEquals": ["States.ALL"],
          "Next": "HandleError"
        }
      ]
    },
    "IsValid": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.valid",
          "BooleanEquals": true,
          "Next": "ProcessImage"
        }
      ],
      "Default": "RejectImage"
    },
    "ProcessImage": {
      "Type": "Parallel",
      "Branches": [
        {
          "StartAt": "ResizeImage",
          "States": {
            "ResizeImage": {
              "Type": "Task",
              "Resource": "arn:aws:lambda:REGION:ACCOUNT:function:resize-image",
              "End": true
            }
          }
        },
        {
          "StartAt": "OptimizeImage",
          "States": {
            "OptimizeImage": {
              "Type": "Task",
              "Resource": "arn:aws:lambda:REGION:ACCOUNT:function:optimize-image",
              "End": true
            }
          }
        },
        {
          "StartAt": "ExtractMetadata",
          "States": {
            "ExtractMetadata": {
              "Type": "Task",
              "Resource": "arn:aws:lambda:REGION:ACCOUNT:function:extract-metadata",
              "End": true
            }
          }
        }
      ],
      "Next": "SaveResults"
    },
    "SaveResults": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:REGION:ACCOUNT:function:save-results",
      "End": true
    },
    "RejectImage": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:REGION:ACCOUNT:function:reject-image",
      "End": true
    },
    "HandleError": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:REGION:ACCOUNT:function:handle-error",
      "End": true
    }
  }
}
```

### **Week 5 Checkpoint:**
- [ ] Created and deployed Lambda functions
- [ ] Integrated Lambda with API Gateway
- [ ] Implemented event-driven processing
- [ ] Created and used Lambda Layers
- [ ] Understand error handling and logging
- [ ] Built complex workflows with Step Functions

---

## Phase 4: Virtual Servers with EC2 (Week 6)

### **Learning Objectives:**
- Understand EC2 instance types
- Launch and configure EC2 instances
- Implement security groups
- Use Elastic IPs and load balancers
- Deploy Node.js applications on EC2

### **Day 1-2: EC2 Basics**

**Theory (2 hours):**
- Virtual machines in the cloud
- Instance types and families
- AMIs (Amazon Machine Images)
- EBS volumes
- Security groups vs NACLs

**Hands-on (4 hours):**

```bash
# Task 1: Create key pair
aws ec2 create-key-pair \
  --key-name my-ec2-key \
  --query 'KeyMaterial' \
  --output text > my-ec2-key.pem

chmod 400 my-ec2-key.pem

# Task 2: Create security group
aws ec2 create-security-group \
  --group-name web-server-sg \
  --description "Security group for web server"

export SG_ID=$(aws ec2 describe-security-groups \
  --group-names web-server-sg \
  --query 'SecurityGroups[0].GroupId' \
  --output text)

# Allow SSH (port 22)
aws ec2 authorize-security-group-ingress \
  --group-id ${SG_ID} \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0

# Allow HTTP (port 80)
aws ec2 authorize-security-group-ingress \
  --group-id ${SG_ID} \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# Allow HTTPS (port 443)
aws ec2 authorize-security-group-ingress \
  --group-id ${SG_ID} \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

# Allow Node.js (port 3000)
aws ec2 authorize-security-group-ingress \
  --group-id ${SG_ID} \
  --protocol tcp \
  --port 3000 \
  --cidr 0.0.0.0/0

# Task 3: Launch EC2 instance
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --count 1 \
  --instance-type t2.micro \
  --key-name my-ec2-key \
  --security-group-ids ${SG_ID} \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=WebServer}]'

# Get instance ID and public IP
export INSTANCE_ID=$(aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=WebServer" "Name=instance-state-name,Values=running" \
  --query 'Reservations[0].Instances[0].InstanceId' \
  --output text)

export PUBLIC_IP=$(aws ec2 describe-instances \
  --instance-ids ${INSTANCE_ID} \
  --query 'Reservations[0].Instances[0].PublicIpAddress' \
  --output text)

echo "Instance ID: ${INSTANCE_ID}"
echo "Public IP: ${PUBLIC_IP}"

# Wait for instance to be ready
aws ec2 wait instance-running --instance-ids ${INSTANCE_ID}

# SSH into instance
ssh -i my-ec2-key.pem ec2-user@${PUBLIC_IP}
```

### **Day 3-4: Deploy Node.js Application**

**User Data Script (runs on instance launch):**

```bash
#!/bin/bash
# user-data.sh

# Update system
yum update -y

# Install Node.js
curl -sL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Install Git
yum install -y git

# Install PM2 for process management
npm install -g pm2

# Create app directory
mkdir -p /home/ec2-user/app
cd /home/ec2-user/app

# Create sample Express app
cat > server.js << 'EOF'
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>EC2 Node.js App</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: 50px auto;
                    padding: 20px;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <h1>🚀 Node.js App Running on EC2</h1>
            <p>Server Time: ${new Date().toLocaleString()}</p>
            <p>Hostname: ${require('os').hostname()}</p>
        </body>
        </html>
    `);
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
EOF

# Create package.json
cat > package.json << 'EOF'
{
  "name": "ec2-app",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}
EOF

# Install dependencies
npm install

# Start app with PM2
pm2 start server.js --name ec2-app
pm2 startup systemd
pm2 save

# Change ownership
chown -R ec2-user:ec2-user /home/ec2-user/app

echo "✓ Application deployed successfully!"
```

**Launch instance with user data:**

```bash
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --count 1 \
  --instance-type t2.micro \
  --key-name my-ec2-key \
  --security-group-ids ${SG_ID} \
  --user-data file://user-data.sh \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=NodeJSServer}]'

# After instance is running, visit:
echo "Application URL: http://${PUBLIC_IP}:3000"
```

### **Day 5: Nginx Reverse Proxy**

```bash
# SSH into instance
ssh -i my-ec2-key.pem ec2-user@${PUBLIC_IP}

# Install Nginx
sudo amazon-linux-extras install nginx1 -y

# Configure Nginx
sudo cat > /etc/nginx/conf.d/app.conf << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Now visit: http://${PUBLIC_IP} (port 80)
```

### **Day 6-7: Auto Scaling & Load Balancing**

**Create Launch Template:**

```bash
# Create launch template
aws ec2 create-launch-template \
  --launch-template-name web-server-template \
  --version-description "Version 1" \
  --launch-template-data '{
    "ImageId": "ami-0c55b159cbfafe1f0",
    "InstanceType": "t2.micro",
    "KeyName": "my-ec2-key",
    "SecurityGroupIds": ["'${SG_ID}'"],
    "UserData": "'$(base64 -w 0 user-data.sh)'"
  }'

# Create target group
aws elbv2 create-target-group \
  --name web-servers \
  --protocol HTTP \
  --port 80 \
  --vpc-id ${VPC_ID} \
  --health-check-path /api/health

# Create Application Load Balancer
aws elbv2 create-load-balancer \
  --name web-alb \
  --subnets ${SUBNET_1} ${SUBNET_2} \
  --security-groups ${SG_ID}

# Create Auto Scaling Group
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name web-asg \
  --launch-template LaunchTemplateName=web-server-template \
  --min-size 1 \
  --max-size 3 \
  --desired-capacity 2 \
  --target-group-arns ${TARGET_GROUP_ARN} \
  --health-check-type ELB \
  --health-check-grace-period 300 \
  --vpc-zone-identifier "${SUBNET_1},${SUBNET_2}"

# Create scaling policies
aws autoscaling put-scaling-policy \
  --auto-scaling-group-name web-asg \
  --policy-name scale-up \
  --scaling-adjustment 1 \
  --adjustment-type ChangeInCapacity

aws autoscaling put-scaling-policy \
  --auto-scaling-group-name web-asg \
  --policy-name scale-down \
  --scaling-adjustment -1 \
  --adjustment-type ChangeInCapacity
```

### **Week 6 Checkpoint:**
- [ ] Launched and configured EC2 instances
- [ ] Deployed Node.js application
- [ ] Configured security groups
- [ ] Set up Nginx reverse proxy
- [ ] Created Auto Scaling Group
- [ ] Configured Application Load Balancer

---

## Phase 5: Full-Stack with Amplify (Weeks 7-8)

### **Learning Objectives:**
- Understand Amplify framework
- Set up Amplify CLI
- Deploy full-stack applications
- Implement authentication with Amplify
- Use Amplify DataStore
- Configure CI/CD with Amplify Hosting

### **Week 7, Day 1-2: Amplify Setup**

**Installation & Configuration:**

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Configure Amplify
amplify configure

# Follow prompts:
# 1. Sign in to AWS Console
# 2. Specify AWS Region
# 3. Create IAM user with AdministratorAccess-Amplify
# 4. Enter access keys
# 5. Set profile name

# Create new React app
npx create-react-app amplify-app
cd amplify-app

# Install Amplify libraries
npm install aws-amplify @aws-amplify/ui-react

# Initialize Amplify project
amplify init

# Project name: amplifyapp
# Environment: dev
# Default editor: VS Code
# App type: javascript
# Framework: react
# Source directory: src
# Distribution directory: build
# Build command: npm run build
# Start command: npm start
```

### **Week 7, Day 3-4: Authentication**

```bash
# Add authentication
amplify add auth

# Use default configuration
# How do you want users to be able to sign in? Email
# Do you want to configure advanced settings? No

# Push to cloud
amplify push
```

**Implement in React:**

```javascript
// src/App.js
import React from 'react';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';

Amplify.configure(awsExports);

function App({ signOut, user }) {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <header>
        <h1>Welcome to Amplify App</h1>
        <p>Hello, {user.username}!</p>
        <button onClick={signOut}>Sign Out</button>
      </header>
      
      <main style={{ marginTop: '20px' }}>
        <h2>User Attributes:</h2>
        <pre>{JSON.stringify(user.attributes, null, 2)}</pre>
      </main>
    </div>
  );
}

export default withAuthenticator(App);
```

### **Week 7, Day 5-7: API & Database**

```bash
# Add API with GraphQL
amplify add api

# Select GraphQL
# API name: amplifyapi
# Authorization type: Amazon Cognito User Pool
# Do you want to configure advanced settings? No
# Do you have an annotated GraphQL schema? No
# Do you want a guided schema creation? Yes
# What best describes your project: Single object with fields
# Do you want to edit the schema now? Yes
```

**Edit schema (amplify/backend/api/amplifyapi/schema.graphql):**

```graphql
type Todo @model @auth(rules: [{ allow: owner }]) {
  id: ID!
  title: String!
  description: String
  completed: Boolean!
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

type Note @model @auth(rules: [{ allow: owner }]) {
  id: ID!
  title: String!
  content: String!
  tags: [String]
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

```bash
# Push changes
amplify push

# Generate code? Yes
# Generate GraphQL statements? Yes
# Maximum statement depth: 2
```

**Use API in React:**

```javascript
// src/App.js
import React, { useState, useEffect } from 'react';
import { Amplify, API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
import { listTodos } from './graphql/queries';
import { createTodo, updateTodo, deleteTodo } from './graphql/mutations';
import { onCreateTodo, onUpdateTodo, onDeleteTodo } from './graphql/subscriptions';

Amplify.configure(awsExports);

function App({ signOut, user }) {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Fetch todos
  useEffect(() => {
    fetchTodos();
    
    // Subscribe to new todos
    const createSub = API.graphql(graphqlOperation(onCreateTodo))
      .subscribe({
        next: ({ value }) => {
          const newTodo = value.data.onCreateTodo;
          setTodos(prev => [...prev, newTodo]);
        }
      });

    // Subscribe to todo updates
    const updateSub = API.graphql(graphqlOperation(onUpdateTodo))
      .subscribe({
        next: ({ value }) => {
          const updatedTodo = value.data.onUpdateTodo;
          setTodos(prev => prev.map(todo => 
            todo.id === updatedTodo.id ? updatedTodo : todo
          ));
        }
      });

    // Subscribe to todo deletions
    const deleteSub = API.graphql(graphqlOperation(onDeleteTodo))
      .subscribe({
        next: ({ value }) => {
          const deletedTodo = value.data.onDeleteTodo;
          setTodos(prev => prev.filter(todo => todo.id !== deletedTodo.id));
        }
      });

    return () => {
      createSub.unsubscribe();
      updateSub.unsubscribe();
      deleteSub.unsubscribe();
    };
  }, []);

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos));
      setTodos(todoData.data.listTodos.items);
    } catch (err) {
      console.error('Error fetching todos:', err);
    }
  }

  async function addTodo(e) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const todo = {
        title,
        description,
        completed: false
      };
      await API.graphql(graphqlOperation(createTodo, { input: todo }));
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Error creating todo:', err);
    }
  }

  async function toggleTodo(todo) {
    try {
      await API.graphql(graphqlOperation(updateTodo, {
        input: {
          id: todo.id,
          completed: !todo.completed
        }
      }));
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  }

  async function removeTodo(id) {
    try {
      await API.graphql(graphqlOperation(deleteTodo, { input: { id } }));
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h1>📝 My Todos</h1>
          <p>Welcome, {user.username}!</p>
        </div>
        <button onClick={signOut} style={{
          padding: '10px 20px',
          background: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Sign Out
        </button>
      </header>

      <form onSubmit={addTodo} style={{ marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Todo title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '5px'
          }}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '5px'
          }}
        />
        <button type="submit" style={{
          padding: '10px 20px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}>
          Add Todo
        </button>
      </form>

      <div>
        <h2>Todos ({todos.length})</h2>
        {todos.map(todo => (
          <div key={todo.id} style={{
            padding: '15px',
            marginBottom: '10px',
            background: '#f5f5f5',
            borderRadius: '5px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ flex: 1 }}>
              <h3 style={{
                margin: '0 0 5px 0',
                textDecoration: todo.completed ? 'line-through' : 'none'
              }}>
                {todo.title}
              </h3>
              {todo.description && (
                <p style={{ margin: 0, color: '#666' }}>{todo.description}</p>
              )}
            </div>
            <div>
              <button
                onClick={() => toggleTodo(todo)}
                style={{
                  padding: '5px 10px',
                  marginRight: '5px',
                  background: todo.completed ? '#ffa500' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                {todo.completed ? '↺ Undo' : '✓ Complete'}
              </button>
              <button
                onClick={() => removeTodo(todo.id)}
                style={{
                  padding: '5px 10px',
                  background: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuthenticator(App);
```

### **Week 8, Day 1-3: Storage**

```bash
# Add storage
amplify add storage

# Select: Content (Images, audio, video, etc.)
# Resource name: amplifystorage
# Bucket name: (accept default)
# Who should have access: Auth users only
# What kind of access: create/update, read, delete

amplify push
```

**Implement file upload:**

```javascript
// src/components/FileUpload.js
import React, { useState } from 'react';
import { Storage } from 'aws-amplify';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  async function handleUpload() {
    if (!file) return;

    setUploading(true);
    try {
      const result = await Storage.put(file.name, file, {
        contentType: file.type,
        level: 'private',
        progressCallback: (progress) => {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
        }
      });
      
      console.log('Upload success:', result);
      fetchFiles();
      setFile(null);
    } catch (error) {
      console.error('Upload error:', error);
    }
    setUploading(false);
  }

  async function fetchFiles() {
    try {
      const files = await Storage.list('', { level: 'private' });
      setUploadedFiles(files);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  }

  async function downloadFile(key) {
    try {
      const url = await Storage.get(key, { level: 'private' });
      window.open(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }

  async function deleteFile(key) {
    try {
      await Storage.remove(key, { level: 'private' });
      fetchFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  React.useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>File Upload</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: '10px' }}
        />
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          style={{
            padding: '10px 20px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: uploading ? 'not-allowed' : 'pointer'
          }}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      <div>
        <h3>Your Files</h3>
        {uploadedFiles.map((file) => (
          <div key={file.key} style={{
            padding: '10px',
            background: '#f5f5f5',
            marginBottom: '10px',
            borderRadius: '5px',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>{file.key}</span>
            <div>
              <button onClick={() => downloadFile(file.key)}>Download</button>
              <button onClick={() => deleteFile(file.key)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileUpload;
```

### **Week 8, Day 4-7: Amplify Hosting & CI/CD**

```bash
# Add hosting
amplify add hosting

# Select: Hosting with Amplify Console
# Type: Continuous deployment

amplify publish

# Connect to Git repository (GitHub, GitLab, Bitbucket)
# Follow prompts to connect repository

# Your app is now deployed with automatic CI/CD!
# Any push to main branch will trigger automatic deployment
```

**Custom domain setup:**

```bash
# Via CLI
amplify add domain

# Or via console
# 1. Go to Amplify Console
# 2. Select your app
# 3. Domain management
# 4. Add domain
# 5. Configure DNS (add CNAME records)
```

### **Week 8 Checkpoint:**
- [ ] Set up Amplify project
- [ ] Implemented authentication
- [ ] Created GraphQL API
- [ ] Added file storage
- [ ] Configured CI/CD with Amplify Hosting
- [ ] Deployed production application

---

## Phase 6: Integration & Advanced Patterns (Weeks 9-10)

### **Week 9: Complete Integration Project**

**Project: Full-Stack Blog Platform**

Integrate all services:
- S3 for image storage
- CloudFront for content delivery
- Lambda for serverless functions
- EC2 for admin panel (optional)
- Amplify for frontend

*Implementation details provided in separate project guide*

### **Week 10: Advanced Topics**

- Performance optimization
- Security best practices
- Cost optimization strategies
- Monitoring and logging
- Disaster recovery

---

## Phase 7: Production Best Practices (Weeks 11-12)

### **Week 11: Security & Compliance**

- [ ] IAM best practices
- [ ] Encryption at rest and in transit
- [ ] Security auditing
- [ ] Compliance frameworks

### **Week 12: Operations & Monitoring**

- [ ] CloudWatch dashboards
- [ ] Alerting strategies
- [ ] Log aggregation
- [ ] Performance tuning

---

## Capstone Project

**Build a Complete SaaS Application:**

**Requirements:**
1. User authentication (Cognito/Amplify)
2. Static frontend (S3 + CloudFront)
3. Serverless API (Lambda + API Gateway)
4. Database (DynamoDB)
5. File storage (S3 with presigned URLs)
6. Email notifications (SES/SNS)
7. CI/CD pipeline (CodePipeline or Amplify)
8. Monitoring (CloudWatch)
9. Custom domain with HTTPS
10. Cost optimization implemented

**Example Project Ideas:**
- Task management system
- Note-taking application
- Image gallery with processing
- Blog platform
- E-commerce site
- Real-time chat application

---

## Resources & Next Steps

### **Official Documentation:**
- [AWS Documentation](https://docs.aws.amazon.com/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [AWS Amplify Docs](https://docs.amplify.aws/)

### **Courses & Tutorials:**
- AWS Free Tier tutorials
- AWS Skill Builder
- freeCodeCamp AWS tutorials
- Udemy AWS courses
- A Cloud Guru / Linux Academy

### **Practice Platforms:**
- AWS Workshops
- AWS Hands-on Labs
- Qwiklabs
- AWS Cloud Quest (gamified)

### **Certifications:**
1. AWS Certified Cloud Practitioner
2. AWS Certified Solutions Architect - Associate
3. AWS Certified Developer - Associate

### **Communities:**
- AWS Forums
- Reddit: r/aws, r/serverless
- Stack Overflow
- AWS User Groups
- Twitter: #AWS

---

## Progress Tracker

### **Week 1: AWS Fundamentals**
- [ ] Account setup and security
- [ ] IAM configuration
- [ ] AWS CLI mastery

### **Week 2: S3**
- [ ] Basic operations
- [ ] Static hosting
- [ ] Advanced features

### **Week 3: CloudFront**
- [ ] Distribution setup
- [ ] Caching strategies
- [ ] Lambda@Edge

### **Week 4-5: Lambda**
- [ ] Basic functions
- [ ] API integration
- [ ] Event-driven architecture

### **Week 6: EC2**
- [ ] Instance management
- [ ] Application deployment
- [ ] Auto Scaling

### **Week 7-8: Amplify**
- [ ] Project setup
- [ ] Authentication
- [ ] API & database
- [ ] Hosting & CI/CD

### **Week 9-10: Integration**
- [ ] Full-stack project
- [ ] Advanced patterns

### **Week 11-12: Production**
- [ ] Security
- [ ] Operations

### **Capstone:**
- [ ] Complete SaaS application

---

## Tips for Success

1. **Practice Daily:** Dedicate at least 1-2 hours per day
2. **Build Projects:** Theory is important, but hands-on is crucial
3. **Track Costs:** Always monitor your AWS spending
4. **Use Free Tier:** Maximize free tier usage
5. **Take Notes:** Document your learning journey
6. **Join Communities:** Learn from others' experiences
7. **Clean Up Resources:** Always delete unused resources
8. **Review Regularly:** Revisit previous weeks' topics
9. **Ask Questions:** Use Stack Overflow and AWS forums
10. **Stay Updated:** AWS releases new features regularly

---

## Cost Management Tips

```bash
# Daily cost check
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-02 \
  --granularity DAILY \
  --metrics UnblendedCost

# Set budget
aws budgets create-budget \
  --account-id $(aws sts get-caller-identity --query Account --output text) \
  --budget file://budget.json \
  --notifications-with-subscribers file://notifications.json

# Clean up script
cat > cleanup.sh << 'EOF'
#!/bin/bash
echo "Cleaning up AWS resources..."

# Stop all EC2 instances
aws ec2 stop-instances --instance-ids $(aws ec2 describe-instances --query 'Reservations[].Instances[].InstanceId' --output text)

# Delete all CloudFront invalidations (they cost money!)
# Be careful with this one

# Empty and delete S3 buckets (be careful!)
# aws s3 rb s3://bucket-name --force

echo "Cleanup complete!"
EOF

chmod +x cleanup.sh
```

---

**Good luck with your AWS learning journey! 🚀**

Remember: The key to mastering AWS is consistent practice and building real projects. Don't just read – build!

