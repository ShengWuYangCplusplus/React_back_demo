# FROM keymetrics/pm2:latest-alpine

# # Bundle APP files
# COPY src src/
# COPY package.json .
# COPY pm2.json .

# # Install app dependencies
# ENV NPM_CONFIG_LOGLEVEL warn
# RUN npm install --production

# # Show current folder structure in logs
# RUN ls -al -R

# CMD [ "pm2-runtime", "start", "pm2.json" ]

# 依赖pm2镜像
FROM keymetrics/pm2:latest-alpine 

# Bundle APP files
RUN mkdir -p /usr/src/MyDocker/First_Docker_Node
WORKDIR /usr/src/MyDocker/First_Docker_Node
 
# Bundle app source
COPY . /usr/src/MyDocker/First_Docker_Node
RUN npm install

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production

# Show current folder structure in logs
RUN ls -al -R

EXPOSE 7788 
CMD [ "pm2-runtime", "start", "process.json" ]