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

Enabling the Cloudbuild API for your project will automatically create a
cloud-builds topic.

Next, you need to ensure that pubsub has permission to invoke your Cloud Run
container:

```sh
gcloud projects add-iam-policy-binding propertygraph \
 --member=serviceAccount:service-861907550287@gcp-sa-pubsub.iam.gserviceaccount.com \
 --role=roles/run.invoker

gcloud iam service-accounts create cloud-run-pubsub-invoker \
     --display-name "Cloud Run Pub/Sub Invoker"
```

You'll also need a service account for the reporter to use to lookup the build triggers names:

```sh
gcloud iam service-accounts create build-trigger-viewer --display-name "Build trigger viewer"

gcloud projects add-iam-policy-binding [PROJECT-ID] \
 --member=serviceAccount:build-trigger-viewer@[PROJECT-ID].iam.gserviceaccount.com \
 --role=roles/cloudbuild.builds.viewer
```

Then build yourself a copy of this image and push it to your project:

```sh
docker build -t gcr.io/[PROJECT-ID]/cloudbuild-status-reporter .
docker push gcr.io/[PROJECT-ID]/cloudbuild-status-reporter
```

Deploying the Cloud Run container requires a Github token that must be created in [your
settings](https://github.com/settings/tokens). The token needs to have the
repo scope to create the status on the PR.

With that created we can deploy our endpoint and create a subscription that points to it:

```sh
gcloud beta run deploy --service-account=build-trigger-viewer@[PROJECT-ID].iam.gserviceaccount.com \
  --platform=managed --region=us-central1 \
 --set-env-vars=GCP_PROJECT=your_gcp_project,GITHUB_TOKEN=1234,REPO_NAME=github_repo_name,REPO_OWNER=github_user_name \
 --allow-unauthenticated --image gcr.io/[PROJECT-ID]/cloudbuild-status-reporter cloudbuild-status-reporter

# Take the URL that command gives you and use it as a pubsub endpoint:
gcloud pubsub subscriptions create --push-endpoint=https://cloudbuild-status-reporter-qf7voqbyya-uc.a.run.app --topic=cloud-builds cbrun
```

## TODO

* add a Makefile/script to automate some of this setup
