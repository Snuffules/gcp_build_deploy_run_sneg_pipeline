## Cloud Build and Deployment Process

- Detailed overview of the steps executed from the cloudbuild.yaml:
- Create container from your *.js and package.json files using Dockerfile
- For Dockerfile used in this solution, node20 is used as docker image
- Push container to Artifact Registry
- Deploy with Cloud Run as service, if new service is created, deploy with 100% traffic serving, otherwise  new revision with 0% traffic
- Region europe-central2 is used(as per your current Cloud Run service)
- Perform health check(added /health to server.js)
- curl is used to check Serverless NEG external IP with /health
- If health check failed, pipeline will stop execution
- Split traffic to 50% between new and old revision(canary deployment)
- Applied Internal traffic and Allow traffic from external Application Load Balancers
- Following best practices [here](https://cloud.google.com/run/docs/securing/ingress).

- Created Cloud Build that creates container from `*.js` and `package.json`
- Created container using Dockerfile
- Pushed to Artifact registry
- Deployed as Cloud Run service
- Binary authorisation is enabled
- New revision is deployed with `--no-traffic` option

## Health Check Implementation

- Healthcheck added to `*.js`:
```node
app.get('/health', (req, res) => {
    res.status(200).send('Healthy!');
    });
```

- Health check using curl - in case of an Error - breaks and exits the pipeline
- If healthy, deploying new revision with 50% old revision and 50% new revision (can be changed)

## Environment and Configuration

- `node20-alpine` used for small size benefit and quick iterations (Correct if I am wrong, I see that you are using node20 image from Cloud Build logs)
- Region: `europe-central2` (as per your Cloud Run App)

## Serverless NEG for Cloud Run

Created to:
- Balance the load to lower the attack vector in front of your app
- Redirect requests between active service revisions (old and new)

Tested with this code:

```node
app.get('/', (req, res) => {
    const revisionName = process.env.K_REVISION;
    res.send(Hello from revision: ${revisionName});
    });
```

## Domain Configuration

- Domain mapped to Serverless NEG Load Balancer External IP
- DNS A records added for domain: `@` and `www` with corresponding IP for Serverless NEG LB

