FROM node

# Create app directory
WORKDIR /usr/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./


RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .
WORKDIR /usr/app/src

EXPOSE 8080
ENV DB_USER="doadmin" DB_PASS="AVNS_NBBOb4ar5CFDbn5oGL7" DB_HOST="db-postgresql-ams3-90808-do-user-7508816-0.b.db.ondigitalocean.com:25060" DB_NAME="defaultdb" NODE_TLS_REJECT_UNAUTHORIZED="0"
CMD [ "node", "app.js" ]