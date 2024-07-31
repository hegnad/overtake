# Overtake backend server

This folder hosts the backend server for Overtake implemented in C#.

## Getting started

With .NET SDK 8.0 installed, run from the current folder:

```console
$ dotnet run
```

The Swagger page can then be accessed at [http://localhost:8080/swagger](http://localhost:8080/swagger).

## Configuration

Any default [ASP.NET Core configuration options](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-8.0) can be used. The recommended way to configure the server is through environment variables:

| Key        | Example Value                                              | Description                |
| ---------- | ---------------------------------------------------------- | -------------------------- |
| `DATABASE` | `Host=localhost;Username=test;Password=test;Database=test` | Postgres connection string |
