FROM 23.1.0-alpine3.20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:prod"]