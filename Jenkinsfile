pipeline {
    agent any

    environment {
        GIT_REPO = 'git@github.com:aqaproject/aqa-backend-nestjs.git'
        BRANCH = 'main'
        DEPLOY_DIR = '/var/www/backend'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: "${BRANCH}", url: "${GIT_REPO}"
            }
        }

        stage('Build') {
            steps {
                echo 'Building application...'
                sh 'npm install'
                sh 'npm run build'
            }
        }

        // stage('Test') {
        //     steps {
        //         echo 'Running tests...'
        //         sh 'npm test'  // Or your test command
        //     }
        // }

        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                sh """
                    rm -rf ${DEPLOY_DIR}/*
                    cp -R * ${DEPLOY_DIR}/
                """
                sh 'npm run start:prod'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
