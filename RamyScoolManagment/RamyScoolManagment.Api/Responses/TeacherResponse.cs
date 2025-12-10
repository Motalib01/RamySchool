namespace RamyScoolManagment.Api.Responses
{
    public class TeacherResponse
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public decimal Salary { get; set; }
        public decimal Percentage { get; set; }
        public List<GroupResponse> Groups { get; set; } = new List<GroupResponse>();
    }
}
