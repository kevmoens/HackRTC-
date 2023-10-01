
using Google.Cloud.Vision.V1;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestAPI
{
    public static class Requester
    {
        private static void SendRequest()
        {
            string filepath = @"C:\Users\zmanj\Downloads\pack.png";
            //string filepath = @"C:\Users\zmanj\source\repos\RTCTestApp\RTCTestApp\Resources\horse.jpg";
            Image image = Image.FromFile(filepath);
            ImageAnnotatorClient client = ImageAnnotatorClient.Create();
            IReadOnlyList<EntityAnnotation> labels = client.DetectLabels(image);
            foreach (EntityAnnotation label in labels)
            {
                Console.WriteLine($"Score: {(int)(label.Score * 100)}%; Description: {label.Description}");
            }
        }

        public static IEnumerable<LocalizedObjectAnnotation> IdentifyLabelsByByte(byte[] imageBytes)
        {
            Image img = Image.FromBytes(imageBytes);
            return IdentifyLabels(img);
        }


        public static IEnumerable<LocalizedObjectAnnotation> IdentifyLabels(Image image)
        {
            ImageAnnotatorClient client = ImageAnnotatorClient.Create();
            return client.DetectLocalizedObjects(image);

            //foreach (EntityAnnotation label in labels)
            //{
            //    Console.WriteLine($"Score: {(int)(label.Score * 100)}%; Description: {label.Description}");
            //}
        }

    }
}


