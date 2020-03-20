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
                    image 'trion/ng-cli'
                }
            }
            steps {
                sh 'npm install --save-dev @angular-devkit/build-angular'
                sh 'npm install --save-dev @angular/compiler-cli'
                sh 'cd gobang-web && ng build --outputPath ../gobang-service/src/main/resources/public'
                sh 'ng build'
            }
        }
        stage('Build image') {
            steps {
                sh 'docker build . -t gobang:1.0'
            }
        }
    }
}
