variable "environment" {
  type    = string
  default = "prod"
}

variable "resource_group_name" {
  type    = string
  default = "rg-eventgrid-demo"
}

variable "eg_resource_group" {
  type      = string
  sensitive = true
}

variable "eg_domain_subscription_id" {
  type      = string
  sensitive = true
}

variable "eg_domain_name" {
  type      = string
  sensitive = true
}

variable "eg_domain_endpoint" {
  type      = string
  sensitive = true
}

variable "az_client_secret" {
  type      = string
  sensitive = true
}

variable "az_client_id" {
  type      = string
  sensitive = true
}

variable "az_tenant_id" {
  type      = string
  sensitive = true
}
