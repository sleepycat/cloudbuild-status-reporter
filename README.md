# Reporter

Integration between Cloudbuild and Github is currently very simplistic. The
goal here is to leverage Cloud Run to provide a monorepo friendly integration
where the status of multiple builds are communicated back to github from
CloudBuild.

Enabling the cloudbuild API for your project will automatically create a
cloud-builds topic.

We can subscribe our Cloud Run endpoint to that topic with the following command:

```sh
gcloud beta run deploy --region=us-central1
--set-env-vars=GITHUB_TOKEN=abc123,REPO_NAME=foo,REPO_OWNER=bar
--image gcr.io/propertygraph/reporter reporter

# Take the URL that command gives you and use it as a pubsub endpoint:
gcloud pubsub subscriptions create \	
	--push-endpoint=https://your-cloud.run.app \
	--topic=cloud-builds cbrun
```

This requires a Github token that must be created in [your
settings](https://github.com/settings/tokens).  The token needs to have the
repo scope to create the status on the PR.

