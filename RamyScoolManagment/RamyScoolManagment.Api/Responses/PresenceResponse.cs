using System;
using RamyScoolManagment.Api.Models;

namespace RamyScoolManagment.Api.Responses
{
    public class PresenceResponse
    {
        public int Id { get; set; }
        public required string StudentName { get; set; }
        public required string GroupName { get; set; }
        public required string SessionDate { get; set; }
        public PresenceStatus PresenceStatus { get; set; }
    }
}

