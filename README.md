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
gcloud projects add-iam-policy-binding [PROJECT-ID] \
 --member=serviceAccount:service-[PROJECT-NUMBER]@gcp-sa-pubsub.iam.gserviceaccount.com \
 --role=roles/iam.serviceAccountTokenCreator

gcloud iam service-accounts create cloud-run-pubsub-invoker \
     --display-name "Cloud Run Pub/Sub Invoker"
```

Deploying the Cloud Run container requires a Github token that must be created in [your
settings](https://github.com/settings/tokens). The token needs to have the
repo scope to create the status on the PR.

With that created we can deploy our endpoint and create a subscription that points to it:

```sh
gcloud beta run deploy --region=us-central1
--set-env-vars=GITHUB_TOKEN=abc123,REPO_NAME=foo,REPO_OWNER=bar
--allow-unauthenticated --image gcr.io/propertygraph/reporter reporter

# Take the URL that command gives you and use it as a pubsub endpoint:
gcloud pubsub subscriptions create \	
	--push-endpoint=https://your-cloud.run.app \
	--topic=cloud-builds cbrun
```


