def label = "jenkins-agent-${UUID.randomUUID().toString()}"

podTemplate(label: label, cloud: 'kubernetes-199222', namespace:'jenkins', containers: [
    containerTemplate(name: 'docker', image: 'docker', command: 'cat', ttyEnabled: true),
    containerTemplate(name: 'kubectl', image: 'raphaelfp/jnlp-slave:lts', command: 'cat', ttyEnabled: true)
],
volumes: [
    hostPathVolume(mountPath: '/usr/bin/docker', hostPath: '/usr/bin/docker'),
    hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock')
]) {
    node(label) {
        def myRepo = checkout scm
        def gitCommit = myRepo.GIT_COMMIT
        def gitBranch = myRepo.GIT_BRANCH.replace("origin/","")

        def project = 'raphaelfp'
        def appName = 'auth'
        def svcPort = 3000
        def imageName = "${project}/${appName}:${gitBranch}.${env.BUILD_NUMBER}"



        stage('Build image') {
            container('docker') {
                echo "Building docker image \"${imageName}\""
                sh "docker build -t ${imageName} ."
            }
        }

        stage('Test build') {
            container('docker') {
                echo "Testing image \"${imageName}\""
                sh "docker run ${imageName} npm test"
            }
        }

        stage('Push image to registry') {
            container('docker') {
                echo "Testing image \"${imageName}\""
                sh "${DOCKER_HUB_PASS} | docker login -u raphaelfp --password-stdin"
                sh "docker push ${imageName}"
            }
        }

        stage('Deploy application') {
            container('kubectl') {
                echo "Deploying application"
                switch (gitBranch) {
                    case "staging":
                        sh("sed -i.bak 's#${project}/${appName}#${imageName}#' k8s/staging/*.yaml")
                        sh("kubectl --namespace=staging apply -f k8s/services/")
                        sh("kubectl --namespace=staging apply -f k8s/staging/")
                        sh("echo http://`kubectl --namespace=production get service/${appName} --output=json | jq -r '.status.loadBalancer.ingress[0].ip'`:${svcPort} > ${appName}")
                        break

                    case "master":
                        sh("sed -i.bak 's#${project}/${appName}#${imageName}#' k8s/production/*.yaml")
                        sh("kubectl --namespace=production apply -f k8s/services/")
                        sh("kubectl --namespace=production apply -f k8s/production/")
                        sh("echo http://`kubectl --namespace=production get service/${appName} --output=json | jq -r '.status.loadBalancer.ingress[0].ip'`:${svcPort} > ${appName}")
                        break

                    default:
                        sh("sed -i.bak 's#${project}/${appName}#${imageName}#' k8s/staging/*.yaml")
                        sh("kubectl --namespace=staging apply -f k8s/services/")
                        sh("kubectl --namespace=staging apply -f k8s/staging/")
                        sh("echo http://`kubectl --namespace=production get service/${appName} --output=json | jq -r '.status.loadBalancer.ingress[0].ip'`:${svcPort} > ${appName}")
                }
            }
        }
    }
}