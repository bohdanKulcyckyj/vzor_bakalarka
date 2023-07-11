using static Map3dWeb.Controllers.ProjectController;

namespace Map3dWeb.Services
{
    public class ProjectService
    {
        private List<Project> projects = new List<Project>()
        {
            new Project()
            {
                Id = 1,
                Title = "Mont Blanc",
                Data = new Model()
                {
                    center = new ModelCenter()
                        {
                            lat = 45.83256987294795,
                            lng = 6.865163189418157,
                            alt = 4791.7
                        },
                        zoom = 13,
                        trailGpxUrl = "./assets/export2.gpx",
                        bbox = new ModelBBox() {
                            northEast = new ModelCoord()
                            {
                                lat = 45.9179008,
                                lng = 6.9354122
                            },
                            southWest = new ModelCoord()
                            {
                                lat = 45.7724925,
                                lng = 6.7421217,
                            }
                        }
                }
            },
            new Project()
                {
                    Id = 2,
                    Title = "Ostravice",
                    Data = new Model()
                    {
                        center = new ModelCenter()
                        {
                            lat = 49.54052265869064,
                            lng = 18.391556789721125,
                            alt = 412.1
                        },
                        zoom = 13,
                        trailGpxUrl = "./assets/ostravice.gpx"
                    }
                },
                new Project()
                {
                    Id = 3,
                    Title = "Mestia",
                    Data = new Model()
                    {
                        center = new ModelCenter()
                        {
                            lat = 43.0600378,
                            lng = 42.7224428,
                            alt = 2175
                        },
                        bbox = new ModelBBox()
                        {
                            northEast = new ModelCoord()
                            {
                                lat = 43.0976803,
                                lng = 42.7591461
                            },
                            southWest = new ModelCoord()
                            {
                                lat = 43.0342228,
                                lng = 42.6528878
                            }
                        },
                        zoom = 13,
                        trailGpxUrl = null
                    }
                }
        };

        public List<Project> List()
        {
            return projects;
        }

        public Project? Find(int id)
        {
            return projects.FirstOrDefault(x => x.Id == id);
        }


    }

    public class Project
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public Model Data { get; set; }
    }

}
