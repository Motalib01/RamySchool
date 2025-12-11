using Microsoft.OpenApi;

namespace RamyScoolManagment.Api.Configuration
{
    public static class SwaggerConfiguration
    {
        public static void AddSwaggerConfiguration(this IServiceCollection services)
        {
            // Optional helper from Microsoft.AspNetCore.OpenApi (keep if package is installed)
            services.AddOpenApi();

            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Ramy School Management API",
                    Version = "v1.0",
                    Description = "API for managing teachers, students, groups, sessions, and attendance",
                    Contact = new OpenApiContact
                    {
                        Name = "Ramy School",
                        Email = "support@ramyschool.com"
                    },
                    License = new OpenApiLicense
                    {
                        Name = "MIT License",
                        Url = new Uri("https://opensource.org/licenses/MIT")
                    }
                });

                // JWT Bearer authentication (recommended)
                var bearerDef = new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\""
                };

                options.AddSecurityDefinition("Bearer", bearerDef);

                // Add XML comments support (enable XML doc generation in project settings)
                var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                if (File.Exists(xmlPath))
                {
                    options.IncludeXmlComments(xmlPath);
                }
            });
        }

        public static void UseSwaggerConfiguration(this WebApplication app)
        {
            
                app.UseSwagger();
                app.UseSwaggerUI(options =>
                {
                    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Ramy School Management API v1.0");
                    options.RoutePrefix = "swagger";
                    options.DefaultModelsExpandDepth(2);
                    options.DefaultModelExpandDepth(2);
                });

                // Optional helper from Microsoft.AspNetCore.OpenApi
                app.MapOpenApi();
            
        }
    }
}
