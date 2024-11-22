using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

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
            var response = await httpClient.GetAsync("https://ergast.com/api/f1/current/next.json");

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                var raceData = JsonSerializer.Deserialize<RaceData>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                if (raceData?.MRData?.RaceTable?.Races?.Count > 0)
                {
                    var nextRace = raceData.MRData.RaceTable.Races[0];
                    var raceStartTime = DateTime.Parse(nextRace.Date + "T" + nextRace.Time);

                    // Set trigger time for normal operation (3 hours after race start)
                    _triggerTime = raceStartTime.AddHours(3);
                    _logger.LogInformation("Next race trigger set for: {TriggerTime}", _triggerTime.Value);
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

    private void TriggerAction()
    {
        _logger.LogInformation("Race trigger activated at: {Time}", DateTime.UtcNow);

        // TODO: Add the action to be executed after the trigger activates
        // Example: Call a method in BallotController or another service
        // BallotController.PerformTriggerAction();

        // TODO: Add the actual scoring logic for what should happen here
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
}
