# Overtake

Monorepo for Overtake.

## Projects

This monorepo contains all complete stack of components needed for running the Overtake application:

- [server](./server): Backend API server written in C# with [.NET](https://dotnet.microsoft.com/).
- [web](./web): Frontend web app written in TypeScript with [Next.js](https://nextjs.org/).

## Quickstart

This repository provides a [`docker-compose.yml`](./docker-compose.yml) file for quickly running the entire application stack without requiring the [prerequisites](#prerequisite) to be installed.

With [Docker Compose](https://docs.docker.com/compose/) installed:

```console
$ docker compose up -d
```

and the backend server will be accessible locally at [http://localhost:8080/](http://localhost:8080/).

To stop the stack:

```console
$ docker compose down
```

> [!NOTE]
>
> On Windows or macOS, a [Docker Desktop](https://docs.docker.com/desktop/) installation comes with Compose functionalities. There's no need to install Compose separately in this case.

## Prerequisite

Depending on the component, different toolchains need to be installed to successfully build and run them.

### `server`

The backend server is developed with [.NET](https://dotnet.microsoft.com/) 8.0. The .NET SDK must be installed to develop the server. To check whether .NET SDK has been successfully installed:

```console
$ dotnet --version
8.0.303
```

### `web`

The frontend web app is developed with [Next.js](https://nextjs.org/). [Node.js](https://nodejs.org/) must be installed:

```console
$ node --version
v20.16.0
```

In addition, the project uses the `yarn` package manager, which can be installed with:

```console
$ npm install -g yarn
```

To check whether `yarn` is properly installed:

```console
$ yarn --version
1.22.22
```
