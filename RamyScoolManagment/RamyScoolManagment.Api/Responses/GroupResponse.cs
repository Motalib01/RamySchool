namespace RamyScoolManagment.Api.Responses
{
    public class GroupResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int TeacherId { get; set; }
        public string TeacherName { get; set; }
        public List<StudentResponse> Students { get; set; } = new List<StudentResponse>();
    }
}
