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

variable "allowed_origins" {
  description = "Allowed CORS Origings for the API Gateway"
  type        = list(string)
  default     = ["http://localhost:5173"]
}
