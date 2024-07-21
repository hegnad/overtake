# Overtake

Monorepo for Overtake.

## Projects

This monorepo contains all complete stack of components needed for running the Overtake application:

- [server](./server): Backend API server written in C# with [.NET](https://dotnet.microsoft.com/).

## Prerequisite

Depending on the component, different toolchains need to be installed to successfully build and run them.

### `server`

The backend server is developed with [.NET](https://dotnet.microsoft.com/) 8.0. The .NET SDK must be installed to develop the server. To check whether .NET SDK has been successfully installed:

```console
$ dotnet --version
8.0.303
```
