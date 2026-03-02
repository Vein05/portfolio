---
title: "Getting Started with Go for Web Services"
date: "2024-11-05"
category: "Engineering"
status: "MATURE"
---

![Getting Started with Go](/.netlify/images?url=/posts/images/getting-started-with-go/golang.png&w=500&h=200)

# Why Go?

Go (or Golang) has become my daily driver for backend development. Designed at Google to solve problems of scale, it strikes an incredible balance between the performance of C++ and the developer ergonomics of Python. 

## The Standard Library is Your Friend

One of the best things about Go is how much you can accomplish without reaching for third-party libraries. The `net/http` package is incredibly robust.

### A Simple Server

Here is how simple it is to stand up a web server in Go:

```go
package main

import (
    "fmt"
    "net/http"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello, World!")
}

func main() {
    http.HandleFunc("/", helloHandler)
    http.ListenAndServe(":8080", nil)
}
```

Notice a few things:
* We didn't need to install Express or Flask.
* The handler signature `(w, r)` is standard across the entire Go ecosystem.
* It compiles to a single static binary.

## Concurrency Made Easy

Go's killer feature is goroutines and channels. Instead of dealing with async/await coloring or complex thread management, you simply prepend `go` to a function call to run it concurrently.

```go
func processData(data []int) {
    // heavy processing here
}

// Fire and forget
go processData(mySlice)
```

## Structuring a Service

When building larger services, you want to move away from putting everything in `main.go`. I typically follow a variation of clean architecture:

1. **Handlers**: The HTTP layer (parsing requests, writing JSON responses).
2. **Services**: Business logic.
3. **Store/Repository**: Database interactions.

This separation of concerns makes the code highly testable, which is crucial because Go's built-in testing framework (`go test`) is fantastic.
