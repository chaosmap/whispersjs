#!bin/bash
python3 pre_uglified_build.py && 
sudo docker run -v $(pwd)/src/shorthand:/mnt/codebase -it node /bin/bash -c "cd /mnt/codebase && npm install uglify-js -g && uglifyjs whispers.js -o uglified/whispers.js -c -m" && 
sudo docker run -v $(pwd)/src/shorthand:/mnt/codebase -it node /bin/bash -c "cd /mnt/codebase && npm install uglify-js -g && uglifyjs whispers_plus.js -o uglified/whispers_plus.js -c -m" && 
python3 post_uglified_build.py && 
ls -lh --block-size=1 src/shorthand/uglified