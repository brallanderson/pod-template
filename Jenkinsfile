/*
This is an example pipeline that implement full CI/CD for a simple static web site packed in a Docker image.
The pipeline is made up of 6 main steps
1. Build image
2. Test build
3. Push image to registry
4. Deploy application
*/

node {

    def myRepo = checkout scm
    def gitCommit = myRepo.GIT_COMMIT
    def gitBranch = myRepo.GIT_BRANCH.replace("origin/","")

    def project = 'raphaelfp'
    def appName = 'pod-template'
    def imageName = "${project}/${appName}:${gitBranch}.${env.BUILD_NUMBER}"



    stage('Build image') {

        //echo sh(returnStdout: true, script: 'env')

        echo "Validating kubectl"
        sh "kubectl cluster-info"
        
        echo "Building docker image \"${imageName}\""

        sh "docker build -t ${imageName} ."
    }

    stage('Test build') {
        echo "Testing image \"${imageName}\""

        sh "docker run ${imageName} npm test"
    }

    stage('Push image to registry') {
        echo "Testing image \"${imageName}\""

        sh "docker login -u raphaelfp -p ${DOCKER_HUB_PASS}"
        sh "docker push ${imageName}"
    }

    stage('Deploy application') {
        echo "Deploying application"
        switch (gitBranch) {
            case "staging":
                sh("sed -i.bak 's#${project}/${appName}#${imageName}#' k8s/staging/*.yaml")
                sh("kubectl --namespace=staging apply -f k8s/services/")
                sh("kubectl --namespace=staging apply -f k8s/staging/")
                // echo 'To access your environment run `kubectl proxy`'
                // echo "Then access your service via http://localhost:8001/api/v1/proxy/namespaces/${gitBranch}/services/${appName}/"
                sh("echo http://`kubectl --namespace=production get service/${appName} --output=json | jq -r '.status.loadBalancer.ingress[0].ip'` > ${appName}")
                break

            case "master":
                sh("sed -i.bak 's#${project}/${appName}#${imageName}#' k8s/production/*.yaml")
                sh("kubectl --namespace=production apply -f k8s/services/")
                sh("kubectl --namespace=production apply -f k8s/production/")
                //echo 'To access your environment run `kubectl proxy`'
                //echo "Then access your service via http://localhost:8001/api/v1/proxy/namespaces/${gitBranch}/services/${appName}/"
                sh("echo http://`kubectl --namespace=production get service/${appName} --output=json | jq -r '.status.loadBalancer.ingress[0].ip'` > ${appName}")
                break

            default:
                sh("kubectl get ns ${gitBranch} || kubectl create ns ${gitBranch}")
                // Don't use public load balancing for development branches
                sh("sed -i.bak 's#${project}/${appName}#${imageName}#' k8s/dev/*.yaml")
                sh("kubectl --namespace=${gitBranch} apply -f k8s/services/")
                sh("kubectl --namespace=${gitBranch} apply -f k8s/dev/")
                echo 'To access your environment run `kubectl proxy`'
                echo "Then access your service via http://localhost:8001/api/v1/proxy/namespaces/${gitBranch}/services/${appName}:80/"
        }
    }
}