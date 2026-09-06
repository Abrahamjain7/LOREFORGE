using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LoreForge.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCoverImageUrlAndUpvotes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Upvotes",
                table: "Guides",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Upvotes",
                table: "Guides");
        }
    }
}
