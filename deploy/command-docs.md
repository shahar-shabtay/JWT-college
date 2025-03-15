
# copy the certificates to right path:
cp ../client-cert.pem ./
cp ../client-key.pem ./
cp ../.env.prod ./

# Run the container
docker build -t back ./
docker run -dit --name back --network host back