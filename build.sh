#!bin/bash
python3 build.py && 
docker run -v $(pwd)/src/shorthand:/mnt/silversea_codebase -it node /bin/bash -c "cd /mnt/silversea_codebase && npm install uglify-js -g && uglifyjs whispers.js -o uglified/whispers.js -c -m" && 
python3 build.py && 
ls -lh --block-size=1 src/shorthand/uglified