using Map3dWeb.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Map3dWeb.Controllers
{
    public class ProjectController : Controller
    {

        public class Model
        {
            public ModelCenter center { get; set; }
            public ModelBBox bbox { get; set; }
            public int zoom { get; set; }
            public string trailGpxUrl { get; set; }
        }

        public class ModelCenter
        {
            public required double lat { get; set; }
            public required double lng { get; set; }
            public required double alt { get; set; }
        }


        public class ModelCoord
        {
            public required double lat { get; set; }
            public required double lng { get; set; }
        }

        public class ModelBBox
        {
            public required ModelCoord northEast { get; set; }
            public required ModelCoord southWest { get; set; }
        }

        public class ModelOptions
        {
            public required ModelCenter center { get; set; }
            public ModelBBox bbox { get; set; }
            public required int zoom { get; set; }
            public string trailGpxUrl { get; set; }
        }


        [HttpGet]
        public IActionResult Detail(int id, [FromServices] ProjectService projectService)
        {
            return new JsonResult(projectService.Find(id)?.Data);
        }

        [HttpPut]
        public IActionResult Bbox(int id, [FromBody] ModelBBox bbox, [FromServices] ProjectService projectService) {

            var data = projectService.Find(id)!.Data;
            data.bbox = bbox;

            return new JsonResult(new
            {
                bbox = bbox
            });
        }

    }
}
