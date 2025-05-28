# AutoTranscribe TODO List

## High Priority

- [ ] Implement ephemeral transcriptions
  - Add expiration_date field to transcriptions table
  - Set 7-day expiration for free tier
  - Set 30-day expiration for premium tier
  - Add cleanup job to delete expired transcripts
  - Add warning notifications for expiring transcripts
  - Update UI to show expiration date

## Authentication & User Management

- [ ] Implement token refresh logic
- [ ] Add session persistence
- [ ] Handle token expiration gracefully
- [ ] Add proper logout functionality

## Dashboard Features

- [ ] Add pagination for transcriptions list
- [ ] Implement transcription search/filter
- [ ] Add sorting options (by date, status, etc.)
- [ ] Add bulk actions (delete, download)

## Transcription Features

- [ ] Add form for new transcription requests
- [ ] Show transcription progress/status
- [ ] Implement download functionality
- [ ] Add progress indicators
- [ ] Support multiple file formats

## Error Handling & UX

- [ ] Improve error messages
- [ ] Add loading states
- [ ] Implement success notifications
- [ ] Add form validation
- [ ] Add retry mechanisms for failed operations

## Testing & Deployment

- [ ] Set up production environment variables
- [ ] Add automated tests
- [ ] Set up CI/CD pipeline
- [ ] Configure production deployment
- [ ] Add monitoring and logging

## Future Enhancements

- [ ] Implement premium tier features
- [ ] Add user profile management
- [ ] Add usage statistics and analytics
- [ ] Implement batch processing
- [ ] Add API rate limiting
