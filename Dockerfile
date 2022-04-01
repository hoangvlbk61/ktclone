FROM node:lts

WORKDIR /app
COPY ./package*.json ./
RUN npm ci
COPY . .
#RUN chown -R node.node /app 
#RUN chmod 777 /app/images
#RUN chmod 777 -R /app/images
#USER node
#RUN chmod 777 /app/images

EXPOSE 3000
CMD npm start
