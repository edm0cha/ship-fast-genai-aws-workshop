terraform {
  backend "s3" {
    bucket       = "lambda-edwin-genai-workshop"
    key          = "terraform.tfstate"
    region       = "us-east-1"
    use_lockfile = true
    encrypt      = true
  }
}
