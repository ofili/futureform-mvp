# Evidence Upload Integration Guide

## Quick Start

### 1. Add Environment Variable

Add to `.env.local`:

```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

Get your token from: <https://vercel.com/dashboard> → Storage → Blob → Create Token

### 2. Import Components

```typescript
import { EvidenceUpload } from '@/components/evidence/evidence-upload';
import { EvidenceList } from '@/components/evidence/evidence-list';
import { useEvidence } from '@/hooks/use-evidence';
```

### 3. Use in Question Component

```typescript
export function QuestionAnswerStep({ assessmentId, currentQuestion }) {
  const { evidence, deleteEvidence } = useEvidence(assessmentId);
  
  // Filter evidence for current question
  const questionEvidence = evidence.filter(
    e => e.questionId === currentQuestion.id
  );

  return (
    <div>
      {/* Question text and answer input */}
      
      {/* Evidence Upload Section */}
      <div className="mt-6 space-y-4">
        <div>
          <h4 className="font-medium mb-2">Supporting Evidence</h4>
          <p className="text-sm text-gray-600 mb-4">
            Upload documents to support your answer (optional)
          </p>
        </div>
        
        <EvidenceUpload
          assessmentId={assessmentId}
          questionId={currentQuestion.id}
          onUploadComplete={(evidence) => {
            console.log('File uploaded:', evidence);
            // Evidence automatically added to state
          }}
        />
        
        {questionEvidence.length > 0 && (
          <EvidenceList
            evidence={questionEvidence}
            onDelete={deleteEvidence}
          />
        )}
      </div>
    </div>
  );
}
```

---

## File Constraints

### Per File

- **Max Size**: 10MB
- **Allowed Types**: PDF, DOC/DOCX, XLS/XLSX, CSV, JPG/PNG/GIF/WEBP, PPT/PPTX, TXT

### Per Question

- **Max Files**: 5
- **Max Total Size**: 50MB

### Per Assessment

- **Max Files**: 100
- **Max Total Size**: 500MB

---

## API Reference

### Upload Evidence

```typescript
POST /api/v1/evidence/upload

FormData:
  - file: File
  - assessmentId: string
  - questionId: string

Response:
{
  success: true,
  data: {
    id: string,
    fileName: string,
    fileSize: number,
    storageUrl: string,
    uploadedAt: string
  }
}
```

### Delete Evidence

```typescript
DELETE /api/v1/evidence/[id]

Response:
{
  success: true,
  message: "Evidence deleted successfully"
}
```

### Get Assessment Evidence

```typescript
GET /api/v1/assessments/[id]/evidence

Response:
{
  success: true,
  data: Evidence[],
  total: number
}
```

---

## Error Handling

The components handle errors automatically:

```typescript
// File too large
"File size exceeds 10MB limit"

// Invalid file type
"File type not supported. Please upload PDF, Word, Excel, or image files."

// Too many files
"Maximum 5 files per question"

// Question size exceeded
"Total file size for this question exceeds 50MB"
```

---

## Validation Status

Evidence files have validation statuses:

- **PENDING** - Awaiting analyst review
- **APPROVED** - Accepted by analyst
- **REJECTED** - Rejected by analyst
- **NEEDS_REVIEW** - Requires additional review

Status badges are automatically displayed in `EvidenceList`.

---

## Advanced Usage

### Custom Upload Handling

```typescript
const handleUpload = async (file: File) => {
  try {
    const evidence = await uploadEvidence(file, questionId);
    toast.success('File uploaded successfully');
    // Custom logic here
  } catch (error) {
    toast.error(error.message);
  }
};
```

### Fetch Evidence on Mount

```typescript
useEffect(() => {
  fetchEvidence();
}, [fetchEvidence]);
```

### Read-Only Mode

```typescript
<EvidenceList
  evidence={questionEvidence}
  readOnly={true} // No delete buttons
/>
```

---

## Troubleshooting

### "Upload failed" Error

- Check `BLOB_READ_WRITE_TOKEN` is set correctly
- Verify Vercel Blob is enabled in your project
- Check file size and type constraints

### Files Not Appearing

- Ensure `assessmentId` and `questionId` are correct
- Call `fetchEvidence()` after upload
- Check browser console for errors

### Slow Uploads

- Large files (>5MB) may take time
- Progress indicator shows upload status
- Consider compressing files before upload
