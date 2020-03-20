pipeline {
    agent any
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
                    image 'pivotalpa/angular-cli'
                }
            }
            steps {
                sh 'cd gobang-web && npm install'
                sh 'cd gobang-web && ng build --outputPath ./dist'
            }
        }
        stage('Build image') {
            steps {
                sh 'docker build . -t gobang:1.0'
            }
        }
    }
}
