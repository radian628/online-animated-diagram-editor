# CS361-Video-Microservice
This is my video microservice for CS361

## How to install/run

### Install
In the project directory execute `pip install -r requirements.txt`

### Run
`python app.py`

## How to Use
This service converts a list of images into a video. If the conversion is successful, the service returns the location/name of the video file.

To use the service, make a POST request to http://10.0.0.55:3000/service while app.py is running.

The following are required to be included in the body:
- video_type: The type of video to generate. Values can be mp4, avi, mov, wmv, or mkv
- path_out: The location and name of the final video (e.g. ./example.mp4 to create the video in the same directory as app.py). The type of video specified here should be the same as video_type

The request must also include either path_in or images (but not both):
- path_in: The location of the folder where your images are located. If this is included, the service will include all files within this folder.
- images: An array which includes the full location/file names of all files to be included in the video, in the order that they will be included.

The request can also include:
- fps: Frame rate. If this is not included it will default to 25.

### Sample Request
The following requests assume a set of images are in a folder called images at the directory where the microservice is included:

Request using path_in:
```js
const video_type = "mp4";
const path_in = "./images/dog-what-gif/";
const path_out = "./test.mp4";
const fps = 25.0;


fetch('http://10.0.0.55:3000/service', {
  method: 'POST',
  headers: {
    Accept: 'application.json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    video_type: video_type,
    path_in: path_in,
    path_out: path_out,
    fps: fps
  }) 
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => console.log(err))
```

Request using images:
```js
const video_type = "mp4";
const images = ["./images/giphy-0.jpg", "./images/giphy-1.jpg", "./images/giphy-10.jpg", "./images/giphy-11.jpg", "./images/giphy-12.jpg", "./images/giphy-2.jpg", "./images/giphy-3.jpg", "./images/giphy-4.jpg", "./images/giphy-5.jpg", "./images/giphy-6.jpg", "./images/giphy-7.jpg", "./images/giphy-8.jpg", "./images/giphy-9.jpg"];
const path_out = "./test.mp4";
const fps = 25.0;


fetch('http://10.0.0.55:3000/service', {
  method: 'POST',
  headers: {
    Accept: 'application.json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    video_type: video_type,
    images: images,
    path_out: path_out,
    fps: fps
  }) 
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => console.log(err))
```

## UML Sequence Diagram
![image](https://user-images.githubusercontent.com/11744733/198904507-81c2c445-94ce-4610-b614-f1040f37c9b3.png)

