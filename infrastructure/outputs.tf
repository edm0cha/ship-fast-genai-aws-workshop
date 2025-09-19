output "cloudfront_url" {
  value = module.static.domain_name
}

output "api_gateway_url" {
  value = module.apigateway.api_endpoint
}
