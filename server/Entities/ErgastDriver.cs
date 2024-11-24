namespace Overtake.Entities;

public class ErgastDriver
{
    public string DriverId { get; set; }
    public string PermanentNumber { get; set; }
    public string Code { get; set; }
    public string Url { get; set; }
    public string GivenName { get; set; }
    public string FamilyName { get; set; }
    public string Nationality { get; set; }

    public override string ToString()
    {
        return $"{GivenName} {FamilyName}";
    }
}
