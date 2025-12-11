using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RamyScoolManagment.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSessionsToGroupLevel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sessions_Enrollments_EnrollmentId",
                table: "Sessions");

            migrationBuilder.DropColumn(
                name: "InitialSessionsCount",
                table: "Enrollments");

            // Add temporary GroupId column
            migrationBuilder.AddColumn<int>(
                name: "GroupId_Temp",
                table: "Sessions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            // Update GroupId_Temp with the GroupId from the enrollment
            migrationBuilder.Sql(@"
                UPDATE Sessions 
                SET GroupId_Temp = e.GroupId 
                FROM Sessions s 
                INNER JOIN Enrollments e ON s.EnrollmentId = e.Id
            ");

            // Drop the index first
            migrationBuilder.DropIndex(
                name: "IX_Sessions_EnrollmentId",
                table: "Sessions");

            // Drop the old EnrollmentId column
            migrationBuilder.DropColumn(
                name: "EnrollmentId",
                table: "Sessions");

            // Rename the temporary column to GroupId
            migrationBuilder.RenameColumn(
                name: "GroupId_Temp",
                table: "Sessions",
                newName: "GroupId");

            // Create the index
            migrationBuilder.CreateIndex(
                name: "IX_Sessions_GroupId",
                table: "Sessions",
                column: "GroupId");

            // Add the foreign key constraint
            migrationBuilder.AddForeignKey(
                name: "FK_Sessions_Groups_GroupId",
                table: "Sessions",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sessions_Groups_GroupId",
                table: "Sessions");

            migrationBuilder.RenameColumn(
                name: "GroupId",
                table: "Sessions",
                newName: "EnrollmentId");

            migrationBuilder.RenameIndex(
                name: "IX_Sessions_GroupId",
                table: "Sessions",
                newName: "IX_Sessions_EnrollmentId");

            migrationBuilder.AddColumn<int>(
                name: "InitialSessionsCount",
                table: "Enrollments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_Sessions_Enrollments_EnrollmentId",
                table: "Sessions",
                column: "EnrollmentId",
                principalTable: "Enrollments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
