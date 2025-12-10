namespace RamyScoolManagment.Api.Models
{
    public class Teacher
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public decimal Salary { get; set; }
        public decimal Percentage { get; set; }

        public virtual ICollection<Group> Groups { get; set; } = new List<Group>();
    }
}