namespace Overtake.Entities;

public class Team
{
    public required int TeamId { get; set; }
    public required string Name { get; set; }
    public required string FullName { get; set; }
    public required string Nationality { get; set; }
    public required string Base {  get; set; }
    public required string TeamChief { get; set; }
    public required string TechnicalChief { get; set; }
    public required string Chassis { get; set; }
    public required string PowerUnit { get; set; }
    public required string CarImagePath { get; set; }
    public required string TeamImagePath { get; set; }
    public required string FlagImagePath { get; set; }
    public required int FirstYear { get; set; }
    public required string ConstructorId { get; set; }
}
