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

# module "static" {
#   source       = "./modules/static"
#   name         = var.project_name
#   function_url = module.lambda.function_url
# }
