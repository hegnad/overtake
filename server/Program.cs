using System.Reflection;
using Overtake.Auth;
using Overtake.Interfaces;
using Overtake.Services;

namespace Overtake;

public class Program
{
    static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(options =>
        {
            // Enables loading XML docs for OpenAPI
            var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
            options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
        });

        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(
                policy =>
                {
                    policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                });
        });

        builder.Services.AddAuthentication().AddScheme<MockAuthenticationOptions, MockAuthenticationHandler>("mock_auth", null);

        builder.Services.AddHostedService<DbInitService>();

        builder.Services.AddControllers();

        builder.Services.AddSingleton<IDatabase, PostgresDatabase>();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        app.UseSwagger();
        app.UseSwaggerUI();

        app.UseHttpsRedirection();

        app.UseCors();
        app.UseAuthentication();

        app.MapControllers();

        app.Run();
    }
}
