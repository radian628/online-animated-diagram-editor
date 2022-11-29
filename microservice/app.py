import cv2
import numpy as numpy
import os
from os.path import isfile, join
from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/service', methods=['POST'])
def convert_image_to_video():
    try:
        fields = request.json

        # Check request input
        if ('path_in' in fields and 'images' in fields):
            return jsonify("Cannot have path_in and images in the same request"), 400
        elif (not 'path_in' in fields and not 'images' in fields):
            return jsonify("Either path_in or images must be included in the request"), 400

        if ('path_out' in fields):
            path_out = fields['path_out']
        else:
            return jsonify("A path for the output video must be specified"), 400

        if (not 'video_type' in fields):
            return jsonify("Must specify a video type"), 400
        elif (not fields['video_type'] == 'mp4' and not fields['video_type'] == 'avi' and not fields['video_type'] == 'mov' and not fields['video_type'] == 'wmv' and not fields['video_type'] == 'mkv'):
            return jsonify("Video type must be mp4, avi, mov, wmv, or mkv"), 400

        video_type = fields['video_type']

        if 'fps' in fields:
            fps = float(fields['fps'])
        else:
            fps = 25.0

        frames = []

        if 'path_in' in fields:
            path_in = fields['path_in']

            images = [f for f in os.listdir(
                path_in) if isfile(join(path_in, f))]

            for i in range(len(images)):
                filename = path_in + images[i]
                img = cv2.imread(filename)
                height, width, layers = img.shape
                size = (width, height)
                frames.append(img)

        else:
            images = fields['images']
            for i in range(len(images)):
                img = cv2.imread(images[i])
                height, width, layers = img.shape
                size = (width, height)
                frames.append(img)

        # Create video with correct fourcc code
        if (video_type == 'mp4' or video_type == 'mov' or video_type == 'mkv'):
            out = cv2.VideoWriter(path_out, cv2.VideoWriter_fourcc(
                'm', 'p', '4', 'v'), fps, size)
        elif (video_type == 'avi'):
            out = cv2.VideoWriter(path_out, cv2.VideoWriter_fourcc(
                'X', 'V', 'I', 'D'), fps, size)
        elif (video_type == 'wmv'):
            out = cv2.VideoWriter(path_out, cv2.VideoWriter_fourcc(
                'W', 'M', 'V', '2'), fps, size)
        else:
            return "Something went wrong", 500

        for i in range(len(frames)):
            out.write(frames[i])

        out.release()

        if (isfile(path_out)):
            return jsonify(path_out)
        else:
            return jsonify("Video could not be created"), 500
    except:
        return jsonify("Error in creating video"), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
