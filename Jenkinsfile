pipeline {
    agent any
    environment {
        HOME = '.'
    }
    stages {
        stage('Build Java') {
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
        
        stage('Build Java image') {
            steps {
                sh 'docker build -t gobang-service:1.0 gobang-service'
            }
        }
        stage('Build Web image') {
            steps {
                sh 'docker build -t gobang-web:1.0 gobang-web'
            }
        
        stage('Run API server') {
            steps {
                sh 'docker run --rm --name gobang-service --network host -d -p 10001:10001 gobang-service'
            }
        }
        stage('Run Web server') {
            steps {
                sh 'docker run --rm --name gobang-web --network host -d -p 80:80 gobang-web'
            }
        }
    }
}

