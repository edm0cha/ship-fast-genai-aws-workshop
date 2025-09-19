variable "name" {
  description = "API Gateway name"
  type        = string
}

variable "routes" {
  description = "Map of routes to lambda integrations"
  type = map(object({
    lambda_arn  = string
    lambda_name = string
  }))
}
