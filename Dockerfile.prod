FROM node:slim-23-alpine

WORKDIR /app

COPY package.json ./

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]