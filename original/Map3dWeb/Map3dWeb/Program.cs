using Map3dWeb.Services;
using Microsoft.AspNetCore.StaticFiles;

namespace Map3dWeb
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllersWithViews();
            
            builder.Services.AddSingleton<ProjectService>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            var provider = new FileExtensionContentTypeProvider();
            provider.Mappings[".gpx"] = "application/gpx+xml";
            provider.Mappings[".gltf"] = "model/gltf+json";

            app.UseStaticFiles(new StaticFileOptions()
            {
                ContentTypeProvider = provider
            });

            app.UseRouting();

            app.UseAuthorization();



            app.MapControllerRoute(
                name: "default",
                pattern: "api/{controller=Home}/{action=Index}/{id?}");


            app.MapFallbackToFile("index.html");

            app.Run();
        }
    }
}