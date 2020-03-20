pipeline {
    agent any
    environment {
        HOME = '.'
    }
    stages {
        stage('Build Java') {
            agent {
                docker {
                    image 'maven:3-alpine'
                    args '-v /root/.m2:/root/.m2'
                }
            }
            steps {
                sh 'mvn -B -DskipTests clean package'
            }
        }
        stage('Build Web') {
            agent {
                docker {
                    image 'node:12.7-alpine'
                }
            }
            steps {
                sh 'cd gobang-web && npm install && npm run build'
            }
        }
        stage('Build Java image') {
            steps {
                sh 'docker build gobang-service -t gobang-service:1.0'
            }
        }
        stage('Build Web image') {
            steps {
                sh 'docker build gobang-web -t gobang-web:1.0'
            }
        }
        stage('Run API server') {
            steps {
                sh 'docker run --name gobang-service --network host -d -p 8080:8080 gobang-service'
            }
        }
        stage('Run Web server') {
            steps {
                sh 'docker run --name gobang-web --network host -d -p 80:80 gobang-web'
            }
        }
    }
}
