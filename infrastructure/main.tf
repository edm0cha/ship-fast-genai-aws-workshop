module "dynamo" {
  source = "./modules/dynamodb"
  name   = "${var.project_name}-trips"
}

module "searchLambda" {
  source                   = "./modules/lambda"
  function_name            = "${var.project_name}-search-lambda"
  source_file              = "${path.root}/../backend/searchLambda/lambda.py"
  handler                  = "lambda.lambda_handler"
  dynamo_table_name        = module.dynamo.name
  dynamo_table_arn         = module.dynamo.arn
  endpoint_allowed_methods = ["GET"]
}


module "itineraryLambda" {
  source                   = "./modules/lambda"
  function_name            = "${var.project_name}-itinerary-lambda"
  source_file              = "${path.root}/../backend/itineraryLambda/lambda.py"
  handler                  = "lambda.lambda_handler"
  dynamo_table_name        = module.dynamo.name
  dynamo_table_arn         = module.dynamo.arn
  endpoint_allowed_methods = ["GET", "POST"]
}

module "apigateway" {
  source = "./modules/apigateway"

  name = "genai-flight-api"

  routes = {
    "/search-flights" = {
      lambda_arn  = module.searchLambda.invoke_arn
      lambda_name = module.searchLambda.function_name
    }
    "/generate-itinerary" = {
      lambda_arn  = module.itineraryLambda.invoke_arn
      lambda_name = module.itineraryLambda.function_name
    }
  }
  allowed_origins = ["*"]
}

module "static" {
  source = "./modules/static"
  name   = var.project_name
}
