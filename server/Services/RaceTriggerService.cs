using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Overtake.Entities;

public class RaceTriggerService : BackgroundService
{
    private readonly ILogger<RaceTriggerService> _logger;
    private readonly IHttpClientFactory _httpClientFactory;
    private DateTime? _triggerTime;

    // Add a testing flag
    public bool IsTesting { get; set; } = false;

    public RaceTriggerService(ILogger<RaceTriggerService> logger, IHttpClientFactory httpClientFactory)
    {
        _logger = logger;
        _httpClientFactory = httpClientFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                if (IsTesting)
                {
                    _logger.LogInformation("Testing mode enabled: Manually setting trigger time...");
                    _triggerTime = DateTime.UtcNow.AddMinutes(1); // Set a static testing trigger time
                    _logger.LogInformation("Trigger time for testing is set to: {TriggerTime}", _triggerTime);

                    // Simulate immediate trigger check for testing
                    while (!stoppingToken.IsCancellationRequested)
                    {
                        CheckAndTrigger();

                        if (!_triggerTime.HasValue)
                            break; // Exit testing loop after trigger is executed

                        await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken); // Poll every 10 seconds during testing
                    }

                    _logger.LogInformation("Testing completed.");
                    break; // Exit service loop after testing
                }

                // Normal mode: Fetch race data and set the trigger time
                await FetchAndSetTriggerTimeAsync();

                // Wait for the next check (24 hours)
                for (int i = 0; i < 24; i++) // Check hourly to avoid long blocking
                {
                    if (stoppingToken.IsCancellationRequested)
                        return;

                    CheckAndTrigger();

                    // Wait an hour between inner checks
                    await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in RaceTriggerService.");
            }
        }
    }

    private async Task FetchAndSetTriggerTimeAsync()
    {
        try
        {
            using var httpClient = _httpClientFactory.CreateClient();
            var response = await httpClient.GetAsync("https://api.jolpi.ca/ergast/f1/current/next.json");

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                var raceData = JsonSerializer.Deserialize<RaceData>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                if (raceData?.MRData?.RaceTable?.Races?.Count > 0)
                {
                    var nextRace = raceData.MRData.RaceTable.Races[0];

                    // Parse the race start time and explicitly set it to UTC
                    var raceStartTimeUtc = DateTime.SpecifyKind(
                        DateTime.Parse(nextRace.Date + "T" + nextRace.Time),
                        DateTimeKind.Utc
                    );

                    // Convert UTC to server local time (Mountain Time for Calgary)
                    var mountainTimeZone = TimeZoneInfo.FindSystemTimeZoneById("America/Edmonton");
                    var raceStartTimeLocal = TimeZoneInfo.ConvertTimeFromUtc(raceStartTimeUtc, mountainTimeZone);

                    // Calculate the trigger time (3 hours after race start)
                    _triggerTime = raceStartTimeLocal.AddHours(3);

                    // Log both the race start and the calculated trigger time
                    _logger.LogInformation("Race start time (local): {RaceStartTime}", raceStartTimeLocal);
                    _logger.LogInformation("Next race trigger set for: {TriggerTime} (local time)", _triggerTime.Value);
                }
                else
                {
                    _logger.LogWarning("No upcoming races found in the API response.");
                }
            }
            else
            {
                _logger.LogWarning("Failed to fetch race data: {StatusCode}", response.StatusCode);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching race data.");
        }
    }

    private void CheckAndTrigger()
    {
        if (_triggerTime.HasValue && DateTime.UtcNow >= _triggerTime.Value)
        {
            TriggerAction();
            _triggerTime = null; // Reset trigger time after execution
        }
    }

    private async void TriggerAction()
    {
        _logger.LogInformation("Race trigger activated at: {Time}", DateTime.UtcNow);

        try
        {
            // Step 1: Fetch the latest race results
            var raceResults = await FetchRaceResultsAsync();
            if (raceResults == null || raceResults.Count == 0)
            {
                _logger.LogWarning("No race results were fetched. Aborting scoring.");
                return;
            }

            _logger.LogInformation("Fetched race results: {Results}", string.Join(", ", raceResults));

            // Step 2: Fetch ballots for the race
            var ballots = await FetchBallotsForRaceAsync();
            if (ballots == null || ballots.Count == 0)
            {
                _logger.LogWarning("No ballots found. Aborting scoring.");
                return;
            }

            // Log the fetched ballots
            _logger.LogInformation("Fetched {Count} ballots: ", ballots.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred during race trigger.");
        }
    }

    // Helper method to fetch race results
    private async Task<List<ErgastDriver>> FetchRaceResultsAsync()
    {
        try
        {
            using var httpClient = _httpClientFactory.CreateClient();
            var response = await httpClient.GetAsync("https://ergast.com/api/f1/current/last/results.json");

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                var raceData = JsonSerializer.Deserialize<RaceData>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                // Extract top 10 drivers from the results
                var results = raceData?.MRData?.RaceTable?.Races?[0]?.Results;
                if (results != null)
                {
                    return results.Take(10).Select(result => result.Driver).ToList();
                }
            }
            else
            {
                _logger.LogWarning("Failed to fetch race results: {StatusCode}", response.StatusCode);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching race results.");
        }

        // Return an empty list on failure
        return new List<ErgastDriver>();
    }

    private async Task<List<Ballot>> FetchBallotsForRaceAsync()
    {
        try
        {
            using var httpClient = _httpClientFactory.CreateClient();

            // Step 1: Fetch the next race ID
            var nextRaceIdResponse = await httpClient.GetAsync("http://localhost:8080/api/ballot/nextRaceId");

            if (!nextRaceIdResponse.IsSuccessStatusCode)
            {
                _logger.LogWarning("Failed to fetch next race ID. Status code: {StatusCode}", nextRaceIdResponse.StatusCode);
                return new List<Ballot>();
            }

            var nextRaceIdJson = await nextRaceIdResponse.Content.ReadAsStringAsync();
            if (!int.TryParse(nextRaceIdJson, out var nextRaceId))
            {
                _logger.LogWarning("Invalid next race ID format: {Json}", nextRaceIdJson);
                return new List<Ballot>();
            }

            _logger.LogInformation("Fetched next race ID: {NextRaceId}", nextRaceId);

            // Step 2: Fetch ballots for the next race ID
            var ballotsResponse = await httpClient.GetAsync($"http://localhost:8080/api/ballot/race/{nextRaceId}");

            if (!ballotsResponse.IsSuccessStatusCode)
            {
                _logger.LogWarning("Failed to fetch ballots for race ID: {RaceId}. Status code: {StatusCode}", nextRaceId, ballotsResponse.StatusCode);
                return new List<Ballot>();
            }

            var ballotsJson = await ballotsResponse.Content.ReadAsStringAsync();
            var ballots = JsonSerializer.Deserialize<List<Ballot>>(ballotsJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            _logger.LogInformation("Fetched {Count} ballots for race ID: {RaceId}.", ballots?.Count ?? 0, nextRaceId);

            return ballots ?? new List<Ballot>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching ballots for the next race.");
            return new List<Ballot>();
        }
    }

}

// Define models for deserialization
public class RaceData
{
    public MRData MRData { get; set; }
}

public class MRData
{
    public RaceTable RaceTable { get; set; }
}

public class RaceTable
{
    public List<Race> Races { get; set; }
}

public class Race
{
    public string Date { get; set; }
    public string Time { get; set; }
    public List<Result> Results { get; set; }
}

public class Result
{
    public ErgastDriver Driver { get; set; }
}
