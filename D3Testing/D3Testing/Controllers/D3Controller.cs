using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using D3Testing.Models;

namespace D3Testing.Controllers
{
    public class D3Controller : Controller
    {
        // GET: D3
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult Data()
        {
            var data = new List<D3MapDataPoint>
            {
                new D3MapDataPoint
                {
                    EventDate = new DateTime(2014, 12, 03),
                    FromLocation = new MapPoint(-89.85423279, 35.01461029),
                    ToLocation = new MapPoint(5.0311999, 51.7010612),
                    DurationOfMovement = 1,
                    DaysAtDestination = 10
                },
                new D3MapDataPoint
                {
                    EventDate = new DateTime(2014, 12, 13),
                    FromLocation = new MapPoint(5.0311999, 51.7010612),
                    ToLocation = new MapPoint(-80.19773102, 25.77481079),
                    DurationOfMovement = 3,
                    DaysAtDestination = 1
                },
                new D3MapDataPoint
                {
                    EventDate = new DateTime(2014, 12, 14),
                    FromLocation = new MapPoint(-80.19773102, 25.77481079),
                    ToLocation = new MapPoint(121.4691315, 25.1246395),
                    DurationOfMovement = 5,
                    DaysAtDestination = 5
                },
                new D3MapDataPoint
                {
                    EventDate = new DateTime(2014, 12, 19),
                    FromLocation = new MapPoint(121.4691315, 25.1246395),
                    ToLocation = new MapPoint(-80.24108887, 36.09962082),
                    DurationOfMovement = 20,
                    DaysAtDestination = 1
                }
            };
            return Json(data, JsonRequestBehavior.AllowGet);
        }
    }
}