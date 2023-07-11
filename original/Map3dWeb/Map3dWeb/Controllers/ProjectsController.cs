using Map3dWeb.Services;
using Microsoft.AspNetCore.Mvc;

namespace Map3dWeb.Controllers
{
    public class ProjectsController : Controller
    {
        public IActionResult List([FromServices] ProjectService projectService)
        {
            return new JsonResult(projectService.List().Select(x => new
            {
                id = x.Id,
                title = x.Title
            }));
        }
    }
}
