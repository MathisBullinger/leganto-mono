FROM node:16-alpine

WORKDIR /usr/src/app

COPY ./*.json .
COPY api api

RUN npm install
RUN npm run build -w api

WORKDIR api

EXPOSE 7001
CMD [ "node", "dist/main.js" ]
