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
        stage('Build image') {
            steps {
                sh 'docker build . -t gobang:1.0'
            }
        }
    }
}
