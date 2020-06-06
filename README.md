# Simple Mock API

## Docker

```bash
sudo docker build -t <image_name>:<image_tag> .

sudo docker run \
    -d \
    -p 8080:8080 \
    -v mock_storage:/usr/src/app/storage \
    -e APP_URL=http://localhost:8080 \
    <image_name>:<image_tag>

```