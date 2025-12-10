using System;
using RamyScoolManagment.Api.Models;

namespace RamyScoolManagment.Api.Responses
{
    public class PresenceResponse
    {
        public int Id { get; set; }
        public string StudentName { get; set; }
        public string GroupName { get; set; }
        public string SessionDate { get; set; }
        public PresenceStatus PresenceStatus { get; set; }
    }
}

