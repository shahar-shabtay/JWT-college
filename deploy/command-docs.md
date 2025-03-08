
# copy the certificates to right path:
cp ../client-cert.pem ./nginx/
cp ../client-key.pem ./nginx/

# Run the container
docker build -t back ./
docker run -dit --name back --network host back