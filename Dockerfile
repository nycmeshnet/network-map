# #############################   Stage 0, Build the app   #####################
# pull official base image
FROM node:13.12.0-alpine as build-stage
# set working directory
WORKDIR /app
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
# install app dependencies
COPY package*.json ./
#RUN npm install
RUN npm install

# add app
COPY . ./

#build for production
RUN npm run-script build

# #### Stage 1, push the compressed  built app into nginx ####
FROM nginx:1.17

COPY --from=build-stage /app/build/ /usr/share/nginx/html
