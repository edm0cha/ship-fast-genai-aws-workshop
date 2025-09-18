# output "cloudfront_url" {
#   value = module.static.domain_name
# }

output "search_lambda_url" {
  value = module.searchLambda.function_url
}
