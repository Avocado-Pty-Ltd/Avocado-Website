# Waypoint "clicks vs matters" video

Remotion source for waypoint/media/clicks-vs-matters.mp4 and its poster.

    npm install
    npx remotion render src/index.ts Versus ../../waypoint/media/clicks-vs-matters.mp4 --codec=h264 --crf=26 --muted
    npx remotion still src/index.ts Versus ../../waypoint/media/clicks-vs-matters.png --frame=290
