docker build -t backend ./
docker run -dit --name backend -p 3000:3000 backend

# To run nginx:
docker run -d --name nginx -p 80:80 -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro nginx