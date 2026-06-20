# Cleanup Desk

Cleanup Desk is an AI-assisted cleanup prep product for overloaded bookkeepers and small CPA firms.

## What is live

- Marketing homepage conversion in progress
- Intake route at /intake
- Cleanup job API at /api/cleanup-jobs

## API

POST multipart form data to /api/cleanup-jobs with:

- firmName
- contactEmail
- clientName
- cleanupType
- notes
- file: CSV with date, description, amount

The API returns a review packet JSON with transaction count, category suggestions, vendor list, review flags, and client questions.

## Boundary

Cleanup Desk does not provide bookkeeping, accounting, tax advice, certifications, or filings. It prepares review packets for qualified human reviewers.
