## Cloud Build and Deployment Process

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

