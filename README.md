# Reporter

Integration between Cloudbuild and Github is currently very simplistic. The
goal here is to leverage Cloud Run to provide a monorepo friendly integration
where the status of multiple builds are communicated back to github from
CloudBuild.

Enabling the cloudbuild API for your project will automatically create a
cloud-builds topic.

We can subscribe our Cloud Run endpoint to that topic with the following command:

```sh
gcloud beta run deploy reporter --image gcr.io/propertygraph/reporter

gcloud pubsub subscriptions create \	
	--push-endpoint=https://your-cloud.run.app \
	--topic=cloud-builds cbrun
```

This requires a Github token that must be created in [your
settings](https://github.com/settings/tokens).  The token needs to have the
repo scope to create the status on the PR.

