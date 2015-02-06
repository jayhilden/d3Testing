using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace D3Testing.Models
{
    public class D3MapDataPoint
    {
        public DateTime EventDate { get; set; }
        public MapPoint FromLocation { get; set; }
        public MapPoint ToLocation { get; set; }
        public int DurationOfMovement { get; set; }
        public int DaysAtDestination { get; set; }
    }

    public class MapPoint
    {
        public MapPoint(double longitude, double latitude)
        {
            Longitude = longitude;
            Latitude = latitude;
        }

        public double Longitude { get; private set; }
        public double Latitude { get; private set; }
    }
}

