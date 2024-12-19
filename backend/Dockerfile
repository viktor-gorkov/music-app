FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV npm_config_build_from_source=true

EXPOSE 5000

CMD ["npm", "start"]
