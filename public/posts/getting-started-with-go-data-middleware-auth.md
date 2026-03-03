---
title: "Getting Started with Go for Web Services (Part 2): Data, Middleware, Auth"
date: "2024-11-06"
category: "Engineering"
status: "MATURE"
---

# Getting Started with Go for Web Services (Part 2): Data, Middleware, Auth

Part 2 moves from a simple server to production-ready API behavior: data boundaries, middleware, request IDs, auth, and observability.

## Data access boundaries

Use repository interfaces so handlers do not speak SQL directly.

```go
type UserStore interface {
    GetByID(ctx context.Context, id string) (User, error)
    Create(ctx context.Context, input CreateUserInput) (User, error)
}

type UserService struct {
    store UserStore
}
```

This keeps business logic testable and lets you swap DB drivers safely.

## Middleware stack order

A good default order:

1. Panic recovery
2. Request ID injection
3. Structured logging
4. CORS
5. Auth
6. Handler

```mermaid
graph LR
  A[Incoming request] --> B[Recover]
  B --> C[Request ID]
  C --> D[Logging]
  D --> E[CORS]
  E --> F[Auth]
  F --> G[Business handler]
```

## Request IDs and structured logs

Always attach a request ID and include it in logs and error responses.

```go
type ctxKey string

const requestIDKey ctxKey = "request_id"

func withRequestID(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        rid := r.Header.Get("X-Request-ID")
        if rid == "" {
            rid = uuid.NewString()
        }
        ctx := context.WithValue(r.Context(), requestIDKey, rid)
        w.Header().Set("X-Request-ID", rid)
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}
```

## Authentication strategy

For internal services: mTLS or signed service tokens.
For public APIs: JWT with strict validation and short TTL.

Checklist:

- Validate `iss`, `aud`, `exp`, and signing algorithm.
- Use key rotation.
- Do not put authorization logic in handlers; use policy layer.

## Database handling essentials

- Set pool limits (`SetMaxOpenConns`, `SetMaxIdleConns`, `SetConnMaxLifetime`).
- Pass `context.Context` deadlines into queries.
- Distinguish not-found from system errors.

```textandimage
title: Database and API boundary
text: Keep your DB models internal and expose API-specific DTOs at the handler boundary.

This avoids leaking internal schema changes into public contracts.
src: /posts/images/placeholders/go-guide-placeholder.svg
alt: Placeholder for data flow image
position: left
valign: middle
layout: wide
caption: Placeholder: handler DTO vs DB model map.
```

## Observability baseline

Before launch, you should have:

- JSON logs with request IDs
- Metrics for latency, errors, throughput
- Traces for cross-service paths
- Health (`/healthz`) and readiness (`/readyz`) endpoints

```image
src: /posts/images/placeholders/go-guide-placeholder.svg
alt: Placeholder for dashboard screenshot
caption: Placeholder: p95 latency, error rate, and saturation dashboard.
layout: wide
```
