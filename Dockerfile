FROM openjdk:8-jre-alpine
COPY target/*.jar /app.jar
EXPOSE 10000
CMD /usr/bin/java -jar /app.jar