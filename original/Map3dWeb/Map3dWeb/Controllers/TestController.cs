using Microsoft.AspNetCore.Mvc;

namespace Map3dWeb.Controllers
{
    public class TestController : Controller
    {
        public IActionResult Index()
        {
            return new JsonResult(new { });
        }
    }
}
