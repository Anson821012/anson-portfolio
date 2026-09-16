#!/usr/bin/env bash
# Run in an authenticated Google Cloud Shell only after the account owner approves
# the service account, federation and Search Console read-only access.
set -euo pipefail
task_project='clever-tube-508810-s4'
task_account="anson-portfolio-search@${task_project}.iam.gserviceaccount.com"
task_pool='anson-portfolio'

gcloud services enable searchconsole.googleapis.com iam.googleapis.com iamcredentials.googleapis.com sts.googleapis.com --project="$task_project"

if ! gcloud iam service-accounts describe "$task_account" --project="$task_project" >/dev/null 2>&1; then
  gcloud iam service-accounts create anson-portfolio-search --project="$task_project" --display-name='Anson Portfolio Search Reader' --description='Read-only Fuyun Search Console statistics for Anson portfolio'
fi

if ! gcloud iam workload-identity-pools describe "$task_pool" --location=global --project="$task_project" >/dev/null 2>&1; then
  gcloud iam workload-identity-pools create "$task_pool" --location=global --project="$task_project" --display-name='Anson Portfolio GitHub Actions'
fi

task_mapping='google.subject=assertion.sub,attribute.repository_id=assertion.repository_id,attribute.repository_owner_id=assertion.repository_owner_id,attribute.ref=assertion.ref,attribute.workflow_ref=assertion.workflow_ref'
task_condition="assertion.repository_id == '1145977686' && assertion.repository_owner_id == '258237118' && assertion.ref == 'refs/heads/main' && assertion.workflow_ref == 'Anson821012/anson-portfolio/.github/workflows/sync-pages.yml@refs/heads/main'"

if gcloud iam workload-identity-pools providers describe github-main --workload-identity-pool="$task_pool" --location=global --project="$task_project" >/dev/null 2>&1; then
  gcloud iam workload-identity-pools providers update-oidc github-main --workload-identity-pool="$task_pool" --location=global --project="$task_project" --issuer-uri=https://token.actions.githubusercontent.com --attribute-mapping="$task_mapping" --attribute-condition="$task_condition"
else
  gcloud iam workload-identity-pools providers create-oidc github-main --workload-identity-pool="$task_pool" --location=global --project="$task_project" --issuer-uri=https://token.actions.githubusercontent.com --attribute-mapping="$task_mapping" --attribute-condition="$task_condition"
fi

task_number=$(gcloud projects describe "$task_project" --format='value(projectNumber)')
gcloud iam service-accounts add-iam-policy-binding "$task_account" --project="$task_project" --role=roles/iam.workloadIdentityUser --member="principalSet://iam.googleapis.com/projects/${task_number}/locations/global/workloadIdentityPools/${task_pool}/attribute.repository_id/1145977686"

printf 'GSC_SERVICE_ACCOUNT=%s\n' "$task_account"
printf 'GSC_WIF_PROVIDER=projects/%s/locations/global/workloadIdentityPools/%s/providers/github-main\n' "$task_number" "$task_pool"
printf 'Next: add the service account as a Restricted user of sc-domain:fuyunlovemommy.com in Search Console.\n'
