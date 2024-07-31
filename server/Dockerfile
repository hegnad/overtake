FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src
COPY ./ /src/

RUN --mount=type=cache,target=/root/.nuget \
    --mount=type=cache,target=/src/obj \
    dotnet build -c Release

FROM mcr.microsoft.com/dotnet/aspnet:8.0

WORKDIR /app
COPY --from=build /src/bin/Release/net8.0/ /app/

EXPOSE 8080

ENTRYPOINT ["/app/overtake-server"]
