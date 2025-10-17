# @fishtank/api-client

Shared API client for backend communication across all Fishtank applications.

## Usage

```typescript
import { apiClient, authApi, usersApi } from '@fishtank/api-client';

// Use pre-configured API methods
const user = await authApi.login(email, password);

// Or use the base client
const data = await apiClient.get('/custom-endpoint');
```

## Features

- Type-safe API calls
- Consistent error handling
- Shared authentication
- Environment-based configuration

## Environment Variables

Set `VITE_API_BASE_URL` in your `.env` file to configure the API endpoint.

