# cloudbuild-status-reporter

Integration between Cloudbuild and Github is currently very simplistic.  If you
have a single `cloudbuild.yaml` file in your project root, life is good for
you.

For those with a monorepo setup, creating a cloudbuild trigger pointing at
cloudbuild.yaml files in subfolders means your builds will be triggered as
expected but their status will never make it back to Github. This project
solves that problem.

cloudbuild-status-reporter is a container meant to be used with Cloud Run to
communicate the status of multiple builds back to Github.

## Getting it working

There is a little bit of wiring work that needs to get done, but it's not as bad as it looks.

First, deploying the Cloud Run container requires a Github token that must be created in [your
settings](https://github.com/settings/tokens). The token needs to have the
repo scope to create the status on the PR.

Next, clone this repo and build.

```sh
$ git clone git@github.com:sleepycat/cloudbuild-status-reporter.git && cd cloudbuild-status-reporter
# Build yourself a copy of the image and push it to your registry:
$ docker build -t gcr.io/[PROJECT_ID]/cloudbuild-status-reporter .
$ docker push gcr.io/[PROJECT_ID]/cloudbuild-status-reporter
```

Cloudbuild automatically creates a pubsub topic and sends updates to it. We need to access that.

```sh
# Enable cloudbuild
$ gcloud services enable cloudbuild.googleapis.com
# Notice that enabling cloudbuild creates a pubsub topic with build info
$ gcloud pubsub topics list
---
name: projects/[PROJECT_ID]/topics/cloud-builds
```
We want the pubsub service to be able to invoke Cloud Run. It'll need accounts and permissions for that.

```sh
# Create a service account so pubsub can invoke Cloud Run
$ gcloud iam service-accounts create cloud-run-pubsub-invoker --display-name "Cloud Run Pub/Sub Invoker"
$ gcloud iam service-accounts list
NAME                                    EMAIL                                                                      DISABLED
Cloud Run Pub/Sub Invoker               cloud-run-pubsub-invoker@[PROJECT_ID].iam.gserviceaccount.com              False
```

The cloudbuild-status-reporter needs a service account and permission to access trigger details to be able to able to report meaningful details back to Github.

```
# Create a Service account for the container to use to get trigger names
$ gcloud iam service-accounts create build-trigger-viewer --display-name "Build trigger viewer"
# Give permission for that account to access build triggers
$ gcloud projects add-iam-policy-binding PROJECT_ID --member=serviceAccount:build-trigger-viewer@[PROJECT_ID].iam.gserviceaccount.com --role=roles/cloudbuild.builds.viewer
```

Finally, we'll deploy a Cloud Run service based on that image, and then use the service URL to subscribe to the cloudbuild pubsub topic:

```
# Deploy a Cloud Run service based on that image
$ gcloud beta run deploy --service-account=build-trigger-viewer@[PROJECT_ID].iam.gserviceaccount.com --platform=managed --region=us-central1 --set-env-vars=GCP_PROJECT=[PROJECT_ID],GCP_TRIGGER_REGION=[REGION_TRIGGERS_RUN_IN],GITHUB_TOKEN=[YOUR_GITHUB_TOKEN],REPO_NAME=[YOUR_REPO_NAME],REPO_OWNER=[GITHUB_ORG_OR_USERNAME] --allow-unauthenticated --image gcr.io/[PROJECT_ID]/cloudbuild-status-reporter cloudbuild-status-reporter
$ gcloud run services add-iam-policy-binding cloudbuild-status-reporter --member=serviceAccount:cloud-run-pubsub-invoker@[PROJECT_ID].iam.gserviceaccount.com --role=roles/run.invoker --platform managed --region=us-central1
$ gcloud pubsub subscriptions create --push-endpoint=[THE_CLOUD_RUN_SERVICE_URL] --topic=cloud-builds cloudbuild-status-reporter
```

## TODO

* add a Makefile/script to automate some of this setup
